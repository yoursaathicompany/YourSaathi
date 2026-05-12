import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Exam-specific prompt hints
const EXAM_HINTS: Record<string, string> = {
  'SSC CGL': 'Focus on: Reasoning (Analogy, Series, Coding-Decoding), Quantitative Aptitude (Percentage, Ratio, Profit-Loss, Time-Speed), English (Fill-in-the-blanks, One-word substitution), General Awareness (Current affairs, History, Polity, Science).',
  'SSC CHSL': 'Focus on: General Intelligence, English Language, Quantitative Aptitude (Basic math), General Awareness.',
  'SSC MTS': 'Focus on: General Intelligence & Reasoning, Numerical Aptitude, General English, General Awareness. Keep it at a basic level.',
  'UPSC Prelims': 'Focus on: Polity & Governance (Constitution, Parliament, Judiciary), Indian History (Ancient, Medieval, Modern), Indian Geography (Physical, Economic), Economy (GDP, Inflation, Five-Year Plans), Environment & Ecology, Science & Technology, Current Affairs.',
  'IBPS PO': 'Focus on: Reasoning Ability (Seating Arrangement, Syllogism, Blood Relations), Quantitative Aptitude (Data Interpretation, Quadratic Equations), English Language (Reading Comprehension, Error Spotting), General/Financial Awareness (Banking terms, RBI, Monetary Policy).',
  'IBPS Clerk': 'Focus on: Reasoning, Quantitative Aptitude, English Language, General Financial Awareness. Keep at moderate difficulty.',
  'SBI PO': 'Focus on: Data Analysis & Interpretation, Reasoning & Computer Aptitude, English Language (Complex RC), General/Economy/Banking Awareness.',
  'RRB NTPC': 'Focus on: General Awareness (Railway, Current Affairs, History, Geography, Polity, Economics), Mathematics (Number System, HCF-LCM, Percentage, SI-CI), General Intelligence & Reasoning.',
  'RRB Group D': 'Focus on: Mathematics (Basic), General Intelligence & Reasoning (Basic), General Science (Physics, Chemistry, Biology — Class 10 level), General Awareness & Current Affairs.',
  'NDA': 'Focus on: Mathematics (Algebra, Trigonometry, Calculus, Statistics, Matrices), General Ability Test (Physics, Chemistry, Biology, History, Geography, Current Affairs, English Grammar).',
  'CDS': 'Focus on: English (Comprehension, Grammar), General Knowledge (Current events, History, Geography, Economy, Polity, Science), Elementary Mathematics.',
  'State PSC': 'Focus on: State-specific History and Culture, State Geography and Economy, Indian Polity and Constitution, Current Affairs (national and state), General Science.',
  'Custom': 'Generate high-quality questions based on the topic provided.',
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { exam_name, subject, topic, difficulty, num_questions, time_limit_minutes, language = 'English' } = body;

    if (!exam_name || !subject || !difficulty || !num_questions) {
      return NextResponse.json({ error: 'Missing required fields: exam_name, subject, difficulty, num_questions' }, { status: 400 });
    }

    // ── Credit Check ───────────────────────────────────────────────────────
    const { data: purchases } = await supabaseAdmin
      .from('mock_test_purchases')
      .select('credits_granted')
      .eq('user_id', userId)
      .eq('status', 'paid');

    const totalEarned = (purchases ?? []).reduce(
      (sum: number, p: { credits_granted: number }) => sum + p.credits_granted,
      0
    );

    const { count: totalUsed } = await supabaseAdmin
      .from('mock_test_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    const creditsRemaining = Math.max(0, totalEarned - (totalUsed ?? 0));

    if (creditsRemaining <= 0) {
      return NextResponse.json({
        status: 'payment_required',
        message: 'Buy 50 mock tests for ₹49 using Razorpay to continue.',
        razorpay_required: true,
        package: '50 mock tests',
        price_inr: 49,
      }, { status: 402 });
    }

    // ── Gemini Generation ──────────────────────────────────────────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI key not configured' }, { status: 500 });
    }

    const examHint = EXAM_HINTS[exam_name] || EXAM_HINTS['Custom'];
    const timeLimitMin = time_limit_minutes ?? (num_questions === 10 ? 10 : num_questions === 20 ? 20 : 30);
    const topicStr = topic ? `Topic/Chapter: ${topic}` : '';

    const prompt = `
You are an expert Indian competitive exam question setter with 15+ years of experience.
Create a high-quality, original mock test strictly following the JSON format below.

EXAM DETAILS:
- Exam: ${exam_name}
- Subject: ${subject}
${topicStr}
- Difficulty: ${difficulty}
- Number of Questions: ${num_questions}
- Language: ${language}

EXAM-SPECIFIC INSTRUCTIONS:
${examHint}

STRICT RULES:
1. Generate exactly ${num_questions} questions. No more, no less.
2. All text MUST be in ${language}.
3. Each question must have exactly 4 options: A, B, C, D.
4. Only ONE option is correct per question.
5. Explanations must be clear, factual, and under 60 words.
6. Do NOT copy verbatim from any real exam paper. Make original questions inspired by the pattern.
7. Questions must be diverse — do NOT repeat the same concept.
8. Avoid trick questions unless difficulty is "hard".
9. correct_option must be EXACTLY one of: "A", "B", "C", or "D".

REQUIRED JSON OUTPUT FORMAT (return ONLY valid JSON, no markdown, no code blocks):
{
  "status": "success",
  "exam_name": "${exam_name}",
  "test_title": "<descriptive title>",
  "subject": "${subject}",
  "topic": "${topic ?? subject}",
  "difficulty": "${difficulty}",
  "total_questions": ${num_questions},
  "time_limit_minutes": ${timeLimitMin},
  "questions": [
    {
      "question_number": 1,
      "question": "<question text>",
      "options": {
        "A": "<option A>",
        "B": "<option B>",
        "C": "<option C>",
        "D": "<option D>"
      },
      "correct_option": "A",
      "explanation": "<brief explanation under 60 words>"
    }
  ],
  "result_message": "Great job! Keep practicing to ace ${exam_name}!"
}
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelChain = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
    let aiData = null;

    for (const modelName of modelChain) {
      if (aiData) break;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: { responseMimeType: 'application/json' },
          });
          const result = await model.generateContent(prompt);
          const text = result.response.text().trim();
          const parsed = JSON.parse(text);
          if (parsed.questions && parsed.questions.length > 0) {
            aiData = parsed;
            break;
          }
        } catch (err: unknown) {
          const error = err as { status?: number; message?: string };
          const is429 = error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota');
          if (is429 && attempt < 2) {
            await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 5000));
            continue;
          }
          if (attempt === 2) break;
        }
      }
    }

    if (!aiData) {
      return NextResponse.json({ error: 'Failed to generate test. Please try again.' }, { status: 503 });
    }

    // ── Persist Session ────────────────────────────────────────────────────
    const { data: sessionRow, error: sessionErr } = await supabaseAdmin
      .from('mock_test_sessions')
      .insert({
        user_id: userId,
        exam_name,
        subject,
        topic: topic ?? null,
        difficulty,
        num_questions,
        time_limit_min: timeLimitMin,
        language,
        questions: aiData.questions,
        ai_raw: aiData,
        status: 'generated',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h expiry
      })
      .select('id')
      .single();

    if (sessionErr || !sessionRow) {
      console.error('[mock-test/generate] Failed to save session:', sessionErr);
      return NextResponse.json({ error: 'Failed to save test session' }, { status: 500 });
    }

    // Credit is consumed by the session insertion above (counted in sessions table)
    const newCreditsRemaining = creditsRemaining - 1;

    return NextResponse.json({
      ...aiData,
      status: 'success',
      session_id: sessionRow.id,
      remaining_credits: newCreditsRemaining,
    });

  } catch (err) {
    console.error('[mock-test/generate] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

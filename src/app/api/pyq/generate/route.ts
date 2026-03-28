import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const pyqRequestSchema = z.object({
  exam: z.string().min(1),
  subject: z.string().min(1),
  year: z.number().optional(),
  numQuestions: z.number().min(3).max(20).default(10),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  entryId: z.string().optional(),
});

// Wrap JSON array in an object so Gemini handles it reliably
const buildPrompt = (params: z.infer<typeof pyqRequestSchema>): string => {
  const yearContext = params.year
    ? `from the ${params.year} exam paper`
    : 'based on typical question patterns across recent years';

  return `You are an expert exam coach for Indian board and competitive exams.

Generate exactly ${params.numQuestions} high-quality MCQ questions in the style of ${params.exam} ${params.subject} ${yearContext}.

Rules:
- Difficulty: ${params.difficulty}
- Each question must have exactly 4 answer options
- Questions should cover different chapters/topics from the syllabus
- Explanations must be under 60 words
- Respond ONLY with a valid JSON object — absolutely no markdown, no code blocks, no intro text

Required JSON format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Full question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "The exact text of the correct option",
      "explanation": "Short explanation under 60 words",
      "topic": "Chapter or topic name",
      "year_hint": "${params.year ? `${params.year} pattern` : 'Classic pattern'}"
    }
  ]
}

Generate all ${params.numQuestions} questions inside the "questions" array.`;
};

const MODEL_CHAIN = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
];

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

async function callGemini(model: string, apiKey: string, prompt: string): Promise<any> {
  const url = `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    const err: any = new Error(`HTTP ${response.status}: ${errText.slice(0, 200)}`);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) throw new Error('Empty content from Gemini');

  // Strip any accidental markdown fences
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  return JSON.parse(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const params = pyqRequestSchema.parse(body);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[pyq/generate] GEMINI_API_KEY not set');
      return NextResponse.json({ error: 'AI key not configured' }, { status: 500 });
    }

    const prompt = buildPrompt(params);
    let questions: any[] = [];
    let lastError: string = '';

    for (const model of MODEL_CHAIN) {
      if (questions.length > 0) break;

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          console.log(`[pyq/generate] Trying ${model} attempt ${attempt + 1}`);
          const parsed = await callGemini(model, apiKey, prompt);

          // Accept both { questions: [...] } and a bare array
          const arr = Array.isArray(parsed)
            ? parsed
            : Array.isArray(parsed?.questions)
            ? parsed.questions
            : null;

          if (arr && arr.length > 0) {
            questions = arr;
            console.log(`[pyq/generate] Success: ${questions.length} questions from ${model}`);
            break;
          }
          console.warn(`[pyq/generate] ${model} attempt ${attempt + 1}: empty questions`);
        } catch (err: any) {
          lastError = err?.message ?? String(err);
          console.error(`[pyq/generate] ${model} attempt ${attempt + 1} failed: ${lastError}`);

          const is429 =
            err?.status === 429 ||
            lastError.includes('429') ||
            lastError.toLowerCase().includes('quota') ||
            lastError.toLowerCase().includes('rate');

          if (is429) {
            const waitMs = Math.pow(2, attempt) * 5000; // 5s, 10s, 20s
            console.warn(`[pyq/generate] Rate limited. Waiting ${waitMs}ms before retry...`);
            await new Promise(r => setTimeout(r, waitMs));
            continue;
          }

          // Non-rate-limit error: try next model
          break;
        }
      }
    }

    if (questions.length === 0) {
      console.error(`[pyq/generate] All models exhausted. Last error: ${lastError}`);
      return NextResponse.json(
        { error: 'Could not generate questions right now. Please try again in a moment.' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      exam: params.exam,
      subject: params.subject,
      year: params.year,
      difficulty: params.difficulty,
      questions,
      generatedAt: new Date().toISOString(),
    });

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: err.issues }, { status: 400 });
    }
    console.error('[pyq/generate] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

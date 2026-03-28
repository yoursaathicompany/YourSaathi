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
- Respond ONLY with a valid JSON object — no markdown, no code blocks

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

// Only models confirmed to exist in the v1beta API (returns 429 not 404)
const MODEL_CHAIN = [
  'gemini-2.0-flash',
  'gemini-2.5-flash',
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
    const err: any = new Error(`HTTP ${response.status}: ${errText.slice(0, 300)}`);
    err.httpStatus = response.status;
    throw err;
  }

  const data = await response.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) throw new Error('Empty content from Gemini');

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
    let lastError = '';

    modelLoop:
    for (const model of MODEL_CHAIN) {
      if (questions.length > 0) break;

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          console.log(`[pyq/generate] Trying ${model} attempt ${attempt + 1}`);
          const parsed = await callGemini(model, apiKey, prompt);

          const arr = Array.isArray(parsed)
            ? parsed
            : Array.isArray(parsed?.questions)
            ? parsed.questions
            : null;

          if (arr && arr.length > 0) {
            questions = arr;
            console.log(`[pyq/generate] Success: ${questions.length} questions via ${model}`);
            break modelLoop;
          }
          // Empty but no error — try once more then give up on this model
          console.warn(`[pyq/generate] ${model} attempt ${attempt + 1}: no questions in response`);
          if (attempt >= 1) break;

        } catch (err: any) {
          lastError = err?.message ?? String(err);
          const httpStatus: number = err?.httpStatus ?? 0;
          console.error(`[pyq/generate] ${model} attempt ${attempt + 1} FAILED (HTTP ${httpStatus}): ${lastError.slice(0, 120)}`);

          if (httpStatus === 404) {
            // Model doesn't exist — skip immediately, no retries
            console.warn(`[pyq/generate] ${model} is 404 (model not found), skipping to next model`);
            break; // exit attempt loop, next model in modelLoop
          }

          if (httpStatus === 429) {
            if (attempt < 2) {
              const waitMs = (attempt + 1) * 4000; // 4s then 8s
              console.warn(`[pyq/generate] Rate limited. Waiting ${waitMs}ms...`);
              await new Promise(r => setTimeout(r, waitMs));
              continue;
            }
            console.warn(`[pyq/generate] ${model} rate limited on all 3 attempts, trying next model`);
            break;
          }

          // Any other error — don't retry, try next model
          console.warn(`[pyq/generate] ${model} non-retryable error, moving to next model`);
          break;
        }
      }
    }

    if (questions.length === 0) {
      console.error(`[pyq/generate] All models failed. Last: ${lastError.slice(0, 200)}`);
      return NextResponse.json(
        { error: 'AI is busy right now. Please wait a moment and try again.' },
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

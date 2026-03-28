import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const pyqRequestSchema = z.object({
  exam: z.string().min(1),
  subject: z.string().min(1),
  year: z.number().optional(),
  numQuestions: z.number().min(3).max(20).default(10),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  entryId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const params = pyqRequestSchema.parse(body);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI key not configured' }, { status: 500 });
    }

    const yearContext = params.year ? `from the ${params.year} exam paper` : 'based on typical question patterns';
    const prompt = `
You are an expert exam coach and question paper analyst for Indian competitive and board exams.

Generate ${params.numQuestions} high-quality MCQ (multiple choice) questions in the EXACT style and pattern of 
${params.exam} - ${params.subject} ${yearContext}.

The questions should be:
- Difficulty: ${params.difficulty}
- Authentic to the board/exam style (CBSE boards have different phrasing than JEE/NEET)
- Diverse: cover different chapters/topics from the syllabus
- Each question MUST have exactly 4 options labeled as just the option text

IMPORTANT: You MUST reply ONLY with a valid JSON array (no markdown, no code fences, no extra text):

[
  {
    "id": "q1",
    "question": "Full question text here",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correct_answer": "The exact text of the correct option",
    "explanation": "Clear explanation in under 60 words",
    "topic": "Chapter/topic name",
    "year_hint": "${params.year ? `Based on ${params.year} pattern` : 'Classic pattern'}"
  }
]

Generate exactly ${params.numQuestions} questions. The JSON array should have ${params.numQuestions} items.
    `.trim();

    const modelChain = ['gemini-1.5-flash', 'gemini-1.5-pro'];
    const genAI = new GoogleGenerativeAI(apiKey);
    let questions: any[] = [];

    for (const modelName of modelChain) {
      if (questions.length > 0) break;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: { responseMimeType: 'application/json' },
          });
          const result = await model.generateContent(prompt);
          let text = result.response.text().trim();
          // Strip markdown fences if present
          text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            questions = parsed;
            break;
          }
        } catch (err: any) {
          const is429 = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota');
          if (is429 && attempt === 0) {
            await new Promise(r => setTimeout(r, 5000));
            continue;
          }
          if (attempt === 1) break;
        }
      }
    }

    if (questions.length === 0) {
      return NextResponse.json({ error: 'Failed to generate PYQ questions. Please try again.' }, { status: 503 });
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
    console.error('[pyq/generate] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

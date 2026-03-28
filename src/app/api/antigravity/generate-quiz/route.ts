import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// ─── Request Schema ───────────────────────────────────────────────────────
const quizRequestSchema = z.object({
  topic: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  student_level: z.enum(['class6', 'class10', 'college', 'upsc', 'custom']),
  number_of_questions: z.number().min(1).max(25),
  question_types: z.array(z.enum(['mcq_single', 'mcq_multi', 'assertion', 'short_answer', 'code'])),
  language: z.string().default('English'),
  include_hints: z.boolean().default(true),
  include_sources: z.boolean().default(false),
  allow_media: z.boolean().default(false),
  advanced_options: z.object({
    shuffle_choices: z.boolean().default(true),
    include_explanations: z.boolean().default(true),
    strict_scoring: z.boolean().default(false),
  }),
  request_id: z.string().optional(),
});

// ─── Response Schema (for Gemini) ─────────────────────────────────────────
const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    request_id: { type: SchemaType.STRING },
    topic: { type: SchemaType.STRING },
    generated_at: { type: SchemaType.STRING },
    meta: {
      type: SchemaType.OBJECT,
      properties: {
        num_questions_returned: { type: SchemaType.NUMBER },
        estimated_total_time_seconds: { type: SchemaType.NUMBER },
      },
      required: ['num_questions_returned', 'estimated_total_time_seconds'],
    },
    questions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          type: { type: SchemaType.STRING },
          question: { type: SchemaType.STRING },
          options: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Exactly 4 options for MCQs",
          },
          correct_answer: { 
            type: SchemaType.STRING, 
            description: "The correct option or string answer" 
          },
          explanation: { type: SchemaType.STRING },
          hints: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          sources: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                text: { type: SchemaType.STRING },
                url: { type: SchemaType.STRING },
              },
              required: ['text', 'url'],
            },
          },
          tags: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          metadata: {
            type: SchemaType.OBJECT,
            properties: {
              estimated_time_seconds: { type: SchemaType.NUMBER },
              difficulty_score: { type: SchemaType.NUMBER },
            },
            required: ['estimated_time_seconds', 'difficulty_score'],
          },
        },
        required: ['type', 'question', 'explanation', 'metadata'],
      },
    },
  },
  required: ['request_id', 'topic', 'questions', 'meta'],
};

// ─── POST /api/antigravity/generate-quiz ──────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      console.warn('[generate-quiz] Unauthorized request attempt. Session:', session);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('[generate-quiz] Authorized request by user:', session.user.id);

    const body = await req.json();
    const validatedRequest = quizRequestSchema.parse(body);
    const requestId = validatedRequest.request_id || uuidv4();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI key not configured' }, { status: 500 });
    }
    // Log last 4 chars to confirm key identity without exposing full key
    console.log(`[generate-quiz] Using API key ending in: ...${apiKey.slice(-4)}`);

    const prompt = `
      You are an expert educator and exam creator. 
      Generate a comprehensive, rigorous quiz based on the following parameters. 
      Your primary goal is to return a strict JSON object that exactly matches the provided schema. 

      PARAMETERS:
      - Topic: ${validatedRequest.topic}
      - Student Level: ${validatedRequest.student_level}
      - Difficulty: ${validatedRequest.difficulty}
      - Required Questions: ${validatedRequest.number_of_questions}
      - Allowed Question Types: ${validatedRequest.question_types.join(', ')}
      - Language: ${validatedRequest.language}
      - Include Hints: ${validatedRequest.include_hints}
      - Include Sources: ${validatedRequest.include_sources}
      - Allow Media: ${validatedRequest.allow_media}
      - Include Explanations: ${validatedRequest.advanced_options.include_explanations}

      RULES:
      1. All generated text MUST be in ${validatedRequest.language}.
      2. For multiple choice questions (mcq_single, mcq_multi), provide exactly 4 options.
      3. Explanations must be strictly under 60 words.
      4. If include_hints is false, provide empty arrays for hints. Otherwise, Max 2 hints per question, 20 words each.
      5. Include sources only if extremely confident.
      6. Request ID is: ${requestId}.

      REQUIRED JSON SCHEMA:
      ${JSON.stringify(responseSchema, null, 2)}

      IMPORTANT: Respond ONLY with a valid JSON object. No markdown, no code blocks, no extra text.
    `;

    // Model fallback chain: try flash first, fall back to pro models
    const modelFallbackChain = ['gemini-2.0-flash', 'gemini-2.5-flash'];
    const genAI = new GoogleGenerativeAI(apiKey);
    let quizData: any = null;

    for (let modelIndex = 0; modelIndex < modelFallbackChain.length && !quizData; modelIndex++) {
      const modelName = modelFallbackChain[modelIndex];
      console.log(`[generate-quiz] Trying model: ${modelName}`);
      
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: { responseMimeType: 'application/json' },
          });

          const result = await model.generateContent(prompt);
          const responseText = result.response.text().trim();

          const parsed = JSON.parse(responseText);
          if (parsed.questions && parsed.questions.length > 0) {
            quizData = parsed;
            break;
          }
          console.warn(`[generate-quiz] No questions in response from ${modelName}, attempt ${attempt + 1}`);
        } catch (err: any) {
          const is429 = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota');
          if (is429) {
            if (attempt < 2) {
              const waitMs = Math.pow(2, attempt) * 5000; // 5s, 10s, 20s exponential backoff
              console.warn(`[generate-quiz] Rate limited on ${modelName}. Waiting ${waitMs}ms before retry ${attempt + 1}...`);
              await new Promise(r => setTimeout(r, waitMs));
              continue;
            } else {
              console.warn(`[generate-quiz] ${modelName} exhausted after 429s, trying next model...`);
              break; // move to next model in chain
            }
          }
          // Non-429 error on last attempt of this model — try next model
          console.error(`[generate-quiz] Error on ${modelName} attempt ${attempt + 1}:`, err?.message);
          if (attempt === 2) break;
        }
      }
    }

    // Guard: if we exhausted retries without valid data
    if (!quizData || !quizData.questions || quizData.questions.length === 0) {
      return NextResponse.json({ error: 'Failed to generate quiz questions after multiple attempts. Please try again.' }, { status: 503 });
    }

    // Persist to DB
    const { data: quizRow, error: quizError } = await supabaseAdmin
      .from('quizzes')
      .insert({
        title: `${validatedRequest.topic} - ${validatedRequest.difficulty}`,
        topic: validatedRequest.topic,
        difficulty: validatedRequest.difficulty,
        student_level: validatedRequest.student_level,
        language: validatedRequest.language,
        creator_id: session.user.id,
        request_id: requestId,
        meta: quizData.meta,
        ai_raw: quizData,
      })
      .select('id')
      .single();

    if (quizError || !quizRow) {
      console.error('Failed to persist quiz:', quizError);
      return NextResponse.json({ error: 'Failed to save quiz' }, { status: 500 });
    }

    const questionInserts = quizData.questions.map((q: any, index: number) => ({
      quiz_id: quizRow.id,
      type: q.type,
      content: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      hints: q.hints || [],
      sources: q.sources || [],
      tags: q.tags || [],
      metadata: q.metadata,
      order_index: index,
    }));

    const { error: questionsError } = await supabaseAdmin
      .from('questions')
      .insert(questionInserts);

    if (questionsError) {
      console.error('Failed to persist questions:', questionsError);
    }

    return NextResponse.json({
      ...quizData,
      quiz_id: quizRow.id,
    });

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: err.issues }, { status: 400 });
    }
    console.error('Unexpected error in generate-quiz:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
    `;

    let attempts = 0;
    let quizData: any = null;

    while (attempts < 3) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json'
            }
          })
        });

        if (!response.ok) {
           const errorText = await response.text();
           throw new Error(`API HTTP error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
           throw new Error('Invalid response structure from Gemini API');
        }

        let responseText = data.candidates[0].content.parts[0].text;
        
        // Strip out markdown code block if present
        responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        
        quizData = JSON.parse(responseText);
        
        // Basic validation: ensure questions count is correct or at least not zero
        if (quizData.questions && quizData.questions.length > 0) {
          break;
        }
      } catch (err) {
        console.error(`Attempt ${attempts + 1} failed:`, err);
        attempts++;
        if (attempts === 3) throw err;
      }
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

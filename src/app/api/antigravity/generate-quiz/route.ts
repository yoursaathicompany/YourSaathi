import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { GenerateQuizRequest } from '@/types/quiz';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // Initializes from env GEMINI_API_KEY

// Validate the GenerateQuizRequest body
const quizRequestSchema = z.object({
  topic: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  student_level: z.enum(['class6', 'class10', 'college', 'upsc', 'custom']),
  number_of_questions: z.number().int().min(1).max(50),
  question_types: z.array(z.enum(['mcq_single', 'mcq_multi', 'assertion', 'short_answer', 'code'])).min(1),
  language: z.string().default('English'),
  include_hints: z.boolean().default(false),
  include_sources: z.boolean().default(false),
  allow_media: z.boolean().default(false),
  advanced_options: z.object({
    shuffle_choices: z.boolean().default(false),
    include_explanations: z.boolean().default(true),
    strict_scoring: z.boolean().default(false)
  }).default({ shuffle_choices: false, include_explanations: true, strict_scoring: false })
});

// We expect Gemini to return exactly this JSON
const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    request_id: { type: "STRING" },
    topic: { type: "STRING" },
    difficulty: { type: "STRING", enum: ["easy", "medium", "hard"] },
    student_level: { type: "STRING" },
    generated_at: { type: "STRING" },
    meta: {
      type: "OBJECT",
      properties: {
        num_questions_requested: { type: "INTEGER" },
        num_questions_returned: { type: "INTEGER" },
        estimated_total_time_seconds: { type: "INTEGER" },
        uniqueness_score: { type: "NUMBER" },
        confidence_score: { type: "NUMBER" }
      },
      required:["num_questions_requested", "num_questions_returned", "estimated_total_time_seconds", "uniqueness_score", "confidence_score"]
    },
    questions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          type: { type: "STRING" },
          question: { type: "STRING" },
          options: { type: "ARRAY", items: { type: "STRING" } },
          correct_answer: { }, // Flexible
          explanation: { type: "STRING" },
          hints: { type: "ARRAY", items: { type: "STRING" } },
          sources: { type: "ARRAY", items: { type: "OBJECT", properties: { text: { type: "STRING" }, url: { type: "STRING"} } } },
          tags: { type: "ARRAY", items: { type: "STRING" } },
          metadata: {
            type: "OBJECT",
            properties: {
              estimated_time_seconds: { type: "INTEGER" },
              difficulty_score: { type: "NUMBER" },
              media: { type: "OBJECT", properties: { type: { type: "STRING" }, url: { type: "STRING" } }, nullable: true }
            }
          }
        },
        required: ["id", "type", "question", "explanation", "metadata"]
      }
    },
    summary: {
      type: "OBJECT",
      properties: {
        question_count: { type: "INTEGER" },
        estimated_total_time_seconds: { type: "INTEGER" },
        difficulty_profile: {
          type: "OBJECT",
          properties: {
            easy: { type: "INTEGER" },
            medium: { type: "INTEGER" },
            hard: { type: "INTEGER" }
          }
        }
      }
    }
  },
  required: ["request_id", "topic", "difficulty", "student_level", "generated_at", "meta", "questions", "summary"]
};

const buildPrompt = (data: z.infer<typeof quizRequestSchema>, uniqueId: string) => `
You are an expert educator and exam creator. 
Generate a comprehensive, rigorous quiz based on the following parameters. 
Your primary goal is to return a strict JSON object that exactly matches the provided schema. 

PARAMETERS:
- Topic: ${data.topic}
- Student Level: ${data.student_level}
- Difficulty: ${data.difficulty}
- Required Questions: ${data.number_of_questions}
- Allowed Question Types: ${data.question_types.join(', ')}
- Language: ${data.language}
- Include Hints: ${data.include_hints}
- Include Sources: ${data.include_sources}
- Allow Media: ${data.allow_media}
- Include Explanations: ${data.advanced_options.include_explanations}

RULES:
1. All generated text MUST be in ${data.language}.
2. For multiple choice questions, provide exactly 4 options.
3. Explanations must be strictly under 60 words.
4. If include_hints is false, provide empty arrays for hints. Otherwise, Max 2 hints per question, 20 words each.
5. Do not hallucinate URLs; include sources only if extremely confident.
6. Progress difficulty across questions and avoid repeating core facts. Ensure at least one applied/real-world question.
7. Request ID is: ${uniqueId}.
`;

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    const validatedData = quizRequestSchema.parse(rawData);
    
    const maxRetries = 2;
    let attempt = 0;
    const uniqueId = crypto.randomUUID();
    const prompt = buildPrompt(validatedData, uniqueId);

    while (attempt <= maxRetries) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            temperature: 0.2, // Factual correctness over creativity
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA as any,
          }
        });

        const jsonText = response.text || "{}";
        const parsedJson = JSON.parse(jsonText);
        
        // At this point we can also save this to Supabase DB
        // e.g., using a service role key: adminSupabase.from('quizzes').insert({...})
        // For now, we will just return the successfully generated strict JSON to frontend.

        return NextResponse.json(parsedJson);
      } catch (genError: any) {
        console.error(\`Generation Attempt \${attempt} failed\`, genError);
        attempt++;
        if (attempt > maxRetries) throw new Error("Max retries exceeded while calling Gemini.");
      }
    }
  } catch (error: any) {
    console.error("Quiz Generation API Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}

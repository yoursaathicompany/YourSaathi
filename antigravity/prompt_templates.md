# Antigravity Quiz Generation - Prompt Templates

## Recommended Model Settings
Model: \`gemini-2.5-flash\`
Temperature: \`0.2\` (For factual correctness; use \`0.7\` if creative variations are desired)
Max Tokens: implicitly defined by response limit
Response Format: \`application/json\`
Response Schema: Strict JSON schema defined in \`/api/antigravity/generate-quiz/route.ts\`

## Base Prompt Template
```javascript
const buildPrompt = (data: z.infer<typeof quizRequestSchema>, uniqueId: string) => \`
You are an expert educator and exam creator. 
Generate a comprehensive, rigorous quiz based on the following parameters. 
Your primary goal is to return a strict JSON object that exactly matches the provided schema. 

PARAMETERS:
- Topic: \${data.topic}
- Student Level: \${data.student_level}
- Difficulty: \${data.difficulty}
- Required Questions: \${data.number_of_questions}
- Allowed Question Types: \${data.question_types.join(', ')}
- Language: \${data.language}
- Include Hints: \${data.include_hints}
- Include Sources: \${data.include_sources}
- Allow Media: \${data.allow_media}
- Include Explanations: \${data.advanced_options.include_explanations}

RULES:
1. All generated text MUST be in \${data.language}.
2. For multiple choice questions, provide exactly 4 options.
3. Explanations must be strictly under 60 words.
4. If include_hints is false, provide empty arrays for hints. Otherwise, Max 2 hints per question, 20 words each.
5. Do not hallucinate URLs; include sources only if extremely confident.
6. Progress difficulty across questions and avoid repeating core facts. Ensure at least one applied/real-world question.
7. Request ID is: \${uniqueId}.
\`;
```

## Retry/Backoff Policy
The API logic includes a retry loop.
1. Attempt generation.
2. If generation fails due to a Gemini network issue or response schema validation failure:
   - Increment attempt counter (up to 2 maximum retries).
   - Sleep for exponential backoff (if implemented) or immediately retry.
   - The SDK natively uses retry loops if properly configured. Zod validation or JSON.parse is the fallback guard.

## Schema Validation
The JSON schema provides the exact structure natively to the \`@google/genai\` SDK which enforces \`generateContent\` to output the strict JSON.

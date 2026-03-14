# ZQuiz - AI Generated Quizzes

A production-grade Next.js (App Router) full-stack application that dynamically generates rigorous, highly-typed quizzes using Google Gemini 2.5 and Supabase.

## Tech Stack
- **Framework:** Next.js 15 (App Router, React 19)
- **Styling:** Tailwind CSS + Framer Motion (Glassmorphism & Gradients)
- **Database & Auth:** Supabase + NextAuth.js
- **Generative AI:** Google Gen AI SDK (`gemini-2.5-flash`)
- **Validation:** Zod

## Local Setup & Development

1. **Clone the repository and install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Setup:**
   Copy the example environment file and fill in your keys (You MUST provide a valid Gemini API Key):
   \`\`\`bash
   cp .env.example .env
   # Edit .env file with your valid GEMINI_API_KEY
   \`\`\`

3. **Supabase Local (Optional Docker Emulation) or Cloud**
   You can link to a cloud Supabase database or run locally. To use the included seed script:
   \`\`\`bash
   # Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env
   npm run seed
   \`\`\`

4. **Start the Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000)

## Docker Deployment (Compose)

A `docker-compose.yml` is provided for running this alongside a mock Supabase stack or isolated web container.

\`\`\`bash
docker-compose up --build -d
\`\`\`
*Access the app at `http://localhost:3000`*

## Features Implemented
- **Landing Page Grid:** Explore interactive categories.
- **AI Generation Forms:** Pre-configured prompts matching topic, difficulty, and depth.
- **Strict JSON Enforcement:** AI responses are strictly validated via Zod on the backend.
- **Interactive Quiz Player:** Realtime feedback, animated progress, timer, and end-of-game score screen.
- **Dashboard & Settings:** Extensible layouts for teachers and students.

### Documentation
- Review the core AI prompts in `antigravity/prompt_templates.md`
- Database migrations are in `supabase/migrations/`

*(Agent output instructions below)*
---
\`cp .env.example .env && fill env\`
\`npm run seed && npm run dev\`
\`open http://localhost:3000\`

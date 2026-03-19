# QuizFlow 🪙

QuizFlow is a production-ready, AI-powered quiz generation platform. It uses Google's Gemini 1.5 Flash to generate rigorous, verified quizzes on any topic and rewards students with coins for correct answers.

## 🚀 One-Line Dev Command
\`\`\`bash
cp .env.example .env && npm install && npm run seed && npm run dev
\`\`\`

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4 + Framer Motion
- **Database & Auth**: Supabase (PostgreSQL) + NextAuth
- **AI**: Google Gemini 1.5 Flash
- **Testing**: Jest (Unit) + Cypress (E2E)

## 📦 Features
- **AI Generation**: Instant quizzes based on topic, difficulty, and student level.
- **Coin Reward System**: 1 coin per correct answer, awarded server-side with idempotency guards.
- **Interactive Player**: Immersive quiz-taking experience with timers and progress tracking.
- **Coin UX**: Animated coin balances, flying coin reward animations, and confetti.
- **Admin Dashboard**: Monitor AI logs and manually adjust user balances.
- **Accessibility**: Support for \`prefers-reduced-motion\` and keyboard navigation.

## ⚙️ Setup & Environment
Ensure you have the following environment variables in \`.env\`:
- \`SUPABASE_URL\`, \`SUPABASE_ANON_KEY\`, \`SUPABASE_SERVICE_ROLE_KEY\`
- \`GEMINI_API_KEY\`
- \`NEXTAUTH_SECRET\`
- \`DATABASE_URL\` (for direct DB access/seed)

## 🧪 Testing
\`\`\`bash
npm test          # Run unit tests
npm run test:e2e  # Run Cypress E2E tests
\`\`\`

## 🐳 Docker
\`\`\`bash
docker-compose up --build
\`\`\`

---
*Built with Antigravity.*

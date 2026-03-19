# Changelog - QuizFlow

## [1.0.0] - 2026-03-15

### Added
- **AI Quiz Generation**: Complete integration with Gemini 1.5 Flash using Zod/JSON schema enforcement.
- **Coin Reward System**: Implemented atomic server-side coin awarding with idempotency keys (UUIDs) to prevent double-spending.
- **Authentication**: Full NextAuth flow with Google, GitHub, and Magic Link (Resend) providers.
- **QuizPlayer**: Interactive frontend with step-by-step navigation, timers, and keyboard support.
- **Coin UX**: Added flying coin animations (Framer Motion) and confetti (canvas-confetti) for rewards.
- **Admin Tools**: Added a balance adjustment API and interface for teacher/admin roles.
- **Seed Script**: 100-question sample quiz and demo users.
- **CI/CD**: Added GitHub Actions workflow for linting, testing, and building.

### Design Decisions
- **Optimistic Locking**: Used a WHERE clause in SQL updates to ensure user balances are updated safely without race conditions.
- **Idempotency**: Implemented a \`coin_transactions\` unique index on \`attempt_id\` to ensure multiple submissions of the same result don't award duplicate coins.
- **Server-Side Grading**: All MCQ/Assertion questions are graded server-side to prevent client-side spoofing of rewards.
- **Modular Components**: Separated \`QuizPlayer\`, \`CoinWalletHeader\`, and \`CoinRewardAnimation\` for better maintainability and reusability.
- **Accessibility**: Every animation respects the \`prefers-reduced-motion\` setting, falling back to static badges.

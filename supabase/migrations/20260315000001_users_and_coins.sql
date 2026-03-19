-- ============================================================
-- QuizFlow Full Schema Migration
-- Run after initial schema: applies users, coin_transactions,
-- categories, tags, media and enhanced RLS policies
-- ============================================================

-- -------------------------------------------------------
-- 0. Enums & Extensions
-- -------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE coin_reason AS ENUM (
    'quiz_correct_answer', 'admin_adjustment', 'welcome_bonus', 'teacher_graded'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE student_level AS ENUM ('class6', 'class10', 'college', 'upsc', 'custom');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE question_type AS ENUM ('mcq_single', 'mcq_multi', 'assertion', 'short_answer', 'code');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Auto-update updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END $$;

-- -------------------------------------------------------
-- 1. NextAuth Schema (Required for @auth/supabase-adapter)
-- -------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS next_auth;

CREATE TABLE IF NOT EXISTS next_auth.users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT,
  email         TEXT UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image         TEXT
);

CREATE TABLE IF NOT EXISTS next_auth.accounts (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type               TEXT NOT NULL,
  provider           TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token      TEXT,
  access_token       TEXT,
  expires_at         BIGINT,
  token_type         TEXT,
  scope              TEXT,
  id_token           TEXT,
  session_state      TEXT,
  oauth_token_secret TEXT,
  oauth_token        TEXT,
  "userId"           UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS next_auth.sessions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expires        TIMESTAMPTZ NOT NULL,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId"       UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS next_auth.verification_tokens (
  identifier TEXT,
  token      TEXT PRIMARY KEY,
  expires    TIMESTAMPTZ NOT NULL
);

-- -------------------------------------------------------
-- 1. public.users table (mirrors next_auth.users + app logic)
-- -------------------------------------------------------
DROP TABLE IF EXISTS public.attempt_answers CASCADE;
DROP TABLE IF EXISTS public.attempts CASCADE;
DROP TABLE IF EXISTS public.questions CASCADE;
DROP TABLE IF EXISTS public.quizzes CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

CREATE TABLE public.users (
  id               UUID PRIMARY KEY REFERENCES next_auth.users(id) ON DELETE CASCADE,
  email            TEXT NOT NULL,
  display_name     TEXT,
  avatar_url       TEXT,
  role             user_role NOT NULL DEFAULT 'student',
  coins_balance    INTEGER NOT NULL DEFAULT 0 CHECK (coins_balance >= 0),
  email_verified   BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create public.users row after NextAuth user created
CREATE OR REPLACE FUNCTION public.handle_next_auth_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.name,
    NEW.image,
    (NEW."emailVerified" IS NOT NULL)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url,
    email_verified = EXCLUDED.email_verified;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_next_auth_user_created ON next_auth.users;
CREATE TRIGGER on_next_auth_user_created
  AFTER INSERT OR UPDATE ON next_auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_next_auth_user();

-- -------------------------------------------------------
-- 2. Categories & Tags
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT,
  color       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------
-- 3. Quizzes
-- -------------------------------------------------------
CREATE TABLE public.quizzes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  topic         TEXT NOT NULL,
  difficulty    difficulty_level NOT NULL,
  student_level student_level NOT NULL,
  language      TEXT NOT NULL DEFAULT 'English',
  category_id   UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_public     BOOLEAN NOT NULL DEFAULT false,
  creator_id    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  request_id    TEXT,                          -- AI generation request ID
  meta          JSONB NOT NULL DEFAULT '{}',   -- AI meta (uniqueness_score, estimated_time, etc.)
  ai_raw        JSONB,                          -- sanitized raw AI response (admin-visible)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER quizzes_updated_at
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -------------------------------------------------------
-- 4. Questions
-- -------------------------------------------------------
CREATE TABLE public.questions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id        UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  type           question_type NOT NULL,
  content        TEXT NOT NULL,
  options        JSONB,          -- array of exactly 4 strings for MCQ
  correct_answer JSONB NOT NULL, -- string or string[]
  explanation    TEXT,           -- ≤ 60 words enforced at app layer
  hints          JSONB NOT NULL DEFAULT '[]',  -- max 2 hints, ≤ 20 words each
  sources        JSONB NOT NULL DEFAULT '[]',
  tags           JSONB NOT NULL DEFAULT '[]',
  metadata       JSONB NOT NULL DEFAULT '{}',  -- estimated_time, difficulty_score, media
  order_index    INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_questions_quiz_id ON public.questions(quiz_id);

-- -------------------------------------------------------
-- 5. Attempts & Answers
-- -------------------------------------------------------
CREATE TABLE public.attempts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id             UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  attempt_id          TEXT UNIQUE NOT NULL,   -- client-generated idempotency key
  score_percentage    NUMERIC(5,2) DEFAULT 0,
  correct_count       INTEGER DEFAULT 0,
  total_questions     INTEGER DEFAULT 0,
  auto_graded_count   INTEGER DEFAULT 0,
  pending_review_count INTEGER DEFAULT 0,
  coins_awarded       INTEGER DEFAULT 0,
  time_taken_seconds  INTEGER,
  completed_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attempts_user_id ON public.attempts(user_id);
CREATE INDEX idx_attempts_quiz_id ON public.attempts(quiz_id);

CREATE TABLE public.attempt_answers (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id         UUID NOT NULL REFERENCES public.attempts(id) ON DELETE CASCADE,
  question_id        UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  user_answer        JSONB,
  is_correct         BOOLEAN,
  grading_status     TEXT NOT NULL DEFAULT 'auto_graded',  -- 'auto_graded', 'pending_review', 'teacher_graded'
  time_taken_seconds INTEGER,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- 6. Coin Transactions (append-only log)
-- -------------------------------------------------------
CREATE TABLE public.coin_transactions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  attempt_id       TEXT,                        -- idempotency: attempt external id
  quiz_id          UUID REFERENCES public.quizzes(id) ON DELETE SET NULL,
  coins_awarded    INTEGER NOT NULL,
  previous_balance INTEGER NOT NULL,
  new_balance      INTEGER NOT NULL,
  reason           coin_reason NOT NULL DEFAULT 'quiz_correct_answer',
  note             TEXT,
  timestamp        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coin_tx_user_id ON public.coin_transactions(user_id);
CREATE UNIQUE INDEX idx_coin_tx_attempt_id ON public.coin_transactions(attempt_id) WHERE attempt_id IS NOT NULL;

-- -------------------------------------------------------
-- 7. Media
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id     UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('image','video')),
  url         TEXT NOT NULL,
  alt_text    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------
-- 8. AI Generation Logs (for admin view)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_generation_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id    TEXT NOT NULL,
  user_id       UUID REFERENCES public.users(id) ON DELETE SET NULL,
  topic         TEXT,
  difficulty    TEXT,
  status        TEXT NOT NULL DEFAULT 'pending',   -- 'pending','success','failed','retried'
  attempts_used INTEGER DEFAULT 1,
  quiz_id       UUID REFERENCES public.quizzes(id) ON DELETE SET NULL,
  error_message TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- 9. Row-Level Security
-- -------------------------------------------------------
ALTER TABLE public.users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generation_logs ENABLE ROW LEVEL SECURITY;

-- Users
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

CREATE POLICY "Admins can update any user"
  ON public.users FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

-- Categories (public read)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Tags (public read)
CREATE POLICY "Anyone can view tags" ON public.tags FOR SELECT USING (true);

-- Quizzes
CREATE POLICY "Public quizzes viewable by all" ON public.quizzes FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view quizzes they generated" ON public.quizzes FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Authenticated can create quizzes" ON public.quizzes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Creators can update their quizzes" ON public.quizzes FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Admins can manage all quizzes" ON public.quizzes FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','teacher')));

-- Questions (follow quiz visibility)
CREATE POLICY "Questions visible with public quiz" ON public.questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.quizzes WHERE id = questions.quiz_id AND (is_public = true OR creator_id = auth.uid()))
);
CREATE POLICY "Creators insert questions" ON public.questions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.quizzes WHERE id = questions.quiz_id AND creator_id = auth.uid())
);

-- Attempts
CREATE POLICY "Users see own attempts" ON public.attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own attempts" ON public.attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins/teachers see all attempts" ON public.attempts FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','teacher')));

-- Attempt Answers
CREATE POLICY "Users see own attempt answers" ON public.attempt_answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.attempts WHERE id = attempt_answers.attempt_id AND user_id = auth.uid())
);
CREATE POLICY "Users create attempt answers" ON public.attempt_answers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.attempts WHERE id = attempt_answers.attempt_id AND user_id = auth.uid())
);

-- Coin Transactions
CREATE POLICY "Users see own coin transactions" ON public.coin_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role inserts coin transactions" ON public.coin_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins see all coin transactions" ON public.coin_transactions FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- AI Logs (admin only)
CREATE POLICY "Admins see AI logs" ON public.ai_generation_logs FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin','teacher')));

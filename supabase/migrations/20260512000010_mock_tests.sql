-- ============================================================
-- Mock Test Generator System
-- ============================================================

-- -------------------------------------------------------
-- 1. mock_test_purchases — Razorpay payment records
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mock_test_purchases (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  razorpay_order_id   TEXT NOT NULL UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  amount_paise     INTEGER NOT NULL DEFAULT 4900,   -- ₹49 in paise
  credits_granted  INTEGER NOT NULL DEFAULT 50,
  status           TEXT NOT NULL DEFAULT 'pending'  -- 'pending' | 'paid' | 'failed'
    CHECK (status IN ('pending', 'paid', 'failed')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_mock_purchases_user ON public.mock_test_purchases(user_id);

-- -------------------------------------------------------
-- 2. mock_test_sessions — Each AI-generated test
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mock_test_sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  exam_name        TEXT NOT NULL,
  subject          TEXT NOT NULL,
  topic            TEXT,
  difficulty       TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  num_questions    INTEGER NOT NULL,
  time_limit_min   INTEGER NOT NULL DEFAULT 30,
  language         TEXT NOT NULL DEFAULT 'English',
  questions        JSONB NOT NULL DEFAULT '[]',   -- full AI response stored here
  ai_raw           JSONB,
  status           TEXT NOT NULL DEFAULT 'generated'
    CHECK (status IN ('generated', 'in_progress', 'completed', 'expired')),
  expires_at       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mock_sessions_user ON public.mock_test_sessions(user_id);

-- -------------------------------------------------------
-- 3. mock_test_attempts — User submission + scoring
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mock_test_attempts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id          UUID NOT NULL REFERENCES public.mock_test_sessions(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  answers             JSONB NOT NULL DEFAULT '{}',   -- { "q_index": "A" | "B" | "C" | "D" }
  score_percentage    NUMERIC(5,2) DEFAULT 0,
  correct_count       INTEGER DEFAULT 0,
  wrong_count         INTEGER DEFAULT 0,
  unattempted_count   INTEGER DEFAULT 0,
  time_taken_seconds  INTEGER,
  submitted_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_mock_attempts_user ON public.mock_test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_mock_attempts_session ON public.mock_test_attempts(session_id);

-- -------------------------------------------------------
-- 4. Row-Level Security
-- -------------------------------------------------------
ALTER TABLE public.mock_test_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_test_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_test_attempts  ENABLE ROW LEVEL SECURITY;

-- Purchases: users see own; service_role sees all
DROP POLICY IF EXISTS "users_own_purchases"   ON public.mock_test_purchases;
DROP POLICY IF EXISTS "srole_purchases"       ON public.mock_test_purchases;
DROP POLICY IF EXISTS "admins_purchases"      ON public.mock_test_purchases;

CREATE POLICY "users_own_purchases"
  ON public.mock_test_purchases FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "srole_purchases"
  ON public.mock_test_purchases FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "admins_purchases"
  ON public.mock_test_purchases FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Sessions: users see own
DROP POLICY IF EXISTS "users_own_sessions"    ON public.mock_test_sessions;
DROP POLICY IF EXISTS "srole_sessions"        ON public.mock_test_sessions;

CREATE POLICY "users_own_sessions"
  ON public.mock_test_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "srole_sessions"
  ON public.mock_test_sessions FOR ALL USING (auth.role() = 'service_role');

-- Attempts: users see own
DROP POLICY IF EXISTS "users_own_attempts"    ON public.mock_test_attempts;
DROP POLICY IF EXISTS "srole_attempts"        ON public.mock_test_attempts;

CREATE POLICY "users_own_attempts"
  ON public.mock_test_attempts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "srole_attempts"
  ON public.mock_test_attempts FOR ALL USING (auth.role() = 'service_role');

-- -------------------------------------------------------
-- 5. Grants
-- -------------------------------------------------------
GRANT SELECT ON public.mock_test_purchases TO authenticated;
GRANT SELECT ON public.mock_test_sessions  TO authenticated;
GRANT SELECT ON public.mock_test_attempts  TO authenticated;
GRANT ALL ON public.mock_test_purchases TO service_role;
GRANT ALL ON public.mock_test_sessions  TO service_role;
GRANT ALL ON public.mock_test_attempts  TO service_role;

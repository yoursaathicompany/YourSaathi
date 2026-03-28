-- ============================================================
-- QuizFlow Full Schema + Withdrawal System
-- Includes fix for mark_withdrawal_paid double-deduction bug
-- ============================================================

-- ===============================
-- EXTENSIONS
-- ===============================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===============================
-- CUSTOM TYPES
-- ===============================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_level') THEN
    CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'student_level') THEN
    CREATE TYPE student_level AS ENUM ('class6', 'class10', 'college', 'upsc', 'custom');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_type') THEN
    CREATE TYPE question_type AS ENUM ('mcq_single', 'mcq_multi', 'assertion', 'short_answer', 'code');
  END IF;
END $$;

DO $$ BEGIN
  CREATE TYPE withdrawal_status AS ENUM ('pending', 'approved', 'rejected', 'paid');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE coin_ledger_type AS ENUM ('earned', 'locked', 'redeemed', 'refunded', 'adjusted');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ===============================
-- TABLES
-- ===============================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student',
  coins INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  topic TEXT NOT NULL,
  difficulty difficulty_level NOT NULL,
  student_level student_level NOT NULL,
  is_public BOOLEAN DEFAULT false,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  type question_type NOT NULL,
  content TEXT NOT NULL,
  options JSONB,
  correct_answer JSONB NOT NULL,
  explanation TEXT,
  hints JSONB DEFAULT '[]',
  sources JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  score_percentage NUMERIC DEFAULT 0,
  completed_at TIMESTAMPTZ,
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.attempt_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID REFERENCES public.attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  user_answer JSONB,
  is_correct BOOLEAN,
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================
-- TRIGGER: AUTO CREATE PROFILE
-- ===============================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===============================
-- ENABLE RLS
-- ===============================
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;

-- ===============================
-- POLICIES
-- ===============================
DO $$
BEGIN
  -- PROFILES
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='profiles_select') THEN
    CREATE POLICY profiles_select ON public.profiles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='profiles_insert') THEN
    CREATE POLICY profiles_insert ON public.profiles FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='profiles_update') THEN
    CREATE POLICY profiles_update ON public.profiles FOR UPDATE USING (auth.uid() = id);
  END IF;

  -- QUIZZES
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='quizzes_select') THEN
    CREATE POLICY quizzes_select ON public.quizzes FOR SELECT USING (is_public = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='quizzes_owner_all') THEN
    CREATE POLICY quizzes_owner_all ON public.quizzes
      FOR ALL USING (auth.uid() = creator_id) WITH CHECK (auth.uid() = creator_id);
  END IF;

  -- QUESTIONS
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='questions_select') THEN
    CREATE POLICY questions_select ON public.questions FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = questions.quiz_id AND q.is_public = true)
    );
  END IF;

  -- ATTEMPTS
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='attempts_select') THEN
    CREATE POLICY attempts_select ON public.attempts FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='attempts_insert') THEN
    CREATE POLICY attempts_insert ON public.attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- ATTEMPT ANSWERS
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='attempt_answers_select') THEN
    CREATE POLICY attempt_answers_select ON public.attempt_answers FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.attempts a WHERE a.id = attempt_answers.attempt_id AND a.user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='attempt_answers_insert') THEN
    CREATE POLICY attempt_answers_insert ON public.attempt_answers FOR INSERT WITH CHECK (
      EXISTS (SELECT 1 FROM public.attempts a WHERE a.id = attempt_answers.attempt_id AND a.user_id = auth.uid())
    );
  END IF;
END $$;

-- ============================================================
-- Withdrawal / Redeem Rewards System
-- ============================================================

-- withdrawal_settings table
CREATE TABLE IF NOT EXISTS public.withdrawal_settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label           TEXT NOT NULL,
  coins_required  INTEGER NOT NULL CHECK (coins_required > 0),
  rupee_amount    NUMERIC(10,2) NOT NULL CHECK (rupee_amount > 0),
  is_active       BOOLEAN NOT NULL DEFAULT true,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (coins_required)
);

DROP TRIGGER IF EXISTS withdrawal_settings_updated_at ON public.withdrawal_settings;
CREATE TRIGGER withdrawal_settings_updated_at
  BEFORE UPDATE ON public.withdrawal_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed tiers
INSERT INTO public.withdrawal_settings (label, coins_required, rupee_amount, sort_order)
VALUES
  ('Starter',  2000,  200.00, 1),
  ('Basic',    4000,  400.00, 2),
  ('Standard', 6000,  600.00, 3),
  ('Advanced', 8000,  800.00, 4),
  ('Premium', 10000, 1000.00, 5)
ON CONFLICT (coins_required) DO NOTHING;

-- withdrawals table
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tier_id             UUID REFERENCES public.withdrawal_settings(id) ON DELETE SET NULL,
  upi_id              TEXT NOT NULL,
  requested_amount    NUMERIC(10,2) NOT NULL CHECK (requested_amount > 0),
  coins_required      INTEGER NOT NULL CHECK (coins_required > 0),
  status              withdrawal_status NOT NULL DEFAULT 'pending',
  admin_notes         TEXT,
  payout_reference    TEXT,
  approved_by         UUID REFERENCES public.users(id) ON DELETE SET NULL,
  approved_at         TIMESTAMPTZ,
  rejected_at         TIMESTAMPTZ,
  paid_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id    ON public.withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status     ON public.withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON public.withdrawals(created_at DESC);

DROP TRIGGER IF EXISTS withdrawals_updated_at ON public.withdrawals;
CREATE TRIGGER withdrawals_updated_at
  BEFORE UPDATE ON public.withdrawals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- coin_ledger table
CREATE TABLE IF NOT EXISTS public.coin_ledger (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type            coin_ledger_type NOT NULL,
  amount          INTEGER NOT NULL,
  reference_id    UUID,
  reference_type  TEXT,
  note            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coin_ledger_user_id    ON public.coin_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_ledger_type       ON public.coin_ledger(type);
CREATE INDEX IF NOT EXISTS idx_coin_ledger_ref_id     ON public.coin_ledger(reference_id);
CREATE INDEX IF NOT EXISTS idx_coin_ledger_created_at ON public.coin_ledger(created_at DESC);

-- user_wallet_view
CREATE OR REPLACE VIEW public.user_wallet_view AS
SELECT
  user_id,
  COALESCE(SUM(CASE WHEN type IN ('earned', 'adjusted') THEN amount ELSE 0 END), 0) AS total_earned,
  COALESCE(SUM(CASE WHEN type = 'locked'   THEN amount ELSE 0 END), 0) AS total_locked,
  COALESCE(SUM(CASE WHEN type = 'redeemed' THEN amount ELSE 0 END), 0) AS total_redeemed,
  COALESCE(SUM(CASE WHEN type = 'refunded' THEN amount ELSE 0 END), 0) AS total_refunded,
  COALESCE(SUM(
    CASE
      WHEN type IN ('earned', 'adjusted', 'refunded') THEN  amount
      WHEN type IN ('locked', 'redeemed')             THEN -amount
      ELSE 0
    END
  ), 0) AS available_balance,
  MAX(created_at) AS last_transaction_at
FROM public.coin_ledger
GROUP BY user_id;

-- Backfill existing coin_transactions into coin_ledger
INSERT INTO public.coin_ledger (user_id, type, amount, reference_id, reference_type, note, created_at)
SELECT
  ct.user_id,
  'earned'::coin_ledger_type,
  ct.coins_awarded,
  ct.quiz_id,
  'quiz_attempt',
  ct.note,
  ct.timestamp
FROM public.coin_transactions ct
WHERE ct.coins_awarded > 0
ON CONFLICT DO NOTHING;

-- ============================================================
-- DB Functions
-- ============================================================

-- Helper: get available balance
CREATE OR REPLACE FUNCTION public.get_available_balance(p_user_id UUID)
RETURNS INTEGER LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT COALESCE(SUM(
    CASE
      WHEN type IN ('earned', 'adjusted', 'refunded') THEN  amount
      WHEN type IN ('locked', 'redeemed')             THEN -amount
      ELSE 0
    END
  ), 0)::INTEGER
  FROM public.coin_ledger WHERE user_id = p_user_id;
$$;

-- Create withdrawal request
CREATE OR REPLACE FUNCTION public.create_withdrawal_request(
  p_user_id UUID, p_tier_id UUID, p_upi_id TEXT
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_tier          public.withdrawal_settings%ROWTYPE;
  v_available     INTEGER;
  v_pending_count INTEGER;
  v_withdrawal_id UUID;
BEGIN
  SELECT * INTO v_tier FROM public.withdrawal_settings WHERE id = p_tier_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or inactive redemption tier.');
  END IF;

  IF NOT (p_upi_id ~* '^[a-zA-Z0-9._\-]+@[a-zA-Z0-9]+$') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid UPI ID format.');
  END IF;

  SELECT COUNT(*) INTO v_pending_count FROM public.withdrawals
  WHERE user_id = p_user_id AND status = 'pending';
  IF v_pending_count > 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'You already have a pending withdrawal request.');
  END IF;

  v_available := public.get_available_balance(p_user_id);
  IF v_available < v_tier.coins_required THEN
    RETURN jsonb_build_object('success', false, 'error',
      format('Insufficient coins. Need %s but have %s.', v_tier.coins_required, v_available));
  END IF;

  INSERT INTO public.withdrawals (user_id, tier_id, upi_id, requested_amount, coins_required, status)
  VALUES (p_user_id, p_tier_id, p_upi_id, v_tier.rupee_amount, v_tier.coins_required, 'pending')
  RETURNING id INTO v_withdrawal_id;

  -- Lock coins in ledger
  INSERT INTO public.coin_ledger (user_id, type, amount, reference_id, reference_type, note)
  VALUES (p_user_id, 'locked', v_tier.coins_required, v_withdrawal_id, 'withdrawal',
    format('Coins locked for withdrawal of ₹%s', v_tier.rupee_amount));

  -- Sync legacy cache
  UPDATE public.users SET coins_balance = public.get_available_balance(p_user_id) WHERE id = p_user_id;

  RETURN jsonb_build_object('success', true, 'withdrawal_id', v_withdrawal_id,
    'message', format('Withdrawal of ₹%s submitted successfully!', v_tier.rupee_amount));
END;
$$;

-- Approve withdrawal
CREATE OR REPLACE FUNCTION public.approve_withdrawal(p_withdrawal_id UUID, p_admin_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_w   public.withdrawals%ROWTYPE;
  v_role TEXT;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = p_admin_id;
  IF v_role <> 'admin' THEN RETURN jsonb_build_object('success', false, 'error', 'Unauthorized.'); END IF;

  SELECT * INTO v_w FROM public.withdrawals WHERE id = p_withdrawal_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'error', 'Withdrawal not found.'); END IF;
  IF v_w.status <> 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', format('Cannot approve a %s withdrawal.', v_w.status));
  END IF;

  UPDATE public.withdrawals SET status = 'approved', approved_by = p_admin_id, approved_at = NOW()
  WHERE id = p_withdrawal_id;

  RETURN jsonb_build_object('success', true, 'message', 'Withdrawal approved.');
END;
$$;

-- Reject withdrawal (auto-refunds coins)
CREATE OR REPLACE FUNCTION public.reject_withdrawal(
  p_withdrawal_id UUID, p_admin_id UUID, p_notes TEXT DEFAULT NULL
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_w   public.withdrawals%ROWTYPE;
  v_role TEXT;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = p_admin_id;
  IF v_role <> 'admin' THEN RETURN jsonb_build_object('success', false, 'error', 'Unauthorized.'); END IF;

  SELECT * INTO v_w FROM public.withdrawals WHERE id = p_withdrawal_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'error', 'Withdrawal not found.'); END IF;
  IF v_w.status NOT IN ('pending', 'approved') THEN
    RETURN jsonb_build_object('success', false, 'error', format('Cannot reject a %s withdrawal.', v_w.status));
  END IF;

  UPDATE public.withdrawals SET status = 'rejected', admin_notes = p_notes, rejected_at = NOW()
  WHERE id = p_withdrawal_id;

  -- Refund the locked coins
  INSERT INTO public.coin_ledger (user_id, type, amount, reference_id, reference_type, note)
  VALUES (v_w.user_id, 'refunded', v_w.coins_required, p_withdrawal_id, 'withdrawal',
    COALESCE('Refund: ' || p_notes, format('Coins refunded — ₹%s withdrawal rejected.', v_w.requested_amount)));

  -- Sync legacy cache
  UPDATE public.users SET coins_balance = public.get_available_balance(v_w.user_id) WHERE id = v_w.user_id;

  RETURN jsonb_build_object('success', true, 'message', 'Withdrawal rejected and coins refunded.');
END;
$$;

-- ============================================================
-- BUG FIX: mark_withdrawal_paid
-- OLD behaviour: inserted only 'redeemed', but 'locked' was never
-- cancelled → view subtracted BOTH locked AND redeemed → -ve balance.
--
-- FIX: first insert 'refunded' to cancel the 'locked' entry, THEN
-- insert 'redeemed'. Net ledger: earned - redeemed (single deduction).
-- ============================================================
CREATE OR REPLACE FUNCTION public.mark_withdrawal_paid(
  p_withdrawal_id UUID, p_admin_id UUID, p_payout_ref TEXT DEFAULT NULL
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_w   public.withdrawals%ROWTYPE;
  v_role TEXT;
BEGIN
  SELECT role INTO v_role FROM public.users WHERE id = p_admin_id;
  IF v_role <> 'admin' THEN RETURN jsonb_build_object('success', false, 'error', 'Unauthorized.'); END IF;

  SELECT * INTO v_w FROM public.withdrawals WHERE id = p_withdrawal_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'error', 'Withdrawal not found.'); END IF;
  IF v_w.status <> 'approved' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Must be approved before marking as paid.');
  END IF;

  UPDATE public.withdrawals SET status = 'paid', payout_reference = p_payout_ref, paid_at = NOW()
  WHERE id = p_withdrawal_id;

  -- Step 1: Cancel the existing 'locked' entry with a 'refunded' entry.
  --         This neutralises the locked deduction so it's not counted twice.
  INSERT INTO public.coin_ledger (user_id, type, amount, reference_id, reference_type, note)
  VALUES (v_w.user_id, 'refunded', v_w.coins_required, p_withdrawal_id, 'withdrawal',
    format('Unlocking coins for completed withdrawal ₹%s', v_w.requested_amount));

  -- Step 2: Permanently deduct as 'redeemed'.
  --         Net effect: earned - redeemed (no double-count with locked).
  INSERT INTO public.coin_ledger (user_id, type, amount, reference_id, reference_type, note)
  VALUES (v_w.user_id, 'redeemed', v_w.coins_required, p_withdrawal_id, 'withdrawal',
    format('₹%s paid to %s. Ref: %s', v_w.requested_amount, v_w.upi_id, COALESCE(p_payout_ref, 'N/A')));

  -- Sync legacy cache
  UPDATE public.users SET coins_balance = public.get_available_balance(v_w.user_id) WHERE id = v_w.user_id;

  RETURN jsonb_build_object('success', true, 'message', 'Marked as paid.');
END;
$$;

-- ============================================================
-- Backfill: Fix existing paid withdrawals with double-deduction
-- Inserts a compensating 'refunded' entry for any paid/approved
-- withdrawal that has both 'locked' AND 'redeemed' but no 'refunded'.
-- ============================================================
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT w.id AS withdrawal_id, w.user_id, w.coins_required, w.requested_amount
    FROM public.withdrawals w
    WHERE w.status IN ('paid', 'approved')
      AND EXISTS (
        SELECT 1 FROM public.coin_ledger cl
        WHERE cl.reference_id = w.id AND cl.reference_type = 'withdrawal' AND cl.type = 'locked'
      )
      AND EXISTS (
        SELECT 1 FROM public.coin_ledger cl
        WHERE cl.reference_id = w.id AND cl.reference_type = 'withdrawal' AND cl.type = 'redeemed'
      )
      AND NOT EXISTS (
        SELECT 1 FROM public.coin_ledger cl
        WHERE cl.reference_id = w.id AND cl.reference_type = 'withdrawal' AND cl.type = 'refunded'
      )
  LOOP
    INSERT INTO public.coin_ledger (user_id, type, amount, reference_id, reference_type, note)
    VALUES (
      r.user_id, 'refunded', r.coins_required, r.withdrawal_id, 'withdrawal',
      format('Backfill: unlocking coins for paid withdrawal ₹%s (double-deduction fix)', r.requested_amount)
    );

    UPDATE public.users
    SET coins_balance = public.get_available_balance(r.user_id)
    WHERE id = r.user_id;
  END LOOP;
END;
$$;

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE public.withdrawal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_ledger         ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active tiers"               ON public.withdrawal_settings;
DROP POLICY IF EXISTS "Admins can manage tiers"                    ON public.withdrawal_settings;
DROP POLICY IF EXISTS "Users can view own withdrawals"             ON public.withdrawals;
DROP POLICY IF EXISTS "Admins can view all withdrawals"            ON public.withdrawals;
DROP POLICY IF EXISTS "Admins can update withdrawals"              ON public.withdrawals;
DROP POLICY IF EXISTS "Service role full access on withdrawals"    ON public.withdrawals;
DROP POLICY IF EXISTS "Service role full access on coin_ledger"    ON public.coin_ledger;
DROP POLICY IF EXISTS "Users can view own ledger entries"          ON public.coin_ledger;
DROP POLICY IF EXISTS "Admins can view all ledger entries"         ON public.coin_ledger;

CREATE POLICY "Anyone can view active tiers"
  ON public.withdrawal_settings FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage tiers"
  ON public.withdrawal_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can view own withdrawals"
  ON public.withdrawals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all withdrawals"
  ON public.withdrawals FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update withdrawals"
  ON public.withdrawals FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Service role full access on withdrawals"
  ON public.withdrawals FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on coin_ledger"
  ON public.coin_ledger FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users can view own ledger entries"
  ON public.coin_ledger FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all ledger entries"
  ON public.coin_ledger FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- Grants
-- ============================================================
GRANT EXECUTE ON FUNCTION public.get_available_balance(UUID)                 TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_withdrawal_request(UUID, UUID, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.approve_withdrawal(UUID, UUID)              TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.reject_withdrawal(UUID, UUID, TEXT)         TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.mark_withdrawal_paid(UUID, UUID, TEXT)      TO authenticated, service_role;
GRANT SELECT ON public.user_wallet_view TO authenticated, service_role;

-- ============================================================
-- Set admin role
-- ============================================================
UPDATE public.users
SET role = 'admin'
WHERE email = 'imsanju4141@gmail.com';

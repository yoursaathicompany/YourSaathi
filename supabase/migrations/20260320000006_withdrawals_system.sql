-- ============================================================
-- Withdrawal / Redeem Rewards System Migration
-- YourSaathi App — Run in Supabase SQL Editor
-- ============================================================

-- -------------------------------------------------------
-- 0. Enums
-- -------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE withdrawal_status AS ENUM ('pending', 'approved', 'rejected', 'paid');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE coin_ledger_type AS ENUM ('earned', 'locked', 'redeemed', 'refunded', 'adjusted');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- -------------------------------------------------------
-- 1. withdrawal_settings — redeemable tiers (DB-driven)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.withdrawal_settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label           TEXT NOT NULL,                          -- e.g. "Starter", "Pro"
  coins_required  INTEGER NOT NULL CHECK (coins_required > 0),
  rupee_amount    NUMERIC(10,2) NOT NULL CHECK (rupee_amount > 0),
  is_active       BOOLEAN NOT NULL DEFAULT true,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (coins_required)
);

CREATE TRIGGER withdrawal_settings_updated_at
  BEFORE UPDATE ON public.withdrawal_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed initial tiers
INSERT INTO public.withdrawal_settings (label, coins_required, rupee_amount, sort_order)
VALUES
  ('Starter',    2000,  200.00, 1),
  ('Basic',      4000,  400.00, 2),
  ('Standard',   6000,  600.00, 3),
  ('Advanced',   8000,  800.00, 4),
  ('Premium',   10000, 1000.00, 5)
ON CONFLICT (coins_required) DO NOTHING;

-- -------------------------------------------------------
-- 2. withdrawals — every withdrawal request
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tier_id             UUID REFERENCES public.withdrawal_settings(id) ON DELETE SET NULL,
  upi_id              TEXT NOT NULL,
  requested_amount    NUMERIC(10,2) NOT NULL CHECK (requested_amount > 0),
  coins_required      INTEGER NOT NULL CHECK (coins_required > 0),
  status              withdrawal_status NOT NULL DEFAULT 'pending',
  admin_notes         TEXT,
  payout_reference    TEXT,           -- External payout transaction ID / UTR
  approved_by         UUID REFERENCES public.users(id) ON DELETE SET NULL,
  approved_at         TIMESTAMPTZ,
  rejected_at         TIMESTAMPTZ,
  paid_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_withdrawals_user_id   ON public.withdrawals(user_id);
CREATE INDEX idx_withdrawals_status    ON public.withdrawals(status);
CREATE INDEX idx_withdrawals_created_at ON public.withdrawals(created_at DESC);

CREATE TRIGGER withdrawals_updated_at
  BEFORE UPDATE ON public.withdrawals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -------------------------------------------------------
-- 3. coin_ledger — append-only audit trail
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coin_ledger (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type            coin_ledger_type NOT NULL,
  amount          INTEGER NOT NULL,               -- always positive
  reference_id    UUID,                           -- withdrawal_id or attempt_id etc.
  reference_type  TEXT,                           -- 'withdrawal', 'quiz_attempt', etc.
  note            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coin_ledger_user_id    ON public.coin_ledger(user_id);
CREATE INDEX idx_coin_ledger_type       ON public.coin_ledger(type);
CREATE INDEX idx_coin_ledger_ref_id     ON public.coin_ledger(reference_id);
CREATE INDEX idx_coin_ledger_created_at ON public.coin_ledger(created_at DESC);

-- -------------------------------------------------------
-- 4. user_wallet_view — computed balance per user
-- -------------------------------------------------------
CREATE OR REPLACE VIEW public.user_wallet_view AS
SELECT
  user_id,
  COALESCE(SUM(CASE WHEN type IN ('earned', 'adjusted') THEN amount ELSE 0 END), 0) AS total_earned,
  COALESCE(SUM(CASE WHEN type = 'locked'                THEN amount ELSE 0 END), 0) AS total_locked,
  COALESCE(SUM(CASE WHEN type = 'redeemed'              THEN amount ELSE 0 END), 0) AS total_redeemed,
  COALESCE(SUM(CASE WHEN type = 'refunded'              THEN amount ELSE 0 END), 0) AS total_refunded,
  -- available = earned + adjusted + refunded - locked - redeemed
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

-- -------------------------------------------------------
-- 5. Backfill coin_ledger from existing coin_transactions
--    so existing balances carry over correctly
-- -------------------------------------------------------
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

-- -------------------------------------------------------
-- 6. Secure DB Functions (SECURITY DEFINER)
-- -------------------------------------------------------

-- Helper: get available balance for a user
CREATE OR REPLACE FUNCTION public.get_available_balance(p_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(SUM(
    CASE
      WHEN type IN ('earned', 'adjusted', 'refunded') THEN  amount
      WHEN type IN ('locked', 'redeemed')             THEN -amount
      ELSE 0
    END
  ), 0)::INTEGER
  FROM public.coin_ledger
  WHERE user_id = p_user_id;
$$;

-- ── 6A. Create a withdrawal request (atomic) ─────────────────────────────
CREATE OR REPLACE FUNCTION public.create_withdrawal_request(
  p_user_id     UUID,
  p_tier_id     UUID,
  p_upi_id      TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tier            public.withdrawal_settings%ROWTYPE;
  v_available       INTEGER;
  v_pending_count   INTEGER;
  v_withdrawal_id   UUID;
BEGIN
  -- 1. Load & validate tier
  SELECT * INTO v_tier FROM public.withdrawal_settings
  WHERE id = p_tier_id AND is_active = true;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or inactive redemption tier.');
  END IF;

  -- 2. Validate UPI ID format (basic: word@word)
  IF NOT (p_upi_id ~* '^[a-zA-Z0-9._\-]+@[a-zA-Z0-9]+$') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid UPI ID format.');
  END IF;

  -- 3. Check for existing pending request
  SELECT COUNT(*) INTO v_pending_count
  FROM public.withdrawals
  WHERE user_id = p_user_id AND status = 'pending';

  IF v_pending_count > 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'You already have a pending withdrawal request. Please wait for it to be processed.');
  END IF;

  -- 4. Check available balance
  v_available := public.get_available_balance(p_user_id);

  IF v_available < v_tier.coins_required THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', format('Insufficient coins. You need %s coins but have %s available.', v_tier.coins_required, v_available)
    );
  END IF;

  -- 5. Insert withdrawal record
  INSERT INTO public.withdrawals (user_id, tier_id, upi_id, requested_amount, coins_required, status)
  VALUES (p_user_id, p_tier_id, p_upi_id, v_tier.rupee_amount, v_tier.coins_required, 'pending')
  RETURNING id INTO v_withdrawal_id;

  -- 6. Lock the coins in the ledger
  INSERT INTO public.coin_ledger (user_id, type, amount, reference_id, reference_type, note)
  VALUES (
    p_user_id,
    'locked',
    v_tier.coins_required,
    v_withdrawal_id,
    'withdrawal',
    format('Coins locked for withdrawal of ₹%s', v_tier.rupee_amount)
  );

  RETURN jsonb_build_object(
    'success', true,
    'withdrawal_id', v_withdrawal_id,
    'message', format('Withdrawal request of ₹%s submitted. Coins are locked pending admin approval.', v_tier.rupee_amount)
  );
END;
$$;

-- ── 6B. Admin: Approve a withdrawal ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.approve_withdrawal(
  p_withdrawal_id UUID,
  p_admin_id      UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_w public.withdrawals%ROWTYPE;
  v_admin_role TEXT;
BEGIN
  -- Verify caller is admin
  SELECT role INTO v_admin_role FROM public.users WHERE id = p_admin_id;
  IF v_admin_role <> 'admin' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized.');
  END IF;

  SELECT * INTO v_w FROM public.withdrawals WHERE id = p_withdrawal_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Withdrawal not found.');
  END IF;

  IF v_w.status <> 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', format('Cannot approve a %s withdrawal.', v_w.status));
  END IF;

  UPDATE public.withdrawals
  SET status = 'approved', approved_by = p_admin_id, approved_at = NOW()
  WHERE id = p_withdrawal_id;

  RETURN jsonb_build_object('success', true, 'message', 'Withdrawal approved. Please process the payout and mark as paid.');
END;
$$;

-- ── 6C. Admin: Reject a withdrawal (auto-refunds coins) ──────────────────
CREATE OR REPLACE FUNCTION public.reject_withdrawal(
  p_withdrawal_id UUID,
  p_admin_id      UUID,
  p_notes         TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_w public.withdrawals%ROWTYPE;
  v_admin_role TEXT;
BEGIN
  SELECT role INTO v_admin_role FROM public.users WHERE id = p_admin_id;
  IF v_admin_role <> 'admin' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized.');
  END IF;

  SELECT * INTO v_w FROM public.withdrawals WHERE id = p_withdrawal_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Withdrawal not found.');
  END IF;

  IF v_w.status NOT IN ('pending', 'approved') THEN
    RETURN jsonb_build_object('success', false, 'error', format('Cannot reject a %s withdrawal.', v_w.status));
  END IF;

  -- Update withdrawal status
  UPDATE public.withdrawals
  SET status = 'rejected', admin_notes = p_notes, rejected_at = NOW()
  WHERE id = p_withdrawal_id;

  -- Refund locked coins back to user
  INSERT INTO public.coin_ledger (user_id, type, amount, reference_id, reference_type, note)
  VALUES (
    v_w.user_id,
    'refunded',
    v_w.coins_required,
    p_withdrawal_id,
    'withdrawal',
    COALESCE('Refund: ' || p_notes, format('Coins refunded — withdrawal of ₹%s was rejected.', v_w.requested_amount))
  );

  RETURN jsonb_build_object('success', true, 'message', 'Withdrawal rejected and coins refunded to user.');
END;
$$;

-- ── 6D. Admin: Mark a withdrawal as paid ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.mark_withdrawal_paid(
  p_withdrawal_id  UUID,
  p_admin_id       UUID,
  p_payout_ref     TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_w public.withdrawals%ROWTYPE;
  v_admin_role TEXT;
BEGIN
  SELECT role INTO v_admin_role FROM public.users WHERE id = p_admin_id;
  IF v_admin_role <> 'admin' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized.');
  END IF;

  SELECT * INTO v_w FROM public.withdrawals WHERE id = p_withdrawal_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Withdrawal not found.');
  END IF;

  IF v_w.status <> 'approved' THEN
    RETURN jsonb_build_object('success', false, 'error', format('Cannot mark a %s withdrawal as paid. Must be approved first.', v_w.status));
  END IF;

  UPDATE public.withdrawals
  SET status = 'paid', payout_reference = p_payout_ref, paid_at = NOW()
  WHERE id = p_withdrawal_id;

  -- Mark coins as fully redeemed
  INSERT INTO public.coin_ledger (user_id, type, amount, reference_id, reference_type, note)
  VALUES (
    v_w.user_id,
    'redeemed',
    v_w.coins_required,
    p_withdrawal_id,
    'withdrawal',
    format('₹%s paid via UPI (%s). Ref: %s', v_w.requested_amount, v_w.upi_id, COALESCE(p_payout_ref, 'N/A'))
  );

  -- Remove the 'locked' entry balance effect by noting it's now fully consumed
  -- (locked → redeemed: net effect removes those coins permanently)

  RETURN jsonb_build_object('success', true, 'message', 'Withdrawal marked as paid and coins fully redeemed.');
END;
$$;

-- -------------------------------------------------------
-- 7. Row-Level Security
-- -------------------------------------------------------
ALTER TABLE public.withdrawal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_ledger         ENABLE ROW LEVEL SECURITY;

-- withdrawal_settings: anyone can read (for tier display), only admins manage
CREATE POLICY "Anyone can view active tiers"
  ON public.withdrawal_settings FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage tiers"
  ON public.withdrawal_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- withdrawals: users see only their own; admins see all
CREATE POLICY "Users can view own withdrawals"
  ON public.withdrawals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all withdrawals"
  ON public.withdrawals FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update withdrawals"
  ON public.withdrawals FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Service role can do everything (used by our API routes via supabaseAdmin)
CREATE POLICY "Service role full access on withdrawals"
  ON public.withdrawals FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on coin_ledger"
  ON public.coin_ledger FOR ALL
  USING (auth.role() = 'service_role');

-- coin_ledger: users see own; admins see all
CREATE POLICY "Users can view own ledger entries"
  ON public.coin_ledger FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all ledger entries"
  ON public.coin_ledger FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- -------------------------------------------------------
-- 8. Grant execute permissions on functions
-- -------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.get_available_balance(UUID)         TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_available_balance(UUID)         TO service_role;
GRANT EXECUTE ON FUNCTION public.create_withdrawal_request(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_withdrawal_request(UUID, UUID, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.approve_withdrawal(UUID, UUID)      TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_withdrawal(UUID, UUID)      TO service_role;
GRANT EXECUTE ON FUNCTION public.reject_withdrawal(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_withdrawal(UUID, UUID, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.mark_withdrawal_paid(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_withdrawal_paid(UUID, UUID, TEXT) TO service_role;

-- Grant view access
GRANT SELECT ON public.user_wallet_view TO authenticated;
GRANT SELECT ON public.user_wallet_view TO service_role;

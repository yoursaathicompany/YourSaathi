-- ============================================================
-- Fix: Withdrawal "paid" double-deduction bug
-- When mark_withdrawal_paid runs it adds a 'redeemed' ledger entry,
-- but the 'locked' entry from submission is never cancelled.
-- The view formula counts BOTH locked AND redeemed as deductions,
-- causing the available_balance to go negative (show minus coins).
--
-- Fix: when marking paid, first insert a 'refunded' entry to cancel
-- the 'locked' one, then insert 'redeemed'.
-- Net ledger effect: earned - redeemed  (single clean deduction)
-- ============================================================

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

  -- Step 1: Cancel the 'locked' entry by inserting a compensating 'refunded' entry.
  --         This brings the "locked" deduction back to zero.
  INSERT INTO public.coin_ledger (user_id, type, amount, reference_id, reference_type, note)
  VALUES (
    v_w.user_id,
    'refunded',
    v_w.coins_required,
    p_withdrawal_id,
    'withdrawal',
    format('Unlocking coins previously locked for withdrawal ₹%s (now converting to redeemed)', v_w.requested_amount)
  );

  -- Step 2: Now permanently deduct those coins as 'redeemed'.
  --         Net effect: earned - redeemed  (no double-count with 'locked')
  INSERT INTO public.coin_ledger (user_id, type, amount, reference_id, reference_type, note)
  VALUES (
    v_w.user_id,
    'redeemed',
    v_w.coins_required,
    p_withdrawal_id,
    'withdrawal',
    format('₹%s paid via UPI (%s). Ref: %s', v_w.requested_amount, v_w.upi_id, COALESCE(p_payout_ref, 'N/A'))
  );

  -- Sync the legacy cache column
  UPDATE public.users
  SET coins_balance = public.get_available_balance(v_w.user_id)
  WHERE id = v_w.user_id;

  RETURN jsonb_build_object('success', true, 'message', 'Withdrawal marked as paid and coins fully redeemed.');
END;
$$;

-- ============================================================
-- Backfill: Fix existing paid withdrawals that were processed
-- with the old broken function (they have both 'locked' AND
-- 'redeemed' entries, causing double-deduction / negative balance).
--
-- For each paid withdrawal, if there is a 'locked' entry but NO
-- compensating 'refunded' entry (the fix we now add), insert one.
-- ============================================================
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT
      w.id            AS withdrawal_id,
      w.user_id,
      w.coins_required,
      w.requested_amount
    FROM public.withdrawals w
    WHERE w.status IN ('paid', 'approved')
      -- Has a 'locked' ledger entry for this withdrawal
      AND EXISTS (
        SELECT 1 FROM public.coin_ledger cl
        WHERE cl.reference_id = w.id
          AND cl.reference_type = 'withdrawal'
          AND cl.type = 'locked'
      )
      -- Has a 'redeemed' ledger entry (old code added this without cancelling locked)
      AND EXISTS (
        SELECT 1 FROM public.coin_ledger cl
        WHERE cl.reference_id = w.id
          AND cl.reference_type = 'withdrawal'
          AND cl.type = 'redeemed'
      )
      -- Does NOT already have the compensating 'refunded' entry (our fix)
      AND NOT EXISTS (
        SELECT 1 FROM public.coin_ledger cl
        WHERE cl.reference_id = w.id
          AND cl.reference_type = 'withdrawal'
          AND cl.type = 'refunded'
      )
  LOOP
    -- Insert the compensating refund to cancel the stale 'locked' entry
    INSERT INTO public.coin_ledger (user_id, type, amount, reference_id, reference_type, note)
    VALUES (
      r.user_id,
      'refunded',
      r.coins_required,
      r.withdrawal_id,
      'withdrawal',
      format('Backfill: unlocking coins for already-paid withdrawal ₹%s (fixing double-deduction bug)', r.requested_amount)
    );

    -- Sync the legacy cache column for this user
    UPDATE public.users
    SET coins_balance = public.get_available_balance(r.user_id)
    WHERE id = r.user_id;
  END LOOP;
END;
$$;

-- ============================================================
-- Bonus Offers System — Admin-Controlled
-- ============================================================

-- Main offers configuration table
CREATE TABLE IF NOT EXISTS public.bonus_offers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  type            TEXT NOT NULL CHECK (type IN ('signup_bonus', 'promo_code', 'custom')),
  coin_amount     INTEGER NOT NULL CHECK (coin_amount > 0),
  max_recipients  INTEGER CHECK (max_recipients IS NULL OR max_recipients > 0),
  is_active       BOOLEAN NOT NULL DEFAULT true,
  promo_code      TEXT,           -- required & unique for promo_code offers
  starts_at       TIMESTAMPTZ,    -- NULL = no start restriction
  ends_at         TIMESTAMPTZ,    -- NULL = no end restriction
  description     TEXT,           -- admin-only internal notes
  modal_title     TEXT,           -- headline shown to users in modal
  modal_body      TEXT,           -- body text shown to users in modal
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Case-insensitive unique index on promo_code (NULLs allowed, excluded from index)
CREATE UNIQUE INDEX IF NOT EXISTS uidx_bonus_offers_promo_code
  ON public.bonus_offers (lower(promo_code))
  WHERE promo_code IS NOT NULL;

-- Claim tracking — one row per user per offer
CREATE TABLE IF NOT EXISTS public.offer_claims (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id   UUID NOT NULL REFERENCES public.bonus_offers(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (offer_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_offer_claims_offer_id ON public.offer_claims(offer_id);
CREATE INDEX IF NOT EXISTS idx_offer_claims_user_id  ON public.offer_claims(user_id);

-- Auto-update updated_at
DROP TRIGGER IF EXISTS bonus_offers_updated_at ON public.bonus_offers;
CREATE TRIGGER bonus_offers_updated_at
  BEFORE UPDATE ON public.bonus_offers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.bonus_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_claims  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "srole_bonus_offers"        ON public.bonus_offers;
DROP POLICY IF EXISTS "admins_manage_bonus_offers" ON public.bonus_offers;
DROP POLICY IF EXISTS "public_read_active_offers"  ON public.bonus_offers;
DROP POLICY IF EXISTS "srole_offer_claims"         ON public.offer_claims;
DROP POLICY IF EXISTS "users_view_own_claims"      ON public.offer_claims;
DROP POLICY IF EXISTS "admins_view_all_claims"     ON public.offer_claims;

CREATE POLICY "srole_bonus_offers"
  ON public.bonus_offers FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "admins_manage_bonus_offers"
  ON public.bonus_offers FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "public_read_active_offers"
  ON public.bonus_offers FOR SELECT USING (is_active = true);

CREATE POLICY "srole_offer_claims"
  ON public.offer_claims FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "users_view_own_claims"
  ON public.offer_claims FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "admins_view_all_claims"
  ON public.offer_claims FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Grants
GRANT SELECT ON public.bonus_offers TO authenticated;
GRANT SELECT, INSERT ON public.offer_claims TO authenticated;
GRANT ALL ON public.bonus_offers TO service_role;
GRANT ALL ON public.offer_claims TO service_role;

-- Seed: pre-populate with the existing signup bonus
INSERT INTO public.bonus_offers (
  name, type, coin_amount, max_recipients, is_active,
  description, modal_title, modal_body
)
VALUES (
  'Welcome Bonus',
  'signup_bonus',
  100,
  100,
  true,
  'First 100 users get a 100-coin welcome bonus on signup.',
  '🎁 Welcome Bonus — 100 Free Coins!',
  'You''re one of the first users on YourSaathi. Claim your exclusive welcome bonus — valid for the first 100 sign-ups only.'
)
ON CONFLICT DO NOTHING;

-- Backfill: register existing signup_bonus coin_ledger entries as offer_claims
-- so those users don't get double-granted
DO $$
DECLARE
  v_offer_id UUID;
BEGIN
  SELECT id INTO v_offer_id FROM public.bonus_offers WHERE type = 'signup_bonus' LIMIT 1;
  IF v_offer_id IS NOT NULL THEN
    INSERT INTO public.offer_claims (offer_id, user_id, claimed_at)
    SELECT v_offer_id, cl.user_id, cl.created_at
    FROM   public.coin_ledger cl
    WHERE  cl.reference_type = 'signup_bonus'
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

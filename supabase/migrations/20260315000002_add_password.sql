-- -------------------------------------------------------
-- Add password_hash to public.users for Credentials Auth
-- -------------------------------------------------------
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash TEXT;

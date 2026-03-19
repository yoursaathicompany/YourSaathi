-- Add missing columns to public.quizzes if they do not already exist
-- This ensures older tables correctly support the new generation API payload

ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English';
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS request_id TEXT;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS ai_raw JSONB DEFAULT '{}';

-- Tell PostgREST to reload its schema cache (optional but helpful if running in SQL editor)
NOTIFY pgrst, 'reload schema';

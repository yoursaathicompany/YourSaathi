-- Add ai_raw column to public.quizzes if it does not already exist
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS ai_raw JSONB DEFAULT '{}';

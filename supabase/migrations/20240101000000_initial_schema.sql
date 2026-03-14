-- Create custom types
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE student_level AS ENUM ('class6', 'class10', 'college', 'upsc', 'custom');
CREATE TYPE question_type AS ENUM ('mcq_single', 'mcq_multi', 'assertion', 'short_answer', 'code');

-- 1. Users table (managed by Supabase Auth but we might need public profiles)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student', -- 'student', 'teacher', 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Quizzes table
CREATE TABLE public.quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  topic TEXT NOT NULL,
  difficulty difficulty_level NOT NULL,
  student_level student_level NOT NULL,
  is_public BOOLEAN DEFAULT false,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  meta JSONB DEFAULT '{}', -- stores count, time, unique score etc
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Questions table
CREATE TABLE public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  type question_type NOT NULL,
  content TEXT NOT NULL,
  options JSONB, -- Array of strings for MCQs
  correct_answer JSONB NOT NULL, -- Can be single string or array of strings
  explanation TEXT,
  hints JSONB DEFAULT '[]',
  sources JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Attempts table
CREATE TABLE public.attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  score_percentage NUMERIC DEFAULT 0,
  completed_at TIMESTAMPTZ,
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Attempt Answers table
CREATE TABLE public.attempt_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID REFERENCES public.attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  user_answer JSONB,
  is_correct BOOLEAN,
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;

-- Basic Policies (can be refined based on NextAuth logic)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public quizzes are viewable by everyone" ON public.quizzes FOR SELECT USING (is_public = true);
CREATE POLICY "Teachers can create and manage their quizzes" ON public.quizzes FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Questions are viewable by everyone if quiz is public" ON public.questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.quizzes WHERE id = questions.quiz_id AND is_public = true)
);

CREATE POLICY "Users can see their own attempts" ON public.attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own attempts" ON public.attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can see their own attempt answers" ON public.attempt_answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.attempts WHERE id = attempt_answers.attempt_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create own attempt answers" ON public.attempt_answers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.attempts WHERE id = attempt_answers.attempt_id AND user_id = auth.uid())
);

-- -- Create custom types (idempotent with DO blocks)
-- DO $$
-- BEGIN
--   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_level') THEN
--     CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
--   END IF;
-- END $$;

-- DO $$
-- BEGIN
--   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'student_level') THEN
--     CREATE TYPE student_level AS ENUM ('class6', 'class10', 'college', 'upsc', 'custom');
--   END IF;
-- END $$;

-- DO $$
-- BEGIN
--   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_type') THEN
--     CREATE TYPE question_type AS ENUM ('mcq_single', 'mcq_multi', 'assertion', 'short_answer', 'code');
--   END IF;
-- END $$;

-- -- Tables (unchanged, IF NOT EXISTS works fine)
-- CREATE TABLE IF NOT EXISTS public.profiles (
--   id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
--   full_name TEXT,
--   avatar_url TEXT,
--   role TEXT DEFAULT 'student',
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   updated_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- CREATE TABLE IF NOT EXISTS public.quizzes (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   title TEXT NOT NULL,
--   description TEXT,
--   topic TEXT NOT NULL,
--   difficulty difficulty_level NOT NULL,
--   student_level student_level NOT NULL,
--   is_public BOOLEAN DEFAULT false,
--   creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
--   meta JSONB DEFAULT '{}',
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   updated_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- CREATE TABLE IF NOT EXISTS public.questions (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
--   type question_type NOT NULL,
--   content TEXT NOT NULL,
--   options JSONB,
--   correct_answer JSONB NOT NULL,
--   explanation TEXT,
--   hints JSONB DEFAULT '[]',
--   sources JSONB DEFAULT '[]',
--   tags JSONB DEFAULT '[]',
--   metadata JSONB DEFAULT '{}',
--   order_index INTEGER NOT NULL DEFAULT 0,
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   updated_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- CREATE TABLE IF NOT EXISTS public.attempts (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
--   user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
--   score_percentage NUMERIC DEFAULT 0,
--   completed_at TIMESTAMPTZ,
--   time_taken_seconds INTEGER,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- CREATE TABLE IF NOT EXISTS public.attempt_answers (
--   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--   attempt_id UUID REFERENCES public.attempts(id) ON DELETE CASCADE,
--   question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
--   user_answer JSONB,
--   is_correct BOOLEAN,
--   time_taken_seconds INTEGER,
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- -- Enable RLS
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;

-- -- Policies (idempotent via DO $$ ... $$)

-- -- public_profiles_select: Public profiles are viewable by everyone
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1
--     FROM pg_catalog.pg_policy p
--     JOIN pg_catalog.pg_class c ON p.polrelid = c.oid
--     JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
--     WHERE n.nspname = 'public'
--       AND c.relname = 'profiles'
--       AND p.polname = 'public_profiles_select'
--   ) THEN
--     CREATE POLICY public_profiles_select
--       ON public.profiles
--       FOR SELECT
--       USING (true);
--   END IF;
-- END
-- $$;

-- -- public_profiles_update: Users can update own profile
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1
--     FROM pg_catalog.pg_policy p
--     JOIN pg_catalog.pg_class c ON p.polrelid = c.oid
--     JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
--     WHERE n.nspname = 'public'
--       AND c.relname = 'profiles'
--       AND p.polname = 'public_profiles_update'
--   ) THEN
--     CREATE POLICY public_profiles_update
--       ON public.profiles
--       FOR UPDATE
--       USING ((SELECT auth.uid()) = id);
--   END IF;
-- END
-- $$;

-- -- public_quizzes_select: Public quizzes are viewable by everyone
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1
--     FROM pg_catalog.pg_policy p
--     JOIN pg_catalog.pg_class c ON p.polrelid = c.oid
--     JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
--     WHERE n.nspname = 'public'
--       AND c.relname = 'quizzes'
--       AND p.polname = 'public_quizzes_select'
--   ) THEN
--     CREATE POLICY public_quizzes_select
--       ON public.quizzes
--       FOR SELECT
--       USING (is_public = true);
--   END IF;
-- END
-- $$;

-- -- public_quizzes_owner_all: Teachers can create and manage their quizzes
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1
--     FROM pg_catalog.pg_policy p
--     JOIN pg_catalog.pg_class c ON p.polrelid = c.oid
--     JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
--     WHERE n.nspname = 'public'
--       AND c.relname = 'quizzes'
--       AND p.polname = 'public_quizzes_owner_all'
--   ) THEN
--     CREATE POLICY public_quizzes_owner_all
--       ON public.quizzes
--       FOR ALL
--       USING ((SELECT auth.uid()) = creator_id)
--       WITH CHECK ((SELECT auth.uid()) = creator_id);
--   END IF;
-- END
-- $$;

-- -- public_questions_select: Questions are viewable if their quiz is public
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1
--     FROM pg_catalog.pg_policy p
--     JOIN pg_catalog.pg_class c ON p.polrelid = c.oid
--     JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
--     WHERE n.nspname = 'public'
--       AND c.relname = 'questions'
--       AND p.polname = 'public_questions_select'
--   ) THEN
--     CREATE POLICY public_questions_select
--       ON public.questions
--       FOR SELECT
--       USING (
--         EXISTS (
--           SELECT 1 FROM public.quizzes q
--           WHERE q.id = public.questions.quiz_id
--             AND q.is_public = true
--         )
--       );
--   END IF;
-- END
-- $$;

-- -- public_attempts_select: Users can see their own attempts
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1
--     FROM pg_catalog.pg_policy p
--     JOIN pg_catalog.pg_class c ON p.polrelid = c.oid
--     JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
--     WHERE n.nspname = 'public'
--       AND c.relname = 'attempts'
--       AND p.polname = 'public_attempts_select'
--   ) THEN
--     CREATE POLICY public_attempts_select
--       ON public.attempts
--       FOR SELECT
--       USING ((SELECT auth.uid()) = user_id);
--   END IF;
-- END
-- $$;

-- -- public_attempts_insert: Users can create their own attempts
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1
--     FROM pg_catalog.pg_policy p
--     JOIN pg_catalog.pg_class c ON p.polrelid = c.oid
--     JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
--     WHERE n.nspname = 'public'
--       AND c.relname = 'attempts'
--       AND p.polname = 'public_attempts_insert'
--   ) THEN
--     CREATE POLICY public_attempts_insert
--       ON public.attempts
--       FOR INSERT
--       WITH CHECK ((SELECT auth.uid()) = user_id);
--   END IF;
-- END
-- $$;

-- -- public_attempt_answers_select: Users can see their own attempt answers
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1
--     FROM pg_catalog.pg_policy p
--     JOIN pg_catalog.pg_class c ON p.polrelid = c.oid
--     JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
--     WHERE n.nspname = 'public'
--       AND c.relname = 'attempt_answers'
--       AND p.polname = 'public_attempt_answers_select'
--   ) THEN
--     CREATE POLICY public_attempt_answers_select
--       ON public.attempt_answers
--       FOR SELECT
--       USING (
--         EXISTS (
--           SELECT 1 FROM public.attempts a
--           WHERE a.id = public.attempt_answers.attempt_id
--             AND a.user_id = (SELECT auth.uid())
--         )
--       );
--   END IF;
-- END
-- $$;

-- -- public_attempt_answers_insert: Users can create own attempt answers
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1
--     FROM pg_catalog.pg_policy p
--     JOIN pg_catalog.pg_class c ON p.polrelid = c.oid
--     JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
--     WHERE n.nspname = 'public'
--       AND c.relname = 'attempt_answers'
--       AND p.polname = 'public_attempt_answers_insert'
--   ) THEN
--     CREATE POLICY public_attempt_answers_insert
--       ON public.attempt_answers
--       FOR INSERT
--       WITH CHECK (
--         EXISTS (
--           SELECT 1 FROM public.attempts a
--           WHERE a.id = public.attempt_answers.attempt_id
--             AND a.user_id = (SELECT auth.uid())
--         )
--       );
--   END IF;
-- END
-- $$;

-- -- Add password_hash to public.profiles if not exists
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;



-- chatgpt code 

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
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ===============================
-- ENABLE RLS (AFTER TABLES EXIST)
-- ===============================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;

-- ===============================
-- POLICIES (SAFE EXECUTION)
-- ===============================

DO $$
BEGIN
  -- PROFILES
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='profiles') THEN

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='profiles_select') THEN
      CREATE POLICY profiles_select ON public.profiles FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='profiles_insert') THEN
      CREATE POLICY profiles_insert ON public.profiles FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='profiles_update') THEN
      CREATE POLICY profiles_update ON public.profiles FOR UPDATE USING (auth.uid() = id);
    END IF;

  END IF;

  -- QUIZZES
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='quizzes') THEN

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='quizzes_select') THEN
      CREATE POLICY quizzes_select ON public.quizzes FOR SELECT USING (is_public = true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='quizzes_owner_all') THEN
      CREATE POLICY quizzes_owner_all ON public.quizzes
      FOR ALL USING (auth.uid() = creator_id)
      WITH CHECK (auth.uid() = creator_id);
    END IF;

  END IF;

  -- QUESTIONS
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='questions') THEN

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='questions_select') THEN
      CREATE POLICY questions_select ON public.questions
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.quizzes q
          WHERE q.id = questions.quiz_id AND q.is_public = true
        )
      );
    END IF;

  END IF;

  -- ATTEMPTS
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='attempts') THEN

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='attempts_select') THEN
      CREATE POLICY attempts_select ON public.attempts
      FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='attempts_insert') THEN
      CREATE POLICY attempts_insert ON public.attempts
      FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

  END IF;

  -- ATTEMPT ANSWERS
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='attempt_answers') THEN

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='attempt_answers_select') THEN
      CREATE POLICY attempt_answers_select ON public.attempt_answers
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.attempts a
          WHERE a.id = attempt_answers.attempt_id AND a.user_id = auth.uid()
        )
      );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname='attempt_answers_insert') THEN
      CREATE POLICY attempt_answers_insert ON public.attempt_answers
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.attempts a
          WHERE a.id = attempt_answers.attempt_id AND a.user_id = auth.uid()
        )
      );
    END IF;

  END IF;

END $$;
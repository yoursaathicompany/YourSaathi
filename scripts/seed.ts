import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🌱 Seeding QuizFlow database...');

  // 1. Categories
  const categories = [
    { name: 'Mathematics & Logic', slug: 'math', icon: 'Calculator', color: 'from-blue-500 to-cyan-400' },
    { name: 'Science & Nature', slug: 'science', icon: 'Beaker', color: 'from-emerald-500 to-green-400' },
    { name: 'Computer Science', slug: 'cs', icon: 'Code2', color: 'from-purple-500 to-indigo-500' },
    { name: 'World History', slug: 'history', icon: 'Globe', color: 'from-orange-500 to-yellow-500' },
    { name: 'Literature', slug: 'lit', icon: 'Book', color: 'from-pink-500 to-rose-400' },
    { name: 'Competitive Exams', slug: 'comp', icon: 'Target', color: 'from-red-500 to-orange-500' },
  ];

  const { data: catData, error: catErr } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' }).select();
  if (catErr) console.error('Cat Seed Error:', catErr);
  console.log(`✅ Seeded ${catData?.length} categories`);

  // 2. Demo User (Teacher) in next_auth schema first
  const teacherId = '00000000-0000-0000-0000-000000000001';
  await supabase.from('users').delete().eq('id', teacherId); // Clear old app row
  
  // Note: Handle NextAuth triggers sync, but to be safe we insert into both or rely on trigger
  // Since we have a trigger on next_auth.users -> public.users, we just need the next_auth row
  const { error: authUserErr } = await supabase.schema('next_auth').from('users').upsert({
    id: teacherId,
    name: 'Seed Teacher Admin',
    email: 'teacher@quizflow.dev',
    image: null,
    emailVerified: new Date().toISOString()
  });

  if (authUserErr) console.error('Auth User Seed Error:', authUserErr);

  // The trigger handle_next_auth_user will auto-create the public.users row.
  // We just update the role to admin afterward.
  await supabase.from('users').update({ role: 'admin', coins_balance: 1000 }).eq('id', teacherId);

  // 3. Quiz & 100 Questions
  console.log('Generating 100 questions...');
  
  const { data: quiz } = await supabase.from('quizzes').upsert({
    title: 'General Knowledge Mega Quiz',
    topic: 'General Knowledge',
    difficulty: 'medium',
    student_level: 'college',
    creator_id: teacherId,
    is_public: true,
  }).select().single();

  if (quiz) {
    const questions = [];
    for (let i = 1; i <= 100; i++) {
      questions.push({
        quiz_id: quiz.id,
        type: 'mcq_single',
        content: `Sample Question #${i}: What is the result of ${i} + ${i}?`,
        options: [String(i * 2), String(i * 2 + 1), String(i * 2 - 1), String(i + 1)],
        correct_answer: String(i * 2),
        explanation: `The sum of ${i} and ${i} is exactly ${i * 2}. This is a basic arithmetic question for demonstration.`,
        hints: ['Try adding the numbers.', 'It is an even number.'],
        order_index: i,
        metadata: { estimated_time_seconds: 30, difficulty_score: 1 }
      });
    }

    const { error: qErr } = await supabase.from('questions').insert(questions);
    if (qErr) console.error('Question Seed Error:', qErr);
    else console.log('✅ Seeded 100 questions into "General Knowledge Mega Quiz"');
  }

  console.log('🏁 Seeding complete!');
}

seed();

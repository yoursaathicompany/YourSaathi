const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error("Please provide SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleQuestions = Array.from({ length: 100 }).map((_, i) => ({
  type: i % 5 === 0 ? 'mcq_multi' : 'mcq_single',
  content: `Sample unique question content ${i + 1} regarding an educational topic.`,
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correct_answer: i % 5 === 0 ? ['Option A', 'Option C'] : 'Option B',
  explanation: `This is a sample explanation for question ${i + 1} which is less than 60 words.`,
  hints: ['Hint 1', 'Hint 2'],
  sources: [],
  tags: ['sample', 'education'],
  metadata: {
    estimated_time_seconds: 30,
    difficulty_score: 0.5,
    media: i % 10 === 0 ? { type: 'image', url: 'https://placehold.co/600x400' } : null
  },
  order_index: i
}));

async function seed() {
  console.log("Starting seed process...");

  // 1. Create a dummy public profile for a teacher
  const { data: profile, error: profileErr } = await supabase.from('profiles').insert({
    id: '00000000-0000-0000-0000-000000000000', // Need proper auth user normally, assuming this works with disabled RLS seed
    full_name: 'Seed Teacher Admin',
    role: 'teacher'
  }).select().single();

  const profileId = profile?.id || null;

  // 2. Create a generic public quiz
  const { data: quiz, error: quizErr } = await supabase.from('quizzes').insert({
    title: '100 Question Comprehensive Sample Quiz',
    description: 'A pre-seeded quiz containing diverse topics and question types to verify the system works.',
    topic: 'General Knowledge',
    difficulty: 'medium',
    student_level: 'college',
    is_public: true,
    creator_id: profileId,
    meta: { count: 100, estimated_time: 3000 }
  }).select().single();

  if (quizErr) {
    console.error("Failed to seed quiz:", quizErr);
    // Ignore error if RLS or foreign key is an issue for initial dummy setup without real auth users
  }

  const quizId = quiz?.id || null;

  // 3. Insert questions mapped to the quiz
  if (quizId) {
    const questionsToInsert = sampleQuestions.map(q => ({ ...q, quiz_id: quizId }));
    const { error: qErr } = await supabase.from('questions').insert(questionsToInsert);
    if (qErr) console.error("Error inserting questions:", qErr.message);
    else console.log("Successfully inserted 100 sample questions linked to quiz", quizId);
  } else {
    // Insert just as floating questions if quiz failed
    const { error: qErr } = await supabase.from('questions').insert(sampleQuestions);
    if (qErr) console.error("Error inserting questions:", qErr.message);
    else console.log("Successfully inserted 100 floating sample questions.");
  }

  console.log("Seed completed.");
}

seed();

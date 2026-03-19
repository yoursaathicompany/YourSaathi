const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.from('quizzes').select('*').limit(1);
  console.log("Service role key select:", data, error);
  
  // also try to do an insert
  const dummyUser = "02872602-54b6-4387-8750-b3eced89d9d7";
  const { error: insertError } = await supabase.from('quizzes').insert({
    title: "Test",
    topic: "Test Topic",
    difficulty: "easy",
    student_level: "class10",
    language: "English",
    creator_id: dummyUser,
    request_id: "test-" + Date.now(),
    meta: { num_questions_returned: 1, estimated_total_time_seconds: 60 },
    ai_raw: {}
  });
  console.log("Service role key insert error:", insertError);
}
check();

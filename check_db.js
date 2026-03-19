const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient('https://wwlsneyxxdhwsegdljuf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3bHNuZXl4eGRod3NlZ2RsanVmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzIyOTQwOCwiZXhwIjoyMDg4ODA1NDA4fQ.hj1gJ6_EIszk7env4KOwAm14Nb-eV6KAoR5SrZKBMh0');

async function test() {
  const users = await supabase.from('users').select('id, email, role, coins_balance').limit(1);
  const profiles = await supabase.from('profiles').select('*').limit(1);
  const quizzes = await supabase.from('quizzes').select('id, difficulty, topic, student_level, meta').limit(1);
  const quizzesAll = await supabase.from('quizzes').select('*').limit(1);
  
  fs.writeFileSync('output.json', JSON.stringify({ 
    users: { data: users.data, error: users.error },
    profiles: { data: profiles.data, error: profiles.error },
    quizzes: { data: quizzes.data, error: quizzes.error },
    quizzesAll: { data: quizzesAll.data, error: quizzesAll.error }
  }, null, 2));
}
test().catch(console.error);

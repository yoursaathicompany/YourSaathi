const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient('https://wwlsneyxxdhwsegdljuf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3bHNuZXl4eGRod3NlZ2RsanVmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzIyOTQwOCwiZXhwIjoyMDg4ODA1NDA4fQ.hj1gJ6_EIszk7env4KOwAm14Nb-eV6KAoR5SrZKBMh0');

async function test() {
  const questionsList = await supabase.from('questions').select('*').limit(1);
  const attempt_answers = await supabase.from('attempt_answers').select('*').limit(1);
  const attempts = await supabase.from('attempts').select('*').limit(1);

  fs.writeFileSync('output_questions.json', JSON.stringify({ 
    questionsList: { cols: questionsList.data ? Object.keys(questionsList.data[0] || {}) : [], data: questionsList.data, error: questionsList.error },
    attempt_answers: { cols: attempt_answers.data ? Object.keys(attempt_answers.data[0] || {}) : [], data: attempt_answers.data, error: attempt_answers.error },
    attempts: { cols: attempts.data ? Object.keys(attempts.data[0] || {}) : [], data: attempts.data, error: attempts.error },
  }, null, 2));
}
test().catch(console.error);

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://wwlsneyxxdhwsegdljuf.supabase.co', 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.from('attempts').select('score').limit(1);
  console.log("Check score:", error ? error.message : "Success");
  
  const { data: d2, error: e2 } = await supabase.from('attempts').select('score_percentage').limit(1);
  console.log("Check score_percentage:", e2 ? e2.message : "Success");

  const { data: d3, error: e3 } = await supabase.from('attempts').select('time_taken_seconds').limit(1);
  console.log("Check time_taken_seconds:", e3 ? e3.message : "Success");
}
check();

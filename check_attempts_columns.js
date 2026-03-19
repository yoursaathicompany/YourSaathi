const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://wwlsneyxxdhwsegdljuf.supabase.co', 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.from('attempts').select('attempt_id').limit(1);
  console.log("Check attempt_id:", error ? error.message : "Success");
  
  const { data: d2, error: e2 } = await supabase.from('attempts').select('id, quiz_id, user_id, completed_at').limit(1);
  console.log("Check basic columns:", e2 ? e2.message : "Success");
}
check();

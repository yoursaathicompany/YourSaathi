const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://wwlsneyxxdhwsegdljuf.supabase.co', 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.from('profiles').select('id, created_at').limit(5);
  console.log("Check profiles:", error ? error.message : "Success", data);
  
  const { data: d2, error: e2 } = await supabase.from('attempts').select('id, user_id').limit(5);
  console.log("Check attempts:", e2 ? e2.message : "Success", d2);
}
check();

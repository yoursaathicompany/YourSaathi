const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://wwlsneyxxdhwsegdljuf.supabase.co', 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.from('users').select('created_at').limit(1);
  console.log("Check users:", error ? error.message : "Success");
  
  const { data: d2, error: e2 } = await supabase.from('profiles').select('created_at').limit(1);
  console.log("Check profiles:", e2 ? e2.message : "Success", d2);
}
check();

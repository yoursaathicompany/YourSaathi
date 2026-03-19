const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://wwlsneyxxdhwsegdljuf.supabase.co', 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.from('attempts').select('correct_count').limit(1);
  console.log("Check correct_count:", error ? error.message : "Success");
  
  const { data: d2, error: e2 } = await supabase.from('attempts').select('coins_awarded').limit(1);
  console.log("Check coins_awarded:", e2 ? e2.message : "Success");
}
check();

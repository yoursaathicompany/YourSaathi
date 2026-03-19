const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://wwlsneyxxdhwsegdljuf.supabase.co', 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data: d1, error: e1 } = await supabase.from('users').select('id').limit(1);
  console.log("Check users:", e1 ? e1.message : "Success");
  
  const { data: d2, error: e2 } = await supabase.from('coin_transactions').select('id').limit(1);
  console.log("Check coin_transactions:", e2 ? e2.message : "Success");
}
check();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://wwlsneyxxdhwsegdljuf.supabase.co', 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.from('attempts').select('*').limit(1);
  if (data && data.length > 0) {
    console.log(Object.keys(data[0]));
  } else {
    // Let's insert a dummy row to see what columns exist if it fails
    const { error: insertErr } = await supabase.from('attempts').insert({ quiz_id: "00000000-0000-0000-0000-000000000000", user_id: "00000000-0000-0000-0000-000000000000" });
    console.log("Insert Error details:", insertErr);
  }
}
check();

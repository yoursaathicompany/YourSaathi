const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const url = process.env.SUPABASE_URL;
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, secret, { db: { schema: 'next_auth' } });

async function test() {
  const { data, error } = await supabase.from('accounts').select('*').limit(1);
  console.log("Error:", error);
  console.log("Data:", data);
}
test();

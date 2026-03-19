import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    db: { schema: 'next_auth' }
  }
);

async function test() {
  console.log('Testing Supabase Connection to next_auth.accounts...');
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('Supabase Query Error:', JSON.stringify(error, null, 2));
  } else {
    console.log('Success! Data:', data);
  }
}

test();

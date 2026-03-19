const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://wwlsneyxxdhwsegdljuf.supabase.co', 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.from('attempts').select('*').limit(1);
  console.log("Attempts Table Check:");
  if (error) {
    console.error(error);
  } else {
    // get keys of the first row if exists, else an empty object
    const keys = data.length > 0 ? Object.keys(data[0]) : "No rows, but query succeeded.";
    console.log("Columns:", keys);
    console.log("Data:", data);
  }
}

check();

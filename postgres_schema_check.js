const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient('https://wwlsneyxxdhwsegdljuf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3bHNuZXl4eGRod3NlZ2RsanVmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzIyOTQwOCwiZXhwIjoyMDg4ODA1NDA4fQ.hj1gJ6_EIszk7env4KOwAm14Nb-eV6KAoR5SrZKBMh0');

async function check() {
  const qCols = await supabase.rpc('get_table_info', {table_name: 'questions'}).catch(() => null);
  fs.writeFileSync('output_checks.json', JSON.stringify({ qCols }));
}
check();

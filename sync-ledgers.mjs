import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  dotenv.config({ path: '.env' });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncLedgers() {
  console.log('Fetching users and their wallet balances...');
  
  const { data: users, error: uErr } = await supabase.from('users').select('id, coins_balance');
  const { data: wallets, error: wErr } = await supabase.from('user_wallet_view').select('user_id, available_balance');

  if (uErr || wErr) {
    console.error('Error fetching data:', uErr || wErr);
    process.exit(1);
  }

  const walletMap = new Map(wallets.map(w => [w.user_id, w.available_balance]));
  let fixedCount = 0;

  for (const user of users) {
    const ledgerBalance = walletMap.get(user.id) || 0;
    const dbBalance = user.coins_balance || 0;
    
    if (dbBalance > ledgerBalance) {
      const diff = dbBalance - ledgerBalance;
      console.log(`Fixing User ${user.id}: db=${dbBalance}, ledger=${ledgerBalance}. Adding ${diff}.`);
      
      const { error } = await supabase.from('coin_ledger').insert({
        user_id: user.id,
        type: 'adjusted',
        amount: diff,
        reference_type: 'system_sync',
        note: `Syncing ${diff} coins earned during bug`
      });
      
      if (error) {
        console.error('Failed to insert ledger for user', user.id, error);
      } else {
        fixedCount++;
      }
    }
  }

  console.log(`\n✅ Finished syncing. Fixed ${fixedCount} users.`);
}

syncLedgers();

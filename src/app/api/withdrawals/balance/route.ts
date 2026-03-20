import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

// GET /api/withdrawals/balance — returns the authenticated user's wallet balance
export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get ledger-based wallet view
  const { data: wallet, error } = await supabaseAdmin
    .from('user_wallet_view')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = row not found (user has no ledger entries yet)
    return NextResponse.json({ error: 'Failed to load wallet' }, { status: 500 });
  }

  // Fallback: use coins_balance from users table if no ledger entries
  if (!wallet) {
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('coins_balance')
      .eq('id', session.user.id)
      .single();

    return NextResponse.json({
      user_id: session.user.id,
      total_earned: user?.coins_balance ?? 0,
      total_locked: 0,
      total_redeemed: 0,
      total_refunded: 0,
      available_balance: user?.coins_balance ?? 0,
      last_transaction_at: null,
    });
  }

  return NextResponse.json(wallet);
}

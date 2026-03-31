import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { CoinTransactionPage } from '@/types/user';

// GET /api/user/transactions?page=1&per_page=20
// Reads from coin_ledger which is the single source of truth for all coin events
// (quiz earnings, signup bonus, withdrawals, admin adjustments, etc.)
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const perPage = Math.min(50, parseInt(url.searchParams.get('per_page') || '20', 10));
  const offset = (page - 1) * perPage;

  // Read all coin events from coin_ledger — this includes signup_bonus, quiz earnings, etc.
  const { data: ledgerEntries, error, count } = await supabaseAdmin
    .from('coin_ledger')
    .select('id, type, amount, reference_type, note, created_at', { count: 'exact' })
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1);

  if (error) {
    console.error('Failed to fetch transactions from coin_ledger:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }

  // Map ledger entries to the CoinTransaction shape expected by the UI
  const mappedTransactions = (ledgerEntries ?? []).map((entry: any) => {
    // Determine amount sign: 'locked' and 'redeemed' subtract from balance
    const isDebit = entry.type === 'locked' || entry.type === 'redeemed';
    const coinsAwarded = isDebit ? -Math.abs(entry.amount) : Math.abs(entry.amount);

    // Map reference_type → UI reason label key
    const reasonMap: Record<string, string> = {
      signup_bonus: 'signup_bonus',
      quiz_attempt: 'quiz_correct_answer',
      withdrawal: entry.type === 'locked' ? 'withdrawal_locked'
        : entry.type === 'refunded' ? 'withdrawal_refunded'
        : 'withdrawal_redeemed',
    };
    const reason = reasonMap[entry.reference_type ?? ''] ?? entry.type ?? 'admin_adjustment';

    return {
      id: entry.id,
      user_id: session.user.id,
      attempt_id: null,
      quiz_id: null,
      coins_awarded: coinsAwarded,
      previous_balance: 0,
      new_balance: 0,
      reason,
      note: entry.note ?? '',
      timestamp: entry.created_at,
      quiz: null,
    };
  });

  const result: CoinTransactionPage = {
    transactions: mappedTransactions as any,
    total: count ?? 0,
    page,
    per_page: perPage,
    has_more: (count ?? 0) > offset + perPage,
  };

  return NextResponse.json(result);
}

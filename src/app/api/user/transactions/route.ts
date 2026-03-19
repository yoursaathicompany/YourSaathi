import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { CoinTransactionPage } from '@/types/user';

// GET /api/user/transactions?page=1&per_page=20
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const perPage = Math.min(50, parseInt(url.searchParams.get('per_page') || '20', 10));
  const offset = (page - 1) * perPage;

  const { data: attempts, error, count } = await supabaseAdmin
    .from('attempts')
    .select(`
      id, quiz_id, completed_at, coins_awarded,
      quiz:quiz_id (topic, title)
    `, { count: 'exact' })
    .eq('user_id', session.user.id)
    .order('completed_at', { ascending: false })
    .range(offset, offset + perPage - 1);

  if (error) {
    console.error('Failed to fetch transactions (from attempts proxy):', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }

  // Map attempts to look like coin_transactions for the UI
  const mappedTransactions = (attempts ?? []).map((a: any) => ({
    id: a.id,
    user_id: session.user.id,
    attempt_id: a.id,
    quiz_id: a.quiz_id,
    coins_awarded: a.coins_awarded || 0,
    previous_balance: 0,
    new_balance: 0,
    reason: 'quiz_correct_answer',
    note: `Completed Quiz`,
    timestamp: a.completed_at,
    quiz: a.quiz,
  }));

  const result: CoinTransactionPage = {
    transactions: mappedTransactions as any,
    total: count ?? 0,
    page,
    per_page: perPage,
    has_more: (count ?? 0) > offset + perPage,
  };

  return NextResponse.json(result);
}

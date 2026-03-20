import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

// GET /api/admin/withdrawals — admin: list all withdrawals with user info
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify admin role
  const { data: caller } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (caller?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20', 10));
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('withdrawals')
    .select(`
      *,
      withdrawal_settings(label, coins_required, rupee_amount),
      user:users!withdrawals_user_id_fkey(display_name, email, coins_balance)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && ['pending', 'approved', 'rejected', 'paid'].includes(status)) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('[GET /api/admin/withdrawals] error:', error);
    return NextResponse.json({ error: 'Failed to load withdrawals' }, { status: 500 });
  }

  return NextResponse.json({
    withdrawals: data ?? [],
    total: count ?? 0,
    page,
    limit,
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: caller } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (caller?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [usersRes, quizzesRes, aiLogsRes, attemptsRes, pendingWdRes, coinsRes] =
      await Promise.all([
        supabaseAdmin.from('users').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('quizzes').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('ai_generation_logs').select('id', { count: 'exact', head: true }),
        supabaseAdmin.from('attempts').select('score_percentage'),
        supabaseAdmin
          .from('withdrawals')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabaseAdmin.from('users').select('coins_balance'),
      ]);

    const scores = (attemptsRes.data ?? []).map((a) => Number(a.score_percentage));
    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) + '%'
        : '0%';

    const totalCoins = (coinsRes.data ?? []).reduce(
      (s, u) => s + (Number(u.coins_balance) || 0),
      0
    );

    return NextResponse.json({
      total_users: usersRes.count ?? 0,
      total_quizzes: quizzesRes.count ?? 0,
      total_ai_generations: aiLogsRes.count ?? 0,
      avg_score: avgScore,
      pending_withdrawals: pendingWdRes.count ?? 0,
      total_coins_in_circulation: totalCoins,
    });
  } catch (err) {
    console.error('[GET /api/admin/stats]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

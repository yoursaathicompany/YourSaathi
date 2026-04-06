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

    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, email, display_name, avatar_url, role, coins_balance, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GET /api/admin/users/all]', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // Fetch attempts for all users at once
    const userIds = users.map(u => u.id);
    const { data: allAttempts } = await supabaseAdmin
       .from('attempts')
       .select('id, user_id, score_percentage, created_at, quizzes(title, topic)')
       .in('user_id', userIds)
       .order('created_at', { ascending: false });
       
    // Merge attempts into users array
    const enriched = users.map(u => ({
      ...u,
      attempts: allAttempts?.filter(a => a.user_id === u.id) || []
    }));

    return NextResponse.json({ users: enriched });
  } catch (err) {
    console.error('[GET /api/admin/users/all]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

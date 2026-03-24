import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
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

    const email = req.nextUrl.searchParams.get('email')?.trim();
    if (!email) {
      return NextResponse.json({ error: 'email query param required' }, { status: 400 });
    }

    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, email, display_name, avatar_url, role, coins_balance, created_at')
      .ilike('email', `%${email}%`)
      .limit(5);

    if (error) {
      console.error('[GET /api/admin/users/search]', error);
      return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }

    // Enrich with attempt count for each user
    const enriched = await Promise.all(
      (users ?? []).map(async (u) => {
        const { count } = await supabaseAdmin
          .from('attempts')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', u.id);
        return { ...u, attempt_count: count ?? 0 };
      })
    );

    return NextResponse.json({ users: enriched });
  } catch (err) {
    console.error('[GET /api/admin/users/search]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

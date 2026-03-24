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

    const { data, error } = await supabaseAdmin
      .from('ai_generation_logs')
      .select('id, status, topic, difficulty, error_message, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(15);

    if (error) {
      console.error('[GET /api/admin/logs]', error);
      return NextResponse.json({ error: 'Failed to load logs' }, { status: 500 });
    }

    // Enrich with user emails
    const userIds = [...new Set((data ?? []).map((l) => l.user_id).filter(Boolean))];
    let emailMap: Record<string, string> = {};

    if (userIds.length > 0) {
      const { data: usersData } = await supabaseAdmin
        .from('users')
        .select('id, email')
        .in('id', userIds);
      emailMap = Object.fromEntries((usersData ?? []).map((u) => [u.id, u.email]));
    }

    const logs = (data ?? []).map((l) => ({
      id: l.id,
      status: l.status,
      topic: l.topic,
      difficulty: l.difficulty,
      error_message: l.error_message,
      created_at: l.created_at,
      user_email: l.user_id ? (emailMap[l.user_id] ?? 'unknown') : 'unknown',
    }));

    return NextResponse.json({ logs });
  } catch (err) {
    console.error('[GET /api/admin/logs]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

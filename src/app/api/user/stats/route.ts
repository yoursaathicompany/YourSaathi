import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Get Member Since from users table
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('created_at')
      .eq('id', session.user.id)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Failed to fetch user stats:', userError);
      return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 });
    }

    // Fallback created_at if users row not found (e.g. out of sync schema)
    const createdAt = user?.created_at || new Date().toISOString(); 

    // 2. Get Quizzes Taken count from attempts table
    const { count: attemptsCount, error: attemptsError } = await supabaseAdmin
      .from('attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id);

    if (attemptsError) {
      console.error('Failed to fetch attempts count:', attemptsError);
    }

    const result = {
      memberSince: createdAt,
      quizzesTaken: attemptsCount || 0
    };
    console.log("Stats API Returning:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

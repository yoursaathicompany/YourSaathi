import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Fetch attempts for the user, joined with quiz details
    // We strictly filter by user_id to ensure absolute security and isolation.
    const { data: attempts, error, count } = await supabaseAdmin
      .from('attempts')
      .select(`
        id,
        score_percentage,
        correct_count,
        total_questions,
        created_at,
        quizzes (
          id,
          title,
          topic,
          difficulty
        )
      `, { count: 'exact' })
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[Quiz History API] Error fetching history:', error);
      return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }

    return NextResponse.json({
      attempts,
      total: count ?? 0,
      limit,
      offset,
    });
  } catch (err) {
    console.error('[Quiz History API] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

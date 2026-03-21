import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ attemptId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { attemptId } = await props.params;
    if (!attemptId) {
      return NextResponse.json({ error: 'Missing attempt ID' }, { status: 400 });
    }

    // 1. Verify ownership and fetch attempt summary safely
    const { data: attempt, error: attemptErr } = await supabaseAdmin
      .from('attempts')
      .select(`
        id,
        user_id,
        score_percentage,
        correct_count,
        total_questions,
        created_at,
        time_taken_seconds,
        quizzes (
          title,
          topic,
          difficulty
        )
      `)
      .eq('id', attemptId)
      .eq('user_id', session.user.id) // SUPER IMPORTANT: Ensures users can only view their own history
      .single();

    if (attemptErr || !attempt) {
      console.error('[History Detail API] Attempt not found or unauthorized:', attemptErr);
      return NextResponse.json({ error: 'Attempt not found or unauthorized' }, { status: 404 });
    }

    // 2. Fetch the detailed answers and the actual questions
    const { data: answers, error: answersErr } = await supabaseAdmin
      .from('attempt_answers')
      .select(`
        id,
        user_answer,
        is_correct,
        time_taken_seconds,
        questions (
          id,
          type,
          content,
          options,
          correct_answer,
          explanation,
          order_index
        )
      `)
      .eq('attempt_id', attemptId)
      .order('created_at', { ascending: true });

    if (answersErr) {
      console.error('[History Detail API] Error fetching answers:', answersErr);
      return NextResponse.json({ error: 'Failed to load details' }, { status: 500 });
    }

    // Return the safe compound object
    return NextResponse.json({
      attempt,
      answers: answers || [],
    });

  } catch (err) {
    console.error('[History Detail API] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

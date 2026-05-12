import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { attemptId } = await params;

  const { data, error } = await supabaseAdmin
    .from('mock_test_attempts')
    .select('id, session_id, answers, score_percentage, correct_count, wrong_count, unattempted_count, time_taken_seconds, submitted_at')
    .eq('id', attemptId)
    .eq('user_id', session.user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
  }

  const scorePercent = Number(data.score_percentage);
  const getResultMessage = (score: number) => {
    if (score >= 90) return '🏆 Outstanding! You are exam-ready!';
    if (score >= 75) return '🎯 Excellent work! Keep pushing forward!';
    if (score >= 60) return '👍 Good effort! Practice more to sharpen your skills.';
    if (score >= 40) return '📚 Keep studying! You are making progress.';
    return '💪 Don\'t give up! Consistent practice is the key to success.';
  };

  return NextResponse.json({
    attempt_id: data.id,
    session_id: data.session_id,
    answers: data.answers,
    score_percentage: scorePercent,
    correct_count: data.correct_count,
    wrong_count: data.wrong_count,
    unattempted_count: data.unattempted_count,
    time_taken_seconds: data.time_taken_seconds,
    submitted_at: data.submitted_at,
    result_message: getResultMessage(scorePercent),
    total_questions: (data.correct_count ?? 0) + (data.wrong_count ?? 0) + (data.unattempted_count ?? 0),
  });
}

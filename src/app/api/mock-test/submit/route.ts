import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * POST /api/mock-test/submit
 * Submits user answers, calculates score, saves attempt.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { session_id, answers, time_taken_seconds } = body;

    if (!session_id || !answers) {
      return NextResponse.json({ error: 'Missing session_id or answers' }, { status: 400 });
    }

    // Fetch the session
    const { data: testSession, error: sessionErr } = await supabaseAdmin
      .from('mock_test_sessions')
      .select('id, user_id, questions, num_questions, status')
      .eq('id', session_id)
      .eq('user_id', userId)
      .single();

    if (sessionErr || !testSession) {
      return NextResponse.json({ error: 'Test session not found' }, { status: 404 });
    }

    if (testSession.status === 'completed') {
      // Already submitted — return the existing attempt
      const { data: existing } = await supabaseAdmin
        .from('mock_test_attempts')
        .select('*')
        .eq('session_id', session_id)
        .eq('user_id', userId)
        .single();
      if (existing) {
        return NextResponse.json({
          attempt_id: existing.id,
          score_percentage: existing.score_percentage,
          correct_count: existing.correct_count,
          wrong_count: existing.wrong_count,
          unattempted_count: existing.unattempted_count,
          total_questions: testSession.num_questions,
          result_message: getResultMessage(existing.score_percentage),
          already_submitted: true,
        });
      }
    }

    // ── Score Calculation ────────────────────────────────────────────────
    const questions: Array<{ question_number: number; correct_option: string }> = testSession.questions;
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    for (const q of questions) {
      const userAnswer = answers[String(q.question_number)];
      if (!userAnswer) {
        unattempted++;
      } else if (userAnswer === q.correct_option) {
        correct++;
      } else {
        wrong++;
      }
    }

    const total = questions.length;
    const scorePercent = total > 0 ? parseFloat(((correct / total) * 100).toFixed(2)) : 0;

    // ── Save Attempt ─────────────────────────────────────────────────────
    const { data: attempt, error: attemptErr } = await supabaseAdmin
      .from('mock_test_attempts')
      .insert({
        session_id,
        user_id: userId,
        answers,
        score_percentage: scorePercent,
        correct_count: correct,
        wrong_count: wrong,
        unattempted_count: unattempted,
        time_taken_seconds: time_taken_seconds ?? null,
      })
      .select('id')
      .single();

    if (attemptErr || !attempt) {
      console.error('[mock-test/submit] Failed to save attempt:', attemptErr);
      return NextResponse.json({ error: 'Failed to save attempt' }, { status: 500 });
    }

    // Mark session as completed
    await supabaseAdmin
      .from('mock_test_sessions')
      .update({ status: 'completed' })
      .eq('id', session_id);

    // Current credits remaining
    const { data: purchases } = await supabaseAdmin
      .from('mock_test_purchases')
      .select('credits_granted')
      .eq('user_id', userId)
      .eq('status', 'paid');

    const totalEarned = (purchases ?? []).reduce(
      (sum: number, p: { credits_granted: number }) => sum + p.credits_granted,
      0
    );
    const { count: totalUsed } = await supabaseAdmin
      .from('mock_test_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);
    const creditsRemaining = Math.max(0, totalEarned - (totalUsed ?? 0));

    return NextResponse.json({
      attempt_id: attempt.id,
      score_percentage: scorePercent,
      correct_count: correct,
      wrong_count: wrong,
      unattempted_count: unattempted,
      total_questions: total,
      result_message: getResultMessage(scorePercent),
      credits_remaining: creditsRemaining,
    });

  } catch (err) {
    console.error('[mock-test/submit] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getResultMessage(score: number): string {
  if (score >= 90) return '🏆 Outstanding! You are exam-ready!';
  if (score >= 75) return '🎯 Excellent work! Keep pushing forward!';
  if (score >= 60) return '👍 Good effort! Practice more to sharpen your skills.';
  if (score >= 40) return '📚 Keep studying! You are making progress.';
  return '💪 Don\'t give up! Consistent practice is the key to success.';
}

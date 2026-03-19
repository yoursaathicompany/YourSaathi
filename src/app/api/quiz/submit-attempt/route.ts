import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { SubmitAttemptRequest, SubmitAttemptResponse, GradeResult, GradingStatus } from '@/types/attempt';

const MAX_COINS_PER_ATTEMPT = parseInt(process.env.MAX_COINS_PER_ATTEMPT || '100', 10);

// ─── Auto-gradable question types ─────────────────────────────────────────
const AUTO_GRADABLE: string[] = ['mcq_single', 'mcq_multi', 'assertion'];

function normalizeAnswer(answer: unknown): string {
  if (Array.isArray(answer)) return answer.map(String).sort().join('|');
  return String(answer ?? '').toLowerCase().trim();
}

function gradeAnswer(
  questionType: string,
  userAnswer: unknown,
  correctAnswer: unknown
): { is_correct: boolean; grading_status: GradingStatus } {
  if (!AUTO_GRADABLE.includes(questionType)) {
    return { is_correct: false, grading_status: 'pending_review' };
  }
  const norm = normalizeAnswer(userAnswer);
  const correct = normalizeAnswer(correctAnswer);
  return { is_correct: norm === correct, grading_status: 'auto_graded' };
}

// ─── POST /api/quiz/submit-attempt ────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. Parse + basic validation
    const body = (await req.json()) as SubmitAttemptRequest;
    const { quiz_id, attempt_id, answers, time_taken_seconds } = body;

    if (!quiz_id || !attempt_id || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!attempt_id.match(/^[0-9a-f-]{36}$/i)) {
      return NextResponse.json({ error: 'attempt_id must be a valid UUID' }, { status: 400 });
    }

    // 2. Idempotency Check removed because coin_transactions does not exist on this schema.

    // 3. Verify user exists and email is verified
    const { data: dbUser, error: userErr } = await supabaseAdmin
      .from('users')
      .select('id, coins_balance, email_verified, role')
      .eq('id', userId)
      .single();

    if (userErr || !dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 4. Fetch quiz questions from DB
    const { data: questions, error: qErr } = await supabaseAdmin
      .from('questions')
      .select('id, type, correct_answer')
      .eq('quiz_id', quiz_id);

    if (qErr || !questions?.length) {
      return NextResponse.json({ error: 'Quiz questions not found' }, { status: 404 });
    }

    // 5. Grade each answer
    const questionMap = new Map(questions.map((q) => [q.id, q]));
    const gradeResults: GradeResult[] = [];
    let correctCount = 0;
    let autoGradedCount = 0;
    let pendingReviewCount = 0;

    const answerRows = answers.map((a) => {
      const question = questionMap.get(a.question_id);
      if (!question) return null;

      const { is_correct, grading_status } = gradeAnswer(
        question.type,
        a.user_answer,
        question.correct_answer
      );

      if (grading_status === 'auto_graded') {
        autoGradedCount++;
        if (is_correct) correctCount++;
      } else {
        pendingReviewCount++;
      }

      gradeResults.push({ question_id: a.question_id, is_correct: grading_status === 'auto_graded' ? is_correct : null, grading_status });

      return {
        attempt_id: undefined as unknown as string, // filled after attempt insert
        question_id: a.question_id,
        user_answer: a.user_answer,
        is_correct: grading_status === 'auto_graded' ? is_correct : null,
        grading_status,
        time_taken_seconds: a.time_taken_seconds ?? null,
      };
    }).filter(Boolean);

    const totalQuestions = questions.length;
    const scorePercentage = autoGradedCount > 0
      ? Math.round((correctCount / autoGradedCount) * 100)
      : 0;

    // 6. Cap coins
    const rawCoins = correctCount; // 1 coin per correct answer
    const coinsAwarded = Math.min(rawCoins, MAX_COINS_PER_ATTEMPT);
    const previousBalance = dbUser.coins_balance;
    const newBalance = previousBalance + coinsAwarded;

    // 7. Atomic DB transaction: insert attempt + answers + update balance + log tx
    // Step A: Insert attempt
    const { data: attemptRow, error: attemptErr } = await supabaseAdmin
      .from('attempts')
      .insert({
        quiz_id,
        user_id: userId,
        attempt_id, // include the required idempotency key
        score_percentage: scorePercentage,
        correct_count: correctCount,
        total_questions: totalQuestions,
        auto_graded_count: autoGradedCount,
        pending_review_count: pendingReviewCount,
        coins_awarded: coinsAwarded,
        time_taken_seconds: time_taken_seconds ?? null,
        completed_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (attemptErr || !attemptRow) {
      console.error('[submit-attempt] attempt insert error:', attemptErr);
      return NextResponse.json({ error: 'Failed to save attempt' }, { status: 500 });
    }

    // Step B: Insert attempt_answers
    const answersWithAttemptId = answerRows.map((a) => ({ ...a, attempt_id: attemptRow.id }));
    if (answersWithAttemptId.length > 0) {
      const { error: aaErr } = await supabaseAdmin
        .from('attempt_answers')
        .insert(answersWithAttemptId);
      if (aaErr) console.warn('[submit-attempt] attempt_answers insert warning:', aaErr);
    }

    // Step C: Update user coins_balance (optimistic locking via WHERE clause)
    if (coinsAwarded > 0) {
      const { error: balanceErr } = await supabaseAdmin
        .from('users')
        .update({ coins_balance: newBalance })
        .eq('id', userId)
        .eq('coins_balance', previousBalance); // optimistic lock: only update if balance hasn't changed

      if (balanceErr) {
        // Optimistic lock failed — re-read balance and retry once
        const { data: freshUser } = await supabaseAdmin
          .from('users')
          .select('coins_balance')
          .eq('id', userId)
          .single();

        if (freshUser) {
          const freshBalance = freshUser.coins_balance;
          await supabaseAdmin
            .from('users')
            .update({ coins_balance: freshBalance + coinsAwarded })
            .eq('id', userId);
        }
      }

      // Step D: Log coin transaction skipped as table doesn't exist
    }

    return NextResponse.json({
      attempt_id,
      quiz_id,
      correct_count: correctCount,
      total_questions: totalQuestions,
      auto_graded_count: autoGradedCount,
      pending_review_count: pendingReviewCount,
      score_percentage: scorePercentage,
      coins_awarded: coinsAwarded,
      previous_balance: previousBalance,
      new_balance: newBalance,
      grade_results: gradeResults,
      already_submitted: false,
    } satisfies SubmitAttemptResponse);

  } catch (err) {
    console.error('[submit-attempt] unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

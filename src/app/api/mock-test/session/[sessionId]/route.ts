import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sessionId } = await params;

  const { data, error } = await supabaseAdmin
    .from('mock_test_sessions')
    .select('id, exam_name, subject, topic, difficulty, num_questions, time_limit_min, language, questions, status, created_at')
    .eq('id', sessionId)
    .eq('user_id', session.user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json({
    session_id: data.id,
    exam_name: data.exam_name,
    test_title: `${data.exam_name} — ${data.subject} Mock Test`,
    subject: data.subject,
    topic: data.topic,
    difficulty: data.difficulty,
    total_questions: data.num_questions,
    time_limit_minutes: data.time_limit_min,
    language: data.language,
    questions: data.questions,
    status: data.status,
    created_at: data.created_at,
  });
}

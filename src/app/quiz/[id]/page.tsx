import { supabaseAdmin } from '@/lib/supabase/server';
import QuizPlayer from '@/components/QuizPlayer';
import { notFound } from 'next/navigation';
import type { GeneratedQuestion } from '@/types/quiz';

interface QuizPlayPageProps {
  params: { id: string };
}

export default async function QuizPlayPage({ params }: QuizPlayPageProps) {
  const { id } = await params;

  // Fetch quiz and questions from DB
  const { data: quiz, error: quizError } = await supabaseAdmin
    .from('quizzes')
    .select('id, topic, title')
    .eq('id', id)
    .single();

  if (quizError || !quiz) {
    return notFound();
  }

  const { data: questions, error: qError } = await supabaseAdmin
    .from('questions')
    .select('*')
    .eq('quiz_id', id)
    .order('order_index', { ascending: true });

  if (qError || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center gap-4">
        <p className="text-red-400 text-xl font-bold">Failed to load quiz questions.</p>
        <p className="text-gray-400 max-w-md">
          The questions may have failed to save due to an ongoing database issue, or they are still generating in the background. Please check the logs and try generating again.
        </p>
      </div>
    );
  }

  // Map DB questions to Typed questions
  const mappedQuestions: GeneratedQuestion[] = questions.map(q => ({
    id: q.id,
    type: q.type,
    question: q.content,
    options: q.options,
    correct_answer: q.correct_answer,
    explanation: q.explanation || '',
    hints: q.hints || [],
    sources: q.sources || [],
    tags: q.tags || [],
    metadata: q.metadata
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] transition-colors duration-300">
       <QuizPlayer 
          quizId={quiz.id} 
          questions={mappedQuestions} 
          topic={quiz.topic} 
       />
    </div>
  );
}

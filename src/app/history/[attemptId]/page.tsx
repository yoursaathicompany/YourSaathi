'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle2, XCircle, Info, Target, Clock, Brain } from 'lucide-react';
import Link from 'next/link';

interface QuestionDetail {
  id: string;
  type: string;
  content: string;
  options: string[] | null;
  correct_answer: any;
  explanation: string | null;
  order_index: number;
}

interface AnswerDetail {
  id: string;
  user_answer: any;
  is_correct: boolean;
  time_taken_seconds: number | null;
  questions: QuestionDetail;
}

interface AttemptSummary {
  id: string;
  score_percentage: number;
  correct_count: number;
  total_questions: number;
  created_at: string;
  time_taken_seconds: number | null;
  quizzes: {
    title: string;
    topic: string;
    difficulty: string;
  };
}

export default function HistoryDetailPage({ params }: { params: { attemptId: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [attempt, setAttempt] = useState<AttemptSummary | null>(null);
  const [answers, setAnswers] = useState<AnswerDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }

    if (status === 'authenticated') {
      setLoading(true);
      fetch(`/api/user/history/${params.attemptId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch details');
          return res.json();
        })
        .then((data) => {
          setAttempt(data.attempt);
          // sort by order index or fallback
          const sorted = (data.answers || []).sort((a: any, b: any) => 
            (a.questions?.order_index || 0) - (b.questions?.order_index || 0)
          );
          setAnswers(sorted);
        })
        .catch((err) => {
          console.error(err);
          setError('Could not load quiz details. Please try again later.');
        })
        .finally(() => setLoading(false));
    }
  }, [status, router, params.attemptId]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto flex flex-col items-center justify-center">
         <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-center mb-4">
          {error || 'Attempt not found'}
        </div>
        <Link href="/history" className="text-purple-400 hover:text-purple-300 underline underline-offset-4">
          Return to History
        </Link>
      </div>
    );
  }

  // Formatting helpers
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };
  const dateStr = new Date(attempt.created_at).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
  });

  return (
    <div className="min-h-screen pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pt-8">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/history" 
          className="p-2 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Brain className="w-5 h-5 text-white" />
            </div>
            Quiz Review
          </h1>
          <p className="text-gray-500 mt-1 text-sm">{dateStr}</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 mb-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-2">{attempt.quizzes?.title}</h2>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="px-3 py-1 rounded-lg bg-white/5 text-gray-300 text-sm capitalize">
            {attempt.quizzes?.topic}
          </span>
          <span className={`px-3 py-1 rounded-lg text-sm font-medium capitalize
             ${attempt.quizzes?.difficulty === 'hard' ? 'bg-red-500/10 text-red-400' : 
               attempt.quizzes?.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400' : 
               'bg-green-500/10 text-green-400'}`}>
            {attempt.quizzes?.difficulty}
          </span>
          {attempt.time_taken_seconds && (
            <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {formatTime(attempt.time_taken_seconds)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 flex flex-col items-center justify-center">
            <div className="text-sm text-gray-400 mb-1 flex items-center gap-1.5"><Target className="w-4 h-4"/> Score</div>
            <span className="text-2xl font-black text-white">{attempt.score_percentage}%</span>
          </div>
          <div className="bg-green-500/5 rounded-2xl p-4 flex flex-col items-center justify-center border border-green-500/10">
            <div className="text-sm text-green-400/80 mb-1 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Correct</div>
            <span className="text-2xl font-black text-green-400">{attempt.correct_count}</span>
          </div>
          <div className="bg-red-500/5 rounded-2xl p-4 flex flex-col items-center justify-center border border-red-500/10">
            <div className="text-sm text-red-400/80 mb-1 flex items-center gap-1.5"><XCircle className="w-4 h-4"/> Incorrect</div>
            <span className="text-2xl font-black text-red-400">{attempt.total_questions - attempt.correct_count}</span>
          </div>
        </div>
      </div>

      {/* Detailed Questions List */}
      <h3 className="text-xl font-bold text-white mb-6">Question Breakdown</h3>
      <div className="space-y-6">
        {answers.map((ans, idx) => {
          const q = ans.questions;
          const isMcq = q.type === 'mcq_single' || q.type === 'mcq_multi';
          const options = q.options || [];

          return (
            <motion.div 
              key={ans.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white/[0.02] border rounded-3xl p-6 ${
                ans.is_correct ? 'border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.05)]' : 'border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]'
              }`}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${ans.is_correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                `}>
                  {idx + 1}
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="text-lg font-medium text-gray-200 leading-relaxed">
                    {q.content}
                  </h4>
                </div>
                <div className="shrink-0">
                  {ans.is_correct ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                </div>
              </div>

              {/* Answers Display */}
              <div className="pl-12 space-y-3 mb-6">
                {isMcq ? (
                  options.map((opt, oIdx) => {
                    const isUserChoice = Array.isArray(ans.user_answer) 
                      ? ans.user_answer.includes(opt) 
                      : ans.user_answer === opt;
                    
                    const isCorrectChoice = Array.isArray(q.correct_answer)
                      ? q.correct_answer.includes(opt)
                      : q.correct_answer === opt;

                    let bgClass = "bg-white/5 border-white/5 text-gray-400";
                    let accentClass = "";

                    if (isCorrectChoice) {
                      bgClass = "bg-green-500/10 border-green-500/30 text-green-400";
                      accentClass = "ring-1 ring-green-500/50";
                    } else if (isUserChoice && !isCorrectChoice) {
                      bgClass = "bg-red-500/10 border-red-500/30 text-red-400";
                      accentClass = "ring-1 ring-red-500/50";
                    }

                    return (
                      <div key={oIdx} className={`px-4 py-3 rounded-xl border flex items-center justify-between transition-colors ${bgClass} ${accentClass}`}>
                        <span>{opt}</span>
                        {isUserChoice && !isCorrectChoice && <XCircle className="w-4 h-4 text-red-400/80" />}
                        {isCorrectChoice && <CheckCircle2 className="w-4 h-4 text-green-400/80" />}
                      </div>
                    );
                  })
                ) : (
                  // Non-MCQ display (short answer, code, etc.)
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Your Answer:</span>
                      <div className={`px-4 py-3 rounded-xl border ${ans.is_correct ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                        {ans.user_answer ? String(ans.user_answer) : <span className="italic opacity-50">No answer provided</span>}
                      </div>
                    </div>
                    {!ans.is_correct && (
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Correct Answer:</span>
                        <div className="px-4 py-3 rounded-xl border bg-green-500/10 border-green-500/30 text-green-400">
                          {String(q.correct_answer)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Explanation section if available */}
              {q.explanation && (
                <div className="pl-12">
                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 flex gap-3 text-blue-200/80 text-sm">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-blue-300 block mb-1">Explanation</strong>
                      <span className="leading-relaxed">{q.explanation}</span>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}

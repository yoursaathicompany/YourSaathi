'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, XCircle, MinusCircle, ChevronDown, ChevronUp, RotateCcw, Plus, Home, Loader2, Target } from 'lucide-react';
import type { MockTestQuestion } from '@/types/mock-test';

interface AttemptData {
  score_percentage: number;
  correct_count: number;
  wrong_count: number;
  unattempted_count: number;
  total_questions: number;
  result_message: string;
  answers: Record<string, string>;
}

interface SessionData {
  exam_name: string;
  subject: string;
  difficulty: string;
  questions: MockTestQuestion[];
}

function ResultContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as string;
  const attemptId = searchParams.get('attempt');

  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [session, setSession] = useState<SessionData | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionId || !attemptId) return;

    Promise.all([
      fetch(`/api/mock-test/session/${sessionId}`).then(r => r.json()),
      fetch(`/api/mock-test/attempt/${attemptId}`).then(r => r.json()),
      fetch('/api/mock-test/credits').then(r => r.json()),
    ]).then(([sess, att, cred]) => {
      setSession(sess);
      setAttempt(att);
      if (typeof cred.credits_remaining === 'number') setCredits(cred.credits_remaining);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [sessionId, attemptId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
    </div>
  );

  if (!attempt || !session) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-white text-lg">Result not found.</p>
      <button onClick={() => router.push('/mock-test')} className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold">Back to Tests</button>
    </div>
  );

  const score = attempt.score_percentage;
  const scoreColor = score >= 75 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';
  const scoreBg = score >= 75 ? 'from-green-600/20 to-emerald-600/10 border-green-500/30' : score >= 50 ? 'from-yellow-600/20 to-amber-600/10 border-yellow-500/30' : 'from-red-600/20 to-rose-600/10 border-red-500/30';

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12">

        {/* Score Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${scoreBg} p-8 mb-8 text-center`}>
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:20px_20px]" />
          <Trophy className={`w-14 h-14 mx-auto mb-4 ${scoreColor}`} />
          <h1 className="text-4xl font-extrabold text-white mb-1">{score.toFixed(1)}%</h1>
          <p className={`text-lg font-semibold ${scoreColor} mb-1`}>{attempt.result_message}</p>
          <p className="text-gray-400 text-sm">{session.exam_name} — {session.subject} — {session.difficulty}</p>

          {credits !== null && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-sm font-semibold">
              <Target className="w-4 h-4" /> {credits} tests remaining
            </div>
          )}
        </motion.div>

        {/* Stats Row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: CheckCircle, label: 'Correct', value: attempt.correct_count, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
            { icon: XCircle,     label: 'Wrong',   value: attempt.wrong_count,   color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/30' },
            { icon: MinusCircle, label: 'Skipped', value: attempt.unattempted_count, color: 'text-gray-400', bg: 'bg-white/5 border-white/10' },
          ].map(stat => (
            <div key={stat.label} className={`flex flex-col items-center py-5 rounded-2xl border ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
              <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-3 mb-10">
          <button onClick={() => router.push('/mock-test')}
            className="flex flex-col items-center gap-1.5 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors font-semibold text-sm">
            <Home className="w-5 h-5" /> All Exams
          </button>
          <button onClick={() => router.push(`/mock-test/configure?exam=${encodeURIComponent(session.exam_name)}`)}
            className="flex flex-col items-center gap-1.5 py-4 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 transition-colors font-semibold text-sm">
            <Plus className="w-5 h-5" /> New Test
          </button>
          <button onClick={() => router.push(`/mock-test/configure?exam=${encodeURIComponent(session.exam_name)}`)}
            className="flex flex-col items-center gap-1.5 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors font-semibold text-sm">
            <RotateCcw className="w-5 h-5" /> Retry
          </button>
        </motion.div>

        {/* Per-Question Review */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-bold text-white mb-4">Question Review</h2>
          <div className="space-y-3">
            {session.questions.map((q) => {
              const userAnswer = attempt.answers[String(q.question_number)];
              const isCorrect = userAnswer === q.correct_option;
              const isSkipped = !userAnswer;
              const isExpanded = expandedQ === q.question_number;

              let statusIcon = <MinusCircle className="w-5 h-5 text-gray-500 flex-shrink-0" />;
              let statusBorder = 'border-white/10';
              if (!isSkipped) {
                statusIcon = isCorrect
                  ? <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  : <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />;
                statusBorder = isCorrect ? 'border-green-500/30' : 'border-red-500/30';
              }

              return (
                <div key={q.question_number} className={`rounded-2xl border ${statusBorder} bg-[#18181B] overflow-hidden`}>
                  <button onClick={() => setExpandedQ(isExpanded ? null : q.question_number)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors">
                    {statusIcon}
                    <span className="text-xs font-bold text-gray-500 flex-shrink-0">Q{q.question_number}</span>
                    <span className="flex-1 text-gray-300 text-sm line-clamp-2">{q.question}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-3">
                      {(['A', 'B', 'C', 'D'] as const).map(opt => {
                        const isUserAnswer = userAnswer === opt;
                        const isCorrectOpt = q.correct_option === opt;
                        let optClass = 'border-white/10 bg-white/5 text-gray-400';
                        if (isCorrectOpt) optClass = 'border-green-500/50 bg-green-500/10 text-green-300';
                        else if (isUserAnswer && !isCorrectOpt) optClass = 'border-red-500/50 bg-red-500/10 text-red-300';
                        return (
                          <div key={opt} className={`flex items-start gap-3 p-3 rounded-xl border ${optClass}`}>
                            <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-xs font-bold flex-shrink-0">{opt}</span>
                            <span className="text-sm flex-1">{q.options[opt]}</span>
                            {isCorrectOpt && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />}
                            {isUserAnswer && !isCorrectOpt && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
                          </div>
                        );
                      })}
                      <div className="mt-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <p className="text-xs font-bold text-blue-400 mb-1">Explanation</p>
                        <p className="text-gray-300 text-sm leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>}>
      <ResultContent />
    </Suspense>
  );
}

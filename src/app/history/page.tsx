'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ArrowLeft, Loader2, Target, CheckCircle2, XCircle, Brain, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface QuizAttempt {
  id: string;
  score_percentage: number;
  correct_count: number;
  total_questions: number;
  created_at: string;
  quizzes?: {
    id: string;
    title: string;
    topic: string;
    difficulty: string;
  };
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }

    if (status === 'authenticated') {
      setLoading(true);
      fetch('/api/user/history?limit=100')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch history');
          return res.json();
        })
        .then((data) => {
          setAttempts(data.attempts || []);
        })
        .catch((err) => {
          console.error(err);
          setError('Could not load quiz history. Please try again later.');
        })
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-8">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/profile" 
          className="p-2 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <History className="w-5 h-5 text-white" />
            </div>
            Quiz History
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Review your past performance and track your learning progress.</p>
        </div>
      </div>

      {error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-center">
          {error}
        </div>
      ) : attempts.length === 0 ? (
        <div className="text-center py-20 bg-[#121214] bg-white/[0.02] border border-white/10 border-white/5 rounded-3xl shadow-sm shadow-none">
          <Brain className="w-16 h-16 text-gray-400 text-gray-600 mx-auto mb-4 opacity-70 opacity-50" />
          <h3 className="text-xl font-bold text-white text-gray-300 mb-2">No Quizzes Taken Yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Your history is empty. Start your learning journey by taking a quiz!
          </p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-purple-500/20"
          >
            Take a Quiz
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {attempts.map((attempt, idx) => {
              const incorrectCount = attempt.total_questions - attempt.correct_count;
              const date = new Date(attempt.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              });

              return (
                <motion.div
                  key={attempt.id}
                  onClick={() => router.push(`/history/${attempt.id}`)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white bg-white/[0.03] border border-white/10 border-white/5 shadow-sm shadow-none rounded-3xl p-6 hover:bg-[#09090b] hover:bg-white/[0.05] hover:border-gray-300 hover:border-white/20 transition-all flex flex-col group cursor-pointer relative"
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 bg-white/5 text-gray-600 text-gray-300 border border-white/10 border-white/10 group-hover:border-gray-300 group-hover:border-white/20 transition-colors">
                        <Calendar className="w-3.5 h-3.5" /> {date}
                      </div>
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider
                        ${attempt.score_percentage >= 80 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                          attempt.score_percentage >= 50 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                          'bg-red-500/10 text-red-400 border border-red-500/20'}
                      `}>
                        {attempt.score_percentage}% Score
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white text-white mb-1 line-clamp-2 leading-tight">
                      {attempt.quizzes?.title || 'Unknown Quiz'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                       <span className="capitalize">{attempt.quizzes?.topic || 'General'}</span>
                       •
                       <span className={`capitalize ${attempt.quizzes?.difficulty === 'hard' ? 'text-red-400/80' : attempt.quizzes?.difficulty === 'medium' ? 'text-amber-400/80' : 'text-green-400/80'}`}>
                         {attempt.quizzes?.difficulty || 'Unrated'}
                       </span>
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    {/* Total */}
                    <div className="bg-[#09090b] bg-white/5 rounded-2xl p-3 flex flex-col items-center justify-center border border-white/10 border-white/5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                        <Target className="w-3.5 h-3.5" /> Total
                      </div>
                      <span className="text-lg font-black text-white text-white">{attempt.total_questions}</span>
                    </div>

                    {/* Correct */}
                    <div className="bg-green-50 bg-green-500/5 rounded-2xl p-3 flex flex-col items-center justify-center border border-green-200 border-green-500/10">
                      <div className="flex items-center gap-1.5 text-xs text-green-400/70 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </div>
                      <span className="text-lg font-black text-green-400">{attempt.correct_count}</span>
                    </div>

                    {/* Incorrect */}
                    <div className="bg-red-50 bg-red-500/5 rounded-2xl p-3 flex flex-col items-center justify-center border border-red-200 border-red-500/10">
                      <div className="flex items-center gap-1.5 text-xs text-red-400/70 mb-1">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </div>
                      <span className="text-lg font-black text-red-400">{incorrectCount}</span>
                    </div>
                  </div>

                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                    <ChevronRight className="w-6 h-6 text-purple-400" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

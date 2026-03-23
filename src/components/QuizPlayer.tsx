'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Timer,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { GeneratedQuestion, QuestionType } from '@/types/quiz';
import type { SubmitAttemptRequest, SubmitAttemptResponse } from '@/types/attempt';
import CoinRewardAnimation from './CoinRewardAnimation';

interface QuizPlayerProps {
  quizId: string;
  questions: GeneratedQuestion[];
  topic: string;
}

export default function QuizPlayer({ quizId, questions, topic }: QuizPlayerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [timesTaken, setTimesTaken] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitAttemptResponse | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && !isLastQuestion) handleNext();
      if (e.key === 'ArrowLeft' && currentIndex > 0) handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isLastQuestion]);

  const handleNext = () => {
    const now = Date.now();
    const duration = Math.round((now - questionStartTime) / 1000);
    setTimesTaken(prev => ({ ...prev, [currentQuestion.id]: duration }));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setQuestionStartTime(now);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handleSelect = (answer: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const totalTime = Math.round((Date.now() - startTime) / 1000);

    const payload: SubmitAttemptRequest = {
      user_id: '', // Will be handled server-side via session
      quiz_id: quizId,
      attempt_id: crypto.randomUUID(),
      time_taken_seconds: totalTime,
      answers: Object.entries(answers).map(([qId, val]) => ({
        question_id: qId,
        user_answer: val,
        time_taken_seconds: timesTaken[qId] || 0
      }))
    };

    try {
      const res = await fetch('/api/quiz/submit-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to submit quiz.');
        setIsSubmitting(false);
        return;
      }

      setResult(data);
      setShowReward(true);

      // Trigger balance update across the app
      window.dispatchEvent(new Event('coinBalanceUpdate'));

      // Delay navigation to show rewards
      setTimeout(() => {
        router.push(`/profile`); // Or to a dedicated result page
      }, 5000);

    } catch (err) {
      console.error('Quiz submission error:', err);
      setErrorMsg('A network error occurred while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 glass-panel rounded-3xl border border-white/10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 p-4 rounded-full bg-green-500/20 text-green-400"
        >
          <CheckCircle2 className="w-16 h-16" />
        </motion.div>

        <h2 className="text-4xl font-bold mb-2">Quiz Completed!</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          You answered {result.correct_count} out of {result.total_questions} questions correctly.
        </p>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-sm text-gray-500 mb-1">Score</p>
            <p className="text-2xl font-bold text-white">{result.score_percentage}%</p>
          </div>
          <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
            <p className="text-sm text-yellow-500/70 mb-1">Coins Earned</p>
            <p className="text-2xl font-bold text-yellow-400">+{result.coins_awarded}</p>
          </div>
        </div>

        <button
          onClick={() => router.push('/')}
          className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Back to Home
        </button>

        <CoinRewardAnimation
          coinsAwarded={result.coins_awarded}
          active={showReward}
          onComplete={() => setShowReward(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Error Modal */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#18181b] border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl"
            >
              <div className="mx-auto w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Submission Failed</h3>
              <p className="text-gray-400 mb-8">{errorMsg}</p>

              <div className="flex flex-col gap-3">
                {errorMsg.toLowerCase().includes('login') || errorMsg.toLowerCase().includes('unauthorized') || errorMsg.toLowerCase().includes('verify') ? (
                  <button
                    onClick={() => router.push('/profile')}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                  >
                    Go to Profile
                  </button>
                ) : null}
                <button
                  onClick={() => setErrorMsg(null)}
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-4 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-950 dark:text-white mb-1 truncate max-w-[200px] sm:max-w-md">{topic}</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-200/50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-full text-xs font-medium text-gray-600 dark:text-gray-400">
            <Timer className="w-3.5 h-3.5" />
            <span className="tabular-nums">
              {Math.floor((Date.now() - startTime) / 60000)}:
              {String(Math.floor(((Date.now() - startTime) % 60000) / 1000)).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-200 dark:bg-white/5 rounded-full mb-12 overflow-hidden">
        <motion.div
          className="h-full bg-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-[400px] flex flex-col"
        >
          <div className="glass-panel p-8 rounded-3xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-transparent mb-8">
            <h2 className="text-2xl font-bold leading-tight mb-8 text-gray-950 dark:text-white">
              {currentQuestion.question}
            </h2>

            <div className="grid gap-3">
              {currentQuestion.options?.map((option, idx) => {
                const isSelected = answers[currentQuestion.id] === option;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(option)}
                    className={`
                      w-full text-left p-5 rounded-2xl border transition-all duration-200 group
                      ${isSelected
                        ? 'bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/20'
                        : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/[0.08] hover:border-gray-300 dark:hover:border-white/20'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`
                        w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors
                        ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-gray-500 group-hover:text-gray-800 dark:group-hover:text-gray-300'}
                      `}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 font-medium">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-0 transition-all"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !answers[currentQuestion.id]}
                className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className="bg-white text-black px-10 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

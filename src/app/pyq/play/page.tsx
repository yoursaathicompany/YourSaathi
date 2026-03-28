/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  SkipForward,
  Home,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  Clock,
  BookOpen,
  ChevronRight,
} from 'lucide-react';

interface PYQQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  topic?: string;
  year_hint?: string;
}

interface PYQSessionData {
  exam: string;
  subject: string;
  year?: number;
  difficulty: string;
  questions: PYQQuestion[];
  entryTitle: string;
  entryColor: string;
  entryIcon: string;
}

export default function PYQPlayPage() {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<PYQSessionData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [answerHistory, setAnswerHistory] = useState<{ correct: boolean; skipped: boolean }[]>([]);

  // Elapsed time ticker
  useEffect(() => {
    if (isFinished) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(t);
  }, [startTime, isFinished]);

  useEffect(() => {
    const raw = sessionStorage.getItem('pyq_quiz');
    if (!raw) { router.push('/pyq'); return; }
    try {
      const parsed = JSON.parse(raw);
      // Ensure each question has a stable id
      parsed.questions = parsed.questions.map((q: any, i: number) => ({
        ...q,
        id: q.id || `q${i}`,
      }));
      setSessionData(parsed);
    } catch {
      router.push('/pyq');
    }
  }, [router]);

  if (!sessionData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-purple-600/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-purple-400 animate-pulse" />
            </div>
          </div>
          <p className="text-white font-semibold">Loading your PYQ quiz...</p>
        </div>
      </div>
    );
  }

  const questions = sessionData.questions;
  const question = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = ((currentIndex) / questions.length) * 100;

  const handleSelect = (opt: string) => {
    if (showExplanation) return;
    setSelectedAnswer(opt);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    const isCorrect = selectedAnswer === question.correct_answer;
    if (isCorrect) setScore(s => s + 1);
    setAnsweredCount(a => a + 1);
    setAnswerHistory(prev => [...prev, { correct: isCorrect, skipped: false }]);
    setShowExplanation(true);
  };

  const handleSkip = () => {
    setAnswerHistory(prev => [...prev, { correct: false, skipped: true }]);
    goNext();
  };

  const goNext = () => {
    if (isLastQuestion) {
      setIsFinished(true);
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleNextQuestion = () => {
    goNext();
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const scorePct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  // ── Finished Screen ───────────────────────────────────────────────────────
  if (isFinished) {
    const grade =
      scorePct >= 80 ? { label: 'Excellent! 🏆', color: 'text-yellow-400', bg: 'from-yellow-500/20 to-amber-500/10', border: 'border-yellow-500/30' } :
      scorePct >= 60 ? { label: 'Good Job! 👍', color: 'text-green-400', bg: 'from-green-500/20 to-emerald-500/10', border: 'border-green-500/30' } :
      scorePct >= 40 ? { label: 'Keep Practicing 📖', color: 'text-blue-400', bg: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/30' } :
      { label: 'Needs More Practice 💪', color: 'text-red-400', bg: 'from-red-500/20 to-rose-500/10', border: 'border-red-500/30' };

    return (
      <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full"
        >
          {/* Top card */}
          <div className={`rounded-3xl border ${grade.border} bg-gradient-to-br ${grade.bg} p-8 text-center mb-6`}>
            <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 mx-auto flex items-center justify-center mb-5 text-4xl">
              {sessionData.entryIcon}
            </div>
            <p className={`text-xl font-bold mb-1 ${grade.color}`}>{grade.label}</p>
            <h2 className="text-4xl font-black text-white mb-1">{scorePct}%</h2>
            <p className="text-gray-400 text-sm">{sessionData.entryTitle}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Target, label: 'Correct', value: `${score}/${questions.length}`, color: 'text-green-400' },
              { icon: Clock, label: 'Time', value: formatTime(elapsed), color: 'text-blue-400' },
              { icon: BookOpen, label: 'Year', value: sessionData.year ? String(sessionData.year) : 'Mixed', color: 'text-purple-400' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Answer timeline */}
          <div className="rounded-2xl border border-white/10 bg-[#18181b] p-5 mb-6">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Answer breakdown</p>
            <div className="flex gap-1.5 flex-wrap">
              {answerHistory.map((h, i) => (
                <div
                  key={i}
                  title={`Q${i + 1}: ${h.skipped ? 'Skipped' : h.correct ? 'Correct' : 'Wrong'}`}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    h.skipped
                      ? 'bg-gray-700 text-gray-500'
                      : h.correct
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                sessionStorage.removeItem('pyq_quiz');
                router.push('/pyq');
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all font-semibold"
            >
              <Home className="w-4 h-4" />
              PYQ Home
            </button>
            <button
              onClick={() => {
                const entryId = sessionData.exam; // navigate back to configure
                router.back();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r ${sessionData.entryColor} text-white font-bold hover:opacity-90 transition-all shadow-xl`}
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Quiz Player ────────────────────────────────────────────────────────────
  const isCorrect = showExplanation && selectedAnswer === question.correct_answer;
  const isWrong = showExplanation && selectedAnswer !== question.correct_answer;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-[90vh] flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span className="text-lg">{sessionData.entryIcon}</span>
            <span className="truncate max-w-[180px] sm:max-w-xs">{sessionData.entryTitle}</span>
            {sessionData.year && <span className="px-2 py-0.5 bg-white/5 rounded-full text-xs">{sessionData.year}</span>}
          </div>
          <p className="text-xs text-gray-600 uppercase tracking-widest font-bold">
            Question {currentIndex + 1} / {questions.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-gray-400 font-mono">
            <Clock className="w-3 h-3" />
            {formatTime(elapsed)}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-xs text-green-400 font-semibold">
            <Trophy className="w-3 h-3" />
            {score}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-white/5 rounded-full mb-8 overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${sessionData.entryColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            {/* Question meta */}
            {(question.topic || question.year_hint) && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {question.topic && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-400">
                    {question.topic}
                  </span>
                )}
                {question.year_hint && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-500">
                    {question.year_hint}
                  </span>
                )}
              </div>
            )}

            {/* Question Text */}
            <div className="p-6 md:p-8 rounded-3xl border border-white/10 bg-[#18181b] mb-6">
              <h2 className="text-xl md:text-2xl font-semibold leading-relaxed text-white">
                {question.question}
              </h2>
            </div>

            {/* Options */}
            <div className="grid gap-3 mb-6">
              {question.options.map((opt, idx) => {
                let cls = 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/[0.08] hover:border-white/20';
                let icon = null;
                if (showExplanation) {
                  const isCorrectOpt = opt === question.correct_answer;
                  const isSelectedOpt = opt === selectedAnswer;
                  if (isCorrectOpt) {
                    cls = 'border-green-500/50 bg-green-500/10 text-green-300';
                    icon = <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />;
                  } else if (isSelectedOpt && !isCorrectOpt) {
                    cls = 'border-red-500/50 bg-red-500/10 text-red-400';
                    icon = <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />;
                  } else {
                    cls = 'border-white/5 bg-[#18181b] text-gray-600 opacity-50';
                  }
                } else if (opt === selectedAnswer) {
                  cls = 'border-purple-500 bg-purple-500/15 text-white shadow-lg shadow-purple-500/10';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(opt)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between gap-4 ${cls}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 transition-colors ${
                        opt === selectedAnswer && !showExplanation
                          ? 'bg-purple-500/30 text-purple-300'
                          : 'bg-white/5 text-gray-500'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="font-medium text-sm md:text-base">{opt}</span>
                    </div>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`rounded-2xl border p-5 mb-6 relative overflow-hidden ${
                    isCorrect
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-blue-500/10 border-blue-500/30'
                  }`}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${isCorrect ? 'bg-green-500' : 'bg-blue-500'}`} />
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${isCorrect ? 'text-green-400' : 'text-blue-400'}`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    {isCorrect ? '✓ Correct!' : 'Explanation'}
                  </h4>
                  <p className={`text-sm leading-relaxed ${isCorrect ? 'text-green-300' : 'text-blue-300'}`}>
                    {question.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
              <button
                onClick={() => { if (confirm('Exit quiz?')) { sessionStorage.removeItem('pyq_quiz'); router.push('/pyq'); } }}
                className="text-gray-600 hover:text-white text-sm font-medium transition-colors"
              >
                Quit
              </button>

              <div className="flex gap-3">
                {!showExplanation && !selectedAnswer && (
                  <button
                    onClick={handleSkip}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-300 border border-white/10 px-5 py-2.5 rounded-xl hover:bg-white/5 transition-all text-sm"
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip
                  </button>
                )}
                {!showExplanation && selectedAnswer && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleSubmitAnswer}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/25 text-sm"
                  >
                    Submit Answer
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                )}
                {showExplanation && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={handleNextQuestion}
                    className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold transition-all shadow-xl text-sm text-white bg-gradient-to-r ${sessionData.entryColor} hover:opacity-90`}
                  >
                    {isLastQuestion ? (
                      <><Trophy className="w-4 h-4" /> Finish Quiz</>
                    ) : (
                      <>Next Question <ArrowRight className="w-4 h-4" /></>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

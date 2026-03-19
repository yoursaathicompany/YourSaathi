'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, AlertCircle, Clock, SkipForward, ArrowRight, Home, Sparkles } from 'lucide-react';
import { GeneratedQuizResponse, GeneratedQuestion } from '@/types/quiz';
import { useRouter } from 'next/navigation';

export default function QuizPlayer() {
  const router = useRouter();
  const [quizData, setQuizData] = useState<GeneratedQuizResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Load local temp quiz
    const stored = localStorage.getItem('temp_quiz');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setQuizData(parsed);
        setTimeLeft(parsed.meta?.estimated_total_time_seconds || 600);
      } catch (e) {
        console.error("Invalid quiz data");
      }
    } else {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (!isFinished && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && quizData) {
      finishQuiz();
    }
  }, [timeLeft, isFinished, quizData]);

  if (!quizData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-400">Loading your knowledge environment...</p>
        </div>
      </div>
    );
  }

  const question = quizData.questions[currentIndex];
  const isLastQuestion = currentIndex === quizData.questions.length - 1;
  const currentAnswer = answers[question.id];

  const handleSelectOption = (option: string) => {
    if (showExplanation) return; // Prevent changing after confirmed

    setAnswers(prev => ({ ...prev, [question.id]: option }));
  };

  const verifyAnswer = () => {
    setShowExplanation(true);
    // Simple exact match scoring (for single MCQ demo)
    if (currentAnswer && currentAnswer === question.correct_answer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      setCurrentIndex(i => i + 1);
      setShowExplanation(false);
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentIndex) / quizData.questions.length) * 100;

  if (isFinished) {
    const scorePct = Math.round((score / quizData.questions.length) * 100);
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#18181B] border border-white/10 rounded-2xl p-10 max-w-lg w-full text-center glass-panel shadow-2xl"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-6">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-gray-400 mb-8">Topic: {quizData.topic}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-black/40 rounded-xl p-4 border border-white/5">
              <p className="text-sm text-gray-500 mb-1">Score</p>
              <p className="text-3xl font-bold gradient-text text-white">{scorePct}%</p>
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-white/5">
              <p className="text-sm text-gray-500 mb-1">Correct</p>
              <p className="text-3xl font-bold text-white">{score} <span className="text-lg text-gray-500">/ {quizData.questions.length}</span></p>
            </div>
          </div>

          <button onClick={() => router.push('/')} className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-[85vh] flex flex-col">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white">{quizData.topic}</h1>
          <p className="text-sm text-gray-400 capitalize">{quizData.difficulty} • {quizData.student_level}</p>
        </div>
        <div className="flex items-center gap-4 bg-[#18181B] border border-white/10 px-4 py-2 rounded-full glass-panel">
          <Clock className="w-5 h-5 text-purple-400" />
          <span className="font-mono text-lg font-medium text-purple-400">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-800 rounded-full h-2 mb-8 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex-1 max-w-3xl w-full mx-auto flex flex-col">
        {/* Question Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <div className="text-sm font-semibold text-purple-400 mb-4 flex items-center gap-2">
              <span className="bg-purple-500/20 px-2 py-1 rounded text-xs">Question {currentIndex + 1} of {quizData.questions.length}</span>
              {question.metadata?.difficulty_score > 0.7 && <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">Hard</span>}
            </div>

            <h2 className="text-2xl md:text-3xl font-medium leading-relaxed mb-8">{question.question}</h2>

            {/* Options */}
            <div className="space-y-3">
              {question.options?.map((opt, idx) => {
                const isSelected = currentAnswer === opt;

                // Show Correct / Incorrect states only if explanation is shown
                let optionClass = "border-white/10 bg-[#e1e1e6] hover:border-purple-500/50 hover:bg-purple-500/5";
                let icon = null;

                if (showExplanation) {
                  const isCorrectAnswer = (question.correct_answer === opt) ||
                    (Array.isArray(question.correct_answer) && question.correct_answer.includes(opt));

                  if (isSelected && isCorrectAnswer) {
                    optionClass = "border-green-500/50 bg-green-500/10 text-green-600";
                    icon = <CheckCircle2 className="w-5 h-5 text-green-400" />;
                  } else if (isSelected && !isCorrectAnswer) {
                    optionClass = "border-red-500/50 bg-red-500/10 text-red-400";
                    icon = <AlertCircle className="w-5 h-5 text-red-400" />;
                  } else if (!isSelected && isCorrectAnswer) {
                    optionClass = "border-green-500/50 bg-green-500/10 text-black"; // Highlight correct
                    icon = <CheckCircle2 className="w-5 h-5 text-green-400" />;
                  } else {
                    optionClass = "border-white/5 opacity-50 bg-[#18181B] text-white"; // Dim others
                  }
                } else if (isSelected) {
                  optionClass = "border-purple-500 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    disabled={showExplanation}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${optionClass}`}
                  >
                    <span className="text-lg">{opt}</span>
                    {icon && <span>{icon}</span>}
                  </button>
                );
              })}
            </div>

            {/* Explanation Area */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                  <h4 className="text-blue-400 font-bold mb-2 text-sm uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Explanation
                  </h4>
                  <p className="text-blue-500 leading-relaxed text-sm">{question.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
          <button
            onClick={() => confirm("Are you sure you want to exit?") && router.push('/')}
            className="text-gray-500 hover:text-white transition-colors text-sm font-medium"
          >
            Quit
          </button>

          <div className="flex gap-4">
            {!showExplanation && currentAnswer && (
              <motion.button
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                onClick={verifyAnswer}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 transition-all text-sm"
              >
                Submit Answer
              </motion.button>
            )}

            {showExplanation && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                onClick={nextQuestion}
                className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-xl font-bold shadow-lg shadow-white/20 transition-all flex items-center gap-2 text-sm"
              >
                {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}

            {!currentAnswer && !showExplanation && (
              <button
                onClick={nextQuestion}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors border border-white/10 px-6 py-3 rounded-xl hover:bg-white/5"
              >
                <SkipForward className="w-4 h-4" /> Skip
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

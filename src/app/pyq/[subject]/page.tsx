/* eslint-disable */
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Calendar, Loader2, BookOpen, BarChart2, Hash } from 'lucide-react';
import Link from 'next/link';
import { PYQ_CATALOG, LEVEL_LABELS } from '@/lib/pyqData';

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy', desc: 'Foundational questions', color: 'border-green-500/50 bg-green-500/10 text-green-400' },
  { value: 'medium', label: 'Medium', desc: 'Standard exam level', color: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400' },
  { value: 'hard', label: 'Hard', desc: 'Advanced & tricky', color: 'border-red-500/50 bg-red-500/10 text-red-400' },
];

const QUESTION_COUNTS = [5, 10, 15, 20];

export default function PYQSubjectPage() {
  const params = useParams();
  const router = useRouter();
  const entryId = params.subject as string;

  const entry = PYQ_CATALOG.find((e) => e.id === entryId);

  const [selectedYear, setSelectedYear] = useState<number | null>(
    entry?.availableYears[0] ?? null
  );
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!entry) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-6">📭</div>
        <h1 className="text-2xl font-bold text-white mb-3">Exam Set Not Found</h1>
        <p className="text-gray-400 mb-6">The exam set you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/pyq" className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all">
          Back to PYQs
        </Link>
      </div>
    );
  }

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pyq/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam: entry.exam,
          subject: entry.subject,
          year: selectedYear ?? undefined,
          numQuestions,
          difficulty,
          entryId: entry.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to generate quiz. Please try again.');
        setLoading(false);
        return;
      }
      // Store and navigate
      sessionStorage.setItem('pyq_quiz', JSON.stringify({
        ...data,
        entryTitle: entry.title,
        entryColor: entry.color,
        entryIcon: entry.icon,
      }));
      router.push('/pyq/play');
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Link href="/pyq" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to PYQs
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-5 mb-10"
      >
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${entry.color} flex items-center justify-center text-3xl shadow-xl flex-shrink-0`}>
          {entry.icon}
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{entry.title}</h1>
          <p className="text-gray-400 text-sm">{entry.exam} · {LEVEL_LABELS[entry.level]} · {entry.totalQuestions.toLocaleString()}+ questions</p>
          <p className="text-gray-500 text-sm mt-2 max-w-lg">{entry.description}</p>
        </div>
      </motion.div>

      {/* Config Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl border border-white/10 bg-[#18181b] p-6 md:p-8 space-y-8"
      >
        {/* Year Selection */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
            <Calendar className="w-4 h-4 text-purple-400" />
            Select Year
          </h3>
          <div className="flex flex-wrap gap-2">
            {entry.availableYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  selectedYear === year
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            Difficulty Level
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDifficulty(opt.value as any)}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                  difficulty === opt.value
                    ? opt.color
                    : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <p className="font-bold text-sm mb-0.5">{opt.label}</p>
                <p className="text-xs opacity-70">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
            <Hash className="w-4 h-4 text-purple-400" />
            Number of Questions
          </h3>
          <div className="flex gap-3">
            {QUESTION_COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setNumQuestions(n)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all duration-200 ${
                  numQuestions === n
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Chapters Preview */}
        {entry.chapters && (
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              <BookOpen className="w-4 h-4 text-purple-400" />
              Topics Covered
            </h3>
            <div className="flex flex-wrap gap-2">
              {entry.chapters.map((ch) => (
                <span key={ch} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                  {ch}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all duration-200 flex items-center justify-center gap-3 shadow-2xl ${
            loading
              ? 'bg-purple-600/50 cursor-not-allowed'
              : `bg-gradient-to-r ${entry.color} hover:opacity-90 hover:shadow-purple-500/30`
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating PYQ Quiz...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate {numQuestions} Questions · {selectedYear ?? 'All Years'} · {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </>
          )}
        </motion.button>

        <p className="text-center text-xs text-gray-600">
          🎯 Practice Mode — No coins. Just pure exam preparation.
        </p>
      </motion.div>
    </div>
  );
}

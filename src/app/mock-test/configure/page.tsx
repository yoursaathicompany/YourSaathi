'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Zap, ArrowLeft, ChevronDown } from 'lucide-react';

const EXAM_SUBJECTS: Record<string, string[]> = {
  'SSC CGL':      ['General Reasoning', 'Quantitative Aptitude', 'English Language', 'General Awareness', 'Computer Knowledge'],
  'SSC CHSL':     ['General Intelligence', 'English Language', 'Quantitative Aptitude', 'General Awareness'],
  'SSC MTS':      ['General Intelligence', 'Numerical Aptitude', 'General English', 'General Awareness'],
  'UPSC Prelims': ['Indian Polity & Governance', 'Indian History', 'Indian Geography', 'Indian Economy', 'Science & Technology', 'Environment & Ecology', 'Current Affairs'],
  'IBPS PO':      ['Reasoning Ability', 'Quantitative Aptitude', 'English Language', 'General Financial Awareness', 'Computer Knowledge'],
  'IBPS Clerk':   ['Reasoning Ability', 'Quantitative Aptitude', 'English Language', 'General Financial Awareness'],
  'SBI PO':       ['Data Analysis & Interpretation', 'Reasoning & Computer Aptitude', 'English Language', 'Economy/Banking Awareness'],
  'RRB NTPC':     ['General Awareness', 'Mathematics', 'General Intelligence & Reasoning'],
  'RRB Group D':  ['Mathematics', 'General Intelligence & Reasoning', 'General Science', 'General Awareness'],
  'NDA':          ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'English Grammar', 'Current Affairs'],
  'CDS':          ['English', 'General Knowledge', 'Elementary Mathematics'],
  'State PSC':    ['State History & Culture', 'State Geography & Economy', 'Indian Polity', 'General Science', 'Current Affairs'],
  'Custom':       ['General Knowledge', 'Reasoning', 'Mathematics', 'Science', 'English'],
};

function ConfigureForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examFromUrl = searchParams.get('exam') ?? '';

  const [examName, setExamName] = useState(examFromUrl);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [numQuestions, setNumQuestions] = useState<10 | 20 | 30>(20);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subjects = EXAM_SUBJECTS[examName] ?? EXAM_SUBJECTS['Custom'];

  useEffect(() => { setSubject(subjects[0] ?? ''); }, [examName]);

  const handleGenerate = async () => {
    if (!examName || !subject) { setError('Please fill in all required fields.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/mock-test/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exam_name: examName, subject, topic: topic || undefined, difficulty, num_questions: numQuestions, language }),
      });
      const data = await res.json();
      if (data.status === 'payment_required') {
        router.push('/mock-test?paywall=1');
        return;
      }
      if (!res.ok || !data.session_id) {
        setError(data.error || 'Failed to generate test. Please try again.');
        setLoading(false);
        return;
      }
      router.push(`/mock-test/play/${data.session_id}`);
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  const difficultyOptions = [
    { value: 'easy',   label: 'Easy',   desc: 'Basic concepts, direct questions', color: 'border-green-500/50 bg-green-500/10 text-green-400' },
    { value: 'medium', label: 'Medium', desc: 'Moderate complexity, mixed types', color: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400' },
    { value: 'hard',   label: 'Hard',   desc: 'Advanced, tricky, exam-level', color: 'border-red-500/50 bg-red-500/10 text-red-400' },
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12">
        <button onClick={() => router.push('/mock-test')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Exams
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">Configure Your Test</h1>
          <p className="text-gray-400">Customize your AI mock test for the best practice experience.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="space-y-6">

          {/* Exam Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Exam <span className="text-red-400">*</span></label>
            <div className="relative">
              <select value={examName} onChange={e => setExamName(e.target.value)}
                className="w-full appearance-none bg-[#18181B] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/60 transition-colors pr-10">
                {Object.keys(EXAM_SUBJECTS).map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Subject <span className="text-red-400">*</span></label>
            <div className="relative">
              <select value={subject} onChange={e => setSubject(e.target.value)}
                className="w-full appearance-none bg-[#18181B] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/60 transition-colors pr-10">
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Topic (optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Topic / Chapter <span className="text-gray-600 font-normal">(optional)</span></label>
            <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Number Series, Modern History, Profit & Loss..."
              className="w-full bg-[#18181B] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/60 transition-colors" />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-3">
              {difficultyOptions.map(opt => (
                <button key={opt.value} onClick={() => setDifficulty(opt.value as 'easy' | 'medium' | 'hard')}
                  className={`p-3 rounded-xl border text-sm font-semibold transition-all text-center ${difficulty === opt.value ? opt.color + ' ring-1 ring-current' : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-[10px] opacity-70 mt-0.5 font-normal">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">Number of Questions</label>
            <div className="grid grid-cols-3 gap-3">
              {([10, 20, 30] as const).map(n => (
                <button key={n} onClick={() => setNumQuestions(n)}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${numQuestions === n ? 'border-purple-500/60 bg-purple-500/15 text-purple-300' : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  {n} Questions
                  <div className="text-[10px] font-normal opacity-70 mt-0.5">{n} min</div>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">Language</label>
            <div className="grid grid-cols-2 gap-3">
              {(['English', 'Hindi'] as const).map(lang => (
                <button key={lang} onClick={() => setLanguage(lang)}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all ${language === lang ? 'border-purple-500/60 bg-purple-500/15 text-purple-300' : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  {lang === 'English' ? '🇬🇧 English' : '🇮🇳 Hindi'}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}

          <motion.button onClick={handleGenerate} disabled={loading} whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-purple-500/25 text-lg mt-2">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating your test…</> : <><Zap className="w-5 h-5" /> Generate Mock Test</>}
          </motion.button>

          {loading && (
            <p className="text-center text-gray-500 text-sm animate-pulse">
              AI is crafting fresh, original questions for you… This takes 10–20 seconds.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function ConfigurePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>}>
      <ConfigureForm />
    </Suspense>
  );
}

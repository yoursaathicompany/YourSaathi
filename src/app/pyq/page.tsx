'use client';

import { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Search, Zap, BookOpen, Trophy, Users, Star } from 'lucide-react';

import PYQCard from '@/components/PYQCard';
import { PYQ_CATALOG, LEVEL_LABELS, type PYQLevel } from '@/lib/pyqData';

const TABS: { label: string; value: PYQLevel | 'all' }[] = [
  { label: 'All Exams', value: 'all' },
  { label: 'Class 10', value: 'class10' },
  { label: 'Class 11', value: 'class11' },
  { label: 'Class 12', value: 'class12' },
  { label: 'JEE', value: 'jee' },
  { label: 'NEET', value: 'neet' },
  { label: 'UPSC', value: 'upsc' },
  { label: 'SSC', value: 'ssc' },
];

const STATS = [
  { icon: BookOpen, label: 'PYQ Questions', value: '10,000+' },
  { icon: Trophy, label: 'Exams Covered', value: '8+' },
  { icon: Users, label: 'Students Practicing', value: '50K+' },
  { icon: Star, label: 'Years of Papers', value: '7+' },
];

export default function PYQPage() {
  const [activeTab, setActiveTab] = useState<PYQLevel | 'all'>('all');
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return PYQ_CATALOG.filter((entry) => {
      const matchLevel = activeTab === 'all' || entry.level === activeTab;
      const q = search.toLowerCase();
      const matchSearch = !q || entry.title.toLowerCase().includes(q) || entry.subject.toLowerCase().includes(q) || entry.exam.toLowerCase().includes(q);
      return matchLevel && matchSearch;
    });
  }, [activeTab, search]);

  return (
    <>
      <div className="min-h-screen pb-24 relative z-0">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm font-medium mb-6"
          >
            <GraduationCap className="w-4 h-4" />
            Previous Year Questions
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
          >
            <span className="text-white">Ace Every Exam</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              with Real PYQs
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Practice with AI-powered previous year questions from CBSE, JEE, NEET, UPSC & more.
            Instant explanations. Real exam patterns. Zero guesswork.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <stat.icon className="w-5 h-5 text-purple-400 mb-2" />
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="max-w-xl mx-auto relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
            <div className="relative flex items-center bg-[#18181B] border border-white/10 rounded-2xl overflow-hidden focus-within:border-purple-500/50 transition-colors shadow-2xl">
              <Search className="w-5 h-5 text-gray-500 ml-4 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => startTransition(() => setSearch(e.target.value))}
                placeholder="Search exam, subject, or topic..."
                className="w-full bg-transparent border-none py-4 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-0"
              />
              {search && (
                <button onClick={() => setSearch('')} className="mr-4 text-gray-500 hover:text-white transition-colors text-sm">✕</button>
              )}
            </div>
          </motion.div>
        </section>

        {/* ── Filter Tabs ───────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {TABS.map((tab) => (
              <motion.button
                key={tab.value}
                onClick={() => startTransition(() => setActiveTab(tab.value))}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.value
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
                {tab.value !== 'all' && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({PYQ_CATALOG.filter(e => e.level === tab.value).length})
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </section>

        {/* ── Cards Grid ────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              {filtered.length > 0
                ? `${filtered.length} ${filtered.length === 1 ? 'exam set' : 'exam sets'} available`
                : 'No results found'}
            </h2>
            {activeTab !== 'all' && (
              <span className="text-sm text-gray-500">
                {LEVEL_LABELS[activeTab as PYQLevel]}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={activeTab + search}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {filtered.map((entry, i) => (
                  <PYQCard key={entry.id} entry={entry} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-lg font-semibold text-gray-400 mb-2">No exams found</p>
                <p className="text-sm text-gray-600">Try a different search term or filter</p>
                <button onClick={() => { setSearch(''); setActiveTab('all'); }} className="mt-4 text-purple-400 hover:text-purple-300 text-sm transition-colors">
                  Reset filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/30 to-pink-900/20 p-10 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 pointer-events-none" />
            <Zap className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">
              Want AI-Generated Quizzes on Any Topic?
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Beyond PYQs — generate custom quizzes on any topic, difficulty, and format instantly.
            </p>
            <Link
              href="/"
              className="relative z-10 inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/25"
            >
              <Zap className="w-4 h-4" />
              Try AI Quiz Generator
            </Link>
          </motion.div>
        </section>

      </div>
    </>
  );
}

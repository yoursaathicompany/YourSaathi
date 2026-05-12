'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Trophy, Clock, BookOpen, ChevronRight, Target, Lock, GraduationCap, Star, Shield } from 'lucide-react';
import MockTestPaywall from '@/components/MockTestPaywall';

const EXAM_CATALOG = [
  { name: 'SSC CGL', icon: '🏛️', color: 'from-orange-600 to-amber-500', border: 'border-orange-500/30', badge: 'Most Popular', desc: 'Staff Selection Commission — Combined Graduate Level', subjects: ['Reasoning', 'Quant', 'English', 'GK'] },
  { name: 'UPSC Prelims', icon: '⚖️', color: 'from-blue-700 to-indigo-600', border: 'border-blue-500/30', badge: 'Prestigious', desc: 'Civil Services Preliminary Examination', subjects: ['Polity', 'History', 'Geography', 'Economy', 'Science'] },
  { name: 'IBPS PO', icon: '🏦', color: 'from-green-700 to-emerald-600', border: 'border-green-500/30', badge: 'High Demand', desc: 'Banking Personnel Selection — PO', subjects: ['Reasoning', 'Quant', 'English', 'Banking Awareness'] },
  { name: 'RRB NTPC', icon: '🚂', color: 'from-red-700 to-rose-600', border: 'border-red-500/30', badge: 'Trending', desc: 'Railway Recruitment Board — NTPC', subjects: ['GK', 'Mathematics', 'Reasoning'] },
  { name: 'SSC CHSL', icon: '📋', color: 'from-purple-700 to-violet-600', border: 'border-purple-500/30', badge: '', desc: 'Combined Higher Secondary Level', subjects: ['Reasoning', 'English', 'Quant', 'GK'] },
  { name: 'SBI PO', icon: '💳', color: 'from-cyan-700 to-teal-600', border: 'border-cyan-500/30', badge: '', desc: 'State Bank of India — Probationary Officer', subjects: ['Reasoning', 'Data Interpretation', 'English', 'Banking'] },
  { name: 'NDA', icon: '🎖️', color: 'from-yellow-700 to-amber-600', border: 'border-yellow-500/30', badge: '', desc: 'National Defence Academy Exam', subjects: ['Mathematics', 'Physics', 'Chemistry', 'History'] },
  { name: 'State PSC', icon: '🗺️', color: 'from-pink-700 to-rose-600', border: 'border-pink-500/30', badge: '', desc: 'State Public Service Commission', subjects: ['State GK', 'Polity', 'History', 'Geography'] },
];

const STATS = [
  { icon: BookOpen, label: 'Exams Covered', value: '8+' },
  { icon: Target,   label: 'Questions Generated', value: '50K+' },
  { icon: Trophy,   label: 'Students Practicing', value: '10K+' },
  { icon: Clock,    label: 'Avg. Test Duration', value: '20 min' },
];

export default function MockTestLandingPage() {
  const router = useRouter();
  const [credits, setCredits] = useState<number | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    fetch('/api/mock-test/credits')
      .then(r => r.json())
      .then(d => { if (typeof d.credits_remaining === 'number') setCredits(d.credits_remaining); })
      .catch(() => setCredits(0));
  }, []);

  const handleExamClick = (examName: string) => {
    if (credits !== null && credits <= 0) { setShowPaywall(true); return; }
    router.push(`/mock-test/configure?exam=${encodeURIComponent(examName)}`);
  };

  return (
    <div className="min-h-screen pb-24 relative z-0">
      <AnimatePresence>
        {showPaywall && (
          <MockTestPaywall
            onClose={() => setShowPaywall(false)}
            onSuccess={(g) => { setCredits(c => (c ?? 0) + g); setShowPaywall(false); }}
          />
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm font-medium mb-6">
          <Zap className="w-4 h-4" /> AI-Powered Mock Test Generator
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
          <span className="text-white">Practice Like the</span><br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">Real Exam</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          AI-generated mock tests for SSC, UPSC, Banking, Railway and more. Instant results. Smart explanations.
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          {credits === null ? (
            <div className="h-10 w-44 rounded-xl bg-white/5 animate-pulse" />
          ) : credits > 0 ? (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-semibold">
              <Target className="w-4 h-4" /> {credits} mock {credits === 1 ? 'test' : 'tests'} remaining
            </div>
          ) : (
            <motion.button onClick={() => setShowPaywall(true)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-500/30 transition-all">
              <Lock className="w-4 h-4" /> Unlock 50 Tests for ₹49
            </motion.button>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {STATS.map(stat => (
            <div key={stat.label} className="flex flex-col items-center p-4 rounded-2xl border border-white/10 bg-white/5">
              <stat.icon className="w-5 h-5 text-purple-400 mb-2" />
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Exam Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Choose Your Exam</h2>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <GraduationCap className="w-4 h-4" /><span>{EXAM_CATALOG.length} exams</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {EXAM_CATALOG.map((exam, i) => (
            <motion.button key={exam.name} onClick={() => handleExamClick(exam.name)}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
              whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}
              className={`relative text-left group overflow-hidden rounded-2xl border ${exam.border} bg-[#18181B] p-5 shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${exam.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
              {exam.badge && (
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">{exam.badge}</span>
              )}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exam.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>{exam.icon}</div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">{exam.name}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{exam.desc}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {exam.subjects.slice(0, 3).map(s => (
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">{s}</span>
                ))}
                {exam.subjects.length > 3 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">+{exam.subjects.length - 3}</span>}
              </div>
              <div className="flex items-center gap-1 text-purple-400 text-sm font-semibold">
                <span>Start Test</span><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <h2 className="text-2xl font-bold text-white text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', icon: '🎯', title: 'Pick Your Exam', desc: 'Choose from SSC, UPSC, Banking, Railway, Defence and more.' },
            { step: '02', icon: '🤖', title: 'AI Generates Test', desc: 'Our AI creates a fresh, unique test tailored to your subject and difficulty.' },
            { step: '03', icon: '📊', title: 'Review & Improve', desc: 'Instant results with detailed explanations for every question.' },
          ].map((item, i) => (
            <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/10 bg-white/5">
              <div className="text-4xl mb-3">{item.icon}</div>
              <div className="text-xs font-bold text-purple-400 mb-1">STEP {item.step}</div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      {credits === 0 && (
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/30 to-indigo-900/20 p-10 text-center">
            <Shield className="w-10 h-10 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Ready to Start Practicing?</h3>
            <p className="text-gray-400 mb-6">50 AI mock tests for just ₹49 — less than a cup of coffee!</p>
            <motion.button onClick={() => setShowPaywall(true)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-10 py-4 rounded-2xl shadow-lg shadow-purple-500/25 text-lg">
              <Zap className="w-5 h-5" /> Get 50 Tests for ₹49
            </motion.button>
            <div className="flex items-center justify-center gap-4 mt-5 text-gray-500 text-xs">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Razorpay Secured</span>
              <span className="flex items-center gap-1"><Star className="w-3 h-3" /> 10,000+ students</span>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}

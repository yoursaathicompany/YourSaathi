'use client';

import { useState, useTransition } from 'react';
import { Search, Sparkles, TrendingUp } from 'lucide-react';
import QuizBoxGrid from '@/components/QuizBoxGrid';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import StarField from '@/components/StarField';
import ShootingStar from '@/components/ShootingStar';
import { motion } from 'framer-motion';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <BackgroundAnimation />
      <StarField />
      <ShootingStar />
      <div className="min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">

        {/* ── Hero ── */}
        <div className="flex flex-col items-center text-center mb-16 space-y-6">

          {/* GLASS badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-purple-500/40 bg-white/[0.07] backdrop-blur-xl text-purple-300 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_24px_rgba(139,92,246,0.15)]"
          >
            <Sparkles className="w-4 h-4" />
            Boost your preparation :)
          </motion.div>

          <motion.h1
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
            }}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl font-extrabold tracking-tight flex flex-col items-center gap-2 sm:gap-4"
          >
            <div className="overflow-hidden flex gap-3 md:gap-4 flex-wrap justify-center">
              {['Earn', 'Money'].map((word, i) => (
                <motion.span
                  key={`word1-${i}`}
                  variants={{
                    hidden: { y: '100%', opacity: 0, rotateX: -45, filter: 'blur(8px)' },
                    visible: { y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)', transition: { type: 'spring', damping: 12, stiffness: 100 } },
                  }}
                  className="inline-block text-white"
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <div className="overflow-hidden flex gap-3 md:gap-4 flex-wrap justify-center mt-[-0.2em]">
              {['By', 'Practicing', 'Quizzes'].map((word, i) => (
                <motion.span
                  key={`word2-${i}`}
                  variants={{
                    hidden: { y: '100%', opacity: 0, rotateX: -45, filter: 'blur(8px)' },
                    visible: { y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)', transition: { type: 'spring', damping: 12, stiffness: 100 } },
                  }}
                  className="inline-block gradient-text"
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl"
          >
            Instantly create high-quality, rigorously verified practice tests on any topic, at any difficulty level.
          </motion.p>

          {/* ── GLASS Search Bar ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-xl mt-8 relative"
          >
            {/* glow bloom */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/25 to-pink-500/25 rounded-2xl blur-2xl" />
            {/* glass container */}
            <div className="relative flex items-center bg-white/[0.06] backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden focus-within:border-purple-400/60 focus-within:bg-white/[0.09] transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_40px_rgba(0,0,0,0.4)]">
              <Search className="w-6 h-6 text-gray-400 ml-4 flex-shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  const v = e.target.value;
                  setInputValue(v);
                  startTransition(() => setSearchQuery(v));
                }}
                placeholder="What do you want to learn today?"
                aria-label="Search quiz topics"
                className={`w-full bg-transparent border-none py-4 px-4 text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-0 transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}
              />
              <button className="bg-white/90 backdrop-blur-sm text-black font-semibold px-6 py-2 rounded-xl mr-2 hover:bg-white transition-all shadow-sm">
                Search
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── Featured Categories ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="text-purple-400" />
              {searchQuery ? 'Search Results' : 'Featured Categories'}
            </h2>
            {!searchQuery && (
              <button
                onClick={() => startTransition(() => setShowAll(!showAll))}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                {showAll ? 'Show Less <' : 'View All >'}
              </button>
            )}
          </div>
          <QuizBoxGrid searchQuery={searchQuery} showAll={showAll} />
        </div>

        {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mt-24"
          aria-label="How YourSaathi works"
        >
          <div className="text-center mb-12">
            {/* GLASS badge */}
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-purple-500/40 bg-white/[0.06] backdrop-blur-xl text-purple-400 mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              Simple. Fast. Effective.
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white">How It Works</h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              From zero to quiz in under 10 seconds — no sign-up needed to start.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30" />
            {[
              { step: '01', emoji: '🎯', title: 'Pick a Topic', desc: 'Choose any subject — Maths, Physics, History, Coding or any custom topic you want to master.', gradFrom: 'rgba(139,92,246,0.12)', gradTo: 'rgba(109,40,217,0.06)', border: 'rgba(139,92,246,0.35)' },
              { step: '02', emoji: '🤖', title: 'AI Generates Quiz', desc: 'Our AI instantly creates 10 verified, difficulty-calibrated questions tailored exactly to your selection.', gradFrom: 'rgba(236,72,153,0.12)', gradTo: 'rgba(244,63,94,0.06)', border: 'rgba(236,72,153,0.35)' },
              { step: '03', emoji: '🪙', title: 'Learn & Earn Coins', desc: 'Answer correctly, earn coins. Accumulate enough and redeem them for real money rewards.', gradFrom: 'rgba(245,158,11,0.12)', gradTo: 'rgba(249,115,22,0.06)', border: 'rgba(245,158,11,0.35)' },
            ].map(({ step, emoji, title, desc, gradFrom, gradTo, border }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                style={{
                  background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
                  borderColor: border,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.3)`,
                }}
                className="relative rounded-2xl p-6 backdrop-blur-xl border hover:-translate-y-1 transition-transform duration-300"
              >
                {/* step number bubble */}
                <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/20 flex items-center justify-center text-xs font-black text-purple-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                  {step}
                </div>
                <div className="text-4xl mb-4 mt-2">{emoji}</div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── STATS ROW ───────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mt-24"
          aria-label="Platform statistics"
        >
          {/* GLASS stats panel */}
          <div
            className="rounded-3xl overflow-hidden backdrop-blur-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 60px rgba(0,0,0,0.4)',
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/10">
              {[
                { value: '10K+', label: 'Quizzes Generated', emoji: '📝' },
                { value: '50+', label: 'Topics Available', emoji: '📚' },
                { value: '100%', label: 'AI-Powered Content', emoji: '🤖' },
                { value: '₹0', label: 'Always Free to Use', emoji: '🎉' },
              ].map(({ value, label, emoji }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="p-8 text-center hover:bg-white/[0.04] transition-colors"
                >
                  <div className="text-3xl mb-2">{emoji}</div>
                  <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── FEATURES GRID ───────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mt-24"
          aria-label="Platform features"
        >
          <div className="text-center mb-12">
            {/* GLASS badge */}
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-emerald-500/40 bg-white/[0.06] backdrop-blur-xl text-emerald-400 mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              Everything You Need
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white">Why Students Choose YourSaathi</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '⚡', title: 'Instant Quiz Generation', desc: 'No waiting. AI crafts a fresh 10-question quiz on any topic within seconds.', glowColor: 'rgba(234,179,8,0.15)', borderHover: 'hover:border-yellow-400/50' },
              { icon: '🎓', title: 'PYQ Practice Mode', desc: 'Real previous year questions for CBSE, JEE, NEET, UPSC & SSC — exactly as they appeared.', glowColor: 'rgba(59,130,246,0.15)', borderHover: 'hover:border-blue-400/50' },
              { icon: '📊', title: 'Adaptive Difficulty', desc: 'Easy, Medium, or Hard — pick your level and the AI calibrates every question accordingly.', glowColor: 'rgba(139,92,246,0.15)', borderHover: 'hover:border-purple-400/50' },
              { icon: '🪙', title: 'Earn Real Rewards', desc: 'Every correct answer earns you coins redeemable for real money. Study and get paid.', glowColor: 'rgba(245,158,11,0.15)', borderHover: 'hover:border-amber-400/50' },
              { icon: '📈', title: 'Track Your Progress', desc: 'A detailed quiz history dashboard shows your scores, streaks, and improvement over time.', glowColor: 'rgba(16,185,129,0.15)', borderHover: 'hover:border-emerald-400/50' },
              { icon: '🔒', title: 'Safe & Secure', desc: "Your data stays private. We use industry-grade encryption and never sell your information.", glowColor: 'rgba(236,72,153,0.15)', borderHover: 'hover:border-pink-400/50' },
            ].map(({ icon, title, desc, glowColor, borderHover }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                style={{
                  background: `linear-gradient(135deg, ${glowColor}, rgba(255,255,255,0.03))`,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.25)',
                }}
                className={`group rounded-2xl p-6 backdrop-blur-xl border border-white/10 ${borderHover} hover:-translate-y-1 hover:shadow-2xl transition-all duration-300`}
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mt-24"
          aria-label="Student testimonials"
        >
          <div className="text-center mb-12">
            {/* GLASS badge */}
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-pink-500/40 bg-white/[0.06] backdrop-blur-xl text-pink-400 mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              Real Students, Real Results
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white">What Our Community Says</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Riya S.', tag: 'Class 12 · CBSE', stars: 5, avatar: 'R', quote: 'YourSaathi is literally the only app where I enjoy studying. The coins make me want to come back every day!' },
              { name: 'Arjun K.', tag: 'JEE Aspirant', stars: 5, avatar: 'A', quote: 'The PYQ drill mode is insane. I solved 10 years of JEE questions in one week without any coaching material.' },
              { name: 'Priya M.', tag: 'UPSC Preparation', stars: 5, avatar: 'P', quote: 'Free, fast, and accurate. I have tried every edtech app in India and none come close to how smooth this is.' },
            ].map(({ name, tag, stars, avatar, quote }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.3)',
                }}
                className="rounded-2xl p-6 backdrop-blur-xl border border-white/12 hover:border-purple-400/40 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(139,92,246,0.15)] transition-all duration-300"
              >
                {/* stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: stars }).map((_, si) => (
                    <span key={si} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg shadow-purple-500/30">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{name}</p>
                    <p className="text-gray-500 text-xs">{tag}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── FINAL CTA ───────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mt-24"
          aria-label="Get started with YourSaathi"
        >
          {/* outer gradient border ring */}
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-purple-500/80 via-pink-500/80 to-violet-500/80">
            {/* GLASS inner panel */}
            <div
              className="rounded-3xl px-8 py-14 md:py-20 text-center relative overflow-hidden backdrop-blur-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 40px 80px rgba(0,0,0,0.5)',
              }}
            >
              {/* blobs */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-72 h-48 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-40 h-40 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

              <span className="text-5xl block mb-4">🚀</span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                Your Preparation Starts Today
              </h2>
              <p className="text-gray-300 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                Join thousands of students who are already learning smarter, scoring higher, and earning rewards — completely free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* primary glass button */}
                <a
                  href="/pyq"
                  id="home-cta-start-quiz"
                  className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.85), rgba(236,72,153,0.85))',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 0 0 1px rgba(139,92,246,0.5), 0 12px 40px rgba(139,92,246,0.35)',
                  }}
                >
                  🎯 Start Your First Quiz
                </a>
                {/* secondary glass button */}
                <a
                  href="/pyq"
                  id="home-cta-pyq"
                  className="px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
                  }}
                >
                  📚 Practice PYQs
                </a>
              </div>
              <p className="text-gray-300 text-sm mt-6">No account required · Completely free · Earn while you learn</p>
            </div>
          </div>
        </motion.section>

      </div>
    </>
  );
}

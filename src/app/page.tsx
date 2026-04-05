'use client';

import { useState, useTransition } from 'react';
import { Search, Sparkles, TrendingUp } from 'lucide-react';
import QuizBoxGrid from '@/components/QuizBoxGrid';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import StarField from '@/components/StarField';
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
      <div className="min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-0">

        {/* ── Hero ── */}
        <div className="flex flex-col items-center text-center mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-purple-500/30 text-purple-300 text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Boost your preparation :)
          </motion.div>

          <motion.h1
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.1 },
              },
            }}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl font-extrabold tracking-tight flex flex-col items-center gap-2 sm:gap-4"
          >
            <div className="overflow-hidden flex gap-3 md:gap-4 flex-wrap justify-center">
              {['Build', 'Yourself'].map((word, i) => (
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

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-xl mt-8 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl" />
            <div className="relative flex items-center bg-[#18181B] border border-white/10 rounded-2xl overflow-hidden glass-panel focus-within:border-purple-500/50 transition-colors shadow-2xl">
              <Search className="w-6 h-6 text-gray-500 ml-4" />
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
              <button className="bg-white text-black font-semibold px-6 py-2 rounded-xl mr-2 hover:bg-gray-200 transition-colors">
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
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-purple-500/30 bg-purple-500/10 text-purple-400 mb-4">
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
              { step: '01', emoji: '🎯', title: 'Pick a Topic',        desc: 'Choose any subject — Maths, Physics, History, Coding or any custom topic you want to master.',                             color: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/25' },
              { step: '02', emoji: '🤖', title: 'AI Generates Quiz',   desc: 'Our AI instantly creates 10 verified, difficulty-calibrated questions tailored exactly to your selection.',              color: 'from-pink-500/20 to-rose-500/20',   border: 'border-pink-500/25'   },
              { step: '03', emoji: '🪙', title: 'Learn & Earn Coins', desc: 'Answer correctly, earn coins. Accumulate enough and redeem them for real money rewards.',                                  color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/25'  },
            ].map(({ step, emoji, title, desc, color, border }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className={`relative rounded-2xl p-6 bg-gradient-to-br ${color} border ${border} backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300`}
              >
                <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-[#09090b] border border-white/10 flex items-center justify-center text-xs font-black text-purple-400">
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
          <div className="rounded-3xl border border-white/8 bg-white/[0.025] backdrop-blur-sm overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/8">
              {[
                { value: '10K+', label: 'Quizzes Generated',  emoji: '📝' },
                { value: '50+',  label: 'Topics Available',   emoji: '📚' },
                { value: '100%', label: 'AI-Powered Content', emoji: '🤖' },
                { value: '₹0',   label: 'Always Free to Use', emoji: '🎉' },
              ].map(({ value, label, emoji }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="p-8 text-center hover:bg-purple-500/5 transition-colors"
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
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mb-4">
              Everything You Need
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white">Why Students Choose YourSaathi</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '⚡', title: 'Instant Quiz Generation', desc: 'No waiting. AI crafts a fresh 10-question quiz on any topic within seconds.',                   hoverBorder: 'hover:border-yellow-500/40'  },
              { icon: '🎓', title: 'PYQ Practice Mode',        desc: 'Real previous year questions for CBSE, JEE, NEET, UPSC & SSC — exactly as they appeared.',      hoverBorder: 'hover:border-blue-500/40'    },
              { icon: '📊', title: 'Adaptive Difficulty',      desc: 'Easy, Medium, or Hard — pick your level and the AI calibrates every question accordingly.',       hoverBorder: 'hover:border-purple-500/40'  },
              { icon: '🪙', title: 'Earn Real Rewards',        desc: 'Every correct answer earns you coins redeemable for real money. Study and get paid.',              hoverBorder: 'hover:border-amber-500/40'   },
              { icon: '📈', title: 'Track Your Progress',      desc: 'A detailed quiz history dashboard shows your scores, streaks, and improvement over time.',        hoverBorder: 'hover:border-emerald-500/40' },
              { icon: '🔒', title: 'Safe & Secure',            desc: "Your data stays private. We use industry-grade encryption and never sell your information.",      hoverBorder: 'hover:border-pink-500/40'    },
            ].map(({ icon, title, desc, hoverBorder }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className={`group rounded-2xl p-6 bg-white/[0.025] border border-white/8 ${hoverBorder} hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
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
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-pink-500/30 bg-pink-500/10 text-pink-400 mb-4">
              Real Students, Real Results
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white">What Our Community Says</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Riya S.',  tag: 'Class 12 · CBSE',   stars: 5, avatar: 'R', quote: 'YourSaathi is literally the only app where I enjoy studying. The coins make me want to come back every day!' },
              { name: 'Arjun K.', tag: 'JEE Aspirant',       stars: 5, avatar: 'A', quote: 'The PYQ drill mode is insane. I solved 10 years of JEE questions in one week without any coaching material.' },
              { name: 'Priya M.', tag: 'UPSC Preparation',   stars: 5, avatar: 'P', quote: 'Free, fast, and accurate. I have tried every edtech app in India and none come close to how smooth this is.' },
            ].map(({ name, tag, stars, avatar, quote }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="rounded-2xl p-6 bg-white/[0.025] border border-white/8 hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: stars }).map((_, si) => (
                    <span key={si} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{name}</p>
                    <p className="text-gray-600 text-xs">{tag}</p>
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
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 overflow-hidden">
            <div className="rounded-3xl bg-[#0d0d10] px-8 py-14 md:py-20 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-64 h-40 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
              <span className="text-5xl block mb-4">🚀</span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                Your Preparation Starts Today
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                Join thousands of students who are already learning smarter, scoring higher, and earning rewards — completely free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/quiz"
                  id="home-cta-start-quiz"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5"
                >
                  🎯 Start Your First Quiz
                </a>
                <a
                  href="/pyq"
                  id="home-cta-pyq"
                  className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all"
                >
                  📚 Practice PYQs
                </a>
              </div>
              <p className="text-gray-600 text-sm mt-6">No account required · Completely free · Earn while you learn</p>
            </div>
          </div>
        </motion.section>

      </div>
    </>
  );
}

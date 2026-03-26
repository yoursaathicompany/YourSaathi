'use client';

import { useState } from 'react';
import { Search, Sparkles, TrendingUp } from 'lucide-react';
import QuizBoxGrid from '@/components/QuizBoxGrid';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import { motion } from 'framer-motion';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  return (
    <>
      <BackgroundAnimation />
      <div className="min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-0">

        {/* Hero Section */}
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
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl font-extrabold tracking-tight flex flex-col items-center gap-2 sm:gap-4"
        >
          <div className="overflow-hidden flex gap-3 md:gap-4 flex-wrap justify-center">
            {["Build", "Yourself"].map((word, i) => (
              <motion.span
                key={`word1-${i}`}
                variants={{
                  hidden: { y: "100%", opacity: 0, rotateX: -45, filter: "blur(8px)" },
                  visible: { 
                    y: 0, 
                    opacity: 1, 
                    rotateX: 0,
                    filter: "blur(0px)",
                    transition: { type: "spring", damping: 12, stiffness: 100 }
                  }
                }}
                className="inline-block text-white text-white"
              >
                {word}
              </motion.span>
            ))}
          </div>
          <div className="overflow-hidden flex gap-3 md:gap-4 flex-wrap justify-center mt-[-0.2em]">
            {["By", "Practicing", "Quizzes"].map((word, i) => (
              <motion.span
                key={`word2-${i}`}
                variants={{
                  hidden: { y: "100%", opacity: 0, rotateX: -45, filter: "blur(8px)" },
                  visible: { 
                    y: 0, 
                    opacity: 1, 
                    rotateX: 0,
                    filter: "blur(0px)", 
                    transition: { type: "spring", damping: 12, stiffness: 100 }
                  }
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
          <div className="relative relative flex items-center bg-[#18181B] border border-white/10 rounded-2xl overflow-hidden glass-panel focus-within:border-purple-500/50 transition-colors shadow-2xl">
            <Search className="w-6 h-6 text-gray-500 ml-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you want to learn today?"
              className="w-full bg-transparent border-none py-4 px-4 text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-0"
            />
            <button className="bg-white text-black font-semibold px-6 py-2 rounded-xl mr-2 hover:bg-gray-200 transition-colors">
              Search
            </button>
          </div>
        </motion.div>
      </div>

      {/* Main Categories / Trending */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="text-purple-400" />
            {searchQuery ? 'Search Results' : 'Featured Categories'}
          </h2>
          {!searchQuery && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              {showAll ? 'Show Less <' : 'View All >'}
            </button>
          )}
        </div>

        <QuizBoxGrid searchQuery={searchQuery} showAll={showAll} />
      </div>

      </div>
    </>
  );
}

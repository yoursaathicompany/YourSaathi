/* eslint-disable */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Beaker, Globe, Code2, Calculator, Book, Feather, Target, Trophy, Map, Palette, Music, Heart, Briefcase } from 'lucide-react';
import QuizRequirementsModal from './QuizRequirementsModal';

const categories = [
  { id: 'math', name: 'Mathematics & Logic', icon: Calculator, color: 'from-blue-500 to-cyan-400', desc: 'Calculus, Algebra, Logic puzzles' },
  { id: 'science', name: 'Science & Nature', icon: Beaker, color: 'from-emerald-500 to-green-400', desc: 'Physics, Biology, Chemistry' },
  { id: 'cs', name: 'Computer Science', icon: Code2, color: 'from-purple-500 to-indigo-500', desc: 'Algorithms, Data Structures, Web' },
  { id: 'history', name: 'World History', icon: Globe, color: 'from-orange-500 to-yellow-500', desc: 'Ancient civilizations, World Wars' },
  { id: 'lit', name: 'Literature', icon: Book, color: 'from-pink-500 to-rose-400', desc: 'Classic authors, Poetry, Analysis' },
  { id: 'comp', name: 'Competitive Exams', icon: Target, color: 'from-red-500 to-orange-500', desc: 'UPSC, GRE, Engineering entrance' },
  { id: 'geo', name: 'Geography', icon: Map, color: 'from-green-500 to-emerald-400', desc: 'Countries, Capitals, Physical Geography' },
  { id: 'art', name: 'Art & Culture', icon: Palette, color: 'from-pink-500 to-fuchsia-500', desc: 'Famous Artists, Art History, Movements' },
  { id: 'music', name: 'Music', icon: Music, color: 'from-violet-500 to-purple-500', desc: 'Instruments, Music Theory, Genres' },
  { id: 'health', name: 'Health & Fitness', icon: Heart, color: 'from-rose-500 to-red-400', desc: 'Nutrition, Anatomy, Wellness' },
  { id: 'business', name: 'Business & Finance', icon: Briefcase, color: 'from-amber-500 to-orange-400', desc: 'Economics, Management, Markets' },
];

interface QuizBoxGridProps {
  searchQuery?: string;
  showAll?: boolean;
}

export default function QuizBoxGrid({ searchQuery = '', showAll = false }: QuizBoxGridProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cat.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedCategories = showAll || searchQuery ? filteredCategories : filteredCategories.slice(0, 6);

  return (
    <>
      {displayedCategories.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white/[0.02] border border-white/5 rounded-2xl w-full">
          No categories found for "{searchQuery}". Try a different search!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {displayedCategories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedTopic(cat.name)}
              className=" card-hover group cursor-pointer relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 glass-panel flex flex-col items-start gap-4"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity translate-x-4 -translate-y-4">
                <Icon className="w-24 h-24" />
              </div>

              <div className={`p-3 rounded-xl bg-gradient-to-br ${cat.color} shadow-lg`}>
                <Icon className="w-6 h-6 text-white dark:text-gray-900" />
              </div>

              <div className="z-10 mt-2 flex-grow">
                <h3 className="text-xl font-bold text-gray-600 mb-1 group-hover:text-purple-400 transition-colors">{cat.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{cat.desc}</p>
              </div>

              <div className="z-10 flex items-center justify-between w-full mt-2 pt-4 border-t border-white/5">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> popular
                </span>
                <span className="text-xs font-medium text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Generate <BrainCircuit className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          );
        })}
        </div>
      )}

      <QuizRequirementsModal
        isOpen={!!selectedTopic}
        onClose={() => setSelectedTopic(null)}
        initialTopic={selectedTopic || ''}
      />
    </>
  );
}

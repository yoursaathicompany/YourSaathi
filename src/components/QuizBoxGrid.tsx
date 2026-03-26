/* eslint-disable */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, BookOpen, Trophy } from 'lucide-react';
import Link from 'next/link';
import { topicsData } from '@/data/topics';

interface QuizBoxGridProps {
  searchQuery?: string;
  showAll?: boolean;
}

export default function QuizBoxGrid({ searchQuery = '', showAll = false }: QuizBoxGridProps) {
  const categoriesList = Object.values(topicsData);

  const filteredCategories = categoriesList.filter(cat => 
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
              <Link href={`/topics/${cat.id}`} key={cat.id} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card-hover group cursor-pointer relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 glass-panel flex flex-col items-start gap-4 h-full"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity translate-x-4 -translate-y-4">
                    <Icon className="w-24 h-24" />
                  </div>

                  <div className={`p-3 rounded-xl bg-gradient-to-br ${cat.color} shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white dark:text-gray-900" />
                  </div>

                  <div className="z-10 mt-2 flex-grow">
                    <h3 className="text-xl font-bold text-gray-200 mb-1 group-hover:text-purple-400 transition-colors">{cat.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{cat.desc}</p>
                  </div>

                  <div className="z-10 flex items-center justify-between w-full mt-2 pt-4 border-t border-white/5">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> popular
                    </span>
                    <span className="text-xs font-bold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                      Study Guide <BookOpen className="w-3 h-3 ml-1" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

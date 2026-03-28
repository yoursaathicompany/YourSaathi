'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Calendar } from 'lucide-react';
import type { PYQEntry } from '@/lib/pyqData';
import { LEVEL_LABELS, LEVEL_COLORS } from '@/lib/pyqData';

interface PYQCardProps {
  entry: PYQEntry;
  index: number;
}

export default function PYQCard({ entry, index }: PYQCardProps) {
  const yearRange = entry.availableYears.length > 0
    ? `${Math.min(...entry.availableYears)} – ${Math.max(...entry.availableYears)}`
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-[#18181b] overflow-hidden hover:border-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl"
    >
      {/* Gradient top bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${entry.color}`} />

      {/* Glow on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${entry.color} blur-3xl -z-10 scale-150`} style={{ opacity: 0 }} />

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${entry.color} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
            {entry.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white leading-tight line-clamp-2 mb-1">
              {entry.title}
            </h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${LEVEL_COLORS[entry.level]}`}>
              {LEVEL_LABELS[entry.level]}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-400 leading-relaxed mb-5 line-clamp-2 flex-1">
          {entry.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-5 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {entry.totalQuestions.toLocaleString()}+ questions
          </span>
          {yearRange && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {yearRange}
            </span>
          )}
        </div>

        {/* Chapters preview */}
        {entry.chapters && entry.chapters.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {entry.chapters.slice(0, 4).map((ch) => (
              <span key={ch} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                {ch}
              </span>
            ))}
            {entry.chapters.length > 4 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-500">
                +{entry.chapters.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/pyq/${entry.id}`}
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r ${entry.color} text-white text-sm font-bold transition-all duration-200 hover:opacity-90 hover:shadow-lg group-hover:scale-[1.02]`}
        >
          Start Practice
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

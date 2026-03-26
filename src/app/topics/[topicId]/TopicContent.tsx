'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TopicData } from '@/data/topics';
import QuizRequirementsModal from '@/components/QuizRequirementsModal';
import { BrainCircuit, BookOpen, GraduationCap, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function TopicContent({ topic }: { topic: TopicData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const Icon = topic.icon;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden"
      >
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${topic.color} rounded-full blur-3xl opacity-20 -mr-20 -mt-20`} />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className={`p-6 rounded-2xl bg-gradient-to-br ${topic.color} shadow-2xl`}>
            <Icon className="w-16 h-16 text-white" />
          </div>
          
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              {topic.name}
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              {topic.desc}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 px-8 py-3 rounded-xl bg-white text-black font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Generate AI Quiz <BrainCircuit className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Introduction & Lessons) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Introduction */}
          <section className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <BookOpen className="text-purple-400" /> Topic Overview
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              {topic.content.introduction}
            </p>
          </section>

          {/* Subtopics / Lessons */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 ml-2">
              <GraduationCap className="text-emerald-400" /> Core Lessons
            </h2>
            <div className="space-y-4">
              {topic.content.subtopics.map((sub, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" /> {sub.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed pl-7">
                    {sub.content}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Sample Quizzes (if available) */}
          {topic.content.sampleQuizzes && (
            <section className="space-y-6 pt-4">
              <h2 className="text-2xl font-bold flex items-center gap-3 ml-2">
                <BrainCircuit className="text-pink-400" /> Sample Questions & Explanations
              </h2>
              <div className="grid gap-6">
                {topic.content.sampleQuizzes.map((quiz, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 bg-white/[0.01]">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg text-gray-200 font-medium font-serif leading-relaxed">
                        Q: {quiz.question}
                      </h3>
                      <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-gray-300 font-semibold uppercase tracking-wider">
                        {quiz.difficulty}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {quiz.options.map((opt, i) => (
                        <div key={i} className={`p-3 rounded-xl border ${opt === quiz.answer ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-white/5 bg-white/5 text-gray-400'}`}>
                          {opt}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 font-medium flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>
                        <span className="font-bold text-white block mb-1">Answer: {quiz.answer}</span>
                        {quiz.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </motion.div>

        {/* Sidebar (Study Guide) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {topic.content.studyGuide && (
            <div className="glass-panel p-6 rounded-2xl border border-white/5 sticky top-24">
              <h3 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">
                {topic.content.studyGuide.title}
              </h3>
              <ul className="space-y-4">
                {topic.content.studyGuide.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-gray-300 leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-4 text-center">Ready to test your knowledge?</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`w-full py-3 rounded-xl bg-gradient-to-r ${topic.color} text-white font-bold shadow-lg opacity-90 hover:opacity-100 transition-opacity`}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          )}
        </motion.div>

      </div>

      <QuizRequirementsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTopic={topic.name}
      />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function QuizRequirementsModal({ 
  isOpen, 
  onClose, 
  initialTopic 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  initialTopic?: string;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [topic, setTopic] = useState(initialTopic || '');
  const [difficulty, setDifficulty] = useState('medium');
  const [studentLevel, setStudentLevel] = useState('class10');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (status !== 'authenticated') {
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.href));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/antigravity/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          difficulty,
          student_level: studentLevel,
          number_of_questions: Number(numQuestions),
          question_types: ['mcq_single'],
          language: 'English',
          include_hints: true,
          include_sources: false,
          allow_media: false,
          advanced_options: {
            shuffle_choices: true,
            include_explanations: true,
            strict_scoring: false
          }
        })
      });

      if (!res.ok) throw new Error('Failed to generate');
      const data = await res.json();
      
      if (data.quiz_id) {
        router.push(`/quiz/${data.quiz_id}`);
      } else {
        throw new Error('No quiz ID returned');
      }
      
    } catch (err) {
      console.error(err);
      alert('Failed to generate quiz. Check the console and try again.');
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#18181B] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden glass-panel"
        >
          <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Generate Quiz
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-300">Topic</label>
              <div className="relative">
                <BookOpen className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" 
                  placeholder="e.g. Photosynthesis, React Hooks, World War II"
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-300">Difficulty</label>
                <select 
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-300">Student Level</label>
                <select 
                  value={studentLevel}
                  onChange={e => setStudentLevel(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none"
                >
                  <option value="class6">Class 6-8</option>
                  <option value="class10">Class 9-12</option>
                  <option value="college">College</option>
                  <option value="upsc">UPSC / Comp</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-300">
                Number of Questions ({numQuestions})
              </label>
              <input 
                type="range" 
                min="1" max="25" 
                value={numQuestions}
                onChange={e => setNumQuestions(Number(e.target.value))}
                className="w-full accent-purple-500 bg-gray-700 h-2 rounded-lg appearance-none cursor-pointer" 
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>25</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex justify-center items-center mt-4 disabled:opacity-50"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Generating AI Quiz...</>
              ) : status === 'unauthenticated' ? (
                'Sign in to Generate'
              ) : (
                'Generate Magic'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

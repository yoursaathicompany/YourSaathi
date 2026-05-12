'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, Send, Loader2, Menu, X } from 'lucide-react';
import type { MockTestQuestion } from '@/types/mock-test';

interface SessionData {
  exam_name: string;
  test_title: string;
  subject: string;
  difficulty: string;
  total_questions: number;
  time_limit_minutes: number;
  questions: MockTestQuestion[];
}

export default function PlayPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load session data from API
  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/mock-test/session/${sessionId}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError(d.error); setLoading(false); return; }
        setSession(d);
        setTimeLeft(d.time_limit_minutes * 60);
        setLoading(false);
        startTimeRef.current = Date.now();
      })
      .catch(() => { setError('Failed to load test session.'); setLoading(false); });
  }, [sessionId]);

  // Countdown timer
  const handleSubmit = useCallback(async (auto = false) => {
    if (submitting) return;
    if (!auto && !showSubmitModal) { setShowSubmitModal(true); return; }
    setShowSubmitModal(false);
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    try {
      const res = await fetch('/api/mock-test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, answers, time_taken_seconds: timeTaken }),
      });
      const data = await res.json();
      if (res.ok && data.attempt_id) {
        router.push(`/mock-test/result/${sessionId}?attempt=${data.attempt_id}`);
      } else {
        setError(data.error || 'Failed to submit test.'); setSubmitting(false);
      }
    } catch { setError('Network error. Please try again.'); setSubmitting(false); }
  }, [submitting, showSubmitModal, sessionId, answers, router]);

  useEffect(() => {
    if (!session || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); handleSubmit(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [session, handleSubmit]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) return (
    <div className="fixed inset-0 bg-[#09090B] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
      <p className="text-gray-400 text-lg">Loading your test…</p>
    </div>
  );

  if (error || !session) return (
    <div className="fixed inset-0 bg-[#09090B] flex flex-col items-center justify-center gap-4">
      <AlertTriangle className="w-12 h-12 text-red-400" />
      <p className="text-white text-lg font-bold">{error || 'Session not found'}</p>
      <button onClick={() => router.push('/mock-test')} className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-500 transition-colors">Back to Mock Tests</button>
    </div>
  );

  const q = session.questions[currentQ];
  const answered = Object.keys(answers).length;
  const isLowTime = timeLeft <= 300;

  return (
    <div className="fixed inset-0 bg-[#09090B] overflow-hidden flex flex-col">

      {/* Top Bar */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${isLowTime ? 'border-red-500/30 bg-red-950/20' : 'border-white/10 bg-[#18181B]'} flex-shrink-0`}>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowPalette(p => !p)} className="md:hidden p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white">
            <Menu className="w-4 h-4" />
          </button>
          <div>
            <p className="text-white font-bold text-sm leading-tight">{session.exam_name}</p>
            <p className="text-gray-500 text-xs">{session.subject} • {session.difficulty}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg ${isLowTime ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 text-white'}`}>
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm hidden sm:block">{answered}/{session.total_questions} answered</span>
          <button onClick={() => handleSubmit(false)} disabled={submitting}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors">
            <Send className="w-4 h-4" /> Submit
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Question Panel */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-bold border border-purple-500/30">
                    Q{q.question_number} / {session.total_questions}
                  </span>
                  {answers[String(q.question_number)] && (
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/30">
                      <CheckCircle className="inline w-3 h-3 mr-1" />Answered
                    </span>
                  )}
                </div>

                <p className="text-white text-xl font-semibold leading-relaxed mb-8">{q.question}</p>

                <div className="space-y-3">
                  {(['A', 'B', 'C', 'D'] as const).map(opt => {
                    const selected = answers[String(q.question_number)] === opt;
                    return (
                      <motion.button key={opt} onClick={() => setAnswers(prev => ({ ...prev, [String(q.question_number)]: opt }))}
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${selected ? 'border-purple-500/70 bg-purple-500/20 text-white' : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/25 hover:bg-white/10'}`}>
                        <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${selected ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400'}`}>
                          {opt}
                        </span>
                        <span className="flex-1 pt-0.5 leading-relaxed">{q.options[opt]}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center justify-between mt-8">
                  <button onClick={() => setCurrentQ(p => Math.max(0, p - 1))} disabled={currentQ === 0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold">
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <span className="text-gray-600 text-sm">{currentQ + 1} of {session.total_questions}</span>
                  <button onClick={() => setCurrentQ(p => Math.min(session.total_questions - 1, p + 1))} disabled={currentQ === session.total_questions - 1}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Question Palette — desktop sidebar */}
        <div className={`${showPalette ? 'fixed inset-0 z-50 md:relative md:inset-auto' : 'hidden md:flex'} md:w-64 flex flex-col border-l border-white/10 bg-[#18181B]`}>
          {showPalette && (
            <div className="absolute inset-0 bg-black/60 md:hidden" onClick={() => setShowPalette(false)} />
          )}
          <div className="relative z-10 w-64 ml-auto md:ml-0 h-full flex flex-col bg-[#18181B] border-l border-white/10">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white font-bold text-sm">Question Palette</h3>
              <button onClick={() => setShowPalette(false)} className="md:hidden text-gray-400 hover:text-white p-1"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-5 gap-2">
                {session.questions.map((_, idx) => {
                  const qNum = String(idx + 1);
                  const isAnswered = !!answers[qNum];
                  const isCurrent = idx === currentQ;
                  return (
                    <button key={idx} onClick={() => { setCurrentQ(idx); setShowPalette(false); }}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${isCurrent ? 'bg-purple-600 text-white ring-2 ring-purple-400' : isAnswered ? 'bg-green-500/30 text-green-400 border border-green-500/40' : 'bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10'}`}>
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="p-4 border-t border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500/40" /> Answered ({answered})
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-4 h-4 rounded bg-white/5 border border-white/10" /> Not Answered ({session.total_questions - answered})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-[#18181B] border border-white/15 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">Submit Test?</h3>
              <p className="text-gray-400 text-sm mb-1">You have answered <span className="text-white font-semibold">{answered}</span> out of <span className="text-white font-semibold">{session.total_questions}</span> questions.</p>
              {answered < session.total_questions && (
                <p className="text-yellow-400 text-xs mb-4 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {session.total_questions - answered} unanswered questions will be marked wrong.</p>
              )}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowSubmitModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 font-semibold transition-colors">Cancel</button>
                <button onClick={() => handleSubmit(false)} disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Confirm Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {error && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-sm shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}

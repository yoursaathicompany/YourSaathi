'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

/* ═══════════════════════════════════════════════════════════════════════════
   YourSaathi — 30-second Cinematic Ad Video
   Architecture:
     • 'waiting'  → tap-to-start overlay (satisfies browser autoplay policy)
     • 'playing'  → voice.onend drives scene advancement (perfect sync)
     • 'exit'     → fade out
   Voice: Web Speech API, chained via onend — NO cancel between scenes
   ═══════════════════════════════════════════════════════════════════════════ */

interface Scene {
  id: number;
  voice: string;
  headline: string;
  sub: string;
  accent: string;
  bg: string;
  badge: string;
}

const SCENES: Scene[] = [
  {
    id: 1,
    badge: 'Introducing',
    voice: "Struggling to prepare for your exams? Meet YourSaathi — India's smartest AI-powered learning companion.",
    headline: 'Meet YourSaathi',
    sub: "India's Smartest AI Learning Companion",
    accent: '#a78bfa',
    bg: 'radial-gradient(ellipse at 50% 0%, #200644 0%, #09090b 65%)',
  },
  {
    id: 2,
    badge: 'Feature 01',
    voice: "Just type any topic — Physics, History, Coding — anything! And in seconds, get a fully custom quiz made just for you.",
    headline: 'Type Any Topic → Get a Quiz',
    sub: 'AI generates 10 tailored questions in under 3 seconds',
    accent: '#38bdf8',
    bg: 'radial-gradient(ellipse at 30% 50%, #0c2340 0%, #09090b 65%)',
  },
  {
    id: 3,
    badge: 'Feature 02',
    voice: "Practice real Previous Year Questions from CBSE, JEE, NEET, UPSC, SSC, and more — all in one place.",
    headline: 'Real PYQ Practice',
    sub: 'CBSE · JEE · NEET · UPSC · SSC · and more',
    accent: '#fb923c',
    bg: 'radial-gradient(ellipse at 70% 30%, #2a1200 0%, #09090b 65%)',
  },
  {
    id: 4,
    badge: 'Feature 03',
    voice: "Answer correctly and earn real coins — coins you can actually redeem for real cash rewards. Learning has never paid off like this!",
    headline: '🪙 Earn Real Coins',
    sub: 'Every correct answer = coins you can redeem for cash',
    accent: '#facc15',
    bg: 'radial-gradient(ellipse at 50% 70%, #1a1400 0%, #09090b 65%)',
  },
  {
    id: 5,
    badge: 'Community',
    voice: "Over ten thousand students across India are already learning, practicing, and earning with YourSaathi every single day.",
    headline: '10,000+ Students',
    sub: 'Across India — learning, practicing & earning daily',
    accent: '#34d399',
    bg: 'radial-gradient(ellipse at 20% 60%, #001a10 0%, #09090b 65%)',
  },
  {
    id: 6,
    badge: 'Join Now',
    voice: "Sign up free in just ten seconds. Start learning. Start earning. Your success starts with YourSaathi.",
    headline: 'Start Free Today 🚀',
    sub: 'Join thousands of toppers — no credit card needed',
    accent: '#c084fc',
    bg: 'radial-gradient(ellipse at 50% 50%, #1a0533 0%, #09090b 50%)',
  },
];

/* ─── Per-scene visual ─── */
function SceneVisual({ id, accent }: { id: number; accent: string }) {
  switch (id) {
    case 1:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, animation: 'ysa-pop 0.7s cubic-bezier(0.34,1.56,0.64,1) both' }}>
          <div style={{ borderRadius: '50%', padding: 6, animation: 'ysa-glow 2.5s ease-in-out infinite', boxShadow: `0 0 60px 16px ${accent}55` }}>
            <Image src="/logo.png" alt="YourSaathi" width={110} height={110} style={{ borderRadius: '50%' }} priority />
          </div>
        </div>
      );
    case 2:
      return (
        <div style={{ animation: 'ysa-slide-up 0.6s ease both', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 16, padding: '20px 28px', width: '100%', maxWidth: 400 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: '1.3rem' }}>🔍</span>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '8px 14px', color: '#fff', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              Newton's laws of motion...
            </div>
          </div>
          {["Which law explains inertia?", "Force = Mass × ?", "Action & Reaction — True/False"].map((q, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)', animation: `ysa-slide-up 0.5s ${i * 160 + 300}ms ease both`, fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>
              <span style={{ color: accent, fontWeight: 700 }}>Q{i + 1}.</span> {q}
            </div>
          ))}
        </div>
      );
    case 3:
      return (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', animation: 'ysa-slide-up 0.6s ease both' }}>
          {[
            { tag: 'CBSE', icon: '📘', color: '#3b82f6' },
            { tag: 'JEE',  icon: '⚗️', color: '#f59e0b' },
            { tag: 'NEET', icon: '🧬', color: '#10b981' },
            { tag: 'UPSC', icon: '🏛️', color: '#8b5cf6' },
            { tag: 'SSC',  icon: '📋', color: '#ef4444' },
          ].map((b, i) => (
            <div key={b.tag} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: `${b.color}18`, border: `1px solid ${b.color}44`, borderRadius: 14, padding: '14px 20px', animation: `ysa-pop 0.5s ${i * 120}ms cubic-bezier(0.34,1.56,0.64,1) both`, minWidth: 72 }}>
              <span style={{ fontSize: '1.8rem' }}>{b.icon}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: b.color }}>{b.tag}</span>
            </div>
          ))}
        </div>
      );
    case 4:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, animation: 'ysa-slide-up 0.6s ease both' }}>
          <div style={{ fontSize: '4rem', animation: 'ysa-bounce 0.8s ease both' }}>🪙</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['+5', '+10', '+15', '+20'].map((v, i) => (
              <div key={v} style={{ background: 'rgba(250,204,21,0.15)', border: '1px solid rgba(250,204,21,0.4)', borderRadius: 10, padding: '8px 14px', color: '#facc15', fontWeight: 700, fontSize: '0.85rem', animation: `ysa-pop 0.5s ${i * 150 + 200}ms cubic-bezier(0.34,1.56,0.64,1) both` }}>{v} coins</div>
            ))}
          </div>
          <div style={{ background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: 12, padding: '10px 24px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
            Redeem for <span style={{ color: '#facc15', fontWeight: 700 }}>real cash</span> anytime 💰
          </div>
        </div>
      );
    case 5:
      return (
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', animation: 'ysa-slide-up 0.6s ease both' }}>
          {[
            { n: '10,000+', l: 'Active Students', icon: '👩‍🎓' },
            { n: '5L+',     l: 'Quizzes Taken',  icon: '📝'   },
            { n: '₹50K+',  l: 'Coins Redeemed', icon: '🏆'   },
          ].map((s, i) => (
            <div key={s.l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 16, padding: '18px 22px', animation: `ysa-pop 0.6s ${i * 180}ms cubic-bezier(0.34,1.56,0.64,1) both`, minWidth: 110 }}>
              <span style={{ fontSize: '2rem' }}>{s.icon}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: accent }}>{s.n}</span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', textAlign: 'center' }}>{s.l}</span>
            </div>
          ))}
        </div>
      );
    case 6:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, animation: 'ysa-pop 0.7s cubic-bezier(0.34,1.56,0.64,1) both' }}>
          <a
            href="/login"
            id="ys-ad-cta-btn"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 44px',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)',
              color: '#fff', fontWeight: 800, fontSize: '1.15rem',
              borderRadius: 50, textDecoration: 'none', letterSpacing: '0.02em',
              boxShadow: '0 8px 40px rgba(168,85,247,0.55)',
              animation: 'ysa-glow-cta 2s ease-in-out infinite',
            }}
          >
            🚀 Get Started — It&apos;s Free
          </a>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: 0 }}>No credit card · 10-second signup</p>
        </div>
      );
    default:
      return null;
  }
}

/* ─── Floating Particles ─── */
function Particles({ accent }: { accent: string }) {
  const pts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${(i * 4.7 + 3) % 94}%`,
    top:  `${(i * 7.1 + 6) % 86}%`,
    size: 2 + (i % 3),
    dur:  2.2 + (i % 6) * 0.5,
    delay: (i * 0.32) % 3.5,
    pdx:  `${-40 + (i * 19) % 80}px`,
    color: i % 2 === 0 ? accent : 'rgba(255,255,255,0.3)',
  }));
  return (
    <>
      {pts.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: p.left, top: p.top,
          width: p.size, height: p.size, borderRadius: '50%',
          background: p.color, opacity: 0,
          ['--pdx' as string]: p.pdx,
          animation: `ysa-particle ${p.dur}s ${p.delay}s ease-out infinite`,
          pointerEvents: 'none',
        }} />
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */

type Phase = 'hidden' | 'waiting' | 'playing' | 'exit';

export default function IntroVideo() {
  const { data: session, status } = useSession();

  const [phase, setPhase]       = useState<Phase>('hidden');
  const [sceneIdx, setSceneIdx] = useState(0);
  const [muted, setMuted]       = useState(false);

  /* refs that survive re-renders without triggering them */
  const synthRef         = useRef<SpeechSynthesis | null>(null);
  const preferredVoice   = useRef<SpeechSynthesisVoice | null>(null);
  const muteRef          = useRef(false);
  const sceneIdxRef      = useRef(0);   // shadow of sceneIdx for use inside callbacks
  const dismissCalledRef = useRef(false);

  /* ── Gate: only show to unauthenticated, once per session ── */
  useEffect(() => {
    if (status === 'loading') return;
    if (session?.user) return;
    const seen = sessionStorage.getItem('ys_ad_v2_seen');
    if (seen) return;
    sessionStorage.setItem('ys_ad_v2_seen', '1');

    /* Warm up the speech engine and cache the best voice.
       This must happen before the user taps so the voice is ready instantly. */
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const pickVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        preferredVoice.current =
          voices.find(v => /en[-_](IN|US|GB)/i.test(v.lang) && /google/i.test(v.name)) ||
          voices.find(v => /en[-_](IN|US|GB)/i.test(v.lang))                           ||
          voices.find(v => /en/i.test(v.lang))                                          ||
          voices[0]                                                                      ||
          null;
      };
      if (window.speechSynthesis.getVoices().length > 0) pickVoice();
      else window.speechSynthesis.addEventListener('voiceschanged', pickVoice, { once: true });
    }

    setPhase('waiting');
  }, [status, session]);

  /* ── Cleanup on unmount ── */
  useEffect(() => {
    return () => {
      muteRef.current = true;
      synthRef.current?.cancel();
    };
  }, []);

  /* ── Dismiss helper ── */
  const dismiss = useCallback(() => {
    if (dismissCalledRef.current) return;
    dismissCalledRef.current = true;
    muteRef.current = true;
    synthRef.current?.cancel();
    setPhase('exit');
    setTimeout(() => setPhase('hidden'), 700);
  }, []);

  /* ── Voice chain: each utterance triggers the next via onend.
        MUST be called from within a user-gesture handler (click/tap)
        to satisfy the browser's autoplay policy.                      ── */
  const speakChain = useCallback((fromIdx: number) => {
    const synth = synthRef.current;
    if (!synth) return;

    // Cancel anything lingering, then start fresh
    synth.cancel();

    function speakAt(idx: number) {
      /* Done? Auto-dismiss a beat after the last word */
      if (idx >= SCENES.length) {
        setTimeout(dismiss, 800);
        return;
      }
      if (muteRef.current) return;

      /* Update the visible scene */
      sceneIdxRef.current = idx;
      setSceneIdx(idx);

      const utt = new SpeechSynthesisUtterance(SCENES[idx].voice);
      if (preferredVoice.current) utt.voice = preferredVoice.current;
      utt.rate   = 0.93;   // clear, unhurried delivery
      utt.pitch  = 1.0;
      utt.volume = 1.0;

      /* Chain: when this utterance ends, speak the next one */
      utt.onend  = () => { if (!muteRef.current) setTimeout(() => speakAt(idx + 1), 350); };
      utt.onerror = (e) => {
        if (e.error !== 'canceled' && !muteRef.current) setTimeout(() => speakAt(idx + 1), 350);
      };

      synth.speak(utt);
    }

    speakAt(fromIdx);
  }, [dismiss]);

  /* ── User taps the "Play" screen → start everything ── */
  const handleStart = useCallback(() => {
    if (phase !== 'waiting') return;
    dismissCalledRef.current = false;
    muteRef.current = false;
    setSceneIdx(0);
    sceneIdxRef.current = 0;
    setPhase('playing');

    /* speakChain is called INSIDE the click handler — browser allows this */
    speakChain(0);
  }, [phase, speakChain]);

  /* ── Mute toggle ── */
  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    muteRef.current = next;
    if (next) {
      synthRef.current?.cancel();
    } else {
      /* Resume chain from the scene currently on screen */
      speakChain(sceneIdxRef.current);
    }
  }, [muted, speakChain]);

  if (phase === 'hidden') return null;

  const scene = SCENES[sceneIdx];
  const progressPct = ((sceneIdx) / SCENES.length) * 100;

  return (
    <>
      <style>{`
        @keyframes ysa-pop {
          from { opacity: 0; transform: scale(0.72); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes ysa-slide-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ysa-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes ysa-glow {
          0%, 100% { box-shadow: 0 0 50px 10px rgba(167,139,250,0.3); }
          50%       { box-shadow: 0 0 90px 24px rgba(167,139,250,0.6); }
        }
        @keyframes ysa-bounce {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.2) rotate(5deg);  opacity: 1; }
          100% { transform: scale(1)   rotate(0deg);  opacity: 1; }
        }
        @keyframes ysa-glow-cta {
          0%, 100% { box-shadow: 0 8px 40px rgba(168,85,247,0.55); }
          50%       { box-shadow: 0 12px 60px rgba(168,85,247,0.9); }
        }
        @keyframes ysa-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes ysa-particle {
          0%   { opacity: 0.8; transform: translateY(0) scale(1); }
          100% { opacity: 0;   transform: translateY(-100px) translateX(var(--pdx)) scale(0.2); }
        }
        @keyframes ysa-scan {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(600%);  }
        }
        @keyframes ysa-pulse-ring {
          0%   { transform: scale(0.9); opacity: 0.8; }
          70%  { transform: scale(1.3); opacity: 0;   }
          100% { transform: scale(0.9); opacity: 0;   }
        }
        .ysa-shimmer-title {
          background: linear-gradient(90deg, var(--ac,#a78bfa) 0%, #fff 45%, var(--ac,#a78bfa) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: ysa-shimmer 2.8s linear infinite;
        }
      `}</style>

      {/* ══ ROOT OVERLAY ══ */}
      <div
        id="ys-intro-ad"
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: phase === 'waiting'
            ? 'radial-gradient(ellipse at 50% 30%, #1a0533 0%, #09090b 65%)'
            : scene.bg,
          transition: 'background 1.2s ease, opacity 0.7s ease',
          opacity: phase === 'exit' ? 0 : 1,
          overflow: 'hidden',
        }}
      >
        {/* grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
        }} />

        {/* scan line */}
        {phase === 'playing' && (
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, ${scene.accent}66, transparent)`,
            pointerEvents: 'none',
            animation: 'ysa-scan 4s ease-in-out infinite',
          }} />
        )}

        <Particles accent={phase === 'playing' ? scene.accent : '#8b5cf6'} />

        {/* ══════════════════════════════════════════
            WAITING PHASE — tap to start
        ══════════════════════════════════════════ */}
        {phase === 'waiting' && (
          <div
            onClick={handleStart}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
              cursor: 'pointer', userSelect: 'none',
              animation: 'ysa-fade-in 0.6s ease both',
              textAlign: 'center', padding: '0 24px',
            }}
          >
            {/* logo */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: -12, borderRadius: '50%',
                border: '2px solid rgba(167,139,250,0.5)',
                animation: 'ysa-pulse-ring 1.8s ease-out infinite',
              }} />
              <div style={{ borderRadius: '50%', padding: 6, boxShadow: '0 0 60px 16px rgba(167,139,250,0.4)', animation: 'ysa-glow 2.5s ease-in-out infinite' }}>
                <Image src="/logo.png" alt="YourSaathi" width={100} height={100} style={{ borderRadius: '50%', display: 'block' }} priority />
              </div>
            </div>

            <div style={{ fontSize: 'clamp(2rem, 6vw, 3.2rem)', fontWeight: 900, lineHeight: 1, '--ac': '#a78bfa' } as React.CSSProperties} className="ysa-shimmer-title">
              YourSaathi
            </div>

            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(0.9rem, 2.2vw, 1.15rem)', margin: 0 }}>
              India&apos;s AI-powered quiz &amp; learning companion
            </p>

            {/* play button */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              marginTop: 12,
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                padding: '14px 36px',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                borderRadius: 50, color: '#fff', fontWeight: 800,
                fontSize: '1.05rem', letterSpacing: '0.02em',
                boxShadow: '0 8px 32px rgba(124,58,237,0.5)',
                animation: 'ysa-glow-cta 2s ease-in-out infinite',
              }}>
                <span style={{ fontSize: '1.2rem' }}>▶</span>
                Watch with Voice
              </div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', margin: 0 }}>
                Tap anywhere to start (~30 seconds)
              </p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            PLAYING PHASE — scenes
        ══════════════════════════════════════════ */}
        {phase === 'playing' && (
          <div style={{
            position: 'relative', zIndex: 2,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 22,
            padding: '0 24px', maxWidth: 600, width: '100%', textAlign: 'center',
          }}>
            {/* badge */}
            <div key={`badge-${scene.id}`} style={{
              background: `${scene.accent}22`,
              border: `1px solid ${scene.accent}55`,
              borderRadius: 20, padding: '4px 14px',
              color: scene.accent, fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              animation: 'ysa-pop 0.4s ease both',
            }}>
              {scene.badge}
            </div>

            {/* visual */}
            <div key={`vis-${scene.id}`} style={{ width: '100%' }}>
              <SceneVisual id={scene.id} accent={scene.accent} />
            </div>

            {/* headline */}
            <div
              key={`hl-${scene.id}`}
              className="ysa-shimmer-title"
              style={{
                fontSize: 'clamp(1.6rem, 5vw, 2.8rem)',
                fontWeight: 900, lineHeight: 1.15,
                '--ac': scene.accent,
                animation: 'ysa-slide-up 0.5s 0.1s ease both',
              } as React.CSSProperties}
            >
              {scene.headline}
            </div>

            {/* sub */}
            <div key={`sub-${scene.id}`} style={{
              color: 'rgba(255,255,255,0.62)',
              fontSize: 'clamp(0.88rem, 2vw, 1.1rem)',
              lineHeight: 1.5, maxWidth: 480,
              animation: 'ysa-slide-up 0.5s 0.25s ease both',
            }}>
              {scene.sub}
            </div>
          </div>
        )}

        {/* ══ BOTTOM HUD (shown during playback) ══ */}
        {phase === 'playing' && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%)',
            padding: '28px 28px 20px',
            zIndex: 3,
          }}>
            {/* scene dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: 12 }}>
              {SCENES.map((s, i) => (
                <div key={s.id} style={{
                  width: i === sceneIdx ? 22 : 7, height: 7,
                  borderRadius: 4,
                  transition: 'all 0.4s ease',
                  background: i === sceneIdx
                    ? scene.accent
                    : i < sceneIdx
                      ? `${scene.accent}66`
                      : 'rgba(255,255,255,0.18)',
                }} />
              ))}
            </div>

            {/* progress bar */}
            <div style={{ height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{
                height: '100%',
                width: `${progressPct}%`,
                background: `linear-gradient(90deg, #a78bfa, ${scene.accent})`,
                borderRadius: 4,
                transition: 'width 0.6s ease',
              }} />
            </div>

            {/* controls row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Image src="/logo.png" alt="YourSaathi" width={26} height={26} style={{ borderRadius: '50%', opacity: 0.85 }} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>YourSaathi</span>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.38)', marginLeft: 2 }}>Ad</span>
              </div>

              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>
                {sceneIdx + 1} / {SCENES.length}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  id="ys-ad-mute"
                  onClick={toggleMute}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 20, padding: '5px 14px',
                    color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', cursor: 'pointer',
                  }}
                >
                  {muted ? '🔇 Muted' : '🔊 Voice'}
                </button>
                <button
                  id="ys-ad-skip"
                  onClick={dismiss}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 20, padding: '5px 16px',
                    color: '#fff', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600,
                  }}
                >
                  Skip ›
                </button>
              </div>
            </div>
          </div>
        )}

        {/* top watermark */}
        <div style={{
          position: 'absolute', top: 18, left: 22,
          fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.08em', pointerEvents: 'none',
        }}>
          yoursaathi.site
        </div>

        {/* skip from waiting screen too */}
        {phase === 'waiting' && (
          <button
            id="ys-ad-skip-wait"
            onClick={dismiss}
            style={{
              position: 'absolute', top: 18, right: 20,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20, padding: '5px 16px',
              color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', cursor: 'pointer',
            }}
          >
            Skip ›
          </button>
        )}
      </div>
    </>
  );
}

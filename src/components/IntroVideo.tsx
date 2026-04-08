'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

/* ─────────────────────────────────────────────────────────────────────────────
   YourSaathi — 30-second Cinematic Ad Video
   • 6 scenes, each with its own animation + voiceover line
   • Uses Web Speech API (SpeechSynthesis) — zero external dependency
   • Shown once per browser session to unauthenticated users only
   ───────────────────────────────────────────────────────────────────────────── */

const TOTAL_DURATION = 31_000; // ms

interface Scene {
  id: number;
  startMs: number;
  durationMs: number;
  voice: string;            // spoken text for this scene
  headline: string;
  sub: string;
  accent: string;
  bg: string;
}

const SCENES: Scene[] = [
  {
    id: 1,
    startMs: 0,
    durationMs: 5500,
    voice: 'Struggling to prepare for your exams? Meet YourSaathi — India\'s smartest AI-powered learning companion.',
    headline: 'Meet YourSaathi',
    sub: "India's Smartest AI Learning Companion",
    accent: '#a78bfa',
    bg: 'radial-gradient(ellipse at 50% 0%, #200644 0%, #09090b 65%)',
  },
  {
    id: 2,
    startMs: 5500,
    durationMs: 5500,
    voice: 'Just type any topic — Physics, History, Coding — anything! And in seconds, get a fully custom quiz made just for you.',
    headline: 'Type Any Topic → Get a Quiz',
    sub: 'AI generates 10 tailored questions in under 3 seconds',
    accent: '#38bdf8',
    bg: 'radial-gradient(ellipse at 30% 50%, #0c2340 0%, #09090b 65%)',
  },
  {
    id: 3,
    startMs: 11000,
    durationMs: 6000,
    voice: 'Practice real Previous Year Questions from CBSE, JEE, NEET, UPSC, SSC, and more — all in one place.',
    headline: 'Real PYQ Practice',
    sub: 'CBSE · JEE · NEET · UPSC · SSC · and more',
    accent: '#fb923c',
    bg: 'radial-gradient(ellipse at 70% 30%, #2a1200 0%, #09090b 65%)',
  },
  {
    id: 4,
    startMs: 17000,
    durationMs: 5500,
    voice: 'Answer correctly and earn real coins — coins you can actually redeem for real cash rewards. Learning has never paid off like this!',
    headline: '🪙 Earn Real Coins',
    sub: 'Every correct answer = coins you can redeem for cash',
    accent: '#facc15',
    bg: 'radial-gradient(ellipse at 50% 70%, #1a1400 0%, #09090b 65%)',
  },
  {
    id: 5,
    startMs: 22500,
    durationMs: 4500,
    voice: 'Over ten thousand students across India are already learning, practicing, and earning with YourSaathi every day.',
    headline: '10,000+ Students',
    sub: 'Across India — learning, practicing & earning daily',
    accent: '#34d399',
    bg: 'radial-gradient(ellipse at 20% 60%, #001a10 0%, #09090b 65%)',
  },
  {
    id: 6,
    startMs: 27000,
    durationMs: 4500,
    voice: 'Sign up free in 10 seconds. Start learning. Start earning. Your success starts with YourSaathi.',
    headline: 'Start Free Today 🚀',
    sub: 'Join thousands of toppers — no credit card needed',
    accent: '#c084fc',
    bg: 'radial-gradient(ellipse at 50% 50%, #1a0533 0%, #09090b 50%)',
  },
];

/* ─── scene-specific visual elements ─── */
function SceneVisual({ id, accent }: { id: number; accent: string }) {
  switch (id) {
    case 1:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, animation: 'ysv-pop 0.7s cubic-bezier(0.34,1.56,0.64,1) both' }}>
          <div style={{ borderRadius: '50%', padding: 6, boxShadow: `0 0 60px 16px ${accent}55`, animation: 'ysv-glow 2.5s ease-in-out infinite' }}>
            <Image src="/logo.png" alt="YourSaathi" width={110} height={110} style={{ borderRadius: '50%' }} priority />
          </div>
        </div>
      );
    case 2:
      return (
        <div style={{ animation: 'ysv-slide-up 0.6s ease both', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 16, padding: '20px 28px', width: '100%', maxWidth: 400 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: '1.3rem' }}>🔍</span>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '8px 14px', color: '#fff', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              Newton's laws of motion...
            </div>
          </div>
          {['Which law explains inertia?', 'Force = Mass × ?', 'Action & Reaction — True/False'].map((q, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)', animation: `ysv-slide-up 0.5s ${i * 150 + 300}ms ease both`, fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>
              <span style={{ color: accent, fontWeight: 700 }}>Q{i + 1}.</span> {q}
            </div>
          ))}
        </div>
      );
    case 3:
      return (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', animation: 'ysv-slide-up 0.6s ease both' }}>
          {[
            { tag: 'CBSE', icon: '📘', color: '#3b82f6' },
            { tag: 'JEE', icon: '⚗️', color: '#f59e0b' },
            { tag: 'NEET', icon: '🧬', color: '#10b981' },
            { tag: 'UPSC', icon: '🏛️', color: '#8b5cf6' },
            { tag: 'SSC', icon: '📋', color: '#ef4444' },
          ].map((b, i) => (
            <div key={b.tag} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: `${b.color}18`, border: `1px solid ${b.color}44`, borderRadius: 14, padding: '14px 20px', animation: `ysv-pop 0.5s ${i * 120}ms cubic-bezier(0.34,1.56,0.64,1) both`, minWidth: 72 }}>
              <span style={{ fontSize: '1.8rem' }}>{b.icon}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: b.color }}>{b.tag}</span>
            </div>
          ))}
        </div>
      );
    case 4:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, animation: 'ysv-slide-up 0.6s ease both' }}>
          <div style={{ fontSize: '4rem', animation: 'ysv-bounce 0.8s ease both' }}>🪙</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['+5', '+10', '+15', '+20'].map((v, i) => (
              <div key={v} style={{ background: 'rgba(250,204,21,0.15)', border: '1px solid rgba(250,204,21,0.4)', borderRadius: 10, padding: '8px 14px', color: '#facc15', fontWeight: 700, fontSize: '0.85rem', animation: `ysv-pop 0.5s ${i * 150 + 200}ms cubic-bezier(0.34,1.56,0.64,1) both` }}>{v} coins</div>
            ))}
          </div>
          <div style={{ background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: 12, padding: '10px 24px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
            Redeem for <span style={{ color: '#facc15', fontWeight: 700 }}>real cash</span> anytime 💰
          </div>
        </div>
      );
    case 5:
      return (
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', animation: 'ysv-slide-up 0.6s ease both' }}>
          {[
            { n: '10,000+', l: 'Active Students', icon: '👩‍🎓' },
            { n: '5L+', l: 'Quizzes Taken', icon: '📝' },
            { n: '₹50K+', l: 'Coins Redeemed', icon: '🏆' },
          ].map((s, i) => (
            <div key={s.l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 16, padding: '18px 22px', animation: `ysv-pop 0.6s ${i * 180}ms cubic-bezier(0.34,1.56,0.64,1) both`, minWidth: 110 }}>
              <span style={{ fontSize: '2rem' }}>{s.icon}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: accent }}>{s.n}</span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', textAlign: 'center' }}>{s.l}</span>
            </div>
          ))}
        </div>
      );
    case 6:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, animation: 'ysv-pop 0.7s cubic-bezier(0.34,1.56,0.64,1) both' }}>
          <a
            href="/login"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 44px',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)',
              color: '#fff', fontWeight: 800, fontSize: '1.15rem',
              borderRadius: 50, textDecoration: 'none', letterSpacing: '0.02em',
              boxShadow: '0 8px 40px rgba(168,85,247,0.55)',
              animation: 'ysv-glow-cta 2s ease-in-out infinite',
            }}
            id="ys-ad-cta-btn"
          >
            🚀 Get Started — It&apos;s Free
          </a>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>No credit card · 10-second signup</p>
        </div>
      );
    default:
      return null;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function IntroVideo() {
  const { data: session, status } = useSession();
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);          // ms since start
  const [exiting, setExiting] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);
  const [muted, setMuted] = useState(false);

  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const sceneTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const muteRef = useRef(false);

  /* ── decide whether to show ── */
  useEffect(() => {
    if (status === 'loading') return;
    if (session?.user) return;
    const seen = sessionStorage.getItem('ys_ad_seen');
    if (seen) return;
    sessionStorage.setItem('ys_ad_seen', '1');
    setVisible(true);

    // preload voices
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const load = () => setVoiceReady(true);
      if (speechSynthesis.getVoices().length) { load(); }
      else { speechSynthesis.addEventListener('voiceschanged', load, { once: true }); }
    }
  }, [status, session]);

  /* ── progress ticker ── */
  const tick = useCallback(() => {
    const now = performance.now();
    const ms = now - startTimeRef.current;
    setElapsed(ms);

    // advance scenes by elapsed time
    let newIdx = 0;
    for (let i = SCENES.length - 1; i >= 0; i--) {
      if (ms >= SCENES[i].startMs) { newIdx = i; break; }
    }
    setSceneIdx(newIdx);

    if (ms < TOTAL_DURATION) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      setPlaying(false);
      setElapsed(TOTAL_DURATION);
      setTimeout(dismiss, 1200);
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  /* ── speak a scene's voiceover ── */
  const speakScene = useCallback((scene: Scene) => {
    if (!synthRef.current || muteRef.current) return;
    const synth = synthRef.current;
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(scene.voice);
    utt.rate = 1.05;
    utt.pitch = 1.0;
    utt.volume = 1;
    // prefer a good English voice
    const voices = synth.getVoices();
    const preferred = voices.find(v =>
      /en[-_](IN|US|GB)/i.test(v.lang) && v.name.toLowerCase().includes('google')
    ) || voices.find(v => /en[-_](IN|US|GB)/i.test(v.lang))
      || voices[0];
    if (preferred) utt.voice = preferred;
    synth.speak(utt);
  }, []);

  /* ── start playback ── */
  const startPlay = useCallback(() => {
    if (playing) return;
    setPlaying(true);
    setElapsed(0);
    setSceneIdx(0);
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);

    // Schedule a speak call at each scene's startMs
    sceneTimersRef.current.forEach(clearTimeout);
    sceneTimersRef.current = SCENES.map(scene =>
      setTimeout(() => speakScene(scene), scene.startMs)
    );
  }, [playing, tick, speakScene]);

  /* ── auto-start once visible & voices ready ── */
  useEffect(() => {
    if (visible && voiceReady && !playing) {
      const t = setTimeout(startPlay, 600);
      return () => clearTimeout(t);
    }
    // fallback: if no speech API, start after 1s anyway
    if (visible && !voiceReady) {
      const t = setTimeout(() => {
        setVoiceReady(true); // mark ready so we don't loop
        startPlay();
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [visible, voiceReady]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── cleanup ── */
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      sceneTimersRef.current.forEach(clearTimeout);
      synthRef.current?.cancel();
    };
  }, []);

  const dismiss = useCallback(() => {
    setExiting(true);
    cancelAnimationFrame(rafRef.current);
    sceneTimersRef.current.forEach(clearTimeout);
    synthRef.current?.cancel();
    setTimeout(() => setVisible(false), 700);
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    muteRef.current = next;
    if (next) {
      synthRef.current?.cancel();
    } else if (playing) {
      // re-speak current scene
      const currentScene = SCENES[sceneIdx];
      speakScene(currentScene);
    }
  };

  if (!visible) return null;

  const scene = SCENES[sceneIdx];
  const progressPct = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
  const timeLeft = Math.max(0, Math.ceil((TOTAL_DURATION - elapsed) / 1000));

  return (
    <>
      <style>{`
        @keyframes ysv-pop {
          from { opacity: 0; transform: scale(0.72); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes ysv-slide-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ysv-glow {
          0%, 100% { box-shadow: 0 0 50px 10px rgba(167,139,250,0.3); }
          50%       { box-shadow: 0 0 90px 24px rgba(167,139,250,0.6); }
        }
        @keyframes ysv-bounce {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.2) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes ysv-glow-cta {
          0%, 100% { box-shadow: 0 8px 40px rgba(168,85,247,0.55); }
          50%       { box-shadow: 0 12px 60px rgba(168,85,247,0.85); }
        }
        @keyframes ysv-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes ysv-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes ysv-particle {
          0%   { opacity: 0.8; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-100px) translateX(var(--pdx)) scale(0.2); }
        }
        @keyframes ysv-scan {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .ysv-shimmer {
          background: linear-gradient(90deg, var(--accent) 0%, #fff 40%, var(--accent) 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: ysv-shimmer 2.5s linear infinite;
        }
        .ysv-progress-thumb {
          transition: width 0.1s linear;
        }
      `}</style>

      {/* ── OVERLAY ROOT ── */}
      <div
        id="ys-intro-ad"
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: scene.bg,
          transition: 'background 1s ease, opacity 0.7s ease',
          opacity: exiting ? 0 : 1,
          overflow: 'hidden',
        }}
      >
        {/* ── decorative grid ── */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
        }} />

        {/* ── scan line ── */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${scene.accent}66, transparent)`,
          pointerEvents: 'none',
          animation: 'ysv-scan 4s ease-in-out infinite',
        }} />

        {/* ── floating particles ── */}
        <Particles accent={scene.accent} />

        {/* ══ CONTENT ══ */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 24,
          padding: '0 24px', maxWidth: 600, width: '100%', textAlign: 'center',
        }}>
          {/* scene number badge */}
          <div key={`badge-${scene.id}`} style={{
            background: `${scene.accent}22`,
            border: `1px solid ${scene.accent}55`,
            borderRadius: 20, padding: '4px 14px',
            color: scene.accent, fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            animation: 'ysv-pop 0.4s ease both',
          }}>
            {scene.id === 1 ? 'Introducing' : scene.id === 6 ? 'Join Now' : `Feature 0${scene.id - 1}`}
          </div>

          {/* visual for each scene */}
          <div key={`vis-${scene.id}`} style={{ width: '100%' }}>
            <SceneVisual id={scene.id} accent={scene.accent} />
          </div>

          {/* headline */}
          <div key={`hl-${scene.id}`} style={{
            fontSize: 'clamp(1.6rem, 5vw, 2.8rem)',
            fontWeight: 900, lineHeight: 1.15,
            '--accent': scene.accent,
            animation: 'ysv-slide-up 0.5s 0.1s ease both',
          } as React.CSSProperties}
            className="ysv-shimmer">
            {scene.headline}
          </div>

          {/* subtitle */}
          <div key={`sub-${scene.id}`} style={{
            color: 'rgba(255,255,255,0.62)',
            fontSize: 'clamp(0.88rem, 2vw, 1.1rem)',
            lineHeight: 1.5, maxWidth: 480,
            animation: 'ysv-slide-up 0.5s 0.25s ease both',
          }}>
            {scene.sub}
          </div>
        </div>

        {/* ══ BOTTOM HUD ══ */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
          padding: '28px 28px 20px',
          zIndex: 3,
        }}>
          {/* scene dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: 14 }}>
            {SCENES.map((s, i) => (
              <div key={s.id} style={{
                width: i === sceneIdx ? 22 : 7, height: 7,
                borderRadius: 4, transition: 'all 0.3s ease',
                background: i === sceneIdx ? scene.accent : 'rgba(255,255,255,0.2)',
              }} />
            ))}
          </div>

          {/* progress bar */}
          <div style={{
            height: 3, background: 'rgba(255,255,255,0.1)',
            borderRadius: 4, overflow: 'hidden', marginBottom: 14,
          }}>
            <div className="ysv-progress-thumb" style={{
              height: '100%', width: `${progressPct}%`,
              background: `linear-gradient(90deg, ${SCENES[0].accent}, ${scene.accent})`,
              borderRadius: 4,
            }} />
          </div>

          {/* controls row */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {/* left: logo + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Image src="/logo.png" alt="YourSaathi" width={28} height={28} style={{ borderRadius: '50%', opacity: 0.9 }} />
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>YourSaathi</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>Ad</div>
            </div>

            {/* center: time */}
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
              {timeLeft}s
            </div>

            {/* right: mute + skip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                id="ys-ad-mute"
                onClick={toggleMute}
                title={muted ? 'Unmute' : 'Mute'}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 20, padding: '5px 14px',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.8rem', cursor: 'pointer',
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
                  color: '#fff', fontSize: '0.8rem', cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Skip ›
              </button>
            </div>
          </div>
        </div>

        {/* ── top-left: scene label ── */}
        <div style={{
          position: 'absolute', top: 20, left: 24,
          fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.08em',
        }}>
          yoursaathi.site
        </div>
      </div>
    </>
  );
}

/* ─── Floating Particles ─── */
function Particles({ accent }: { accent: string }) {
  const pts = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    left: `${(i * 4.5 + 3) % 96}%`,
    top: `${(i * 7.3 + 8) % 88}%`,
    size: 2 + (i % 3),
    dur: 2.2 + (i % 6) * 0.5,
    delay: (i * 0.28) % 3.5,
    pdx: `${-40 + (i * 17) % 80}px`,
    color: i % 2 === 0 ? accent : 'rgba(255,255,255,0.35)',
  }));
  return (
    <>
      {pts.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: p.left, top: p.top,
          width: p.size, height: p.size, borderRadius: '50%',
          background: p.color, opacity: 0,
          ['--pdx' as string]: p.pdx,
          animation: `ysv-particle ${p.dur}s ${p.delay}s ease-out infinite`,
          pointerEvents: 'none',
        }} />
      ))}
    </>
  );
}

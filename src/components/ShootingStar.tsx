'use client';

import { useState, useEffect } from 'react';

/* ──────────────────────────────────────────────────────────────────────────
   Types
─────────────────────────────────────────────────────────────────────────── */
type Meteor = {
  id:       number;
  x:        number;   // vw start %
  y:        number;   // vh start %
  angle:    number;   // rotation deg (local X becomes travel direction)
  dist:     number;   // how far to travel along that axis (px)
  duration: number;   // animation seconds
  delay:    number;   // stagger seconds
  length:   number;   // trail length px
  head:     number;   // head glow radius px
  color:    string;   // gradient colour stops
};

/* ──────────────────────────────────────────────────────────────────────────
   Helpers
─────────────────────────────────────────────────────────────────────────── */
const rnd = (min: number, max: number) => min + Math.random() * (max - min);

const PALETTES = [
  'rgba(255,255,255,1), rgba(200,220,255,0.7)',   // pure white-blue
  'rgba(255,255,255,1), rgba(220,180,255,0.7)',   // white-violet
  'rgba(255,255,255,1), rgba(180,240,255,0.7)',   // white-cyan
  'rgba(255,240,180,1), rgba(255,200,120,0.5)',   // warm gold
  'rgba(220,180,255,1), rgba(140,100,255,0.5)',   // full purple
];

function spawnMeteors(): Meteor[] {
  const count    = Math.floor(rnd(2, 5));          // 2–4 meteors per burst
  const baseAngle = rnd(10, 170);                  // new random base direction each burst
  const ts       = Date.now();

  return Array.from({ length: count }, (_, i) => ({
    id:       ts + i,
    x:        rnd(5, 88),
    y:        rnd(2, 45),
    angle:    baseAngle + rnd(-25, 25),            // slight spread within burst
    dist:     rnd(700, 1300),
    duration: rnd(0.9, 1.7),
    delay:    i * rnd(0.2, 0.55),
    length:   rnd(200, 380),
    head:     rnd(3, 6),
    color:    PALETTES[Math.floor(rnd(0, PALETTES.length))],
  }));
}

/* ──────────────────────────────────────────────────────────────────────────
   Component
─────────────────────────────────────────────────────────────────────────── */
export default function ShootingStar() {
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  // ── Trigger burst every 2 minutes ──────────────────────────────────────
  useEffect(() => {
    const fire = () => setMeteors(spawnMeteors());

    // Fire immediately on mount
    fire();

    const iv = setInterval(fire, 120_000);   // 2 minutes
    return () => clearInterval(iv);
  }, []);

  // ── Auto-clear meteors after animation ends ─────────────────────────────
  useEffect(() => {
    if (!meteors.length) return;
    const maxMs = Math.max(...meteors.map(m => (m.duration + m.delay) * 1000)) + 600;
    const t = setTimeout(() => setMeteors([]), maxMs);
    return () => clearTimeout(t);
  }, [meteors]);

  if (!meteors.length) return null;

  /* Inject per-meteor keyframes — only `transform` + `opacity` used,
     so these run on the GPU compositor thread (zero INP cost).       */
  const css = meteors.map(m => `
    @keyframes meteor-${m.id} {
      0%   { opacity: 0;   transform: rotate(${m.angle}deg) translateX(0); }
      6%   { opacity: 1;                                                    }
      82%  { opacity: 0.95;                                                 }
      100% { opacity: 0;   transform: rotate(${m.angle}deg) translateX(${m.dist}px); }
    }
  `).join('\n');

  return (
    <>
      <style>{css}</style>

      {meteors.map((m) => (
        <div
          key={m.id}
          aria-hidden="true"
          style={{
            position:        'fixed',
            left:            `${m.x}vw`,
            top:             `${m.y}vh`,
            pointerEvents:   'none',
            zIndex:          5,
            willChange:      'transform, opacity',
            animationName:        `meteor-${m.id}`,
            animationDuration:    `${m.duration}s`,
            animationDelay:       `${m.delay}s`,
            animationTimingFunction: 'ease-in',
            animationFillMode:    'both',
          } as React.CSSProperties}
        >
          {/* ── Trail ───────────────────────────────────────────────── */}
          <div
            style={{
              position:     'absolute',
              right:        0,
              top:          '50%',
              transform:    'translateY(-50%)',
              width:        `${m.length}px`,
              height:       `${m.head * 0.6}px`,
              background:   `linear-gradient(to left, ${m.color}, transparent)`,
              borderRadius: '999px',
              filter:       `blur(${m.head * 0.35}px)`,
            }}
          />

          {/* ── Second softer trail layer ────────────────────────────── */}
          <div
            style={{
              position:     'absolute',
              right:        0,
              top:          '50%',
              transform:    'translateY(-50%)',
              width:        `${m.length * 0.55}px`,
              height:       `${m.head * 1.2}px`,
              background:   `linear-gradient(to left, rgba(255,255,255,0.4), transparent)`,
              borderRadius: '999px',
              filter:       `blur(${m.head * 0.6}px)`,
            }}
          />

          {/* ── Bright head ─────────────────────────────────────────── */}
          <div
            style={{
              position:     'absolute',
              right:        0,
              top:          '50%',
              transform:    'translate(50%, -50%)',
              width:        `${m.head * 2}px`,
              height:       `${m.head * 2}px`,
              borderRadius: '50%',
              background:   'white',
              boxShadow:    [
                `0 0 ${m.head}px   ${m.head / 2}px rgba(255,255,255,0.9)`,
                `0 0 ${m.head * 3}px ${m.head}px rgba(200,220,255,0.6)`,
                `0 0 ${m.head * 6}px ${m.head * 2}px rgba(150,180,255,0.3)`,
              ].join(', '),
            }}
          />

          {/* ── Sparkle flare on the head ────────────────────────────── */}
          <svg
            style={{
              position:  'absolute',
              right:     0,
              top:       '50%',
              transform: 'translate(50%, -50%)',
              overflow:  'visible',
            }}
            width={m.head * 4}
            height={m.head * 4}
            viewBox={`${-m.head * 2} ${-m.head * 2} ${m.head * 4} ${m.head * 4}`}
          >
            {/* cross flare */}
            {[0, 90].map((rot) => (
              <rect
                key={rot}
                x={-m.head * 2}
                y={-m.head * 0.12}
                width={m.head * 4}
                height={m.head * 0.24}
                fill={`url(#flare-${m.id}-${rot})`}
                transform={`rotate(${rot})`}
              />
            ))}
            <defs>
              {[0, 90].map((rot) => (
                <linearGradient
                  key={rot}
                  id={`flare-${m.id}-${rot}`}
                  x1="0%" y1="0%" x2="100%" y2="0%"
                >
                  <stop offset="0%"   stopColor="white" stopOpacity="0" />
                  <stop offset="50%"  stopColor="white" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              ))}
            </defs>
          </svg>
        </div>
      ))}
    </>
  );
}

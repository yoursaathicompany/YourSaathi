'use client';

import { useEffect, useRef } from 'react';

export default function BlogHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Particle canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = 60;
    type Particle = { x: number; y: number; vx: number; vy: number; r: number; alpha: number };
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* Draw connecting lines between close particles */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(168,85,247,${(1 - dist / 100) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,85,247,${p.alpha})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="relative overflow-hidden bg-[#09090b] pt-20 pb-16 min-h-[420px] flex items-center">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Radial glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-700/10 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-pink-700/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-700/8 rounded-full blur-3xl" />
        {/* Top shimmer bar */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center">
          {/* Eyebrow badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-semibold mb-6"
            style={{ animation: 'blog-fade-in 0.5s ease-out forwards' }}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse inline-block" />
            The YourSaathi Blog
          </div>

          {/* Heading */}
          <h1
            className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6"
            style={{ animation: 'blog-fade-up 0.7s ease-out 0.1s forwards', opacity: 0 }}
          >
            Learn Smarter,{' '}
            <span
              className="block"
              style={{
                background: 'linear-gradient(135deg,#a855f7 0%,#ec4899 50%,#a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Score Higher
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ animation: 'blog-fade-up 0.7s ease-out 0.2s forwards', opacity: 0 }}
          >
            Study strategies, exam guides, platform updates, and the raw story of building
            YourSaathi — India&apos;s AI-powered learn-and-earn quiz platform.
          </p>

          {/* CTA Row */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            style={{ animation: 'blog-fade-up 0.7s ease-out 0.35s forwards', opacity: 0 }}
          >
            <a
              href="#articles"
              id="blog-hero-read-cta"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5"
            >
              Start Reading
            </a>
            <a
              href="/topics"
              id="blog-hero-quiz-cta"
              className="px-7 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
            >
              Try a Quiz →
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

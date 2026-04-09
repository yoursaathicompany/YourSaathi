import { Metadata } from 'next';
import Link from 'next/link';
import { animationCourseModules, animationCourseMetadata } from '@/data/animationCourseData';

export const metadata: Metadata = {
  title: 'Animation & CGI Pipeline Course — YourSaathi',
  description:
    'Master the professional animation pipeline — from 2D principles to real-time rendering in UE5. Learn Maya, Blender, Houdini, and Unreal Engine 5 with studio-grade workflows.',
  keywords: [
    'animation course online',
    'CGI VFX course',
    'Blender rigging tutorial',
    'Houdini VFX course',
    'Unreal Engine 5 cinematics',
    'character rigging course',
    '3D animation pipeline',
    'learn VFX from scratch',
    'animation course India',
    'yoursaathi animation',
  ],
  alternates: { canonical: 'https://www.yoursaathi.site/courses/animation' },
  openGraph: {
    title: 'Animation & CGI Pipeline — YourSaathi',
    description:
      'A studio-grade 4-module course: 2D Animation → 3D Rigging → VFX Simulations → Real-Time Rendering.',
    url: 'https://www.yoursaathi.site/courses/animation',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'YourSaathi Animation Course' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: animationCourseMetadata.title,
  description: animationCourseMetadata.description,
  provider: {
    '@type': 'Organization',
    name: 'YourSaathi',
    url: 'https://www.yoursaathi.site',
  },
  hasCourseInstance: animationCourseModules.map((m) => ({
    '@type': 'CourseInstance',
    name: `Module ${m.number}: ${m.title}`,
    description: m.subtitle,
    courseMode: 'online',
    isAccessibleForFree: true,
  })),
};

export default function AnimationCoursePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        @keyframes anim-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes anim-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes anim-pulse-border {
          0%, 100% { border-color: rgba(251,113,133,0.2); }
          50%      { border-color: rgba(251,113,133,0.5); }
        }
        @keyframes anim-gradient-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .anim-fade-up { animation: anim-fade-up 0.7s ease-out forwards; }
        .anim-float   { animation: anim-float 5s ease-in-out infinite; }
        .anim-card {
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), 
                      box-shadow 0.4s ease,
                      border-color 0.4s ease;
        }
        .anim-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 30px 60px rgba(244,63,94,0.12), 0 0 0 1px rgba(244,63,94,0.2);
          border-color: rgba(244,63,94,0.4);
        }
        .delay-100 { animation-delay: 0.10s; opacity: 0; }
        .delay-200 { animation-delay: 0.20s; opacity: 0; }
        .delay-300 { animation-delay: 0.30s; opacity: 0; }
        .delay-400 { animation-delay: 0.40s; opacity: 0; }
        .gradient-text {
          background: linear-gradient(135deg, #fb7185, #f97316, #fb7185);
          background-size: 200% 200%;
          animation: anim-gradient-shift 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="min-h-screen">
        {/* ── Hero ─────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-rose-600/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[350px] bg-orange-600/6 rounded-full blur-[100px]" />
            <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-violet-600/5 rounded-full blur-[130px]" />
          </div>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold tracking-wider uppercase mb-6" style={{ animation: 'anim-pulse-border 3s ease-in-out infinite' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              Studio-Grade Pipeline
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Animation{' '}
              <span className="gradient-text">&amp; CGI</span>
              <span className="block text-xl sm:text-2xl text-gray-500 font-semibold mt-2">
                The Professional Pipeline
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Learn the exact workflows used at Pixar, ILM, and Weta Digital — from traditional
              2D principles to photorealistic real-time rendering in Unreal Engine 5.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 mb-8">
              {[
                { icon: '⏱️', text: '50–70 Hours' },
                { icon: '📦', text: '4 Modules' },
                { icon: '🎬', text: 'Film Pipeline' },
                { icon: '🏆', text: '4 Projects' },
              ].map(({ icon, text }) => (
                <span key={text} className="inline-flex items-center gap-2">
                  <span>{icon}</span>
                  <span className="font-medium text-gray-400">{text}</span>
                </span>
              ))}
            </div>

            {/* Software logos line */}
            <div className="flex flex-wrap justify-center gap-3">
              {['Blender', 'Maya', 'Toon Boom', 'Houdini', 'UE5', 'After Effects'].map((tool) => (
                <span key={tool} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* ── Prerequisites ───────────────────────────── */}
          <section className="mb-16 anim-fade-up">
            <div className="rounded-2xl border border-white/8 bg-[#0e0e12] p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">🎯</span> Prerequisites &amp; Software
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    You&apos;ll Need
                  </h3>
                  <ul className="space-y-2">
                    {animationCourseMetadata.prerequisites.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Software Stack (All Free Options Available)
                  </h3>
                  <div className="rounded-xl bg-black/40 border border-white/5 p-4 font-mono text-xs text-green-400 overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{animationCourseMetadata.softwareStack}</pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Module Cards ────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-8 anim-fade-up">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-rose-500 to-orange-500" />
              <h2 className="text-2xl font-black text-white">Course Modules</h2>
              <span className="text-sm text-gray-600 ml-auto hidden sm:block">
                {animationCourseModules.length} Modules · {animationCourseMetadata.estimatedHours}
              </span>
            </div>

            <div className="grid gap-6">
              {animationCourseModules.map((mod, idx) => (
                <Link
                  key={mod.slug}
                  href={`/courses/animation/${mod.slug}`}
                  id={`anim-module-${mod.slug}`}
                  className={`anim-card group block rounded-2xl bg-[#0e0e12] border border-white/8 overflow-hidden anim-fade-up delay-${(idx + 1) * 100}`}
                  aria-label={`Module ${mod.number}: ${mod.title}`}
                >
                  <div className="grid md:grid-cols-[200px_1fr] gap-0">
                    {/* Left — Emoji + gradient */}
                    <div
                      className="relative h-32 md:h-auto flex items-center justify-center overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${
                          mod.number === 1 ? 'rgba(244,63,94,0.1)' :
                          mod.number === 2 ? 'rgba(139,92,246,0.1)' :
                          mod.number === 3 ? 'rgba(249,115,22,0.1)' :
                          'rgba(14,165,233,0.1)'
                        }, rgba(0,0,0,0))`,
                      }}
                    >
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-500 select-none anim-float" style={{ animationDelay: `${idx * 0.3}s` }}>
                        {mod.emoji}
                      </span>
                      <span className="absolute top-3 left-3 text-xs font-black px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-white/80">
                        Module {mod.number}
                      </span>
                    </div>

                    {/* Right — Content */}
                    <div className="p-6 sm:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-gray-500">
                            {mod.difficulty}
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-gray-500">
                            {mod.estimatedHours}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2 group-hover:text-rose-300 transition-colors">
                          {mod.title}
                          <span className="text-gray-500 font-semibold text-base sm:text-lg ml-2">
                            — {mod.subtitle}
                          </span>
                        </h3>
                        <ul className="space-y-1.5 mb-4">
                          {mod.objective.slice(0, 2).map((obj) => (
                            <li key={obj} className="flex gap-2 text-sm text-gray-400">
                              <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                              <span className="line-clamp-1">{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex flex-wrap gap-1.5">
                          {mod.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-gray-500"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-400 flex-shrink-0">
                          Start Module <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Back to All Courses ─────────────────────── */}
          <section className="mt-12 text-center anim-fade-up delay-400">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
            >
              <span>←</span> View ML &amp; AI Course
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}

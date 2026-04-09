import { Metadata } from 'next';
import Link from 'next/link';
import { courseModules, courseMetadata } from '@/data/courseData';
import CourseHero from '@/components/courses/CourseHero';

export const metadata: Metadata = {
  title: 'Python ML & AI Course (Beginner → Advanced) — YourSaathi',
  description:
    'Learn Machine Learning & AI from scratch. Our free, beginner-friendly 4-module Python course takes you from zero to production — covering Supervised Learning, Neural Networks, NLP, and Computer Vision.',
  keywords: [
    'python machine learning course for beginners',
    'AI course India',
    'deep learning tutorial beginners',
    'NLP transformers course',
    'computer vision python',
    'learn machine learning from scratch',
    'free ML course for beginners India',
    'scikit-learn tensorflow tutorial',
    'BERT fine-tuning',
    'yoursaathi courses',
  ],
  alternates: { canonical: 'https://www.yoursaathi.site/courses' },
  openGraph: {
    title: 'Advanced Python: ML & AI Course — YourSaathi',
    description:
      'A free, comprehensive 4-module course covering Supervised Learning, Deep Learning, NLP, and Computer Vision. Production-grade Python code.',
    url: 'https://www.yoursaathi.site/courses',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'YourSaathi ML/AI Course' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advanced Python: ML & AI Course — YourSaathi',
    description:
      '4 modules, real projects, zero fluff. Master ML & AI with production-grade Python code.',
    images: ['/og-image.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: courseMetadata.title,
  description: courseMetadata.description,
  provider: {
    '@type': 'Organization',
    name: 'YourSaathi',
    url: 'https://www.yoursaathi.site',
  },
  hasCourseInstance: courseModules.map((m) => ({
    '@type': 'CourseInstance',
    name: `Module ${m.number}: ${m.title}`,
    description: m.subtitle,
    courseMode: 'online',
    isAccessibleForFree: true,
  })),
};

export default function CoursesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Page-scoped animations */}
      <style>{`
        @keyframes course-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes course-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes course-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .course-fade-up { animation: course-fade-up 0.7s ease-out forwards; }
        .course-float   { animation: course-float 4s ease-in-out infinite; }
        .course-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
          background-size: 200% auto;
          animation: course-shimmer 3s linear infinite;
        }
        .module-card {
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .module-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(168,85,247,0.15);
          border-color: rgba(168,85,247,0.4);
        }
        .delay-100 { animation-delay: 0.10s; opacity: 0; }
        .delay-200 { animation-delay: 0.20s; opacity: 0; }
        .delay-300 { animation-delay: 0.30s; opacity: 0; }
        .delay-400 { animation-delay: 0.40s; opacity: 0; }
      `}</style>

      <div className="min-h-screen">
        <CourseHero />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* ── Prerequisites ─────────────────────────────── */}
          <section className="mb-16 course-fade-up">
            <div className="rounded-2xl border border-white/8 bg-[#0e0e12] p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">📋</span> Prerequisites &amp; Setup
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    You&apos;ll Need
                  </h3>
                  <ul className="space-y-2">
                    {courseMetadata.prerequisites.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Install All Libraries
                  </h3>
                  <div className="rounded-xl bg-black/40 border border-white/5 p-4 font-mono text-sm text-green-400 overflow-x-auto">
                    <span className="text-gray-600">$</span> pip install -r requirements.txt
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Or: <code className="text-gray-500">pip install numpy pandas scikit-learn tensorflow matplotlib</code>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Module Cards ──────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-8 course-fade-up">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
              <h2 className="text-2xl font-black text-white">Course Modules</h2>
              <span className="text-sm text-gray-600 ml-auto hidden sm:block">
                {courseModules.length} Modules · {courseMetadata.estimatedHours}
              </span>
            </div>

            <div className="grid gap-6">
              {courseModules.map((mod, idx) => (
                <Link
                  key={mod.slug}
                  href={`/courses/${mod.slug}`}
                  id={`course-module-${mod.slug}`}
                  className={`module-card group block rounded-2xl bg-[#0e0e12] border border-white/8 overflow-hidden course-fade-up delay-${(idx + 1) * 100}`}
                  aria-label={`Module ${mod.number}: ${mod.title}`}
                >
                  <div className="grid md:grid-cols-[200px_1fr] gap-0">
                    {/* Left — Emoji + gradient */}
                    <div
                      className={`relative h-32 md:h-auto bg-gradient-to-br ${mod.color.replace('from-', 'from-').replace('to-', 'to-')}/10 flex items-center justify-center overflow-hidden`}
                      style={{
                        background: `linear-gradient(135deg, ${
                          mod.number === 1 ? 'rgba(59,130,246,0.1)' :
                          mod.number === 2 ? 'rgba(168,85,247,0.1)' :
                          mod.number === 3 ? 'rgba(16,185,129,0.1)' :
                          'rgba(245,158,11,0.1)'
                        }, rgba(0,0,0,0))`,
                      }}
                    >
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-500 select-none course-float">
                        {mod.emoji}
                      </span>
                      <div className="absolute inset-0 course-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                      {/* Module number */}
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
                        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2 group-hover:text-purple-300 transition-colors">
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
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-400 flex-shrink-0">
                          Start Module <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── requirements.txt download ────────────────── */}
          <section className="mt-16 course-fade-up delay-400">
            <div className="rounded-2xl p-[1px] bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
              <div className="rounded-2xl bg-[#0d0d10] p-8 sm:p-10 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                  <span className="text-4xl block mb-4 course-float">📦</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                    requirements.txt
                  </h2>
                  <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                    Install every library you need for all 4 modules with a single command.
                  </p>
                  <div className="max-w-md mx-auto rounded-xl bg-black/50 border border-white/10 p-4 font-mono text-sm text-left text-gray-300 overflow-x-auto mb-6">
                    <pre className="whitespace-pre-wrap">{`pip install numpy pandas scikit-learn \\
  tensorflow matplotlib seaborn nltk \\
  transformers torch torchvision \\
  opencv-python Pillow tqdm`}</pre>
                  </div>
                  <p className="text-xs text-gray-600">
                    💡 Pro tip: Use a virtual environment — <code className="text-gray-500">python -m venv ml_env &amp;&amp; source ml_env/bin/activate</code>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

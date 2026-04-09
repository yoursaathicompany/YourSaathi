import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { animationCourseModules } from '@/data/animationCourseData';
import CodeBlock from '@/components/courses/CodeBlock';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return animationCourseModules.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const mod = animationCourseModules.find((m) => m.slug === slug);
  if (!mod) return {};

  return {
    title: `Module ${mod.number}: ${mod.title} — Animation & CGI Course | YourSaathi`,
    description: mod.objective.join(' '),
    keywords: mod.tags,
    alternates: { canonical: `https://www.yoursaathi.site/courses/animation/${slug}` },
    openGraph: {
      title: `Module ${mod.number}: ${mod.title} — YourSaathi`,
      description: mod.objective[0],
      url: `https://www.yoursaathi.site/courses/animation/${slug}`,
      type: 'article',
    },
  };
}

export default async function AnimationModulePage({ params }: Props) {
  const { slug } = await params;
  const mod = animationCourseModules.find((m) => m.slug === slug);
  if (!mod) notFound();

  const currentIdx = animationCourseModules.findIndex((m) => m.slug === slug);
  const prevMod = currentIdx > 0 ? animationCourseModules[currentIdx - 1] : null;
  const nextMod = currentIdx < animationCourseModules.length - 1 ? animationCourseModules[currentIdx + 1] : null;

  const gradientColors: Record<number, string> = {
    1: 'from-rose-500 to-red-400',
    2: 'from-violet-500 to-purple-400',
    3: 'from-orange-500 to-amber-400',
    4: 'from-sky-500 to-blue-500',
  };
  const accentColors: Record<number, string> = {
    1: 'rgba(244,63,94,',
    2: 'rgba(139,92,246,',
    3: 'rgba(249,115,22,',
    4: 'rgba(14,165,233,',
  };

  const gradient = gradientColors[mod.number] || 'from-rose-500 to-red-400';
  const accent = accentColors[mod.number] || 'rgba(244,63,94,';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: `Module ${mod.number}: ${mod.title}`,
    description: mod.objective[0],
    educationalLevel: mod.difficulty,
    timeRequired: mod.estimatedHours,
    provider: { '@type': 'Organization', name: 'YourSaathi', url: 'https://www.yoursaathi.site' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <style>{`
        @keyframes amod-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes amod-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        .amod-fade-up { animation: amod-fade-up 0.6s ease-out forwards; }
        .amod-float   { animation: amod-float 4s ease-in-out infinite; }
        .amod-theory-card { transition: border-color 0.3s ease; }
        .amod-theory-card:hover { border-color: ${accent}0.35); }
      `}</style>

      <div className="min-h-screen pb-20">
        {/* ── Hero ───────────────────────────────────── */}
        <section className="relative overflow-hidden pt-20 pb-14 sm:pt-24 sm:pb-16">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-1/3 w-[500px] h-[350px] rounded-full blur-[120px]" style={{ background: `${accent}0.08)` }} />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-pink-600/5 rounded-full blur-[100px]" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
              <Link href="/courses/animation" className="hover:text-rose-400 transition-colors">Animation Course</Link>
              <span>/</span>
              <span className="text-gray-300">Module {mod.number}</span>
            </nav>

            <div className="flex items-start gap-5 mb-6">
              <span className="text-5xl sm:text-6xl amod-float select-none flex-shrink-0">{mod.emoji}</span>
              <div>
                <span className={`inline-block text-xs font-black px-3 py-1 rounded-full bg-gradient-to-r ${gradient} text-white mb-3`}>
                  Module {mod.number}
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  {mod.title}
                  <span className="block text-lg sm:text-xl text-gray-500 font-semibold mt-1">{mod.subtitle}</span>
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <span className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400">⏱️ {mod.estimatedHours}</span>
              <span className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400">📊 {mod.difficulty}</span>
              <span className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400">🧩 {mod.codeBlocks.length} Code Blocks</span>
              <span className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400">🏗️ 1 Project</span>
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#0e0e12] p-6 amod-fade-up">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">🎯 Learning Objectives</h2>
              <ul className="space-y-3">
                {mod.objective.map((obj) => (
                  <li key={obj} className="flex gap-3 text-sm text-gray-300">
                    <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>{obj}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Prerequisites ────────────────────────── */}
          <section className="mb-12 amod-fade-up">
            <div className="rounded-2xl border border-white/8 bg-[#0e0e12] p-6">
              <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">📋 Prerequisites</h2>
              <div className="flex flex-wrap gap-2">
                {mod.prerequisites.map((p) => (
                  <span key={p} className="text-xs px-3 py-1.5 rounded-lg border text-rose-300" style={{ backgroundColor: `${accent}0.1)`, borderColor: `${accent}0.2)` }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* ── Theory ────────────────────────────────── */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8 amod-fade-up">
              <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${gradient}`} />
              <h2 className="text-2xl font-black text-white">📐 Technical Theory</h2>
            </div>
            <div className="space-y-6">
              {mod.theorySections.map((section, idx) => (
                <div key={idx} className="amod-theory-card rounded-2xl border border-white/8 bg-[#0e0e12] p-6 sm:p-8 amod-fade-up">
                  <h3 className="text-lg font-bold text-white mb-4">{section.heading}</h3>
                  <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line mb-4">{section.content}</div>
                  {section.formula && (
                    <div className="rounded-xl bg-black/40 border border-white/5 p-4 font-mono text-sm text-cyan-300 overflow-x-auto mb-4">
                      <pre className="whitespace-pre-wrap">{section.formula}</pre>
                    </div>
                  )}
                  {section.table && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr>
                            {section.table.headers.map((h) => (
                              <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-2 border-b border-white/10">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row, ri) => (
                            <tr key={ri} className="border-b border-white/5 last:border-none">
                              {row.map((cell, ci) => (
                                <td key={ci} className="px-4 py-3 text-gray-300">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Code Blocks ───────────────────────────── */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8 amod-fade-up">
              <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${gradient}`} />
              <h2 className="text-2xl font-black text-white">💻 Implementation</h2>
            </div>
            <div className="space-y-10">
              {mod.codeBlocks.map((block) => (
                <div key={block.id} className="amod-fade-up">
                  <h3 className="text-lg font-bold text-white mb-4">{block.title}</h3>
                  <CodeBlock code={block.code} language={block.language} title={block.title} />
                  {block.troubleshooting.length > 0 && (
                    <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5">
                      <h4 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">🔧 Troubleshooting</h4>
                      <div className="space-y-3">
                        {block.troubleshooting.map((t, i) => (
                          <div key={i} className="text-xs grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                            <span className="font-semibold text-red-400">❌ Error:</span>
                            <span className="text-gray-300 font-mono">{t.error}</span>
                            <span className="font-semibold text-yellow-400">🔍 Cause:</span>
                            <span className="text-gray-400">{t.cause}</span>
                            <span className="font-semibold text-green-400">✅ Fix:</span>
                            <span className="text-gray-300">{t.fix}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Project ───────────────────────────────── */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8 amod-fade-up">
              <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${gradient}`} />
              <h2 className="text-2xl font-black text-white">🏗️ Professional Project</h2>
            </div>
            <div className="rounded-2xl p-[1px] bg-gradient-to-r from-rose-500 via-orange-500 to-rose-500 amod-fade-up">
              <div className="rounded-2xl bg-[#0d0d10] p-6 sm:p-8">
                <h3 className="text-xl font-black text-white mb-3">{mod.project.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">{mod.project.description}</p>
                <CodeBlock code={mod.project.code.code} language={mod.project.code.language} title={mod.project.title} />
                {mod.project.code.troubleshooting.length > 0 && (
                  <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5">
                    <h4 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">🔧 Troubleshooting</h4>
                    <div className="space-y-3">
                      {mod.project.code.troubleshooting.map((t, i) => (
                        <div key={i} className="text-xs grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                          <span className="font-semibold text-red-400">❌ Error:</span>
                          <span className="text-gray-300 font-mono">{t.error}</span>
                          <span className="font-semibold text-yellow-400">🔍 Cause:</span>
                          <span className="text-gray-400">{t.cause}</span>
                          <span className="font-semibold text-green-400">✅ Fix:</span>
                          <span className="text-gray-300">{t.fix}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── Tags ──────────────────────────────────── */}
          <section className="mb-12 amod-fade-up">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Topics Covered</h3>
            <div className="flex flex-wrap gap-2">
              {mod.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-gray-400">#{tag}</span>
              ))}
            </div>
          </section>

          {/* ── Navigation ────────────────────────────── */}
          <nav className="flex items-center justify-between pt-8 border-t border-white/8" aria-label="Module navigation">
            {prevMod ? (
              <Link href={`/courses/animation/${prevMod.slug}`} className="group flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <div className="text-left">
                  <span className="block text-xs text-gray-600">Previous</span>
                  <span className="font-semibold">Module {prevMod.number}: {prevMod.title}</span>
                </div>
              </Link>
            ) : (
              <Link href="/courses/animation" className="group flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <span className="font-semibold">All Modules</span>
              </Link>
            )}
            {nextMod ? (
              <Link href={`/courses/animation/${nextMod.slug}`} className="group flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors text-right">
                <div>
                  <span className="block text-xs text-gray-600">Next</span>
                  <span className="font-semibold">Module {nextMod.number}: {nextMod.title}</span>
                </div>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ) : (
              <Link href="/courses/animation" className="group flex items-center gap-3 text-sm font-semibold text-green-400 hover:text-green-300 transition-colors">
                🎓 Course Complete!
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts, blogCategories } from '@/data/blogData';
import BlogHero from '@/components/blog/BlogHero';
import BlogGrid from '@/components/blog/BlogGrid';

export const metadata: Metadata = {
  title: 'Blog — YourSaathi | Study Tips, AI Learning & EdTech Insights',
  description:
    'Explore the YourSaathi blog for expert study strategies, AI-powered learning tips, exam preparation guides for JEE, NEET, UPSC & CBSE, founder insights, and the story of how YourSaathi is revolutionising education in India.',
  keywords: [
    'YourSaathi blog',
    'AI learning tips India',
    'study strategies JEE NEET',
    'CBSE exam preparation',
    'EdTech startup India',
    'online quiz tips',
    'sanjay satya blog',
    'yoursaathi news',
    'competitive exam guide',
    'learn and earn tips',
  ],
  alternates: { canonical: 'https://www.yoursaathi.site/blog' },
  openGraph: {
    title: 'YourSaathi Blog — Study Tips, AI Learning & EdTech Insights',
    description:
      'Actionable study guides, platform updates, and founder stories from the team behind YourSaathi — India\'s AI-powered quiz platform.',
    url: 'https://www.yoursaathi.site/blog',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'YourSaathi Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YourSaathi Blog',
    description: 'Study smarter with AI. Explore tips, guides & founder stories.',
    images: ['/og-image.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'YourSaathi Blog',
  url: 'https://www.yoursaathi.site/blog',
  description:
    'Study tips, AI learning insights, exam prep guides, and the YourSaathi growth story.',
  publisher: {
    '@type': 'Organization',
    name: 'YourSaathi',
    url: 'https://www.yoursaathi.site',
    logo: 'https://www.yoursaathi.site/logo.svg',
  },
  blogPost: blogPosts.map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    url: `https://www.yoursaathi.site/blog/${post.slug}`,
    image: post.coverImage,
    keywords: post.tags.join(', '),
  })),
};

export default function BlogPage() {
  const featuredPost = blogPosts.find((p) => p.featured) ?? blogPosts[0];
  const regularPosts = blogPosts.filter((p) => p.slug !== featuredPost.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen overflow-hidden">
        {/* Page-local animation styles */}
        <style>{`
          @keyframes blog-fade-up {
            from { opacity: 0; transform: translateY(32px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes blog-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes blog-slide-left {
            from { opacity: 0; transform: translateX(-24px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes blog-float {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-10px); }
          }
          @keyframes blog-pulse-glow {
            0%, 100% { box-shadow: 0 0 0 0 rgba(168,85,247,0); }
            50%       { box-shadow: 0 0 40px 8px rgba(168,85,247,0.18); }
          }
          @keyframes blog-shimmer {
            0%   { background-position: -200% center; }
            100% { background-position:  200% center; }
          }
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes count-up {
            from { opacity: 0; transform: scale(0.7); }
            to   { opacity: 1; transform: scale(1); }
          }

          .blog-fade-up  { animation: blog-fade-up  0.7s ease-out forwards; }
          .blog-fade-in  { animation: blog-fade-in  0.5s ease-out forwards; }
          .blog-slide-left { animation: blog-slide-left 0.7s ease-out forwards; }
          .blog-float    { animation: blog-float 5s ease-in-out infinite; }
          .blog-shimmer  {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
            background-size: 200% auto;
            animation: blog-shimmer 2.5s linear infinite;
          }
          .count-up { animation: count-up 0.6s cubic-bezier(.22,1,.36,1) forwards; }

          .delay-100 { animation-delay: 0.10s; opacity: 0; }
          .delay-200 { animation-delay: 0.20s; opacity: 0; }
          .delay-300 { animation-delay: 0.30s; opacity: 0; }
          .delay-400 { animation-delay: 0.40s; opacity: 0; }
          .delay-500 { animation-delay: 0.50s; opacity: 0; }
          .delay-600 { animation-delay: 0.60s; opacity: 0; }
          .delay-700 { animation-delay: 0.70s; opacity: 0; }

          /* Card hover lift */
          .blog-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          }
          .blog-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 60px rgba(168,85,247,0.18);
            border-color: rgba(168,85,247,0.45);
          }

          .featured-card {
            transition: transform 0.4s ease, box-shadow 0.4s ease;
          }
          .featured-card:hover {
            transform: translateY(-4px) scale(1.005);
            box-shadow: 0 32px 80px rgba(168,85,247,0.22);
          }

          /* Category pill */
          .cat-pill {
            transition: all 0.25s ease;
          }
          .cat-pill:hover {
            transform: scale(1.07);
          }

          /* Read-more arrow nudge */
          .read-more-arrow {
            transition: transform 0.25s ease;
          }
          a:hover .read-more-arrow { transform: translateX(4px); }

          /* Ticker */
          .ticker-track { animation: marquee 30s linear infinite; }
          .ticker-track:hover { animation-play-state: paused; }

          /* Gradient text */
          .grad-text {
            background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #a855f7 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          /* Glassy card bg */
          .glass-card {
            background: rgba(255,255,255,0.025);
            border: 1px solid rgba(255,255,255,0.08);
            backdrop-filter: blur(12px);
          }

          /* Subtle grid bg pattern */
          .grid-bg {
            background-image:
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
            background-size: 60px 60px;
          }
        `}</style>

        <BlogHero />

        {/* ── Ticker / Stats bar ─────────────────────────────────────────── */}
        <div className="border-y border-white/5 bg-white/[0.02] overflow-hidden py-3">
          <div className="flex ticker-track whitespace-nowrap gap-16">
            {[...Array(2)].map((_, ri) => (
              <span key={ri} className="inline-flex items-center gap-16 text-sm text-gray-500">
                {[
                  '📚 10 000+ Quizzes Generated',
                  '🎯 JEE · NEET · UPSC · CBSE',
                  '🪙 Earn Coins While You Learn',
                  '🚀 Built by Students for Students',
                  '🤖 Powered by AI · Verified by Experts',
                  '🌍 Students Across India',
                ].map((t) => (
                  <span key={t} className="inline-flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-purple-500 inline-block" />
                    {t}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* ── Growth Stats ─────────────────────────────────────────────── */}
          <section aria-label="Platform growth statistics" className="mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '10K+', label: 'Quizzes Created', color: 'from-purple-500 to-pink-500', delay: 'delay-100' },
                { value: '50+',  label: 'Topics Covered',  color: 'from-blue-500 to-cyan-400',   delay: 'delay-200' },
                { value: '₹0',   label: 'Always Free',     color: 'from-emerald-400 to-teal-400', delay: 'delay-300' },
                { value: '100%', label: 'AI-Powered',      color: 'from-amber-400 to-orange-400', delay: 'delay-400' },
              ].map(({ value, label, color, delay }) => (
                <div
                  key={label}
                  className={`glass-card rounded-2xl p-6 text-center count-up ${delay}`}
                >
                  <p className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${color} grad-text mb-2`}>
                    {value}
                  </p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Featured Post ─────────────────────────────────────────────── */}
          <section aria-label="Featured blog post" className="mb-20">
            <div className="flex items-center gap-3 mb-8 blog-fade-up">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
              <h2 className="text-2xl font-black text-white">Featured Story</h2>
              <span className="hidden sm:inline text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400">
                Must Read
              </span>
            </div>

            <Link href={`/blog/${featuredPost.slug}`} className="block featured-card blog-fade-up delay-100">
              <article className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0e0e12]">
                {/* Gradient blob */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-1/4 w-96 h-64 bg-purple-600/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-1/4 w-80 h-64 bg-pink-600/10 rounded-full blur-3xl" />
                </div>

                <div className="relative grid md:grid-cols-2 gap-0">
                  {/* Cover art */}
                  <div className="relative h-64 md:h-auto bg-gradient-to-br from-purple-900/60 to-pink-900/40 flex items-center justify-center overflow-hidden">
                    <div className="text-8xl blog-float select-none">{featuredPost.emoji}</div>
                    <div className="absolute inset-0 blog-shimmer" />
                    {/* Category badge */}
                    <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full bg-purple-500/30 border border-purple-500/40 text-purple-300 backdrop-blur-sm">
                      {featuredPost.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {featuredPost.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4">
                        {featuredPost.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed line-clamp-3 mb-6">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {featuredPost.author.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{featuredPost.author}</p>
                          <p className="text-xs text-gray-500">{featuredPost.date} · {featuredPost.readTime}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-400">
                        Read Article <span className="read-more-arrow">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          </section>

          {/* ── All Articles ─────────────────────────────────────────────── */}
          <section aria-label="All blog posts">
            <div className="flex items-center gap-3 mb-8 blog-fade-up">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
              <h2 className="text-2xl font-black text-white">All Articles</h2>
            </div>

            <BlogGrid posts={regularPosts} categories={blogCategories} />
          </section>

          {/* ── Newsletter / CTA ─────────────────────────────────────────── */}
          <section
            aria-label="Subscribe to newsletter"
            className="mt-24 rounded-3xl p-[1px] bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 blog-fade-up delay-300"
          >
            <div className="rounded-3xl bg-[#0d0d10] p-10 md:p-14 relative overflow-hidden grid-bg">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative text-center max-w-2xl mx-auto">
                <span className="text-4xl block mb-4 blog-float">📬</span>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                  Stay Ahead of the Curve
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  Get the latest study strategies, platform updates, and exam tips straight from the YourSaathi team — delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all text-sm"
                    aria-label="Enter your email address"
                  />
                  <button
                    id="newsletter-subscribe-btn"
                    type="button"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    Subscribe Free
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-3">No spam, unsubscribe anytime.</p>
              </div>
            </div>
          </section>

          {/* ── Founder Note ─────────────────────────────────────────────── */}
          <section aria-label="A note from the founder" className="mt-20 blog-fade-up delay-400">
            <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
              <div className="relative flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0 text-center md:text-left">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-[2px] flex items-center justify-center mx-auto md:mx-0">
                    <div className="w-full h-full rounded-[14px] bg-[#0d0d10] flex items-center justify-center text-3xl">
                      🚀
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest text-purple-400 uppercase mb-3">
                    A Note From Our Founder
                  </p>
                  <blockquote className="text-lg md:text-xl text-gray-300 font-medium italic leading-relaxed mb-6">
                    &ldquo;I started YourSaathi because I personally experienced how hard it is to prepare for competitive exams without the right resources. Every article on this blog is a piece of my journey — the failures, the lessons, and the wins. I hope it helps you on yours.&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-black text-white">Sanjay Satya</p>
                      <p className="text-sm text-gray-500">Founder &amp; CEO, YourSaathi · BCA Graduate · 22 years old</p>
                    </div>
                    <Link
                      href="/about"
                      className="ml-auto flex-shrink-0 px-4 py-2 rounded-xl border border-purple-500/30 text-purple-400 text-sm font-semibold hover:bg-purple-500/10 transition-all"
                      id="blog-about-founder-link"
                    >
                      Full Story →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}

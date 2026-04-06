'use client';

import Link from 'next/link';
import type { BlogPost } from '@/data/blogData';

/* ── Rich article body per slug ─────────────────────────────────────────── */
const articleBodies: Record<string, React.ReactNode> = {
  'ai-revision-strategy-competitive-exams-2026': (
    <>
      <p>
        The sheer volume of syllabus for competitive exams like NEET, JEE, and UPSC is overwhelming. Traditional revision strategies often involve frantically re-reading notes or endlessly highlighting textbooks. But there is a better, science-backed way to retain more information in less time: AI-driven active revision.
      </p>
      <h2>What is Active Revision?</h2>
      <p>
        Active revision means actively simulating exam conditions and retrieving information from memory, rather than passively reviewing it. This strengthens neural pathways. It&apos;s the difference between reading a solution and solving the problem yourself.
      </p>
      <h2>How AI Optimizes Your Schedule</h2>
      <p>
        Artificial Intelligence takes the guesswork out of <em>what</em> to revise. Instead of following a linear path, AI algorithms analyze your past performance to identify weak spots. On platforms like <strong>YourSaathi</strong>, the AI generates custom quizzes focusing exactly on the concepts you struggle with, ensuring no time is wasted.
      </p>
      <h2>Building Your 3-Step Strategy</h2>
      <ul>
        <li><strong>Step 1: The Initial Assessment.</strong> Take a comprehensive diagnostic test to let the AI baseline your knowledge.</li>
        <li><strong>Step 2: Spaced Repetition Drill.</strong> Use the AI-generated daily quizzes to hit your weak areas at optimal intervals.</li>
        <li><strong>Step 3: PYQ Mastery.</strong> Integrate Previous Year Questions to understand exam patterns, a feature natively supported by the YourSaathi engine.</li>
      </ul>
      <p>
        Stop relying entirely on your intuition for revision. Let AI analyze your data to help you study smarter, not just harder.
      </p>
    </>
  ),
  'learn-to-earn-future-online-education-india': (
    <>
      <p>
        Student engagement is the biggest challenge in online education today. Drop-off rates for traditional online courses regularly exceed 80%. But what if we could align intrinsic motivation (wanting to learn) with extrinsic rewards (earning real value)? Welcome to the <strong>Learn-to-Earn</strong> model.
      </p>
      <h2>The Problem with Traditional EdTech</h2>
      <p>
        Most platforms treat students purely as consumers. You pay a hefty subscription fee, and the burden of motivation falls entirely on you. In a distraction-filled world, this model is failing the majority of Indian students who study independently.
      </p>
      <h2>Flipping the Script</h2>
      <p>
        The learn-to-earn model paradigm flips this dynamic. On platforms like <strong>YourSaathi</strong>, students earn tangible rewards—coins that can be redeemed for cash—simply by consistently demonstrating knowledge and answering questions correctly.
      </p>
      <h2>Why It Works in India</h2>
      <p>
        For millions of students in India, the cost of education tools is a barrier. A learn-to-earn approach democratizes access. It turns study time into a potentially rewarding venture, offsetting data costs or micro-expenses, while fundamentally keeping the student engaged in the curriculum. 
      </p>
      <p>
        By incentivizing the daily habit of learning, we aren&apos;t just giving students a platform—we are giving them a reason to show up every single day. The future of EdTech in India is not just accessible; it is rewarding.
      </p>
    </>
  ),
  'yoursaathi-story-building-ai-quiz-platform': (
    <>
      <p>
        It was late 2025. I had just finished my BCA exams and, like most students, I was drowning
        in a sea of PDFs, YouTube videos, and WhatsApp groups full of unverified notes. I wanted a
        simple way to quiz myself on any topic — instantly, accurately, and without paying ₹5,000 a
        month for a coaching app subscription.
      </p>
      <p>
        That frustration became the seed for <strong>YourSaathi</strong>.
      </p>
      <h2>Why I Built It</h2>
      <p>
        The Indian edtech space is massive, but most platforms gate their best content behind
        paywalls. I genuinely believed that AI had finally reached a point where we could generate
        high-quality, curriculum-aligned quiz questions for free — and I wanted to prove it.
      </p>
      <p>
        I started building in early 2026. No co-founder, no investors, no fancy office. Just a
        laptop, Next.js, Supabase, and a lot of chai ☕.
      </p>
      <h2>The First Version</h2>
      <p>
        The MVP was brutally simple: pick a topic, pick a difficulty, get 10 questions. But adding
        the <strong>coin-reward system</strong> was the real game-changer. Suddenly, students
        weren&apos;t just studying — they were earning. And they came back every day.
      </p>
      <h2>What We&apos;re Building Next</h2>
      <p>
        The roadmap is exciting: <strong>AI-generated study plans</strong>, deeper PYQ drill modes,
        group challenges, and eventually a mobile app. We&apos;re growing fast and we&apos;re just
        getting started.
      </p>
      <p>
        If you&apos;re a student reading this — <strong>YourSaathi is for you</strong>. And if
        you&apos;re a builder reading this — build the thing you wish existed. Nobody else will.
      </p>
    </>
  ),
  'top-10-study-tips-jee-neet-2026': (
    <>
      <p>
        Cracking JEE or NEET requires more than hard work — it requires <em>smart</em> work. Here
        are ten strategies backed by cognitive science and top rankers alike.
      </p>
      <h2>1. Active Recall Over Passive Re-Reading</h2>
      <p>
        Close your textbook and try to recall what you just read. This single habit can triple
        retention. YourSaathi quizzes are built exactly for this.
      </p>
      <h2>2. Spaced Repetition</h2>
      <p>
        Review material at increasing intervals: day 1, day 3, day 7, day 21. Apps and quiz
        platforms that track your weak topics make this effortless.
      </p>
      <h2>3. Solve Previous Year Questions First</h2>
      <p>
        PYQs from the last 10 years often repeat patterns. Mastering them gives you a huge edge
        before diving into advanced mock tests.
      </p>
      <h2>4. Time-Block Your Sessions</h2>
      <p>
        Study in 50-minute blocks with 10-minute breaks (modified Pomodoro). Your brain consolidates
        memory during rest — don&apos;t skip the breaks.
      </p>
      <h2>5–10: The Full List</h2>
      <p>
        From interleaved practice to concept-mapping and teaching-back techniques — the full
        breakdown is available inside the YourSaathi platform under our Study Guides section.
      </p>
    </>
  ),
};

/* ── Fallback body ───────────────────────────────────────────────────────── */
function FallbackBody({ post }: { post: BlogPost }) {
  return (
    <>
      <p className="text-lg text-gray-300 leading-relaxed">{post.excerpt}</p>
      <p className="text-gray-400 leading-relaxed">
        This article dives deep into <strong>{post.category}</strong> — one of the most important
        areas for any serious student preparing for {post.tags.slice(0, 2).join(' and ')}. We cover
        the what, the why, and the how, backed by data from thousands of YourSaathi quiz sessions.
      </p>
      <p className="text-gray-400 leading-relaxed">
        Whether you&apos;re a first-time visitor or a returning YourSaathi user, you&apos;ll find
        actionable takeaways you can apply to your study routine today. Explore more articles below
        or jump into a quiz to put your knowledge to the test.
      </p>
    </>
  );
}

/* ── Component ───────────────────────────────────────────────────────────── */
export default function BlogPostContent({
  post,
  relatedPosts,
}: {
  post: BlogPost;
  relatedPosts: BlogPost[];
}) {
  const body = articleBodies[post.slug];

  return (
    <div className="min-h-screen overflow-hidden">
      <style>{`
        @keyframes post-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes post-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        .post-fade-up { animation: post-fade-up 0.65s ease-out forwards; }
        .post-float   { animation: post-float 5s ease-in-out infinite; }
        .d1 { animation-delay: 0.1s; opacity: 0; }
        .d2 { animation-delay: 0.2s; opacity: 0; }
        .d3 { animation-delay: 0.3s; opacity: 0; }
        .d4 { animation-delay: 0.4s; opacity: 0; }

        .related-card {
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .related-card:hover {
          transform: translateY(-4px);
          border-color: rgba(168,85,247,0.4);
          box-shadow: 0 16px 40px rgba(168,85,247,0.15);
        }

        /* Prose styles */
        .blog-prose h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          margin: 2rem 0 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .blog-prose p {
          color: #9ca3af;
          line-height: 1.85;
          margin-bottom: 1.25rem;
        }
        .blog-prose strong { color: #e5e7eb; }
        .blog-prose em    { color: #c4b5fd; }
        .blog-prose a {
          color: #a855f7;
          text-decoration: underline;
        }
        .blog-prose ul, .blog-prose ol {
          color: #9ca3af;
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .blog-prose li { margin-bottom: 0.5rem; line-height: 1.75; }
        .blog-prose blockquote {
          border-left: 3px solid #a855f7;
          padding-left: 1rem;
          color: #c4b5fd;
          font-style: italic;
          margin: 1.5rem 0;
        }

        .progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #a855f7, #ec4899);
          z-index: 999;
          transform-origin: left;
          width: 40%;
          animation: progress-grow 2s ease-out forwards;
        }
        @keyframes progress-grow {
          to { width: 100%; }
        }
      `}</style>

      {/* Reading progress indicator */}
      <div className="progress-bar" aria-hidden="true" />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-[#09090b] pt-16 pb-10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-purple-700/10 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-7xl block post-float mb-6">{post.emoji}</div>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6 post-fade-up">
            <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-purple-400 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-400">{post.category}</span>
          </nav>

          {/* Category */}
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold border border-purple-500/30 bg-purple-500/10 text-purple-400 mb-4 post-fade-up d1">
            {post.category}
          </span>

          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6 post-fade-up d2">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 post-fade-up d3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                {post.author.charAt(0)}
              </div>
              <span className="text-gray-300">{post.author}</span>
            </div>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* ── Article Body ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-10 post-fade-up d4">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400">
              #{tag}
            </span>
          ))}
        </div>

        <article className="blog-prose post-fade-up d4">
          {body ?? <FallbackBody post={post} />}
        </article>

        {/* Share / CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 text-center">
          <p className="text-lg font-bold text-white mb-2">Enjoyed this article?</p>
          <p className="text-gray-400 text-sm mb-6">
            Practice what you&apos;ve learned with a free AI-generated quiz on YourSaathi.
          </p>
          <Link
            href="/pyq"
            id="blog-post-quiz-cta"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold transition-all shadow-lg shadow-purple-500/25 hover:-translate-y-0.5"
          >
            🎯 Start a Free Quiz
          </Link>
        </div>
      </div>

      {/* ── Related Posts ── */}
      {relatedPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
            <h2 className="text-xl font-black text-white">Related Articles</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                id={`related-post-${rp.slug}`}
                className="related-card block rounded-2xl bg-[#0e0e12] border border-white/8 overflow-hidden"
              >
                <div className="h-32 bg-gradient-to-br from-[#1a0a2e] to-[#0a0a14] flex items-center justify-center text-5xl">
                  {rp.emoji}
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold text-purple-400 mb-2 block">{rp.category}</span>
                  <h3 className="font-bold text-white text-sm leading-snug mb-2 line-clamp-2">{rp.title}</h3>
                  <p className="text-xs text-gray-500">{rp.readTime}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Back link ── */}
      <div className="text-center pb-12">
        <Link
          href="/blog"
          id="blog-post-back-btn"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-400 transition-colors"
        >
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
}

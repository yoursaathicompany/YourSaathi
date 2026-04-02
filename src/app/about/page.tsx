import { Metadata } from 'next';
import { Target, BookOpen, Instagram, Mail, Linkedin, GraduationCap, Lightbulb, Rocket, Code, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About YourSaathi — AI-Powered Learning Platform | Meet Our Founder',
  description: 'Meet Sanjay Satya, the 22-year-old founder and CEO of YourSaathi — India\'s AI-powered quiz and PYQ practice platform. Our mission: democratize quality education for CBSE, JEE, NEET, UPSC students with AI quizzes, previous year questions, and a learn-and-earn reward system.',
  keywords: ['about yoursaathi', 'sanjay satya founder', 'yoursaathi team', 'AI education platform India', 'learn and earn quiz', 'CBSE quiz platform', 'JEE NEET preparation app', 'yoursaathi CEO'],
  alternates: { canonical: 'https://www.yoursaathi.site/about' },
  openGraph: {
    title: 'About YourSaathi — AI Learning Platform | Meet Sanjay Satya, Founder & CEO',
    description: 'YourSaathi empowers students with AI quizzes, PYQ practice, and a coin reward system. Meet our founder Sanjay Satya and learn our mission and story.',
    url: 'https://www.yoursaathi.site/about',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About YourSaathi & Founder Sanjay Satya',
    description: 'AI-powered quizzes, PYQ practice & earn coins while you learn. Meet the founder behind YourSaathi.',
    images: ['/og-image.png'],
  },
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen pt-8 pb-20 overflow-hidden">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2); }
          50% { box-shadow: 0 0 30px rgba(236, 72, 153, 0.6), 0 0 60px rgba(236, 72, 153, 0.3); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes scale-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-fade-up { animation: fadeInUp 0.7s ease-out forwards; }
        .animate-fade-left { animation: fadeInLeft 0.7s ease-out forwards; }
        .animate-fade-right { animation: fadeInRight 0.7s ease-out forwards; }
        .animate-glow { animation: glow-pulse 3s ease-in-out infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% auto;
          animation: shimmer 2s linear infinite;
        }
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
        .delay-600 { animation-delay: 0.6s; opacity: 0; }
        .founder-card {
          background: linear-gradient(135deg, rgba(18,18,20,0.9) 0%, rgba(30,15,40,0.9) 50%, rgba(18,18,20,0.9) 100%);
          border: 1px solid rgba(168, 85, 247, 0.3);
          backdrop-filter: blur(20px);
        }
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          background: rgba(168, 85, 247, 0.1);
          border-color: rgba(168, 85, 247, 0.4);
          transform: translateY(-4px);
        }
        .skill-tag {
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.15));
          border: 1px solid rgba(168, 85, 247, 0.3);
          transition: all 0.3s ease;
        }
        .skill-tag:hover {
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3));
          transform: scale(1.05);
        }
        .social-btn {
          transition: all 0.3s ease;
        }
        .social-btn:hover {
          transform: translateY(-3px) scale(1.05);
        }
        .profile-ring {
          background: linear-gradient(135deg, #a855f7, #ec4899, #a855f7);
        }
        .info-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.3s ease;
        }
        .info-card:hover {
          border-color: rgba(168, 85, 247, 0.3);
          background: rgba(168, 85, 247, 0.05);
        }
      `}</style>

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="text-center mb-16 space-y-4 animate-fade-up">
          <div className="inline-flex items-center justify-center mb-4 animate-float">
            <Image
              src="/logo.svg"
              alt="YourSaathi Logo"
              width={160}
              height={160}
              className="drop-shadow-2xl"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mt-2">
            About YourSaathi
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Empowering students with AI-driven interactive learning, making exam preparation smarter, faster, and more rewarding.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#121214] p-8 rounded-3xl border border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 animate-fade-left delay-100">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              To democratize high-quality education by providing instant, verified, and personalized
              practice quizzes for every subject and difficulty level. We believe that testing your knowledge
              should be accessible to everyone, anywhere, at any time.
            </p>
          </div>

          <div className="bg-[#121214] p-8 rounded-3xl border border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 animate-fade-right delay-100">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Learn &amp; Earn</h2>
            <p className="text-gray-300 leading-relaxed">
              We know that staying motivated can be tough. That&apos;s why we built a learn-and-earn ecosystem
              where your actual performance directly translates into digital coins, which you can later redeem
              for real-world rewards. You put in the hard work, and we reward you for it.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16 animate-fade-up delay-200">
          <h2 className="text-3xl font-bold text-center text-white mb-8">Why Choose Us?</h2>
          <div className="bg-[#09090b] rounded-3xl p-8 border border-white/10">
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Infinite Practice ♾️</h3>
                  <p className="text-gray-300">Generate quizzes on practically any topic under the sun, powered by state-of-the-art AI generation pipelines.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Rigorously Verified ✅</h3>
                  <p className="text-gray-300">All our AI-generated content goes through rigorous verification checks before making it to your screen to guarantee factual accuracy.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Adaptable Difficulty 📈</h3>
                  <p className="text-gray-300">Whether you are a middle schooler brushing up on basics or a high schooler preparing for competitive exams, we adapt to you.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ===== FOUNDER SECTION ===== */}
        <section aria-label="Meet the Founder" className="mb-16">
          {/* Section Header */}
          <div className="text-center mb-10 animate-fade-up delay-300">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium mb-4">
              <Rocket className="w-3.5 h-3.5" />
              The Visionary Behind YourSaathi
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Meet Our{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Founder
              </span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">
              A young engineer with a mission to make quality education accessible for every student across India.
            </p>
          </div>

          {/* Main Founder Card */}
          <div className="founder-card rounded-3xl p-1 animate-fade-up delay-400">
            {/* Gradient border shimmer effect */}
            <div className="relative rounded-[22px] overflow-hidden bg-[#0d0d10] p-6 sm:p-10">
              {/* Background glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-64 h-48 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex flex-col lg:flex-row gap-10 items-center lg:items-start">

                {/* Left: Photo + Social */}
                <div className="flex flex-col items-center gap-6 flex-shrink-0">
                  {/* Animated profile ring */}
                  <div className="relative">
                    <div className="profile-ring p-[3px] rounded-full w-44 h-44 flex items-center justify-center">
                      <div className="rounded-full overflow-hidden w-full h-full border-2 border-[#0d0d10]">
                        <Image
                          src="/founder-sanjay.jpg"
                          alt="Sanjay Satya - Founder and CEO of YourSaathi"
                          width={176}
                          height={176}
                          className="object-cover w-full h-full"
                          priority
                        />
                      </div>
                    </div>
                    {/* Online/Active indicator */}
                    <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-400 rounded-full border-2 border-[#0d0d10] animate-pulse" title="Active" />
                  </div>

                  {/* Name & Role */}
                  <div className="text-center">
                    <h3 className="text-2xl font-black text-white">Sanjay Satya</h3>
                    <p className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mt-1">
                      Founder &amp; CEO
                    </p>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-3">
                    <a
                      href="https://instagram.com/sanju_satyaa"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Sanjay Satya on Instagram"
                      className="social-btn flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 text-sm font-medium hover:from-pink-500/30 hover:to-purple-500/30"
                    >
                      <Instagram className="w-4 h-4" />
                      <span className="hidden sm:inline">@sanju_satyaa</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/sanjay-satya-018828291"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Sanjay Satya on LinkedIn"
                      className="social-btn flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/20"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="hidden sm:inline">LinkedIn</span>
                    </a>
                  </div>
                </div>

                {/* Right: Info */}
                <div className="flex-1 w-full">
                  {/* Quick Stats Row */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="stat-card rounded-2xl p-4 text-center">
                      <p className="text-2xl font-black text-white">22</p>
                      <p className="text-xs text-gray-500 mt-1">Years Old</p>
                    </div>
                    <div className="stat-card rounded-2xl p-4 text-center">
                      <p className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BCA</p>
                      <p className="text-xs text-gray-500 mt-1">Graduate</p>
                    </div>
                    <div className="stat-card rounded-2xl p-4 text-center">
                      <p className="text-2xl font-black text-emerald-400">1</p>
                      <p className="text-xs text-gray-500 mt-1">Vision</p>
                    </div>
                  </div>

                  {/* Info Cards */}
                  <div className="space-y-4 mb-8">
                    <div className="info-card rounded-2xl p-4 flex items-start gap-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center mt-0.5">
                        <Lightbulb className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm mb-1">The Origin Story</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Frustrated with the lack of affordable, personalized study tools during his own exam prep, Sanjay envisioned a platform where every student — regardless of background — could access AI-powered practice quizzes and real exam questions. That vision became YourSaathi.
                        </p>
                      </div>
                    </div>

                    <div className="info-card rounded-2xl p-4 flex items-start gap-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-pink-500/15 flex items-center justify-center mt-0.5">
                        <Code className="w-4 h-4 text-pink-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm mb-1">Builder at Heart</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          At just 22, Sanjay single-handedly built and launched YourSaathi — from the AI quiz engine and database architecture to the UI design and reward system. He is proof that age is no barrier to building a product that can change lives.
                        </p>
                      </div>
                    </div>

                    <div className="info-card rounded-2xl p-4 flex items-start gap-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center mt-0.5">
                        <GraduationCap className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm mb-1">Education &amp; Academic Background</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Holding a Bachelor of Computer Applications (BCA) degree, Sanjay combines technical expertise with a deep passion for education technology. His academic journey gave him firsthand insight into the challenges Indian students face during competitive exam preparation.
                        </p>
                      </div>
                    </div>

                    <div className="info-card rounded-2xl p-4 flex items-start gap-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center mt-0.5">
                        <Heart className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm mb-1">Mission-Driven Leadership</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Sanjay believes that rewarding students for learning is the future of education. He introduced the &apos;learn-and-earn&apos; coin system to ensure students stay motivated and feel valued for every bit of effort they invest in their studies.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold mb-3">Expertise &amp; Passions</p>
                    <div className="flex flex-wrap gap-2">
                      {['AI / Machine Learning', 'Full-Stack Dev', 'EdTech', 'Product Design', 'Next.js', 'Supabase', 'Student Welfare', 'Startup Vision'].map((tag) => (
                        <span key={tag} className="skill-tag px-3 py-1 rounded-lg text-xs font-medium text-purple-300 cursor-default">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quote */}
              <div className="mt-8 pt-8 border-t border-white/5">
                <blockquote className="text-center">
                  <p className="text-lg md:text-xl text-gray-300 font-medium italic leading-relaxed">
                    &ldquo;Education should know no boundaries. Every student deserves a smart study partner — their own <span className="text-purple-400 font-bold not-italic">Saathi</span>.&rdquo;
                  </p>
                  <footer className="mt-3 text-sm text-gray-600">— Sanjay Satya, Founder &amp; CEO, YourSaathi</footer>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Connect With Us */}
        <div className="text-center mt-16 p-8 rounded-3xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 animate-fade-up delay-500">
          <h2 className="text-2xl font-bold text-white mb-4">Connect With Us</h2>
          <p className="text-gray-300 mb-8 max-w-lg mx-auto">
            Join our growing community of learners! Follow us on social media for daily quiz challenges, platform updates, and learning tips.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Instagram */}
            <a
              href="https://instagram.com/yoursaathi_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Instagram className="w-5 h-5" />
              @yoursaathi_ai
            </a>

            {/* Contact */}
            <Link
              href="/contact"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-black/40 border border-white/10 text-white hover:bg-black/60 font-semibold transition-all hover:-translate-y-0.5"
            >
              <Mail className="w-5 h-5 text-gray-400" />
              Contact Team
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}

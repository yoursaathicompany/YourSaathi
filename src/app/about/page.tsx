import { Metadata } from 'next';
import { Target, Users, BookOpen, Sparkles, Instagram, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us | YourSaathi',
  description: 'Learn more about YourSaathi, our mission, and the team behind the AI-powered learning platform.',
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen pt-8 pb-20">
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center mb-4">
            <Image
              src="/logo-yoursaathi.png"
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
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Empowering students with AI-driven interactive learning, making exam preparation smarter, faster, and more rewarding.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-[#121214] p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              To democratize high-quality education by providing instant, verified, and personalized
              practice quizzes for every subject and difficulty level. We believe that testing your knowledge
              should be accessible to everyone, anywhere, at any time.
            </p>
          </div>

          <div className="bg-white dark:bg-[#121214] p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Learn & Earn</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We know that staying motivated can be tough. That&apos;s why we built a learn-and-earn ecosystem
              where your actual performance directly translates into digital coins, which you can later redeem
              for real-world rewards. You put in the hard work, and we reward you for it.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Why Choose Us?</h2>
          <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-8 border border-gray-200 dark:border-white/10">
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Infinite Practice ♾️</h3>
                  <p className="text-gray-600 dark:text-gray-300">Generate quizzes on practically any topic under the sun, powered by state-of-the-art AI generation pipelines.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Rigorously Verified ✅</h3>
                  <p className="text-gray-600 dark:text-gray-300">All our AI-generated content goes through rigorous verification checks before making it to your screen to guarantee factual accuracy.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Adaptable Difficulty 📈</h3>
                  <p className="text-gray-600 dark:text-gray-300">Whether you are a middle schooler brushing up on basics or a high schooler preparing for competitive exams, we adapt to you.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Connect With Us */}
        <div className="text-center mt-16 p-8 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-500/20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Connect With Us</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
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

            {/* Email */}
            <Link
              href="/contact"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-black/60 font-semibold transition-all hover:-translate-y-0.5"
            >
              <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              Contact Team
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}

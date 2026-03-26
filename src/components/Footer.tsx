import Link from 'next/link';
import { Instagram, Mail, BrainCircuit, BookOpen, Shield, FileText, Info, Sparkles } from 'lucide-react';

const currentYear = new Date().getFullYear();

const topicLinks = [
  { href: '/topics/math', label: 'Mathematics & Logic' },
  { href: '/topics/science', label: 'Science & Nature' },
  { href: '/topics/cs', label: 'Computer Science' },
  { href: '/topics/history', label: 'World History' },
  { href: '/topics/comp', label: 'Competitive Exams' },
  { href: '/topics/business', label: 'Business & Finance' },
];

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy', icon: Shield },
  { href: '/terms', label: 'Terms of Service', icon: FileText },
  { href: '/about', label: 'About Us', icon: Info },
  { href: '/contact', label: 'Contact Us', icon: Mail },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#09090b]/90 backdrop-blur-xl">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand col */}
          <div className="lg:col-span-1 space-y-5">
            <Link href="/" className="flex items-center gap-1 group w-fit">
              <span className="font-black text-[32px] text-purple-500 leading-none">Y</span>
              <span className="font-bold text-gray-900 dark:text-white text-2xl tracking-tight">Saathi</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              AI-powered quiz platform to help you learn faster, practice smarter, and earn while you grow. Your preparation partner.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/yoursaathi_ai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow YourSaathi on Instagram"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-400 hover:from-pink-500/20 hover:to-purple-500/20 transition-all text-sm font-semibold"
              >
                <Instagram className="w-4 h-4" />
                @yoursaathi_ai
              </a>
              <a
                href="mailto:yoursaathicompany@gmail.com"
                aria-label="Email YourSaathi support"
                className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-purple-500 hover:border-purple-500/30 transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Study Topics */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" /> Study Topics
            </h3>
            <ul className="space-y-3">
              {topicLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-purple-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Company */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" /> Company
            </h3>
            <ul className="space-y-3">
              {legalLinks.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors flex items-center gap-2 group"
                  >
                    <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Disclaimer */}
            <div className="pt-2 border-t border-gray-200 dark:border-white/5">
              <p className="text-xs text-gray-400 leading-relaxed">
                <span className="font-semibold text-gray-500 dark:text-gray-300">Disclaimer:</span> All AI-generated quiz content is provided for educational purposes only. While we strive for accuracy, we recommend verifying critical information from authoritative sources.
              </p>
            </div>
          </div>

          {/* Features / CTA */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" /> Why YourSaathi?
            </h3>
            <ul className="space-y-3">
              {[
                { emoji: '🧠', text: 'AI-generated custom quizzes' },
                { emoji: '🎯', text: 'Multiple difficulty levels' },
                { emoji: '🪙', text: 'Earn coins for correct answers' },
                { emoji: '💸', text: 'Redeem coins for real money' },
                { emoji: '📚', text: 'Study guides on 11+ topics' },
                { emoji: '🚀', text: 'Track quiz history & progress' },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-base">{item.emoji}</span>
                  {item.text}
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5"
            >
              <BrainCircuit className="w-4 h-4" /> Start Learning Free
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            © {currentYear} <span className="font-semibold text-gray-600 dark:text-gray-300">YourSaathi</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-purple-400 transition-colors">Terms</Link>
            <span>·</span>
            <span>Made with ❤️ in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

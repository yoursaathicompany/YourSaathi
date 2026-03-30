import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — YourSaathi',
  description: 'Read the Terms of Service for using YourSaathi. Covers quiz rules, coin earning policies, coin redemption via UPI, fair play, and user responsibilities.',
  keywords: ['yoursaathi terms', 'yoursaathi terms of service', 'quiz platform rules', 'coin redemption policy', 'yoursaathi fair play'],
  alternates: { canonical: 'https://www.yoursaathi.site/terms' },
  openGraph: {
    title: 'Terms of Service — YourSaathi',
    description: 'YourSaathi Terms of Service: quiz rules, coin earning, UPI redemption policy.',
    url: 'https://www.yoursaathi.site/terms',
    type: 'website',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen pt-8 pb-20">
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-4xl font-black mb-4">Terms of Service</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        {/* Content */}
        <div className="prose prose-purple prose-invert max-w-none space-y-8 text-gray-600 text-gray-300">
          
          <section>
            <h2 className="text-2xl font-bold text-white text-white mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing or using the YourSaathi platform ("the Service"), you agree to be bound by 
              these Terms of Service. If you disagree with any part of these terms, you may not access 
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white text-white mb-4">2. Description of Service</h2>
            <p>
              YourSaathi is an AI-powered educational platform that allows users to generate practice quizzes, 
              take assessments, and earn digital coins ("Coins") based on their performance. Coins can subsequently 
              be redeemed for real monetary rewards via UPI transfers, subject to the conditions outlined below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white text-white mb-4">3. User Accounts</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>You are responsible for safeguarding your account credentials.</li>
              <li>You may not use another user's account without permission.</li>
              <li>We reserve the right to terminate accounts that violate our terms or engage in fraudulent activities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white text-white mb-4">4. Earning and Redeeming Coins</h2>
            <h3 className="text-xl font-semibold text-white text-white mb-2 mt-4">Fair Play and Anti-Cheat</h3>
            <p className="mb-4">
              Coins are awarded strictly for legitimate quiz completion. Any attempt to manipulate, automate 
              (e.g., using bots or scripts), exploit bugs, or bypass the intended tracking of quiz scores to 
              generate artificial Coins will result in immediate account termination and forfeiture of all Coins.
            </p>

            <h3 className="text-xl font-semibold text-white text-white mb-2 mt-4">Redemptions</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Coins have no intrinsic real-world value outside the YourSaathi platform until a valid withdrawal request is approved.</li>
              <li>Withdrawals require reaching specific minimum Coin tiers.</li>
              <li>Payouts are subject to manual review by administrators (averaging 1-3 business days).</li>
              <li>We reserve the right to temporarily suspend redemptions or alter the conversion rates at any time.</li>
              <li>You must provide a valid UPI ID belonging to you to receive funds. We are not responsible for payouts sent to incorrect UPI IDs provided by you.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white text-white mb-4">5. User-Generated and AI-Generated Content</h2>
            <p className="mb-4">
              Quizzes generated via AI on our platform are provided "as-is." While we strive for accuracy, 
              we do not guarantee that all AI-generated questions or answers are flawless. You are solely 
              responsible for verifying the information.
            </p>
            <p>
              Users must not use the AI generation tools to create offensive, adult, illegal, or malicious 
              content. Violations will result in a permanent ban.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white text-white mb-4">6. Limitation of Liability</h2>
            <p>
              In no event shall YourSaathi, nor its directors, employees, partners, agents, suppliers, 
              or affiliates, be liable for any indirect, incidental, special, consequential or punitive 
              damages, including without limitation, loss of profits, data, use, goodwill, or other 
              intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white text-white mb-4">7. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, 
              for any reason whatsoever, including without limitation if you breach the Terms. 
              Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white text-white mb-4">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2 text-purple-400 font-semibold">
              <a href="mailto:yoursaathicompany@gmail.com" className="hover:underline">yoursaathicompany@gmail.com</a>
            </p>
          </section>

        </div>

        {/* Footer Link */}
        <div className="mt-16 pt-8 border-t border-white/10 border-white/10 text-center">
          <Link href="/contact" className="text-sm text-gray-500 hover:text-white text-gray-400 hover:text-white transition-colors">
            Return to Contact Page
          </Link>
        </div>

      </main>
    </div>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | YourSaathi',
  description: 'Learn how YourSaathi collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-8 pb-20">
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-4xl font-black mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-purple max-w-none space-y-8 text-gray-300">
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p>
              Welcome to YourSaathi ("we," "our," or "us"). We are committed to protecting your privacy 
              and ensuring the security of your personal information. This Privacy Policy explains how we 
              collect, use, disclose, and safeguard your information when you visit our website or use our 
              services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-white mb-2 mt-4">Personal Information</h3>
            <p className="mb-4">
              When you register for an account, participate in quizzes, or communicate with us, we may collect:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Name and email address (via Google/OAuth providers)</li>
              <li>Profile picture/avatar URL</li>
              <li>Payment and payout details (e.g., UPI ID) when you redeem coins</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-2 mt-6">Usage Data</h3>
            <p className="mb-4">
              We automatically collect certain information when you visit, use, or navigate the platform:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Quiz performance, scores, and completion times</li>
              <li>Coin balances, earnings, and withdrawal history</li>
              <li>Device information and IP address for security purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use the collected information for various purposes, including to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide, operate, and maintain our platform</li>
              <li>Process transactions, including coin redemptions and payouts</li>
              <li>Personalize your learning experience and generate AI quizzes</li>
              <li>Analyze usage trends to improve our services</li>
              <li>Communicate with you regarding updates, support, and security alerts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Sharing Your Information</h2>
            <p>
              We do not sell your personal information. We may share information with trusted third-party 
              service providers (e.g., hosting providers, payment processors, AI integration APIs) strictly 
              for the purpose of operating our platform. These third parties are bound by confidentiality 
              agreements. We may also disclose information if required by law or to protect our rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information from 
              unauthorized access, alteration, disclosure, or destruction. However, please note that no 
              method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information. If you wish to 
              exercise these rights, or if you have any questions about our privacy practices, please 
              contact us. Note that deleting your account will result in the forfeiture of any accumulated coins.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Changes to This Policy</h2>
            <p>
              We reserve the right to modify this Privacy Policy at any time. Any changes will be effective 
              immediately upon posting the updated policy on this page. We encourage you to review this 
              page periodically for any updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please reach out to us at:
            </p>
            <p className="mt-2 text-purple-400 font-semibold">
              <a href="mailto:yoursaathicompany@gmail.com" className="hover:underline">yoursaathicompany@gmail.com</a>
            </p>
          </section>

        </div>

        {/* Footer Link */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
            Return to Contact Page
          </Link>
        </div>

      </main>
    </div>
  );
}

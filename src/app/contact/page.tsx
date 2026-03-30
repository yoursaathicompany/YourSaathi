import { Metadata } from 'next';
import { Mail, MessageSquare, Clock, Globe } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact YourSaathi — Support & Feedback',
  description: 'Get in touch with the YourSaathi team for support, feedback, bug reports, or general inquiries. We respond within 24-48 hours.',
  keywords: ['contact yoursaathi', 'yoursaathi support', 'yoursaathi feedback', 'yoursaathicompany@gmail.com'],
  alternates: { canonical: 'https://www.yoursaathi.site/contact' },
  openGraph: {
    title: 'Contact YourSaathi — Support & Feedback',
    description: 'Reach out to the YourSaathi team for any questions, bug reports, or feedback.',
    url: 'https://www.yoursaathi.site/contact',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function ContactUsPage() {
  const supportEmail = 'yoursaathicompany@gmail.com'; // Replace with your actual support email
  const mailtoLink = `mailto:${supportEmail}?subject=Support Request - YourSaathi&body=Hi YourSaathi Team,%0D%0A%0D%0AI need help with...`;

  return (
    <div className="min-h-screen flex flex-col pt-8">

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Have a question, feedback, or facing an issue? We're here to help!
            Drop us an email and our team will get back to you.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">

          {/* Email Card (Primary Action) */}
          <a
            href={mailtoLink}
            className="group relative overflow-hidden rounded-3xl p-8 bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col items-center text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Mail className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-white text-white mb-2">Email Support</h2>
            <p className="text-gray-400 mb-6">
              Send us an email directly. Best for detailed questions, bug reports, or account issues.
            </p>

            <span className="inline-flex items-center gap-2 text-purple-400 font-semibold group-hover:text-purple-300">
              {supportEmail}
              <MessageSquare className="w-4 h-4" />
            </span>
          </a>

          {/* Info Card */}
          <div className="rounded-3xl p-8 bg-white/[0.02] border border-white/5 flex flex-col justify-center space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white text-white mb-1">Response Time</h3>
                <p className="text-gray-400 text-sm">
                  We aim to respond to all inquiries within 24-48 hours during business days.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white text-white mb-1">Global Support</h3>
                <p className="text-gray-400 text-sm">
                  Our team is distributed, but support is primarily provided in English and Hindi.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom CTA / Links */}
        <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20">
          <p className="text-gray-400 mb-4">
            Looking for quick answers? You might find what you need in our terms or privacy policy.
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link href="/terms" className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors hover:underline">
              Terms of Service
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/privacy" className="text-sm font-semibold text-pink-400 hover:text-pink-300 transition-colors hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}

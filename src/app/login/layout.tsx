import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In to YourSaathi — Start Learning & Earning',
  description: 'Sign in or create your free YourSaathi account to access AI quizzes, practice PYQs for CBSE, JEE, NEET, UPSC and earn real coins for correct answers.',
  keywords: ['yoursaathi login', 'yoursaathi sign up', 'yoursaathi register', 'create account yoursaathi'],
  alternates: { canonical: 'https://your-saathi.vercel.app/login' },
  robots: { index: false, follow: false }, // No-index login pages for SEO hygiene
  openGraph: {
    title: 'Sign In to YourSaathi',
    description: 'Access your YourSaathi account and start practicing quizzes and PYQs.',
    url: 'https://your-saathi.vercel.app/login',
    type: 'website',
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

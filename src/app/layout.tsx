import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SessionProvider } from "@/components/providers/SessionProvider";
import Navbar from "@/components/Navbar";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = 'https://www.yoursaathi.site';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  title: {
    default: 'YourSaathi — AI Quiz Generator & PYQ Practice for Students',
    template: '%s | YourSaathi',
  },
  description: 'YourSaathi is India\'s AI-powered quiz platform. Generate custom quizzes on any topic, practice CBSE Class 10-12 PYQs, JEE, NEET, UPSC previous year questions, and earn real coins while you learn.',
  keywords: [
    'yoursaathi', 'AI quiz generator India', 'previous year questions', 'PYQ',
    'CBSE Class 10 PYQ', 'CBSE Class 12 PYQ', 'JEE previous year questions',
    'NEET PYQ', 'UPSC previous year papers', 'SSC CGL PYQ',
    'online quiz practice', 'AI learning platform India', 'earn coins learning',
    'quiz app for students', 'practice test generator', 'learn and earn app',
    'AI powered education', 'board exam preparation', 'competitive exam practice',
    'Class 10 science quiz', 'Class 12 physics MCQ', 'JEE Main mock test',
    'NEET biology questions', 'UPSC GS questions', 'free online quiz India',
  ],
  authors: [{ name: 'YourSaathi Team', url: BASE_URL }],
  creator: 'YourSaathi',
  publisher: 'YourSaathi',
  category: 'Education',
  classification: 'Education / Test Preparation',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: 'tM-8E7-jGEUoY_iM20rwU2LYKxXMFz9bM38YIeUWRmE',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    title: 'YourSaathi — AI Quiz Generator & PYQ Practice',
    description: 'Practice with AI-generated quizzes and real PYQs for CBSE, JEE, NEET, UPSC & SSC. Earn coins for every correct answer.',
    siteName: 'YourSaathi',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'YourSaathi — AI-Powered Quiz Platform for Indian Students',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YourSaathi — AI Quiz Generator & PYQ Practice',
    description: 'Generate quizzes on any topic. Practice CBSE, JEE, NEET, UPSC PYQs. Earn real coins while you study.',
    images: ['/og-image.png'],
    creator: '@yoursaathi',
    site: '@yoursaathi',
  },
  other: {
    'google-adsense-account': 'ca-pub-4043118352636472',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b] text-white min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <SessionProvider>
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
          </SessionProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "YourSaathi",
                "url": "https://www.yoursaathi.site",
                "description": "India's AI-powered quiz platform for CBSE, JEE, NEET, UPSC previous year questions and custom quiz generation.",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": { "@type": "EntryPoint", "urlTemplate": "https://www.yoursaathi.site/?q={search_term_string}" },
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "YourSaathi",
                "url": "https://www.yoursaathi.site",
                "logo": "https://www.yoursaathi.site/logo.svg",
                "sameAs": ["https://instagram.com/yoursaathi_ai"],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "email": "yoursaathicompany@gmail.com",
                  "contactType": "customer support",
                  "availableLanguage": ["English", "Hindi"]
                }
              }
            ])
          }}
        />
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4043118352636472"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SessionProvider } from "@/components/providers/SessionProvider";
import Navbar from "@/components/Navbar";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://yoursaathi.com'),
  title: "YourSaathi | AI-Powered Learning",
  description: "YourSaathi is an AI-powered quiz generation platform that helps you create and take quizzes on any topic. Boost your preparation and earn coins while you learn.",
  keywords: [
    "yoursaathi",
    "yoursaathi quiz",
    "yoursaathi student",
    "AI quiz generator",
    "practice quizzes online",
    "online assessment platform",
    "learn and earn",
    "AI powered learning",
    "student preparation",
    "create quizzes",
    "yoursaathi platform",
    "best quiz app"
  ],
  authors: [{ name: "YourSaathi Team" }],
  creator: "YourSaathi",
  publisher: "YourSaathi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "YourSaathi | AI-Powered Learning",
    description: "Instantly create high-quality, rigorously verified practice tests on any topic, at any difficulty level with YourSaathi.",
    siteName: "YourSaathi",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YourSaathi - AI-Powered Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YourSaathi | AI-Powered Learning",
    description: "Instantly create high-quality practice tests on any topic and earn coins while you learn with YourSaathi.",
    images: ["/og-image.png"],
    creator: "@yoursaathi",
  },
  other: {
    "google-adsense-account": "ca-pub-4043118352636472",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-950 dark:bg-[#09090b] dark:text-white min-h-screen transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <SessionProvider>
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
          </SessionProvider>
        </ThemeProvider>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4043118352636472"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

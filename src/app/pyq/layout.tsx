import type { Metadata } from 'next';

const BASE_URL = 'https://www.yoursaathi.site';

export const metadata: Metadata = {
  title: 'PYQ Practice — CBSE, JEE, NEET, UPSC Previous Year Questions',
  description: 'Practice with AI-generated Previous Year Questions for CBSE Class 10, 11, 12, JEE Main, JEE Advanced, NEET, UPSC Prelims, and SSC CGL. Instant explanations. Real exam patterns.',
  keywords: [
    'PYQ', 'previous year questions', 'CBSE PYQ', 'JEE Main PYQ', 'NEET PYQ',
    'UPSC previous year papers', 'SSC CGL previous papers', 'Class 10 PYQ',
    'Class 12 board exam questions', 'JEE Advanced previous papers',
    'NEET biology PYQ', 'CBSE Class 12 physics PYQ', 'free PYQ practice',
    'board exam previous year questions', 'competitive exam PYQ India',
  ],
  alternates: { canonical: `${BASE_URL}/pyq` },
  openGraph: {
    title: 'PYQ Practice — CBSE, JEE, NEET, UPSC Previous Year Questions | YourSaathi',
    description: 'Practice real previous year exam questions for Class 10-12, JEE, NEET, UPSC and SSC with instant AI explanations.',
    url: `${BASE_URL}/pyq`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PYQ Practice on YourSaathi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PYQ Practice — CBSE, JEE, NEET, UPSC | YourSaathi',
    description: 'Practice real PYQs for all major Indian exams with AI explanations.',
    images: ['/og-image.png'],
  },
};

export default function PYQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Previous Year Questions — YourSaathi",
            "description": "Practice previous year questions for CBSE Class 10-12, JEE, NEET, UPSC and SSC exams",
            "url": `${BASE_URL}/pyq`,
            "numberOfItems": 22,
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "CBSE Class 10 Mathematics PYQ", "url": `${BASE_URL}/pyq/cbse10-math` },
              { "@type": "ListItem", "position": 2, "name": "CBSE Class 10 Science PYQ", "url": `${BASE_URL}/pyq/cbse10-science` },
              { "@type": "ListItem", "position": 3, "name": "CBSE Class 12 Physics PYQ", "url": `${BASE_URL}/pyq/cbse12-physics` },
              { "@type": "ListItem", "position": 4, "name": "JEE Main Physics PYQ", "url": `${BASE_URL}/pyq/jee-main-physics` },
              { "@type": "ListItem", "position": 5, "name": "NEET Biology PYQ", "url": `${BASE_URL}/pyq/neet-biology` },
              { "@type": "ListItem", "position": 6, "name": "UPSC Prelims GS Paper 1 PYQ", "url": `${BASE_URL}/pyq/upsc-gs1` },
            ]
          })
        }}
      />
      {children}
    </>
  );
}

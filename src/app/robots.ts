import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yoursaathi.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/profile/',
        '/settings/',
        '/history/',
        '/redeem/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

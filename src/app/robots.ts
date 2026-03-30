import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.yoursaathi.site';

  return {
    rules: [
      {
        // Allow all good crawlers
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/profile/',
          '/settings/',
          '/history/',
          '/redeem/',
          '/quiz/play',   // Dynamic play pages shouldn't be indexed
          '/pyq/play',    // Dynamic play pages shouldn't be indexed
        ],
      },
      {
        // Block bad bots entirely
        userAgent: ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot'],
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

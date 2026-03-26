import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Hardcoded to production domain — NEXT_PUBLIC_APP_URL is localhost in .env
  // To update: change this URL or set NEXT_PUBLIC_APP_URL in Vercel env dashboard
  const baseUrl = 'https://your-saathi.vercel.app';

  const topicIds = ['math', 'science', 'cs', 'history', 'lit', 'comp', 'geo', 'art', 'music', 'health', 'business'];

  const topicPages: MetadataRoute.Sitemap = topicIds.map((id) => ({
    url: `${baseUrl}/topics/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quiz`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...topicPages,
  ];
}

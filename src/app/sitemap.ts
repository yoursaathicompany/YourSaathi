import { MetadataRoute } from 'next';
import { topicsData } from '@/data/topics';
import { PYQ_CATALOG } from '@/lib/pyqData';
import { blogPosts } from '@/data/blogData';
import { courseModules } from '@/data/courseData';
import { animationCourseModules } from '@/data/animationCourseData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.yoursaathi.site').replace(/\/$/, '');
  const now = new Date();

  // Topic pages
  const topicPages: MetadataRoute.Sitemap = Object.keys(topicsData).map((id) => ({
    url: `${baseUrl}/topics/${id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // PYQ subject pages
  const pyqPages: MetadataRoute.Sitemap = PYQ_CATALOG.map((entry) => ({
    url: `${baseUrl}/pyq/${entry.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    // Core
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/pyq`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },

    // Topic quiz pages
    ...topicPages,

    // PYQ subject drill-down pages  
    ...pyqPages,

    // Company pages
    { url: `${baseUrl}/about`,   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/blog`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${baseUrl}/terms`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },

    // Blog post pages
    ...blogPosts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),

    // Course pages — ML & AI
    { url: `${baseUrl}/courses`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    ...courseModules.map((m) => ({
      url: `${baseUrl}/courses/${m.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),

    // Course pages — Animation & CGI
    { url: `${baseUrl}/courses/animation`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    ...animationCourseModules.map((m) => ({
      url: `${baseUrl}/courses/animation/${m.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ];
}

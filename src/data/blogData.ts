export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  emoji: string;
  coverImage: string;
  featured?: boolean;
};

export const blogCategories = [
  'All',
  'Study Tips',
  'Platform Updates',
  'Founder Story',
  'Exam Guides',
  'EdTech',
];

export const blogPosts: BlogPost[] = [
  {
    slug: 'yoursaathi-story-building-ai-quiz-platform',
    title: 'From Frustration to Launch: How YourSaathi Was Born',
    excerpt:
      'At 22, with a BCA degree and a burning frustration over the lack of affordable study tools, Sanjay Satya built India\'s first learn-and-earn AI quiz platform entirely from scratch. This is that unfiltered story.',
    author: 'Sanjay Satya',
    date: 'April 5, 2026',
    readTime: '8 min read',
    category: 'Founder Story',
    tags: ['founder', 'startup', 'yoursaathi', 'edtech'],
    emoji: '🚀',
    coverImage: '/og-image.png',
    featured: true,
  },
  {
    slug: 'top-10-study-tips-jee-neet-2026',
    title: '10 AI-Backed Study Strategies for JEE & NEET 2026',
    excerpt:
      'Forget rote memorisation. Discover ten science-backed, AI-assisted study techniques that top rankers actually use — and how YourSaathi helps you apply each one automatically.',
    author: 'YourSaathi Team',
    date: 'April 3, 2026',
    readTime: '6 min read',
    category: 'Study Tips',
    tags: ['JEE', 'NEET', 'study tips', 'AI learning'],
    emoji: '🎯',
    coverImage: '/og-image.png',
  },
  {
    slug: 'how-ai-is-changing-education-india',
    title: 'How Generative AI Is Reshaping Education in India',
    excerpt:
      'From personalised quizzes to real-time feedback, AI is quietly revolutionising how millions of Indian students learn. Here\'s what teachers, students, and edtech founders are saying.',
    author: 'YourSaathi Team',
    date: 'March 30, 2026',
    readTime: '5 min read',
    category: 'EdTech',
    tags: ['AI', 'education', 'India', 'future of learning'],
    emoji: '🤖',
    coverImage: '/og-image.png',
  },
  {
    slug: 'complete-cbse-class-12-board-preparation-guide',
    title: 'The Complete CBSE Class 12 Board Prep Guide for 2026',
    excerpt:
      'Chapter-by-chapter breakdowns, best resources, time-table templates, and how to use YourSaathi\'s PYQ engine to score 90+ in every subject.',
    author: 'YourSaathi Team',
    date: 'March 27, 2026',
    readTime: '10 min read',
    category: 'Exam Guides',
    tags: ['CBSE', 'Class 12', 'board exam', 'study plan'],
    emoji: '📚',
    coverImage: '/og-image.png',
  },
  {
    slug: 'earn-coins-redeem-cash-yoursaathi',
    title: 'How the YourSaathi Coin System Actually Works',
    excerpt:
      'You earn coins for every correct answer. But how do they convert to real money? We break down the math, the eligibility criteria, and share tips to maximise your rewards.',
    author: 'Sanjay Satya',
    date: 'March 24, 2026',
    readTime: '4 min read',
    category: 'Platform Updates',
    tags: ['coins', 'rewards', 'learn and earn', 'platform'],
    emoji: '🪙',
    coverImage: '/og-image.png',
  },
  {
    slug: 'upsc-prelims-strategy-previous-year-questions',
    title: 'Cracking UPSC Prelims: Why Previous Year Questions Are Your Superpower',
    excerpt:
      'UPSC veterans agree — solving 10 years of PYQs is more valuable than reading 10 textbooks. We explain why, and how YourSaathi\'s PYQ drill mode makes this process lightning fast.',
    author: 'YourSaathi Team',
    date: 'March 20, 2026',
    readTime: '7 min read',
    category: 'Exam Guides',
    tags: ['UPSC', 'PYQ', 'prelims', 'strategy'],
    emoji: '🏛️',
    coverImage: '/og-image.png',
  },
  {
    slug: 'yoursaathi-growth-milestones-2026',
    title: 'YourSaathi Growth Update: Our Milestones So Far',
    excerpt:
      'From 0 to thousands of quizzes generated in just a few months — here\'s a transparent look at how YourSaathi is growing, what\'s working, and what\'s coming next.',
    author: 'Sanjay Satya',
    date: 'March 15, 2026',
    readTime: '5 min read',
    category: 'Platform Updates',
    tags: ['growth', 'milestones', 'startup', 'update'],
    emoji: '📈',
    coverImage: '/og-image.png',
  },
  {
    slug: 'quiz-yourself-daily-habit-science',
    title: 'The Science of Daily Quizzing: Why Testing Beats Re-reading',
    excerpt:
      'Cognitive science has proven that retrieval practice (self-testing) is 2–3× more effective than re-reading notes. Here\'s the research, and here\'s how to build the habit.',
    author: 'YourSaathi Team',
    date: 'March 10, 2026',
    readTime: '5 min read',
    category: 'Study Tips',
    tags: ['learning science', 'retrieval practice', 'study habit', 'memory'],
    emoji: '🧠',
    coverImage: '/og-image.png',
  },
];

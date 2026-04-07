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
  'Productivity',
];

export const blogPosts: BlogPost[] = [
  {
    slug: 'ai-revision-strategy-competitive-exams-2026',
    title: 'How to Build a Winning Revision Strategy for Competitive Exams with AI',
    excerpt:
      'Mastering NEET, JEE, or UPSC requires more than hard work; it requires smart revision. Learn how AI-curated quizzes and targeted flashcards can optimize your study schedule and boost retention.',
    author: 'YourSaathi Team',
    date: 'April 6, 2026',
    readTime: '6 min read',
    category: 'Study Tips',
    tags: ['AI learning', 'revision strategy', 'NEET', 'JEE', 'exam prep'],
    emoji: '🧠',
    coverImage: '/og-image.png',
  },
  {
    slug: 'learn-to-earn-future-online-education-india',
    title: 'Learn-to-Earn: The Future of Online Education in India',
    excerpt:
      'Is rewarding learning with real money the ultimate motivation tool for Indian students? We explore the learn-to-earn EdTech model, its impact on student engagement, and how YourSaathi is pioneering this shift.',
    author: 'Sanjay Satya',
    date: 'April 6, 2026',
    readTime: '5 min read',
    category: 'EdTech',
    tags: ['learn and earn', 'edtech future', 'student motivation', 'India'],
    emoji: '🇮🇳',
    coverImage: '/og-image.png',
  },
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
  {
    slug: 'pomodoro-technique-for-students-2026',
    title: 'Mastering the Pomodoro Technique: A Student\'s Guide to Laser Focus',
    excerpt:
      'Struggling with attention span? The Pomodoro technique is a game-changer. Learn how to structure your study sessions in 25-minute sprints for maximum productivity without burnout.',
    author: 'YourSaathi Team',
    date: 'April 8, 2026',
    readTime: '4 min read',
    category: 'Productivity',
    tags: ['pomodoro', 'focus', 'time management', 'productivity'],
    emoji: '⏱️',
    coverImage: '/og-image.png',
  },
  {
    slug: 'overcoming-procrastination-study-hacks',
    title: '5 Neuroscience Hacks to Beat Procrastination Instantly',
    excerpt:
      'Procrastination is an emotional regulation problem, not a time management one. Discover 5 neuroscience-backed methods to trick your brain into starting your study sessions.',
    author: 'YourSaathi Team',
    date: 'April 9, 2026',
    readTime: '6 min read',
    category: 'Productivity',
    tags: ['procrastination', 'neuroscience', 'productivity hacks'],
    emoji: '🚀',
    coverImage: '/og-image.png',
  },
  {
    slug: 'digital-minimalism-student-focus',
    title: 'Digital Minimalism for Students: Reclaiming Your Attention',
    excerpt:
      'Smartphones are designed to steal your focus. Here is a practical guide to digital minimalism during exam seasons, ensuring you control your devices instead of them controlling you.',
    author: 'YourSaathi Team',
    date: 'April 10, 2026',
    readTime: '5 min read',
    category: 'Productivity',
    tags: ['digital minimalism', 'focus', 'distraction free', 'productivity'],
    emoji: '📱',
    coverImage: '/og-image.png',
  },
  {
    slug: 'eat-the-frog-study-method',
    title: 'Eat The Frog: Why Tackling the Hardest Subject First Works',
    excerpt:
      'Mark Twain famously said to "eat a live frog first thing in the morning." Here is how applying this strategy to your hardest subjects can double your study output.',
    author: 'YourSaathi Team',
    date: 'April 11, 2026',
    readTime: '4 min read',
    category: 'Productivity',
    tags: ['eat the frog', 'study strategy', 'productivity', 'efficiency'],
    emoji: '🐸',
    coverImage: '/og-image.png',
  },
  {
    slug: 'sleep-optimization-for-exam-prep',
    title: 'The Ultimate Sleep Guide for Better Memory Retention',
    excerpt:
      'Pulling an all-nighter is the worst thing for your grades. Uncover the science of REM sleep, memory consolidation, and how to optimize your sleep schedule for exam season.',
    author: 'YourSaathi Team',
    date: 'April 12, 2026',
    readTime: '7 min read',
    category: 'Productivity',
    tags: ['sleep', 'memory retention', 'productivity', 'health'],
    emoji: '💤',
    coverImage: '/og-image.png',
  },
  {
    slug: 'flow-state-deep-work-students',
    title: 'Achieving Flow State: Deep Work for Students',
    excerpt:
      'Cal Newport\'s concept of Deep Work is essential for cracking tough exams. Learn how to enter a "flow state" where hours feel like minutes and complex topics finally click.',
    author: 'YourSaathi Team',
    date: 'April 13, 2026',
    readTime: '6 min read',
    category: 'Productivity',
    tags: ['deep work', 'flow state', 'productivity', 'study habits'],
    emoji: '🌊',
    coverImage: '/og-image.png',
  },
  {
    slug: 'note-taking-systems-notion-obsidian',
    title: 'Building a Second Brain: Note-Taking Systems that Actually Work',
    excerpt:
      'Are you still taking linear notes? Explore dynamic systems using Notion or Obsidian to connect ideas, retain information longer, and boost your productivity drastically.',
    author: 'YourSaathi Team',
    date: 'April 14, 2026',
    readTime: '8 min read',
    category: 'Productivity',
    tags: ['note taking', 'second brain', 'notion', 'productivity'],
    emoji: '📓',
    coverImage: '/og-image.png',
  },
  {
    slug: 'nutrition-brain-food-study-sessions',
    title: 'Brain Food: What to Eat for Maximum Focus and Energy',
    excerpt:
      'Sugar crashes ruin study sessions. A comprehensive look at the best brain-boosting snacks, hydration strategies, and meals to keep your cognitive performance peaking all day.',
    author: 'YourSaathi Team',
    date: 'April 15, 2026',
    readTime: '5 min read',
    category: 'Productivity',
    tags: ['nutrition', 'brain food', 'focus', 'productivity'],
    emoji: '🥑',
    coverImage: '/og-image.png',
  },
  {
    slug: 'spaced-repetition-algorithm-secrets',
    title: 'The Math of Memory: Unleashing Spaced Repetition',
    excerpt:
      'We forget 70% of what we read within 24 hours. Dive deep into the algorthims behind spaced repetition and how tools like YourSaathi ensure you never forget what you\'ve learned.',
    author: 'YourSaathi Team',
    date: 'April 16, 2026',
    readTime: '6 min read',
    category: 'Productivity',
    tags: ['spaced repetition', 'memory', 'productivity hacks', 'learning'],
    emoji: '📈',
    coverImage: '/og-image.png',
  },
  {
    slug: 'morning-routines-of-top-students',
    title: 'Morning Routines of Top 1% Students',
    excerpt:
      'How you start your day determines how you study. We analyzed the morning habits of top NEET and JEE rankers. Here is a blueprint you can implement tomorrow.',
    author: 'YourSaathi Team',
    date: 'April 17, 2026',
    readTime: '5 min read',
    category: 'Productivity',
    tags: ['morning routine', 'habits', 'productivity', 'success'],
    emoji: '🌅',
    coverImage: '/og-image.png',
  },
];

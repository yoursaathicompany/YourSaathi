'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/data/blogData';

type Props = {
  posts: BlogPost[];
  categories: string[];
  featuredSlug?: string;
};

export default function BlogGrid({ posts, categories, featuredSlug }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      // Hide featured post from grid only if viewing 'All' and no search
      if (activeCategory === 'All' && !searchQuery && p.slug === featuredSlug) return false;
      
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  return (
    <div id="articles">
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            🔍
          </span>
          <input
            id="blog-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 text-sm transition-all"
            aria-label="Search blog articles"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`blog-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActiveCategory(cat)}
              className={`cat-pill px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/30'
              }`}
              aria-pressed={activeCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">🔍</span>
          <p className="text-gray-500 text-lg">No articles found. Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, idx) => (
            <ArticleCard key={post.slug} post={post} delay={idx * 80} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleCard({ post, delay }: { post: BlogPost; delay: number }) {
  const categoryColors: Record<string, string> = {
    'Study Tips':       'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    'Platform Updates': 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
    'Founder Story':    'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
    'Exam Guides':      'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
    'EdTech':           'from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-400',
  };
  const colorClass = categoryColors[post.category] ?? 'from-white/10 to-white/5 border-white/20 text-gray-400';

  return (
    <Link
      href={`/blog/${post.slug}`}
      id={`blog-card-${post.slug}`}
      className="blog-card group block rounded-2xl bg-[#0e0e12] border border-white/8 overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
      aria-label={`Read: ${post.title}`}
    >
      {/* Cover */}
      <div className="relative h-40 bg-gradient-to-br from-[#1a0a2e] to-[#0a0a14] flex items-center justify-center overflow-hidden">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-500 select-none">
          {post.emoji}
        </span>
        <div className="absolute inset-0 blog-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-lg bg-gradient-to-r ${colorClass} border backdrop-blur-sm`}
        >
          {post.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-gray-500">
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-300 leading-none">{post.author.split(' ')[0]}</p>
              <p className="text-xs text-gray-600 mt-0.5">{post.readTime}</p>
            </div>
          </div>
          <span className="text-xs text-gray-600">{post.date.split(',')[0]}</span>
        </div>
      </div>
    </Link>
  );
}

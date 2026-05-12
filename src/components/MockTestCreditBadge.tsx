'use client';

import { useEffect, useState } from 'react';
import { Target } from 'lucide-react';

interface MockTestCreditBadgeProps {
  className?: string;
  onZeroClick?: () => void;
}

export default function MockTestCreditBadge({ className = '', onZeroClick }: MockTestCreditBadgeProps) {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/mock-test/credits')
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.credits_remaining === 'number') {
          setCredits(d.credits_remaining);
        }
      })
      .catch(() => {});
  }, []);

  if (credits === null) return null;

  const isEmpty = credits === 0;

  return (
    <button
      onClick={isEmpty ? onZeroClick : undefined}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
        ${isEmpty
          ? 'bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/25 cursor-pointer'
          : 'bg-purple-500/15 border border-purple-500/30 text-purple-300 cursor-default'
        } ${className}`}
    >
      <Target className="w-3 h-3" />
      {isEmpty ? 'Buy Mock Tests' : `${credits} tests left`}
    </button>
  );
}

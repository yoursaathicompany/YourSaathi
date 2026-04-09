'use client';

import { useState, useCallback } from 'react';

type Props = {
  code: string;
  language: string;
  title?: string;
};

export default function CodeBlock({ code, language, title }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/8 bg-[#0c0c10] group">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          {title && (
            <span className="text-xs text-gray-500 font-medium truncate max-w-[280px]">
              {title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
            {language}
          </span>
          <button
            onClick={handleCopy}
            id={`copy-btn-${title?.replace(/\s+/g, '-').toLowerCase() || 'code'}`}
            className="px-3 py-1 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-purple-500/30 transition-all"
            aria-label="Copy code to clipboard"
          >
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
      </div>
      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-5 text-sm leading-relaxed text-gray-300 font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

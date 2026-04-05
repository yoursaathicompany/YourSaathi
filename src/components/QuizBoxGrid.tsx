/* eslint-disable */
import {
  BrainCircuit, BookOpen, Trophy, Calculator, Beaker, Code2,
  Globe, Book, Target, Map as MapIcon, Palette, Music, Heart,
  Briefcase, LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { topicsData } from '@/data/topics';

const iconMap: Record<string, LucideIcon> = {
  math:     Calculator,
  science:  Beaker,
  cs:       Code2,
  history:  Globe,
  lit:      Book,
  comp:     Target,
  geo:      MapIcon,
  art:      Palette,
  music:    Music,
  health:   Heart,
  business: Briefcase,
};

interface QuizBoxGridProps {
  searchQuery?: string;
  showAll?: boolean;
}

// Pure CSS fade-in — zero JS animation overhead, zero INP cost
const fadeInStyle = (i: number): React.CSSProperties => ({
  animation: `qbg-fade-up 0.45s ease-out ${i * 60}ms both`,
});

export default function QuizBoxGrid({ searchQuery = '', showAll = false }: QuizBoxGridProps) {
  const categoriesList = Object.values(topicsData);

  const filteredCategories = categoriesList.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedCategories = showAll || searchQuery
    ? filteredCategories
    : filteredCategories.slice(0, 6);

  return (
    <>
      <style>{`
        @keyframes qbg-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {displayedCategories.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white/[0.02] border border-white/5 rounded-2xl w-full">
          No categories found for &ldquo;{searchQuery}&rdquo;. Try a different search!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {displayedCategories.map((cat, i) => {
            const Icon = iconMap[cat.id] ?? BrainCircuit;
            return (
              <Link href={`/topics/${cat.id}`} key={cat.id} className="block group" style={fadeInStyle(i)}>
                <div
                  className="cursor-pointer relative overflow-hidden rounded-2xl p-6 flex flex-col items-start gap-4 h-full transition-all duration-300 hover:-translate-y-1.5 group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.25)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      'inset 0 1px 0 rgba(255,255,255,0.15), 0 20px 60px rgba(139,92,246,0.18), 0 0 0 1px rgba(139,92,246,0.35)';
                    (e.currentTarget as HTMLDivElement).style.background =
                      'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(255,255,255,0.04))';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.25)';
                    (e.currentTarget as HTMLDivElement).style.background =
                      'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))';
                  }}
                >
                  {/* large faded icon watermark */}
                  <div className="absolute top-0 right-0 p-4 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity translate-x-4 -translate-y-4 pointer-events-none">
                    <Icon className="w-24 h-24" />
                  </div>

                  {/* coloured icon badge */}
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${cat.color} shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="z-10 mt-2 flex-grow">
                    <h3 className="text-xl font-bold text-gray-200 mb-1 group-hover:text-purple-300 transition-colors">{cat.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{cat.desc}</p>
                  </div>

                  <div className="z-10 flex items-center justify-between w-full mt-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> popular
                    </span>
                    <span
                      className="text-xs font-bold text-blue-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform px-3 py-1 rounded-full"
                      style={{
                        background: 'rgba(59,130,246,0.12)',
                        border: '1px solid rgba(59,130,246,0.25)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      Study Guide <BookOpen className="w-3 h-3 ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

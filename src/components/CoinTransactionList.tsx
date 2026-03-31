'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Coins, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import type { CoinTransaction, CoinTransactionPage } from '@/types/user';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function reasonLabel(reason: string) {
  const map: Record<string, string> = {
    quiz_correct_answer: 'Quiz Correct Answers',
    admin_adjustment: 'Admin Adjustment',
    welcome_bonus: 'Welcome Bonus',
    teacher_graded: 'Teacher Graded',
    signup_bonus: '🎁 Signup Welcome Bonus',
    earned: 'Coins Earned',
    adjusted: 'Admin Adjustment',
    withdrawal_locked: '🔒 Withdrawal Pending',
    withdrawal_refunded: '↩️ Withdrawal Refunded',
    withdrawal_redeemed: '💸 Withdrawal Paid',
    offer_claim: '🎁 Bonus Offer',
    promo_code: '🏷️ Promo Code',
  };
  return map[reason] ?? reason;
}

export default function CoinTransactionList() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CoinTransactionPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/user/transactions?page=${p}&per_page=15`);
      if (!res.ok) throw new Error('Failed to load transactions');
      const json: CoinTransactionPage = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPage(page); }, [page, fetchPage]);

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-400 text-sm py-6 justify-center">
        <AlertCircle className="w-4 h-4" />
        {error}
      </div>
    );
  }

  return (
    <div>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : !data?.transactions.length ? (
        <div className="text-center py-12 text-gray-500">
          <Coins className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No coin transactions yet.</p>
          <p className="text-xs mt-1">Complete quizzes to earn coins!</p>
        </div>
      ) : (
        <>
          <div className="space-y-2" role="list" aria-label="Coin transaction history">
            {data.transactions.map((tx: CoinTransaction, i: number) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                role="listitem"
                className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-yellow-400/10 flex items-center justify-center text-lg flex-shrink-0 border border-yellow-400/20">
                    🪙
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white text-white">{reasonLabel(tx.reason)}</p>
                    {tx.quiz && (
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">
                        {tx.quiz.topic ?? tx.quiz.title ?? 'Quiz'}
                      </p>
                    )}
                    <p className="text-xs text-gray-600">{formatDate(tx.timestamp)}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-4">
                  <p className={`text-sm font-bold ${tx.coins_awarded >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {tx.coins_awarded >= 0 ? '+' : ''}{tx.coins_awarded} 🪙
                  </p>
                  <p className="text-xs text-gray-500">Balance: {tx.new_balance}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {(data.total > data.per_page) && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                aria-label="Previous page"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-200 bg-white/5 border border-gray-300 border-white/10 text-sm text-gray-600 text-gray-400 hover:text-white hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <span className="text-xs text-gray-500">
                Page {page} of {Math.ceil(data.total / data.per_page)} &nbsp;·&nbsp; {data.total} total
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!data.has_more || loading}
                aria-label="Next page"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-200 bg-white/5 border border-gray-300 border-white/10 text-sm text-gray-600 text-gray-400 hover:text-white hover:text-white disabled:opacity-30 transition-all"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

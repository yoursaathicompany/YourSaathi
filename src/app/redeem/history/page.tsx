'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import WithdrawalHistoryTable from '@/components/WithdrawalHistoryTable';
import type { Withdrawal } from '@/types/withdrawal';

export default function WithdrawalHistoryPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const LIMIT = 10;

  const fetchHistory = useCallback(async (p: number, showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch(`/api/withdrawals?page=${p}&limit=${LIMIT}`);
      if (res.ok) {
        const data = await res.json();
        setWithdrawals(data.withdrawals ?? []);
        setTotal(data.total ?? 0);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (authStatus === 'unauthenticated') router.replace('/login');
    if (authStatus === 'authenticated') fetchHistory(page);
  }, [authStatus, page, fetchHistory, router]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pt-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/redeem"
            className="p-2 rounded-xl bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black">Withdrawal History</h1>
            <p className="text-sm text-gray-500">Track all your redemption requests</p>
          </div>
        </div>
        <button
          onClick={() => fetchHistory(page, true)}
          disabled={refreshing}
          className="p-2 rounded-xl bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Summary pill */}
      {!loading && total > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-sm text-gray-500"
        >
          {total} withdrawal{total > 1 ? 's' : ''} total
        </motion.div>
      )}

      <WithdrawalHistoryTable
        withdrawals={withdrawals}
        loading={loading}
        emptyMessage="You haven't made any withdrawal requests yet."
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-sm font-medium disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-sm font-medium disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

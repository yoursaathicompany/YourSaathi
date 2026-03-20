'use client';

import { Coins, ExternalLink } from 'lucide-react';
import WithdrawalStatusBadge from './WithdrawalStatusBadge';
import type { Withdrawal } from '@/types/withdrawal';

interface Props {
  withdrawals: Withdrawal[];
  loading?: boolean;
  emptyMessage?: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function WithdrawalHistoryTable({ withdrawals, loading, emptyMessage }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!withdrawals.length) {
    return (
      <div className="text-center py-16 text-gray-500">
        <Coins className="w-10 h-10 mx-auto mb-3 text-gray-700" />
        <p>{emptyMessage ?? 'No withdrawal requests yet.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {withdrawals.map((w) => (
        <div
          key={w.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <span className="text-green-400 font-bold text-sm">₹</span>
            </div>
            <div>
              <p className="text-white font-semibold">
                ₹{Number(w.requested_amount).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                <Coins className="w-3 h-3 text-yellow-500" />
                {w.coins_required.toLocaleString('en-IN')} coins
                <span className="text-gray-700">•</span>
                {w.upi_id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-between sm:justify-end">
            <div className="text-right">
              <WithdrawalStatusBadge status={w.status} size="sm" />
              <p className="text-xs text-gray-600 mt-1">{formatDate(w.created_at)}</p>
            </div>
            {w.payout_reference && (
              <div className="text-xs text-blue-400 font-mono bg-blue-500/10 px-2 py-1 rounded-lg">
                {w.payout_reference}
              </div>
            )}
          </div>

          {w.admin_notes && (
            <div className="w-full text-xs text-amber-400/80 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2">
              Note: {w.admin_notes}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

'use client';

import { Coins, Lock, TrendingUp } from 'lucide-react';
import type { UserWallet } from '@/types/withdrawal';
import { formatINR } from '@/lib/withdrawal-utils';

interface Props {
  wallet: UserWallet | null;
  loading?: boolean;
}

export default function CoinBalanceDisplay({ wallet, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/20 rounded-3xl p-8 animate-pulse">
        <div className="h-12 w-40 bg-white/5 rounded-xl mx-auto mb-4" />
        <div className="flex gap-4 justify-center">
          <div className="h-8 w-28 bg-white/5 rounded-lg" />
          <div className="h-8 w-28 bg-white/5 rounded-lg" />
        </div>
      </div>
    );
  }

  const available = wallet?.available_balance ?? 0;
  const locked    = wallet?.total_locked ?? 0;
  const earned    = wallet?.total_earned ?? 0;

  return (
    <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/20 rounded-3xl p-8 text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
          <Coins className="w-7 h-7 text-yellow-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Available Coins</p>
          <p className="text-5xl font-black text-yellow-400 tabular-nums leading-none">
            {available.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-xs text-gray-400">Earned</span>
          <span className="text-sm font-bold text-green-400">{earned.toLocaleString('en-IN')}</span>
        </div>

        {locked > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">Locked</span>
            <span className="text-sm font-bold text-amber-400">{locked.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

      {locked > 0 && (
        <p className="text-xs text-amber-400/70 mt-3">
          {locked.toLocaleString('en-IN')} coins locked in a pending withdrawal
        </p>
      )}
    </div>
  );
}

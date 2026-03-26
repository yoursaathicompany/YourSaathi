'use client';

import { Coins, IndianRupee, CheckCircle2 } from 'lucide-react';
import type { WithdrawalTier, UserWallet } from '@/types/withdrawal';
import { formatINR } from '@/lib/withdrawal-utils';

interface Props {
  tiers: WithdrawalTier[];
  wallet: UserWallet | null;
  selectedTierId: string | null;
  onSelect: (tier: WithdrawalTier) => void;
  disabled?: boolean;
}

export default function TierSelector({ tiers, wallet, selectedTierId, onSelect, disabled }: Props) {
  const available = wallet?.available_balance ?? 0;

  if (!tiers.length) {
    return (
      <div className="text-center py-10 text-gray-500 text-sm">
        No redemption tiers available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tiers.map((tier) => {
        const canAfford = available >= tier.coins_required;
        const isSelected = selectedTierId === tier.id;
        const isDisabled = disabled || !canAfford;

        return (
          <button
            key={tier.id}
            onClick={() => !isDisabled && onSelect(tier)}
            disabled={isDisabled}
            className={`
              relative group text-left rounded-2xl border p-5 transition-all duration-200
              ${isSelected
                ? 'border-purple-500 bg-purple-500/15 shadow-lg shadow-purple-500/20 scale-[1.02]'
                : canAfford
                  ? 'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/5 hover:scale-[1.01]'
                  : 'border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed'
              }
            `}
          >
            {isSelected && (
              <span className="absolute top-3 right-3">
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
              </span>
            )}

            <div className="mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                {tier.label}
              </span>
            </div>

            <div className="flex items-end gap-2 mb-3">
              <div className="flex items-center gap-1 text-3xl font-black text-black text-white">
                <span className="text-green-400 text-2xl">₹</span>
                {tier.rupee_amount.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span>
                <span className="font-bold text-yellow-400">
                  {tier.coins_required.toLocaleString('en-IN')}
                </span>{' '}
                coins
              </span>
            </div>

            {!canAfford && (
              <p className="text-xs text-red-400/70 mt-2">
                Need {(tier.coins_required - available).toLocaleString('en-IN')} more coins
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}

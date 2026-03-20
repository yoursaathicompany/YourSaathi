'use client';

import { getStatusLabel, getStatusColors } from '@/lib/withdrawal-utils';
import type { WithdrawalStatus } from '@/types/withdrawal';

interface Props {
  status: WithdrawalStatus;
  size?: 'sm' | 'md';
}

export default function WithdrawalStatusBadge({ status, size = 'md' }: Props) {
  const colors = getStatusColors(status);
  const label = getStatusLabel(status);
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClass} ${colors}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
}

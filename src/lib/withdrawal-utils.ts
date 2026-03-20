// Withdrawal utility helpers

/**
 * Validates a UPI ID.
 * Format: localpart@bankhandle
 * e.g. name@okicici, 9999999999@ybl, user.name@okaxis
 */
export function validateUpiId(upi: string): boolean {
  if (!upi || typeof upi !== 'string') return false;
  const trimmed = upi.trim();
  // Must match: alphanumeric/dots/underscores/hyphens @ alphanumeric
  const pattern = /^[a-zA-Z0-9._\-]{3,}@[a-zA-Z0-9]{2,}$/;
  return pattern.test(trimmed);
}

/**
 * Formats a number as Indian Rupees
 * e.g. 200 → "₹200", 1000 → "₹1,000"
 */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Returns a human-readable label for a withdrawal status
 */
export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending:  'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
    paid:     'Paid ✓',
  };
  return map[status] ?? status;
}

/**
 * Returns Tailwind color classes for a withdrawal status badge
 */
export function getStatusColors(status: string): string {
  const map: Record<string, string> = {
    pending:  'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    approved: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    rejected: 'bg-red-500/15 text-red-400 border border-red-500/30',
    paid:     'bg-green-500/15 text-green-400 border border-green-500/30',
  };
  return map[status] ?? 'bg-gray-500/15 text-gray-400 border border-gray-500/30';
}

/**
 * Compute approximate fiat value from coins
 * (Used for display purposes before a tier is selected)
 */
export function coinsToRupees(coins: number): number | null {
  const tiers: Record<number, number> = {
    2000: 200,
    4000: 400,
    6000: 600,
    8000: 800,
    10000: 1000,
  };
  return tiers[coins] ?? null;
}

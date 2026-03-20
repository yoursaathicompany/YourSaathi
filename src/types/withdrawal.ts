// Withdrawal system TypeScript types

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'paid';
export type CoinLedgerType = 'earned' | 'locked' | 'redeemed' | 'refunded' | 'adjusted';

export interface WithdrawalTier {
  id: string;
  label: string;
  coins_required: number;
  rupee_amount: number;
  is_active: boolean;
  sort_order: number;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  tier_id: string | null;
  upi_id: string;
  requested_amount: number;
  coins_required: number;
  status: WithdrawalStatus;
  admin_notes: string | null;
  payout_reference: string | null;
  approved_by: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined user data (admin view)
  user?: {
    display_name: string | null;
    email: string;
    coins_balance: number;
  };
}

export interface CoinLedgerEntry {
  id: string;
  user_id: string;
  type: CoinLedgerType;
  amount: number;
  reference_id: string | null;
  reference_type: string | null;
  note: string | null;
  created_at: string;
}

export interface UserWallet {
  user_id: string;
  total_earned: number;
  total_locked: number;
  total_redeemed: number;
  total_refunded: number;
  available_balance: number;
  last_transaction_at: string | null;
}

export interface CreateWithdrawalPayload {
  tier_id: string;
  upi_id: string;
}

export interface AdminActionPayload {
  admin_notes?: string;
  payout_reference?: string;
}

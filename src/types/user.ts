export type UserRole = 'student' | 'teacher' | 'admin';
export type CoinReason = 'quiz_correct_answer' | 'admin_adjustment' | 'welcome_bonus' | 'teacher_graded';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  coins_balance: number;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CoinTransaction {
  id: string;
  user_id: string;
  attempt_id: string | null;
  quiz_id: string | null;
  coins_awarded: number;
  previous_balance: number;
  new_balance: number;
  reason: CoinReason;
  note: string | null;
  timestamp: string;
  // joined fields (optional)
  quiz?: { topic?: string; title?: string } | null;
}

export interface CoinTransactionPage {
  transactions: CoinTransaction[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

export interface AdminUserSummary {
  id: string;
  email: string;
  display_name: string | null;
  role: UserRole;
  coins_balance: number;
  email_verified: boolean;
  created_at: string;
  attempt_count?: number;
}

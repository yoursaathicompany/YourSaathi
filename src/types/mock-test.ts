// ── Mock Test System Types ──────────────────────────────────────────────────

export type MockTestDifficulty = 'easy' | 'medium' | 'hard';
export type MockTestLanguage = 'English' | 'Hindi';

export type MockTestExam =
  | 'SSC CGL'
  | 'SSC CHSL'
  | 'SSC MTS'
  | 'UPSC Prelims'
  | 'IBPS PO'
  | 'IBPS Clerk'
  | 'SBI PO'
  | 'RRB NTPC'
  | 'RRB Group D'
  | 'NDA'
  | 'CDS'
  | 'State PSC'
  | 'Custom';

export interface MockTestQuestion {
  question_number: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface MockTestSession {
  id: string;
  user_id: string;
  exam_name: string;
  subject: string;
  topic: string | null;
  difficulty: MockTestDifficulty;
  num_questions: number;
  time_limit_min: number;
  language: MockTestLanguage;
  questions: MockTestQuestion[];
  status: 'generated' | 'in_progress' | 'completed' | 'expired';
  expires_at: string | null;
  created_at: string;
}

export interface MockTestAttempt {
  id: string;
  session_id: string;
  user_id: string;
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>;  // question_number → selected option
  score_percentage: number;
  correct_count: number;
  wrong_count: number;
  unattempted_count: number;
  time_taken_seconds: number | null;
  submitted_at: string;
}

export interface MockTestCredits {
  credits_remaining: number;
  total_earned: number;
  total_used: number;
}

export interface MockTestGenerateRequest {
  exam_name: string;
  subject: string;
  topic?: string;
  difficulty: MockTestDifficulty;
  num_questions: 10 | 20 | 30;
  time_limit_minutes?: number;
  language?: MockTestLanguage;
}

export interface MockTestGenerateResponse {
  status: 'success' | 'payment_required';
  session_id?: string;
  exam_name?: string;
  test_title?: string;
  subject?: string;
  topic?: string;
  difficulty?: string;
  total_questions?: number;
  time_limit_minutes?: number;
  questions?: MockTestQuestion[];
  result_message?: string;
  remaining_credits?: number;
  // paywall fields
  message?: string;
  razorpay_required?: boolean;
  package?: string;
  price_inr?: number;
}

export interface MockTestSubmitRequest {
  session_id: string;
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  time_taken_seconds: number;
}

export interface MockTestSubmitResponse {
  attempt_id: string;
  score_percentage: number;
  correct_count: number;
  wrong_count: number;
  unattempted_count: number;
  total_questions: number;
  result_message: string;
  credits_remaining: number;
}

// Exam catalog config
export interface ExamConfig {
  name: MockTestExam;
  icon: string;
  color: string;
  gradient: string;
  subjects: string[];
  defaultDifficulty: MockTestDifficulty;
  description: string;
}

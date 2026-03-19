export type GradingStatus = 'auto_graded' | 'pending_review' | 'teacher_graded';

export interface AnswerPayload {
  question_id: string;
  user_answer: string | string[] | null;
  time_taken_seconds?: number;
}

export interface SubmitAttemptRequest {
  user_id: string;
  quiz_id: string;
  attempt_id: string; // client-generated UUID (idempotency key)
  answers: AnswerPayload[];
  time_taken_seconds: number;
}

export interface GradeResult {
  question_id: string;
  is_correct: boolean | null;   // null = pending review
  grading_status: GradingStatus;
}

export interface SubmitAttemptResponse {
  attempt_id: string;
  quiz_id: string;
  correct_count: number;
  total_questions: number;
  auto_graded_count: number;
  pending_review_count: number;
  score_percentage: number;
  coins_awarded: number;
  previous_balance: number;
  new_balance: number;
  grade_results: GradeResult[];
  already_submitted: boolean;   // true when idempotent re-submission
}

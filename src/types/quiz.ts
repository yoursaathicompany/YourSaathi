export type Difficulty = 'easy' | 'medium' | 'hard';
export type StudentLevel = 'class6' | 'class10' | 'college' | 'upsc' | 'custom';
export type QuestionType = 'mcq_single' | 'mcq_multi' | 'assertion' | 'short_answer' | 'code';

export interface GeneratedQuizMeta {
  num_questions_requested: number;
  num_questions_returned: number;
  estimated_total_time_seconds: number;
  uniqueness_score: number;
  confidence_score: number;
}

export interface QuestionSource {
  text: string;
  url: string;
}

export interface QuestionMedia {
  type: 'image' | 'video';
  url: string;
}

export interface QuestionMetadata {
  estimated_time_seconds: number;
  difficulty_score: number;
  media: QuestionMedia | null;
}

export interface GeneratedQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[] | null;
  correct_answer: string | string[] | null;
  explanation: string;
  hints: string[];
  sources: QuestionSource[];
  tags: string[];
  metadata: QuestionMetadata;
}

export interface GeneratedQuizSummary {
  question_count: number;
  estimated_total_time_seconds: number;
  difficulty_profile: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface GeneratedQuizResponse {
  request_id: string;
  topic: string;
  difficulty: Difficulty;
  student_level: StudentLevel;
  generated_at: string;
  meta: GeneratedQuizMeta;
  questions: GeneratedQuestion[];
  summary: GeneratedQuizSummary;
}

// Request Payload sent to /api/antigravity/generate-quiz
export interface GenerateQuizRequest {
  topic: string;
  difficulty: Difficulty;
  student_level: StudentLevel;
  number_of_questions: number;
  question_types: QuestionType[];
  language: string;
  include_hints: boolean;
  include_sources: boolean;
  allow_media: boolean;
  advanced_options: {
    shuffle_choices: boolean;
    include_explanations: boolean;
    strict_scoring: boolean;
  };
}

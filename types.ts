export interface RawQuestion {
  desc: string;
  options: string[];
  correct_ans: string;
}

export interface Question extends RawQuestion {
  id: string; // Auto-generated ID
}

export type QuizMode = 'practice' | 'exam';

export interface QuizConfig {
  questionCount: number; // 10, 20, 50, or -1 for All
  mode: QuizMode;
  shuffle: boolean;
}

export interface UserAnswer {
  questionId: string;
  selectedOption: string;
  reasoning: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface ExportData {
  summary: {
    score: number;
    total: number;
    timestamp: string;
  };
  weakness_analysis_request: string;
  incorrect_questions: Array<{
    question: string;
    user_choice: string;
    correct_answer: string;
    user_reasoning: string;
  }>;
}
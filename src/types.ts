export type Theme = "light" | "dark";

export type ExamStatus =
  | "fresh"
  | "registered"
  | "in_progress"
  | "annulled"
  | "completed";

export type QuestionKind = "choice" | "text";

export interface ChoiceQuestion {
  id: number;
  kind: "choice";
  prompt: string;
  options: string[];
  correctIndex: number;
  points: number;
  bonus?: boolean;
}

export interface TextQuestion {
  id: number;
  kind: "text";
  prompt: string;
  acceptedAnswers: string[];
  points: number;
  bonus?: boolean;
}

export type Question = ChoiceQuestion | TextQuestion;

export interface AnswerRecord {
  questionId: number;
  given: string;
  correct: boolean;
}

export interface ExamState {
  status: ExamStatus;
  nickname: string;
  startedAt: number | null;
  finishedAt: number | null;
  durationMs: number;
  answers: AnswerRecord[];
  currentIndex: number;
  score: number;
  maxScore: number;
}

import { createContext } from "react";
import type { ExamState, Theme } from "../types";

export interface ExamContextValue {
  state: ExamState;
  theme: Theme;
  hydrated: boolean;
  toggleTheme: () => void;
  register: (nickname: string) => void;
  startExam: () => void;
  submitAnswer: (given: string, correct: boolean) => void;
  annul: (reason?: string) => void;
  finishByTimer: () => void;
  resetForDev: () => void;
}

export const ExamContext = createContext<ExamContextValue | null>(null);

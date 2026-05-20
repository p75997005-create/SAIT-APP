import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ExamContext } from "./examContextDef";
import type { ExamContextValue } from "./examContextDef";
import {
  INITIAL_STATE,
  loadState,
  saveState,
  saveStateSync,
} from "../lib/storage";
import { applyTheme, loadTheme, saveTheme } from "../lib/theme";
import { EXAM_DURATION_MS, MAX_SCORE, QUESTIONS } from "../data/questions";
import type { AnswerRecord, ExamState, Theme } from "../types";

interface ExamProviderProps {
  children: ReactNode;
}

export function ExamProvider({ children }: ExamProviderProps) {
  const [state, setState] = useState<ExamState>(INITIAL_STATE);
  const [theme, setTheme] = useState<Theme>(() => loadTheme());
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef<ExamState>(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;
    void loadState().then((loaded) => {
      if (cancelled) return;
      setState(loaded);
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: ExamState) => {
    setState(next);
    stateRef.current = next;
    saveStateSync(next);
    void saveState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      saveTheme(next);
      return next;
    });
  }, []);

  const register = useCallback(
    (nickname: string) => {
      const trimmed = nickname.trim();
      if (!trimmed) return;
      const current = stateRef.current;
      if (current.status !== "fresh" && current.status !== "registered") {
        return;
      }
      persist({
        ...current,
        status: "registered",
        nickname: trimmed,
      });
    },
    [persist],
  );

  const startExam = useCallback(() => {
    const current = stateRef.current;
    if (current.status !== "registered") return;
    persist({
      ...current,
      status: "in_progress",
      startedAt: Date.now(),
      finishedAt: null,
      durationMs: 0,
      answers: [],
      currentIndex: 0,
      score: 0,
      maxScore: MAX_SCORE,
    });
  }, [persist]);

  const submitAnswer = useCallback(
    (given: string, correct: boolean) => {
      const current = stateRef.current;
      if (current.status !== "in_progress") return;
      const question = QUESTIONS[current.currentIndex];
      if (!question) return;
      const record: AnswerRecord = {
        questionId: question.id,
        given,
        correct,
      };
      const answers = [...current.answers, record];
      const earned = correct ? question.points : 0;
      const score = current.score + earned;
      const nextIndex = current.currentIndex + 1;
      const finished = nextIndex >= QUESTIONS.length;
      persist({
        ...current,
        currentIndex: finished ? current.currentIndex : nextIndex,
        answers,
        score,
        status: finished ? "completed" : "in_progress",
        finishedAt: finished ? Date.now() : null,
        durationMs:
          finished && current.startedAt
            ? Date.now() - current.startedAt
            : current.durationMs,
      });
    },
    [persist],
  );

  const annul = useCallback(
    (_reason?: string) => {
      void _reason;
      const current = stateRef.current;
      if (current.status === "annulled" || current.status === "completed") {
        return;
      }
      persist({
        ...current,
        status: "annulled",
        finishedAt: Date.now(),
      });
    },
    [persist],
  );

  const finishByTimer = useCallback(() => {
    const current = stateRef.current;
    if (current.status !== "in_progress") return;
    persist({
      ...current,
      status: "completed",
      finishedAt: Date.now(),
      durationMs: current.startedAt
        ? Date.now() - current.startedAt
        : current.durationMs,
    });
  }, [persist]);

  const resetForDev = useCallback(() => {
    persist({ ...INITIAL_STATE });
  }, [persist]);

  // Global guard: if exam is in progress, annul on visibility loss / blur.
  useEffect(() => {
    if (!hydrated) return;
    function handleHidden() {
      const current = stateRef.current;
      if (current.status === "in_progress") {
        const annulled: ExamState = {
          ...current,
          status: "annulled",
          finishedAt: Date.now(),
        };
        stateRef.current = annulled;
        setState(annulled);
        saveStateSync(annulled);
        void saveState(annulled);
      }
    }
    function onVisibility() {
      if (document.visibilityState === "hidden") {
        handleHidden();
      }
    }
    function onBlur() {
      handleHidden();
    }
    function onPageHide() {
      handleHidden();
    }
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [hydrated]);

  // Periodically persist the elapsed time so the timer survives reloads.
  useEffect(() => {
    if (state.status !== "in_progress" || !state.startedAt) return;
    const interval = window.setInterval(() => {
      const current = stateRef.current;
      if (current.status !== "in_progress" || !current.startedAt) return;
      const elapsed = Date.now() - current.startedAt;
      if (elapsed >= EXAM_DURATION_MS) {
        const finished: ExamState = {
          ...current,
          status: "completed",
          finishedAt: Date.now(),
          durationMs: EXAM_DURATION_MS,
        };
        stateRef.current = finished;
        setState(finished);
        saveStateSync(finished);
        void saveState(finished);
        return;
      }
      const next: ExamState = { ...current, durationMs: elapsed };
      stateRef.current = next;
      setState(next);
      saveStateSync(next);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [state.status, state.startedAt]);

  const value = useMemo<ExamContextValue>(
    () => ({
      state,
      theme,
      hydrated,
      toggleTheme,
      register,
      startExam,
      submitAnswer,
      annul,
      finishByTimer,
      resetForDev,
    }),
    [
      state,
      theme,
      hydrated,
      toggleTheme,
      register,
      startExam,
      submitAnswer,
      annul,
      finishByTimer,
      resetForDev,
    ],
  );

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
}

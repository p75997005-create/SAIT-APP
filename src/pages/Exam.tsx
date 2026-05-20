import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Timer from "../components/Timer";
import { useExam } from "../context/useExam";
import {
  EXAM_DURATION_MS,
  QUESTIONS,
  isAnswerCorrect,
} from "../data/questions";

interface QuestionFormProps {
  index: number;
  onSubmit: (given: string, correct: boolean) => void;
}

function QuestionForm({ index, onSubmit }: QuestionFormProps) {
  const question = QUESTIONS[index];
  const [choice, setChoice] = useState<string | null>(null);
  const [textValue, setTextValue] = useState("");

  const isLast = index === QUESTIONS.length - 1;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!question) return;
    if (question.kind === "choice") {
      if (choice === null) return;
      onSubmit(choice, isAnswerCorrect(question, choice));
    } else {
      const trimmed = textValue.trim();
      if (!trimmed) return;
      onSubmit(trimmed, isAnswerCorrect(question, trimmed));
    }
  }

  const submitDisabled =
    question.kind === "choice"
      ? choice === null
      : textValue.trim().length === 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6 py-6">
      <h1 className="text-xl font-black leading-snug sm:text-2xl">
        {question.prompt}
      </h1>

      {question.kind === "choice" ? (
        <div className="space-y-3" role="radiogroup">
          {question.options.map((option) => {
            const selected = option === choice;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setChoice(option)}
                className={`option-btn ${selected ? "selected" : ""}`}
              >
                <span>{option}</span>
                <span aria-hidden="true" className="text-lg leading-none">
                  {selected ? "●" : "○"}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <label className="label" htmlFor="answer">
            Ваш ответ
          </label>
          <input
            id="answer"
            className="input"
            value={textValue}
            onChange={(event) => setTextValue(event.target.value)}
            placeholder="Введите ответ"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            autoFocus
          />
          <p className="mt-2 text-xs opacity-70">
            Регистр и пробелы по краям не важны.
          </p>
        </div>
      )}

      <div className="mt-auto">
        <button type="submit" className="btn-primary" disabled={submitDisabled}>
          {isLast ? "Завершить экзамен" : "Продолжить"}
        </button>
      </div>
    </form>
  );
}

export default function Exam() {
  const navigate = useNavigate();
  const { state, submitAnswer } = useExam();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (state.status !== "in_progress") return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [state.status]);

  useEffect(() => {
    if (state.status === "annulled") {
      navigate("/annulled", { replace: true });
    } else if (state.status === "completed") {
      navigate("/results", { replace: true });
    } else if (state.status === "fresh" || state.status === "registered") {
      navigate("/", { replace: true });
    }
  }, [state.status, navigate]);

  if (state.status !== "in_progress") {
    return null;
  }

  const question = QUESTIONS[state.currentIndex];
  if (!question) return null;

  const elapsed = state.startedAt ? now - state.startedAt : 0;
  const remaining = Math.max(0, EXAM_DURATION_MS - elapsed);

  const total = QUESTIONS.length;
  const number = state.currentIndex + 1;

  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-col safe-pad-x safe-pad-y">
      <header className="flex items-center justify-between gap-3 py-4">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-widest opacity-70">
            ЕКДЭ · {state.nickname || "гость"}
          </span>
          <span className="text-sm font-bold">
            Вопрос {number} из {total}
            {question.bonus ? " · бонус" : ""}
          </span>
        </div>
        <Timer remainingMs={remaining} />
      </header>

      <div
        className="h-1 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/15"
        aria-hidden="true"
      >
        <div
          className="h-full bg-black dark:bg-white"
          style={{ width: `${(number / total) * 100}%` }}
        />
      </div>

      <QuestionForm
        key={state.currentIndex}
        index={state.currentIndex}
        onSubmit={submitAnswer}
      />
    </main>
  );
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "../context/useExam";
import { QUESTIONS } from "../data/questions";

export default function Review() {
  const navigate = useNavigate();
  const { state } = useExam();

  useEffect(() => {
    if (state.status === "annulled") {
      navigate("/annulled", { replace: true });
    } else if (state.status !== "completed") {
      navigate("/", { replace: true });
    }
  }, [state.status, navigate]);

  if (state.status !== "completed") {
    return null;
  }

  const answeredById = new Map(state.answers.map((a) => [a.questionId, a]));

  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-col safe-pad-x safe-pad-y">
      <header className="flex items-center justify-between py-4">
        <button
          type="button"
          onClick={() => navigate("/results")}
          className="text-sm font-semibold underline-offset-4 hover:underline"
        >
          ← К результатам
        </button>
        <span className="text-xs font-semibold uppercase tracking-widest opacity-70">
          Проверка ответов
        </span>
      </header>

      <section className="flex flex-1 flex-col gap-3 py-4">
        <p className="text-sm opacity-80">
          Здесь видно, на какие вопросы ты ответил правильно. Сам правильный
          ответ не раскрывается.
        </p>

        <ul className="space-y-3">
          {QUESTIONS.map((question, index) => {
            const answer = answeredById.get(question.id);
            const status = !answer
              ? "skipped"
              : answer.correct
                ? "correct"
                : "wrong";
            const badgeText =
              status === "correct"
                ? "Правильно"
                : status === "wrong"
                  ? "Неправильно"
                  : "Без ответа";
            return (
              <li key={question.id} className="card !p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs opacity-70">
                      Вопрос {index + 1}
                      {question.bonus ? " · бонус" : ""}
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {question.prompt}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border-2 px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      status === "correct"
                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                        : "border-black bg-white text-black dark:border-white dark:bg-black dark:text-white"
                    }`}
                  >
                    {badgeText}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

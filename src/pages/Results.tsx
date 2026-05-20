import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useExam } from "../context/useExam";
import { MAX_SCORE, QUESTIONS } from "../data/questions";

function formatDuration(ms: number): string {
  if (ms <= 0) return "—";
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min === 0) return `${sec} сек`;
  return `${min} мин ${sec.toString().padStart(2, "0")} сек`;
}

export default function Results() {
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

  const correctCount = state.answers.filter((a) => a.correct).length;
  const percent = Math.round((state.score / MAX_SCORE) * 100);
  const answered = state.answers.length;

  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-col safe-pad-x safe-pad-y">
      <header className="py-4">
        <span className="text-xs font-semibold uppercase tracking-widest opacity-70">
          Результаты ЕКДЭ 2026
        </span>
      </header>

      <section className="flex flex-1 flex-col justify-center gap-6 py-6">
        <div className="card flex flex-col gap-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-70">
            Участник
          </p>
          <p className="text-2xl font-black break-words sm:text-3xl">
            {state.nickname}
          </p>
        </div>

        <div className="card flex flex-col items-center gap-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-70">
            Итоговый балл
          </p>
          <p className="text-6xl font-black tabular-nums sm:text-7xl">
            {state.score}
          </p>
          <p className="text-sm opacity-80">из {MAX_SCORE} возможных</p>
          <p className="text-sm font-semibold">{percent}%</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="card !p-4">
            <dt className="text-xs opacity-70">Правильных ответов</dt>
            <dd className="text-xl font-black">
              {correctCount} / {QUESTIONS.length}
            </dd>
          </div>
          <div className="card !p-4">
            <dt className="text-xs opacity-70">Отвечено вопросов</dt>
            <dd className="text-xl font-black">
              {answered} / {QUESTIONS.length}
            </dd>
          </div>
          <div className="card !p-4 col-span-2">
            <dt className="text-xs opacity-70">Время прохождения</dt>
            <dd className="text-xl font-black">
              {formatDuration(state.durationMs)}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate("/review")}
        >
          Посмотреть свои ответы
        </button>

        <p className="text-center text-xs opacity-70">
          Результат сохранён. Повторно пройти экзамен нельзя.
        </p>
      </section>
    </main>
  );
}

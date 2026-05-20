import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useExam } from "../context/useExam";

export default function Welcome() {
  const navigate = useNavigate();
  const { state } = useExam();

  function handleContinue() {
    if (state.status === "registered") {
      navigate("/exam");
    } else {
      navigate("/register");
    }
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-col safe-pad-x safe-pad-y">
      <header className="flex items-center justify-between py-4">
        <span className="text-sm font-bold uppercase tracking-widest">
          ЕКДЭ · 2026
        </span>
        <ThemeToggle />
      </header>

      <section className="flex flex-1 flex-col justify-center gap-6 py-6">
        <h1 className="text-3xl font-black leading-tight sm:text-4xl">
          Приветствую тебя на первом экзамене Е-К-Д-Э (ЕКДЭ) в 2026 году.
        </h1>
        <div className="space-y-4 text-base leading-relaxed sm:text-lg">
          <p>
            Тебя ждёт <strong>16 вопросов</strong>, каждый из которых даёт{" "}
            <strong>6 баллов</strong>. Если ты сможешь выполнить все 15, ты
            сможешь получить целых <strong>90 чистых баллов</strong>.
          </p>
          <p>
            На экзамен даётся <strong>25 минут</strong>. По истечению этого
            времени экзамен заканчивается.
          </p>
          <p className="rounded-2xl border-2 border-black p-4 text-sm font-semibold dark:border-white">
            Важное правило: при сворачивании вкладки или выходе из приложения
            балл и экзамен сбрасываются, а также всё будет аннулировано.
            Пересдача не предусмотрена — это нужно, чтобы ты не заходил вдруг и
            не гуглил Н-И-Ч-Е-Г-О!
          </p>
          <p className="text-sm opacity-80">
            Пока экзамен не начался, можно спокойно сворачивать вкладку и менять
            тему. Как только нажмёшь «Начать экзамен» — таймер запустится и
            любой выход аннулирует попытку.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleContinue}
            className="btn-primary"
          >
            {state.status === "registered"
              ? `Продолжить, ${state.nickname}`
              : "Начать экзамен"}
          </button>
        </div>
      </section>

      <div className="pb-4" aria-hidden="true" />
    </main>
  );
}

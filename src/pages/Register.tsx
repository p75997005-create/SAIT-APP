import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useExam } from "../context/useExam";

export default function Register() {
  const navigate = useNavigate();
  const { state, register, startExam } = useExam();
  const [nickname, setNickname] = useState(state.nickname);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = nickname.trim();
    if (trimmed.length < 2) {
      setError("Никнейм должен содержать минимум 2 символа.");
      return;
    }
    if (trimmed.length > 24) {
      setError("Слишком длинный никнейм (максимум 24 символа).");
      return;
    }
    setError(null);
    register(trimmed);
    setConfirming(true);
  }

  function handleStart() {
    startExam();
    navigate("/exam");
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col safe-pad-x safe-pad-y">
      <header className="flex items-center justify-between py-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-sm font-semibold underline-offset-4 hover:underline"
        >
          ← Назад
        </button>
        <ThemeToggle />
      </header>

      <section className="flex flex-1 flex-col justify-center gap-6 py-6">
        {!confirming ? (
          <>
            <div>
              <h1 className="text-2xl font-black sm:text-3xl">Регистрация</h1>
              <p className="mt-2 text-sm opacity-80">
                Введи свой никнейм. Он сохранится навсегда и будет показан в
                результатах.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label" htmlFor="nickname">
                  Никнейм
                </label>
                <input
                  id="nickname"
                  className="input"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  placeholder="Например, kurik"
                  autoFocus
                  autoComplete="off"
                  maxLength={32}
                />
                {error && (
                  <p className="mt-2 text-sm font-semibold text-black dark:text-white">
                    {error}
                  </p>
                )}
              </div>
              <button type="submit" className="btn-primary">
                Сохранить никнейм
              </button>
            </form>
          </>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-black sm:text-3xl">
                Готов начать, {state.nickname}?
              </h1>
              <p className="mt-2 text-sm opacity-80">
                После нажатия «Начать экзамен» запустится таймер на 25 минут.
                Свернуть вкладку или выйти из приложения нельзя — экзамен будет
                аннулирован.
              </p>
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleStart}
                className="btn-primary"
              >
                Начать экзамен
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="btn-secondary"
              >
                Изменить никнейм
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

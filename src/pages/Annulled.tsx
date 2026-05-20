import { useExam } from "../context/useExam";

export default function Annulled() {
  const { state } = useExam();

  return (
    <main className="mx-auto flex min-h-full w-full max-w-xl flex-col items-center justify-center text-center safe-pad-x safe-pad-y">
      <div className="card w-full space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest opacity-70">
          ЕКДЭ · 2026
        </p>
        <h1 className="text-4xl font-black leading-tight sm:text-5xl">
          ЭКЗАМЕН АННУЛИРОВАН!
        </h1>
        <p className="text-sm opacity-80">
          Вкладка была свернута или приложение было закрыто во время сдачи.
          Согласно правилам, попытка засчитана как недействительная и пересдача
          не предусмотрена.
        </p>
        {state.nickname && (
          <p className="text-sm">
            Участник:{" "}
            <strong className="break-words">{state.nickname}</strong>
          </p>
        )}
        <p className="text-xs opacity-60">
          Очистка cookies, кэша или памяти не вернёт возможность пройти экзамен.
        </p>
      </div>
    </main>
  );
}

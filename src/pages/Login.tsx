import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBank } from "../context/useBank";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useBank();
  const [email, setEmail] = useState("demo@saitbank.ru");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      login(email, password);
      navigate("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    }
  }

  function applyDemoAccount(demoEmail: string, demoPassword: string) {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  }

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2 lg:items-center">
        <div className="hidden flex-col justify-center lg:flex">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white shadow-card">
              <span className="text-2xl font-bold">S</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">SaitBank</div>
              <div className="text-sm text-slate-500">
                Современный онлайн-банк
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Управляйте деньгами легко и безопасно
          </h1>
          <p className="mt-4 max-w-md text-base text-slate-600">
            Переводы между своими счетами и другим клиентам, история операций,
            пополнение и снятие, обмен валют — всё в одном месте.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-3">
              <span className="text-brand-600">●</span>
              Мгновенные переводы по номеру счёта или email
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-600">●</span>
              Несколько счетов в разных валютах
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-600">●</span>
              Подробная история всех операций
            </li>
          </ul>
        </div>

        <div className="card mx-auto w-full max-w-md shadow-card">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
              <span className="text-lg font-bold">S</span>
            </div>
            <div className="text-lg font-bold text-slate-900">SaitBank</div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Вход в банк</h2>
          <p className="mt-1 text-sm text-slate-500">
            Введите свои данные или используйте демо-аккаунт
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <button type="submit" className="btn-primary w-full">
              Войти
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            ДЕМО-АККАУНТЫ
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid gap-2">
            <button
              className="btn-secondary justify-between"
              type="button"
              onClick={() => applyDemoAccount("demo@saitbank.ru", "demo1234")}
            >
              <span>Иван Петров</span>
              <span className="text-xs text-slate-500">demo@saitbank.ru</span>
            </button>
            <button
              className="btn-secondary justify-between"
              type="button"
              onClick={() => applyDemoAccount("anna@saitbank.ru", "anna1234")}
            >
              <span>Анна Соколова</span>
              <span className="text-xs text-slate-500">anna@saitbank.ru</span>
            </button>
            <button
              className="btn-secondary justify-between"
              type="button"
              onClick={() => applyDemoAccount("mark@saitbank.ru", "mark1234")}
            >
              <span>Марк Иванов</span>
              <span className="text-xs text-slate-500">mark@saitbank.ru</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Нет аккаунта?{" "}
            <Link to="/register" className="font-semibold text-brand-600 hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

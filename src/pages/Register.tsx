import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBank } from "../context/useBank";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useBank();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Пароли не совпадают");
      return;
    }
    try {
      register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      navigate("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="card shadow-card">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
            <span className="text-lg font-bold">S</span>
          </div>
          <div className="text-lg font-bold text-slate-900">SaitBank</div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Регистрация</h2>
        <p className="mt-1 text-sm text-slate-500">
          Создайте аккаунт — мы откроем основной счёт и зачислим 1 000 ₽
          приветственным бонусом.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="fullName">
              ФИО
            </label>
            <input
              id="fullName"
              className="input"
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Иван Иванов"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="phone">
              Телефон
            </label>
            <input
              id="phone"
              type="tel"
              className="input"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+7 (900) 000-00-00"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="password">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                className="input"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="label" htmlFor="confirm">
                Повторите пароль
              </label>
              <input
                id="confirm"
                type="password"
                className="input"
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <button type="submit" className="btn-primary w-full">
            Создать аккаунт
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}

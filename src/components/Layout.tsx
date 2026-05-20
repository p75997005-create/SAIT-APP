import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useBank } from "../context/useBank";

const navItems = [
  { to: "/app", label: "Главная", icon: "🏠", end: true },
  { to: "/app/transfer", label: "Переводы", icon: "💸" },
  { to: "/app/cards", label: "Счета и карты", icon: "💳" },
  { to: "/app/history", label: "История", icon: "📜" },
  { to: "/app/exchange", label: "Обмен валют", icon: "💱" },
  { to: "/app/profile", label: "Профиль", icon: "👤" },
];

export default function Layout() {
  const { currentUser, logout } = useBank();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Меню"
            >
              ☰
            </button>
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow">
                <span className="text-lg font-bold">S</span>
              </div>
              <div className="leading-tight">
                <div className="text-base font-bold text-slate-900">
                  SaitBank
                </div>
                <div className="text-[11px] text-slate-500">Онлайн-банк</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-semibold text-slate-900">
                {currentUser?.fullName}
              </div>
              <div className="text-xs text-slate-500">{currentUser?.email}</div>
            </div>
            <button onClick={handleLogout} className="btn-secondary">
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white p-4 transition-transform lg:static lg:z-auto lg:w-64 lg:translate-x-0 lg:bg-transparent lg:p-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between lg:hidden">
            <div className="text-base font-bold text-slate-900">Меню</div>
            <button
              className="btn-ghost"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
            >
              ✕
            </button>
          </div>
          <nav className="mt-4 space-y-1 lg:mt-0">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

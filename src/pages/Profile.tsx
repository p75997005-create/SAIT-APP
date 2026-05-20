import { useBank } from "../context/useBank";
import { totalBalanceInRub, userAccounts, userTransactions } from "../lib/bank";
import { formatDate, formatMoney } from "../utils/format";

export default function Profile() {
  const { state, currentUser, resetDemoData } = useBank();
  if (!currentUser) return null;

  const accounts = userAccounts(state, currentUser.id);
  const txCount = userTransactions(state, currentUser.id).length;
  const total = totalBalanceInRub(state, currentUser.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Профиль</h1>
        <p className="text-sm text-slate-500">Ваши учётные данные и статистика.</p>
      </div>

      <div className="card flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
          {currentUser.fullName
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>
        <div>
          <div className="text-xl font-bold text-slate-900">
            {currentUser.fullName}
          </div>
          <div className="text-sm text-slate-500">{currentUser.email}</div>
          {currentUser.phone && (
            <div className="text-sm text-slate-500">{currentUser.phone}</div>
          )}
          <div className="mt-1 text-xs text-slate-400">
            Зарегистрирован: {formatDate(currentUser.createdAt)}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <div className="text-sm text-slate-500">Общий баланс (в рублях)</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {formatMoney(total, "RUB")}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-500">Открытых счетов</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {accounts.length}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-500">Всего операций</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {txCount}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Демо-данные</h2>
        <p className="mt-1 text-sm text-slate-500">
          Все данные хранятся локально в браузере. Вы можете сбросить демо к
          исходному состоянию.
        </p>
        <button
          onClick={() => {
            if (confirm("Сбросить все локальные данные?")) {
              resetDemoData();
            }
          }}
          className="mt-4 btn-secondary"
        >
          Сбросить демо-данные
        </button>
      </div>
    </div>
  );
}

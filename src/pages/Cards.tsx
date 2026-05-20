import { useMemo, useState, type FormEvent } from "react";
import { useBank } from "../context/useBank";
import { userAccounts } from "../lib/bank";
import AccountCard from "../components/AccountCard";
import { formatMoney } from "../utils/format";

export default function Cards() {
  const { state, currentUser, deposit, withdraw } = useBank();
  const accounts = useMemo(
    () => (currentUser ? userAccounts(state, currentUser.id) : []),
    [currentUser, state],
  );
  const [selectedId, setSelectedId] = useState<string>(accounts[0]?.id ?? "");
  const selected = accounts.find((a) => a.id === selectedId) ?? accounts[0];
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!currentUser || !selected) return null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const numeric = parseFloat(amount.replace(",", "."));
    try {
      if (mode === "deposit") {
        deposit(selected.id, numeric);
        setSuccess(
          `Счёт пополнен на ${formatMoney(numeric, selected.currency)}.`,
        );
      } else {
        withdraw(selected.id, numeric);
        setSuccess(
          `Со счёта снято ${formatMoney(numeric, selected.currency)}.`,
        );
      }
      setAmount("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка операции");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Счета и карты</h1>
        <p className="text-sm text-slate-500">
          Управляйте своими счетами: пополняйте или снимайте средства.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {accounts.map((a) => (
          <AccountCard
            key={a.id}
            account={a}
            onClick={() => {
              setSelectedId(a.id);
              setSuccess(null);
              setError(null);
            }}
            active={a.id === selected.id}
          />
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">
          Операции по счёту: {selected.name}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Текущий баланс: {formatMoney(selected.balance, selected.currency)}
        </p>

        <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <label className="label">Операция</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("deposit")}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  mode === "deposit"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Пополнить
              </button>
              <button
                type="button"
                onClick={() => setMode("withdraw")}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  mode === "withdraw"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                Снять
              </button>
            </div>
          </div>
          <div>
            <label className="label" htmlFor="amt">
              Сумма
            </label>
            <div className="relative">
              <input
                id="amt"
                className="input pr-16"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                placeholder="0,00"
                required
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                {selected.currency}
              </span>
            </div>
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full sm:w-auto">
              Выполнить
            </button>
          </div>
        </form>

        {(error || success) && (
          <div className="mt-4">
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

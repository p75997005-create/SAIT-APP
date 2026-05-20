import { useMemo, useState, type FormEvent } from "react";
import { useBank } from "../context/useBank";
import { userAccounts } from "../lib/bank";
import { formatMoney } from "../utils/format";
import type { Currency } from "../types";

const rates: Record<Currency, number> = { RUB: 1, USD: 92, EUR: 100 };

export default function Exchange() {
  const { state, currentUser, exchange } = useBank();
  const accounts = useMemo(
    () => (currentUser ? userAccounts(state, currentUser.id) : []),
    [currentUser, state],
  );
  const [fromId, setFromId] = useState(accounts[0]?.id ?? "");
  const [toId, setToId] = useState(accounts[1]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!currentUser) return null;

  const from = accounts.find((a) => a.id === fromId);
  const to = accounts.find((a) => a.id === toId);
  const numeric = parseFloat(amount.replace(",", "."));
  const converted =
    from && to && Number.isFinite(numeric) && numeric > 0
      ? (numeric * rates[from.currency]) / rates[to.currency]
      : 0;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      exchange(fromId, toId, numeric);
      setSuccess(
        `Обмен ${formatMoney(numeric, from!.currency)} → ${formatMoney(
          converted,
          to!.currency,
        )} выполнен.`,
      );
      setAmount("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка обмена");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Обмен валют</h1>
        <p className="text-sm text-slate-500">
          Демо-курсы: 1 USD = 92 ₽ · 1 EUR = 100 ₽
        </p>
      </div>

      <form onSubmit={onSubmit} className="card space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="from-acc">
              Со счёта
            </label>
            <select
              id="from-acc"
              className="input"
              value={fromId}
              onChange={(e) => setFromId(e.target.value)}
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} · {formatMoney(a.balance, a.currency)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="to-acc">
              На счёт
            </label>
            <select
              id="to-acc"
              className="input"
              value={toId}
              onChange={(e) => setToId(e.target.value)}
            >
              {accounts
                .filter((a) => a.id !== fromId)
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} · {formatMoney(a.balance, a.currency)}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="exch-amount">
            Сумма списания
          </label>
          <div className="relative">
            <input
              id="exch-amount"
              className="input pr-16"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder="0,00"
              required
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
              {from?.currency ?? "RUB"}
            </span>
          </div>
        </div>

        {from && to && (
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Будет зачислено:{" "}
            <span className="font-semibold text-slate-900">
              {formatMoney(converted, to.currency)}
            </span>
          </div>
        )}

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

        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            Обменять
          </button>
        </div>
      </form>
    </div>
  );
}

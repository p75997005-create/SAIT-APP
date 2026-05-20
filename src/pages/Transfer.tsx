import { useMemo, useState, type FormEvent } from "react";
import { useBank } from "../context/useBank";
import { userAccounts } from "../lib/bank";
import { formatMoney } from "../utils/format";

type Recipient = "account" | "email";

export default function TransferPage() {
  const { state, currentUser, transfer } = useBank();
  const accounts = useMemo(
    () => (currentUser ? userAccounts(state, currentUser.id) : []),
    [currentUser, state],
  );
  const [fromAccountId, setFromAccountId] = useState<string>(
    accounts[0]?.id ?? "",
  );
  const [recipientType, setRecipientType] = useState<Recipient>("account");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!currentUser) return null;

  const fromAccount = accounts.find((a) => a.id === fromAccountId);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const numeric = parseFloat(amount.replace(",", "."));
    try {
      transfer({
        fromAccountId,
        toAccountNumber: recipientType === "account" ? toAccountNumber : undefined,
        toEmail: recipientType === "email" ? toEmail : undefined,
        amount: numeric,
        description,
      });
      setSuccess(
        `Перевод на сумму ${formatMoney(
          numeric,
          fromAccount?.currency ?? "RUB",
        )} успешно выполнен.`,
      );
      setAmount("");
      setDescription("");
      setToAccountNumber("");
      setToEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка перевода");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Новый перевод</h1>
        <p className="text-sm text-slate-500">
          Переведите средства другому клиенту или на свой счёт.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={onSubmit} className="card space-y-4 lg:col-span-2">
          <div>
            <label className="label" htmlFor="from">
              Со счёта
            </label>
            <select
              id="from"
              className="input"
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              required
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} · {formatMoney(a.balance, a.currency)} · {a.number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="label">Получатель</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRecipientType("account")}
                className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  recipientType === "account"
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                По номеру счёта
              </button>
              <button
                type="button"
                onClick={() => setRecipientType("email")}
                className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  recipientType === "email"
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                По email
              </button>
            </div>
          </div>

          {recipientType === "account" ? (
            <div>
              <label className="label" htmlFor="to-account">
                Номер счёта получателя
              </label>
              <input
                id="to-account"
                className="input"
                value={toAccountNumber}
                onChange={(e) => setToAccountNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
          ) : (
            <div>
              <label className="label" htmlFor="to-email">
                Email получателя
              </label>
              <input
                id="to-email"
                type="email"
                className="input"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="recipient@example.com"
                required
              />
            </div>
          )}

          <div>
            <label className="label" htmlFor="amount">
              Сумма
            </label>
            <div className="relative">
              <input
                id="amount"
                className="input pr-16"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                placeholder="0,00"
                required
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                {fromAccount?.currency ?? "RUB"}
              </span>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="description">
              Комментарий
            </label>
            <input
              id="description"
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Например, оплата ужина"
              maxLength={100}
            />
          </div>

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

          <div className="flex justify-end gap-2">
            <button type="submit" className="btn-primary">
              Перевести
            </button>
          </div>
        </form>

        <aside className="card space-y-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Демо-получатели
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Используйте email для быстрого тестового перевода.
            </p>
          </div>
          <div className="space-y-2">
            {state.users
              .filter((u) => u.id !== currentUser.id)
              .map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    setRecipientType("email");
                    setToEmail(u.email);
                  }}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm transition hover:border-brand-300 hover:bg-brand-50/50"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-900">
                      {u.fullName}
                    </div>
                    <div className="truncate text-xs text-slate-500">
                      {u.email}
                    </div>
                  </div>
                  <span className="text-brand-600">→</span>
                </button>
              ))}
          </div>
          <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
            Переводы между счетами с разными валютами недоступны напрямую —
            воспользуйтесь обменом валют.
          </div>
        </aside>
      </div>
    </div>
  );
}

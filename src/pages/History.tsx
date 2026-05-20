import { useMemo, useState } from "react";
import { useBank } from "../context/useBank";
import { userAccounts, userTransactions } from "../lib/bank";
import TransactionItem from "../components/TransactionItem";

type Filter = "all" | "incoming" | "outgoing" | "deposit" | "withdrawal";

export default function History() {
  const { state, currentUser } = useBank();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const accounts = useMemo(
    () => (currentUser ? userAccounts(state, currentUser.id) : []),
    [currentUser, state],
  );
  const transactions = useMemo(() => {
    if (!currentUser) return [];
    const txs = userTransactions(state, currentUser.id);
    return txs
      .filter((tx) => {
        if (filter === "deposit") return tx.type === "deposit";
        if (filter === "withdrawal") return tx.type === "withdrawal";
        if (filter === "incoming")
          return tx.toUserId === currentUser.id && tx.type !== "withdrawal";
        if (filter === "outgoing")
          return tx.fromUserId === currentUser.id && tx.type !== "deposit";
        return true;
      })
      .filter((tx) =>
        query
          ? tx.description.toLowerCase().includes(query.toLowerCase())
          : true,
      );
  }, [currentUser, filter, query, state]);

  if (!currentUser) return null;

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "incoming", label: "Входящие" },
    { key: "outgoing", label: "Исходящие" },
    { key: "deposit", label: "Пополнения" },
    { key: "withdrawal", label: "Снятия" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">История операций</h1>
        <p className="text-sm text-slate-500">
          Все ваши финансовые операции в одном месте.
        </p>
      </div>

      <div className="card space-y-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                filter === f.key
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div>
          <input
            className="input"
            placeholder="Поиск по описанию..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          {transactions.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
              Операций не найдено.
            </div>
          )}
          {transactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              tx={tx}
              currentUserId={currentUser.id}
              accounts={accounts}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

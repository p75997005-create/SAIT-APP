import { Link } from "react-router-dom";
import { useBank } from "../context/useBank";
import { totalBalanceInRub, userAccounts, userTransactions } from "../lib/bank";
import AccountCard from "../components/AccountCard";
import TransactionItem from "../components/TransactionItem";
import { formatMoney } from "../utils/format";

export default function Dashboard() {
  const { state, currentUser } = useBank();
  if (!currentUser) return null;

  const accounts = userAccounts(state, currentUser.id);
  const txs = userTransactions(state, currentUser.id).slice(0, 5);
  const total = totalBalanceInRub(state, currentUser.id);

  return (
    <div className="space-y-6">
      <div className="card flex flex-col gap-4 bg-gradient-to-br from-brand-700 to-brand-500 text-white shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm uppercase tracking-wider text-white/70">
            Общий баланс
          </div>
          <div className="mt-2 text-3xl font-bold sm:text-4xl">
            {formatMoney(total, "RUB")}
          </div>
          <div className="mt-1 text-sm text-white/70">
            Привет, {currentUser.fullName.split(" ")[0]}! Добро пожаловать в
            SaitBank.
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/app/transfer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-sm hover:bg-slate-100"
          >
            💸 Перевести
          </Link>
          <Link
            to="/app/cards"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
          >
            💳 Счета
          </Link>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Мои счета</h2>
          <Link
            to="/app/cards"
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            Все счета →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {accounts.map((a) => (
            <AccountCard key={a.id} account={a} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Последние операции</h2>
          <Link
            to="/app/history"
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            Вся история →
          </Link>
        </div>
        <div className="space-y-2">
          {txs.length === 0 && (
            <div className="card text-center text-sm text-slate-500">
              Операций пока нет.
            </div>
          )}
          {txs.map((tx) => (
            <TransactionItem
              key={tx.id}
              tx={tx}
              currentUserId={currentUser.id}
              accounts={accounts}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

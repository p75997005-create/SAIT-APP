import type { Account, Transaction } from "../types";
import { formatDate, formatMoney } from "../utils/format";

const typeIcons: Record<Transaction["type"], string> = {
  transfer: "↔",
  deposit: "↓",
  withdrawal: "↑",
  fee: "•",
};

function describeTx(tx: Transaction, currentUserId: string): {
  title: string;
  subtitle: string;
  positive: boolean;
} {
  if (tx.type === "deposit") {
    return {
      title: "Пополнение",
      subtitle: tx.description,
      positive: true,
    };
  }
  if (tx.type === "withdrawal") {
    return {
      title: "Снятие",
      subtitle: tx.description,
      positive: false,
    };
  }
  if (tx.fromUserId === currentUserId) {
    return {
      title: "Исходящий перевод",
      subtitle: tx.description,
      positive: false,
    };
  }
  return {
    title: "Входящий перевод",
    subtitle: tx.description,
    positive: true,
  };
}

export default function TransactionItem({
  tx,
  currentUserId,
  accounts,
}: {
  tx: Transaction;
  currentUserId: string;
  accounts: Account[];
}) {
  const { title, subtitle, positive } = describeTx(tx, currentUserId);
  const account = accounts.find(
    (a) =>
      a.id === (positive ? tx.toAccountId : tx.fromAccountId) ||
      a.id === tx.toAccountId ||
      a.id === tx.fromAccountId,
  );
  const sign = positive ? "+" : "−";

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 transition hover:border-slate-200">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg ${
            positive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {typeIcons[tx.type]}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">
            {title}
          </div>
          <div className="truncate text-xs text-slate-500">
            {subtitle}
            {account ? ` · ${account.name}` : ""}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div
          className={`text-sm font-semibold ${
            positive ? "text-emerald-600" : "text-slate-900"
          }`}
        >
          {sign} {formatMoney(tx.amount, tx.currency)}
        </div>
        <div className="text-xs text-slate-400">{formatDate(tx.createdAt)}</div>
      </div>
    </div>
  );
}

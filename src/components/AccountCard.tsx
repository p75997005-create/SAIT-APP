import type { Account } from "../types";
import { formatMoney, maskAccount } from "../utils/format";

const gradients: Record<string, string> = {
  checking: "from-brand-600 via-brand-500 to-brand-400",
  savings: "from-emerald-600 via-emerald-500 to-teal-400",
  card: "from-slate-900 via-slate-800 to-slate-600",
};

const typeNames: Record<string, string> = {
  checking: "Расчётный",
  savings: "Накопительный",
  card: "Карта",
};

export default function AccountCard({
  account,
  onClick,
  active,
}: {
  account: Account;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-left text-white shadow-card transition ${
        gradients[account.type]
      } ${
        onClick
          ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2"
          : "cursor-default"
      } ${active ? "ring-2 ring-brand-300 ring-offset-2" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-white/70">
            {typeNames[account.type]}
          </div>
          <div className="mt-1 text-base font-semibold">{account.name}</div>
        </div>
        <div className="text-xs text-white/70">{account.currency}</div>
      </div>
      <div className="mt-8 text-2xl font-bold sm:text-3xl">
        {formatMoney(account.balance, account.currency)}
      </div>
      <div className="mt-2 flex items-center justify-between text-sm text-white/80">
        <span>{maskAccount(account.number)}</span>
        <span className="text-[10px] uppercase tracking-wider">SaitBank</span>
      </div>
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
    </button>
  );
}

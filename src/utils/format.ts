import type { Currency } from "../types";

const localeByCurrency: Record<Currency, string> = {
  RUB: "ru-RU",
  USD: "en-US",
  EUR: "de-DE",
};

export function formatMoney(amount: number, currency: Currency): string {
  try {
    return new Intl.NumberFormat(localeByCurrency[currency], {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "RUB" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return iso;
  }
}

export function maskAccount(num: string): string {
  const clean = num.replace(/\s+/g, "");
  if (clean.length < 8) return num;
  const last4 = clean.slice(-4);
  return `•••• ${last4}`;
}

import type { Account, BankState, Transaction, User } from "../types";

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function accountNumber(): string {
  const digits = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10));
  return digits.join("").replace(/(.{4})/g, "$1 ").trim();
}

export function createSeedState(): BankState {
  const users: User[] = [
    {
      id: "u_demo",
      email: "demo@saitbank.ru",
      password: "demo1234",
      fullName: "Иван Петров",
      phone: "+7 (900) 000-00-01",
      createdAt: new Date().toISOString(),
    },
    {
      id: "u_anna",
      email: "anna@saitbank.ru",
      password: "anna1234",
      fullName: "Анна Соколова",
      phone: "+7 (900) 000-00-02",
      createdAt: new Date().toISOString(),
    },
    {
      id: "u_mark",
      email: "mark@saitbank.ru",
      password: "mark1234",
      fullName: "Марк Иванов",
      phone: "+7 (900) 000-00-03",
      createdAt: new Date().toISOString(),
    },
  ];

  const accounts: Account[] = [
    {
      id: uid("a"),
      userId: "u_demo",
      name: "Основной счёт",
      number: accountNumber(),
      balance: 125000,
      currency: "RUB",
      type: "checking",
    },
    {
      id: uid("a"),
      userId: "u_demo",
      name: "Накопительный",
      number: accountNumber(),
      balance: 350000,
      currency: "RUB",
      type: "savings",
    },
    {
      id: uid("a"),
      userId: "u_demo",
      name: "Долларовый",
      number: accountNumber(),
      balance: 1450,
      currency: "USD",
      type: "checking",
    },
    {
      id: uid("a"),
      userId: "u_anna",
      name: "Основной счёт",
      number: accountNumber(),
      balance: 78500,
      currency: "RUB",
      type: "checking",
    },
    {
      id: uid("a"),
      userId: "u_mark",
      name: "Карта Visa",
      number: accountNumber(),
      balance: 23400,
      currency: "RUB",
      type: "card",
    },
  ];

  const now = Date.now();
  const transactions: Transaction[] = [
    {
      id: uid("t"),
      type: "deposit",
      toAccountId: accounts[0].id,
      toUserId: "u_demo",
      amount: 50000,
      currency: "RUB",
      description: "Пополнение зарплатой",
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
      status: "completed",
    },
    {
      id: uid("t"),
      type: "transfer",
      fromAccountId: accounts[0].id,
      fromUserId: "u_demo",
      toAccountId: accounts[3].id,
      toUserId: "u_anna",
      amount: 3500,
      currency: "RUB",
      description: "Кофе и обед",
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
      status: "completed",
    },
    {
      id: uid("t"),
      type: "withdrawal",
      fromAccountId: accounts[0].id,
      fromUserId: "u_demo",
      amount: 5000,
      currency: "RUB",
      description: "Снятие в банкомате",
      createdAt: new Date(now - 1000 * 60 * 60 * 24 * 1).toISOString(),
      status: "completed",
    },
  ];

  return { users, accounts, transactions };
}

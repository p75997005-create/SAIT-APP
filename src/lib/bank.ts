import type {
  Account,
  BankState,
  Currency,
  Transaction,
  User,
} from "../types";

export class BankError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BankError";
  }
}

export function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

export function generateAccountNumber(): string {
  const digits = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10));
  return digits.join("").replace(/(.{4})/g, "$1 ").trim();
}

export function findUserByEmail(state: BankState, email: string): User | undefined {
  return state.users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  );
}

export function findUserById(state: BankState, id: string): User | undefined {
  return state.users.find((u) => u.id === id);
}

export function userAccounts(state: BankState, userId: string): Account[] {
  return state.accounts.filter((a) => a.userId === userId);
}

export function accountById(state: BankState, accountId: string): Account | undefined {
  return state.accounts.find((a) => a.id === accountId);
}

export function totalBalanceInRub(state: BankState, userId: string): number {
  const rates: Record<Currency, number> = { RUB: 1, USD: 92, EUR: 100 };
  return userAccounts(state, userId).reduce(
    (sum, acc) => sum + acc.balance * rates[acc.currency],
    0,
  );
}

export function registerUser(
  state: BankState,
  data: { email: string; password: string; fullName: string; phone?: string },
): { state: BankState; user: User } {
  if (findUserByEmail(state, data.email)) {
    throw new BankError("Пользователь с таким email уже зарегистрирован");
  }
  const user: User = {
    id: uid("u"),
    email: data.email.trim().toLowerCase(),
    password: data.password,
    fullName: data.fullName.trim(),
    phone: data.phone?.trim(),
    createdAt: new Date().toISOString(),
  };
  const account: Account = {
    id: uid("a"),
    userId: user.id,
    name: "Основной счёт",
    number: generateAccountNumber(),
    balance: 1000,
    currency: "RUB",
    type: "checking",
  };
  const welcomeTx: Transaction = {
    id: uid("t"),
    type: "deposit",
    toAccountId: account.id,
    toUserId: user.id,
    amount: 1000,
    currency: "RUB",
    description: "Приветственный бонус",
    createdAt: new Date().toISOString(),
    status: "completed",
  };
  const newState: BankState = {
    users: [...state.users, user],
    accounts: [...state.accounts, account],
    transactions: [welcomeTx, ...state.transactions],
  };
  return { state: newState, user };
}

export function login(state: BankState, email: string, password: string): User {
  const user = findUserByEmail(state, email);
  if (!user || user.password !== password) {
    throw new BankError("Неверный email или пароль");
  }
  return user;
}

export function deposit(
  state: BankState,
  accountId: string,
  amount: number,
  description = "Пополнение счёта",
): BankState {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new BankError("Сумма должна быть положительной");
  }
  const account = accountById(state, accountId);
  if (!account) throw new BankError("Счёт не найден");
  const updated: Account = { ...account, balance: account.balance + amount };
  const tx: Transaction = {
    id: uid("t"),
    type: "deposit",
    toAccountId: account.id,
    toUserId: account.userId,
    amount,
    currency: account.currency,
    description,
    createdAt: new Date().toISOString(),
    status: "completed",
  };
  return {
    ...state,
    accounts: state.accounts.map((a) => (a.id === account.id ? updated : a)),
    transactions: [tx, ...state.transactions],
  };
}

export function withdraw(
  state: BankState,
  accountId: string,
  amount: number,
  description = "Снятие средств",
): BankState {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new BankError("Сумма должна быть положительной");
  }
  const account = accountById(state, accountId);
  if (!account) throw new BankError("Счёт не найден");
  if (account.balance < amount) {
    throw new BankError("Недостаточно средств на счёте");
  }
  const updated: Account = { ...account, balance: account.balance - amount };
  const tx: Transaction = {
    id: uid("t"),
    type: "withdrawal",
    fromAccountId: account.id,
    fromUserId: account.userId,
    amount,
    currency: account.currency,
    description,
    createdAt: new Date().toISOString(),
    status: "completed",
  };
  return {
    ...state,
    accounts: state.accounts.map((a) => (a.id === account.id ? updated : a)),
    transactions: [tx, ...state.transactions],
  };
}

export interface TransferInput {
  fromAccountId: string;
  toAccountNumber?: string;
  toEmail?: string;
  amount: number;
  description?: string;
}

export function transfer(state: BankState, input: TransferInput): BankState {
  const { fromAccountId, amount } = input;
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new BankError("Сумма должна быть положительной");
  }
  const fromAccount = accountById(state, fromAccountId);
  if (!fromAccount) throw new BankError("Счёт списания не найден");
  if (fromAccount.balance < amount) {
    throw new BankError("Недостаточно средств для перевода");
  }

  let toAccount: Account | undefined;
  if (input.toAccountNumber) {
    const normalized = input.toAccountNumber.replace(/\s+/g, "");
    toAccount = state.accounts.find(
      (a) => a.number.replace(/\s+/g, "") === normalized,
    );
  } else if (input.toEmail) {
    const user = findUserByEmail(state, input.toEmail);
    if (user) {
      toAccount = state.accounts.find(
        (a) => a.userId === user.id && a.currency === fromAccount.currency,
      );
    }
  }
  if (!toAccount) {
    throw new BankError("Счёт получателя не найден");
  }
  if (toAccount.id === fromAccount.id) {
    throw new BankError("Нельзя перевести на тот же счёт");
  }
  if (toAccount.currency !== fromAccount.currency) {
    throw new BankError(
      "Валюты счетов не совпадают. Сначала используйте обмен валют.",
    );
  }

  const updatedFrom: Account = {
    ...fromAccount,
    balance: fromAccount.balance - amount,
  };
  const updatedTo: Account = {
    ...toAccount,
    balance: toAccount.balance + amount,
  };
  const tx: Transaction = {
    id: uid("t"),
    type: "transfer",
    fromAccountId: fromAccount.id,
    fromUserId: fromAccount.userId,
    toAccountId: toAccount.id,
    toUserId: toAccount.userId,
    amount,
    currency: fromAccount.currency,
    description:
      input.description?.trim() || `Перевод на счёт ${toAccount.number}`,
    createdAt: new Date().toISOString(),
    status: "completed",
  };

  return {
    ...state,
    accounts: state.accounts.map((a) => {
      if (a.id === updatedFrom.id) return updatedFrom;
      if (a.id === updatedTo.id) return updatedTo;
      return a;
    }),
    transactions: [tx, ...state.transactions],
  };
}

export function exchange(
  state: BankState,
  fromAccountId: string,
  toAccountId: string,
  amount: number,
): BankState {
  const from = accountById(state, fromAccountId);
  const to = accountById(state, toAccountId);
  if (!from || !to) throw new BankError("Счёт не найден");
  if (from.userId !== to.userId) {
    throw new BankError("Обмен возможен только между своими счетами");
  }
  if (from.id === to.id) {
    throw new BankError("Выберите разные счета");
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new BankError("Сумма должна быть положительной");
  }
  if (from.balance < amount) {
    throw new BankError("Недостаточно средств для обмена");
  }
  const rates: Record<Currency, number> = { RUB: 1, USD: 92, EUR: 100 };
  const converted = (amount * rates[from.currency]) / rates[to.currency];

  const updatedFrom: Account = { ...from, balance: from.balance - amount };
  const updatedTo: Account = { ...to, balance: to.balance + converted };

  const txOut: Transaction = {
    id: uid("t"),
    type: "transfer",
    fromAccountId: from.id,
    fromUserId: from.userId,
    toAccountId: to.id,
    toUserId: to.userId,
    amount,
    currency: from.currency,
    description: `Обмен ${from.currency} → ${to.currency}`,
    createdAt: new Date().toISOString(),
    status: "completed",
  };

  return {
    ...state,
    accounts: state.accounts.map((a) => {
      if (a.id === updatedFrom.id) return updatedFrom;
      if (a.id === updatedTo.id) return updatedTo;
      return a;
    }),
    transactions: [txOut, ...state.transactions],
  };
}

export function userTransactions(state: BankState, userId: string): Transaction[] {
  return state.transactions.filter(
    (t) => t.fromUserId === userId || t.toUserId === userId,
  );
}

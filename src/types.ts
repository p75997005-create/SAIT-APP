export type Currency = "RUB" | "USD" | "EUR";

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  createdAt: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  number: string;
  balance: number;
  currency: Currency;
  type: "checking" | "savings" | "card";
}

export type TransactionType = "transfer" | "deposit" | "withdrawal" | "fee";

export interface Transaction {
  id: string;
  fromAccountId?: string;
  toAccountId?: string;
  fromUserId?: string;
  toUserId?: string;
  amount: number;
  currency: Currency;
  type: TransactionType;
  description: string;
  createdAt: string;
  status: "completed" | "pending" | "failed";
}

export interface BankState {
  users: User[];
  accounts: Account[];
  transactions: Transaction[];
}

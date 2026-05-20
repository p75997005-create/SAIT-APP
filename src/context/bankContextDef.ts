import { createContext } from "react";
import type { BankState, User } from "../types";
import type { TransferInput } from "../lib/bank";

export interface BankContextValue {
  state: BankState;
  currentUser: User | null;
  login: (email: string, password: string) => void;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  }) => void;
  logout: () => void;
  transfer: (input: TransferInput) => void;
  deposit: (accountId: string, amount: number, description?: string) => void;
  withdraw: (accountId: string, amount: number, description?: string) => void;
  exchange: (fromAccountId: string, toAccountId: string, amount: number) => void;
  resetDemoData: () => void;
}

export const BankContext = createContext<BankContextValue | null>(null);

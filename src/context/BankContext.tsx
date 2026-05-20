import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { BankState, User } from "../types";
import {
  clearSession,
  clearState,
  loadSession,
  loadState,
  saveSession,
  saveState,
} from "../lib/storage";
import { createSeedState } from "../lib/seed";
import {
  deposit as bankDeposit,
  exchange as bankExchange,
  findUserById,
  login as bankLogin,
  registerUser,
  transfer as bankTransfer,
  withdraw as bankWithdraw,
  type TransferInput,
} from "../lib/bank";
import { BankContext, type BankContextValue } from "./bankContextDef";

export function BankProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BankState>(() => {
    const existing = loadState();
    if (existing) return existing;
    const seeded = createSeedState();
    saveState(seeded);
    return seeded;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() =>
    loadSession(),
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  const currentUser = useMemo<User | null>(
    () => (currentUserId ? findUserById(state, currentUserId) ?? null : null),
    [currentUserId, state],
  );

  const login = useCallback(
    (email: string, password: string) => {
      const user = bankLogin(state, email, password);
      saveSession(user.id);
      setCurrentUserId(user.id);
    },
    [state],
  );

  const register = useCallback(
    (data: {
      email: string;
      password: string;
      fullName: string;
      phone?: string;
    }) => {
      const { state: next, user } = registerUser(state, data);
      setState(next);
      saveSession(user.id);
      setCurrentUserId(user.id);
    },
    [state],
  );

  const logout = useCallback(() => {
    clearSession();
    setCurrentUserId(null);
  }, []);

  const transfer = useCallback(
    (input: TransferInput) => {
      const next = bankTransfer(state, input);
      setState(next);
    },
    [state],
  );

  const deposit = useCallback(
    (accountId: string, amount: number, description?: string) => {
      const next = bankDeposit(state, accountId, amount, description);
      setState(next);
    },
    [state],
  );

  const withdraw = useCallback(
    (accountId: string, amount: number, description?: string) => {
      const next = bankWithdraw(state, accountId, amount, description);
      setState(next);
    },
    [state],
  );

  const exchange = useCallback(
    (fromAccountId: string, toAccountId: string, amount: number) => {
      const next = bankExchange(state, fromAccountId, toAccountId, amount);
      setState(next);
    },
    [state],
  );

  const resetDemoData = useCallback(() => {
    clearState();
    clearSession();
    const seeded = createSeedState();
    saveState(seeded);
    setState(seeded);
    setCurrentUserId(null);
  }, []);

  const value: BankContextValue = {
    state,
    currentUser,
    login,
    register,
    logout,
    transfer,
    deposit,
    withdraw,
    exchange,
    resetDemoData,
  };

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
}

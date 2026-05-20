import { useContext } from "react";
import { BankContext, type BankContextValue } from "./bankContextDef";

export function useBank(): BankContextValue {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error("useBank must be used within BankProvider");
  return ctx;
}

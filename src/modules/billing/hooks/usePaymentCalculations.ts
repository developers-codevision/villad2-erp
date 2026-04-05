import { useMemo } from "react";
import type { BillingPaymentDto } from "../types/types";

interface PaymentCalculationsResult {
  totalPaid: number;
  effectiveBalance: number;
  totalWithAdvance: number;
  remaining: number;
  change: number;
  newAdvanceBalance: number;
}

/**
 * Hook que encapsula toda la lógica de cálculos de pagos
 * Elimina la necesidad de hacer cálculos en el componente
 */
export function usePaymentCalculations(
  totalAmount: number,
  payments: BillingPaymentDto[],
  advanceBalance: number = 0,
  useAdvanceBalance: boolean = false
): PaymentCalculationsResult {
  return useMemo(() => {
    const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const effectiveBalance = useAdvanceBalance ? advanceBalance : 0;
    const totalWithAdvance = totalPaid + effectiveBalance;
    const remaining = totalAmount - totalWithAdvance;
    const change = totalWithAdvance > totalAmount ? totalWithAdvance - totalAmount : 0;
    const newAdvanceBalance = change;

    return {
      totalPaid,
      effectiveBalance,
      totalWithAdvance,
      remaining,
      change,
      newAdvanceBalance,
    };
  }, [totalAmount, payments, advanceBalance, useAdvanceBalance]);
}


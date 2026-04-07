import { useMemo } from "react";
import type { BillingPaymentDto } from "../types/types";

interface ChangeCalculationResult {
  paidInUsd: number;
  amountToPayInUsd: number;
  usdDifference: number;
  changeInCup: number;
  isFullPayment: boolean;
}

/**
 * Hook que encapsula la lógica de cálculo de cambio con dos tasas
 * - Tasa de cobro: convierte CUP a USD para el monto a pagar
 * - Tasa de vuelto: convierte USD a CUP para el cambio
 *
 * Lógica:
 * 1. Monto pagado en USD (suma de pagos)
 * 2. Monto a pagar en USD (total convertido desde CUP si es necesario)
 * 3. Diferencia USD = Pagado USD - A pagar USD
 * 4. Vuelto CUP = Diferencia USD × tasa de vuelto
 */
export function useChangeCalculation(
  totalAmountUsd: number,
  payments: BillingPaymentDto[],
  chargeRate: number = 1, // Para convertir de CUP a USD (default USD to CUP rate)
  changeRate: number = 400, // Para convertir USD a CUP en el vuelto
  advanceBalance: number = 0,
  useAdvanceBalance: boolean = false
): ChangeCalculationResult {
  return useMemo(() => {
    // Monto pagado en USD (suma directa de los pagos que ya están en USD)
    const paidInUsd = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Añadir anticipo si se usa
    const effectiveBalance = useAdvanceBalance ? advanceBalance : 0;
    const totalPaidWithAdvance = paidInUsd + effectiveBalance;

    // Monto a pagar es el total en USD
    const amountToPayInUsd = totalAmountUsd;

    // Diferencia: lo que se pagó de más
    const usdDifference = totalPaidWithAdvance - amountToPayInUsd;

    // Vuelto en CUP usando la tasa de vuelto
    const changeInCup = usdDifference > 0 ? usdDifference * changeRate : 0;

    // Full payment si la diferencia es cercana a 0 o positiva
    const isFullPayment = usdDifference >= -0.01;

    return {
      paidInUsd,
      amountToPayInUsd,
      usdDifference,
      changeInCup,
      isFullPayment,
    };
  }, [totalAmountUsd, payments, changeRate, advanceBalance, useAdvanceBalance]);
}


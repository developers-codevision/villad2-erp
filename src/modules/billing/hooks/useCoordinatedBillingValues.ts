import { useState, useCallback, useMemo } from "react";

interface CoordinatedValuesResult {
  tip: number;
  advanceBalance: number;
  changeRemaining: number;
  setTip: (value: number) => void;
  setAdvanceBalance: (value: number) => void;
}

/**
 * Hook que coordina los dos valores editables relacionados con el cambio:
 * - tip: propina
 * - advanceBalance: fondo/anticipo del cliente
 * - changeRemaining: lo que devolvemos en efectivo al cliente (CALCULADO)
 *
 * Restricción: tip + advanceBalance + changeRemaining = totalChange
 * changeRemaining se calcula automáticamente: totalChangeInCup - tip - advanceBalance
 */
export function useCoordinatedBillingValues(totalChangeInCup: number): CoordinatedValuesResult {
  const [tip, setTipState] = useState(0);
  const [advanceBalance, setAdvanceBalanceState] = useState(0);

  // changeRemaining se calcula automáticamente
  const changeRemaining = useMemo(() => {
    return Math.max(0, totalChangeInCup - tip - advanceBalance);
  }, [totalChangeInCup, tip, advanceBalance]);

  const setTip = useCallback((value: number) => {
    const newTip = Math.max(0, value);
    const available = totalChangeInCup - advanceBalance;

    if (newTip <= available + 0.01) {
      setTipState(newTip);
    }
  }, [advanceBalance, totalChangeInCup]);

  const setAdvanceBalance = useCallback((value: number) => {
    const newAdvance = Math.max(0, value);
    const available = totalChangeInCup - tip;

    if (newAdvance <= available + 0.01) {
      setAdvanceBalanceState(newAdvance);
    }
  }, [tip, totalChangeInCup]);

  return {
    tip,
    advanceBalance,
    changeRemaining,
    setTip,
    setAdvanceBalance,
  };
}


import { useState, useCallback, useMemo } from "react";
import type { BillDenominationDto, Currency } from "../types/types";

interface UseBillDenominationsResult {
  billDenominations: BillDenominationDto[];
  addBillDenomination: (value: number) => void;
  updateDenominationQuantity: (currency: Currency, value: number, quantity: number) => void;
  calculateBillsTotal: () => number;
  clearBillDenominations: () => void;
  getBillsByCurrentCurrency: () => BillDenominationDto[];
}

const BILL_DENOMINATIONS = {
  USD: [1, 2, 5, 10, 20, 50, 100],
  EUR: [5, 10, 20, 50, 100, 200, 500],
  CUP: [1, 3, 5, 10, 20, 50, 100, 200, 500, 1000],
};

/**
 * Hook que encapsula toda la lógica de gestión de denominaciones de billetes
 * Centraliza estado y operaciones relacionadas con billetes
 */
export function useBillDenominations(currentCurrency: Currency) {
  const [billDenominations, setBillDenominations] = useState<BillDenominationDto[]>([]);

  const addBillDenomination = useCallback(
    (value: number) => {
      setBillDenominations((prev) => {
        const existing = prev.find((d) => d.currency === currentCurrency && d.value === value);

        if (existing) {
          return prev.map((d) =>
            d.currency === currentCurrency && d.value === value
              ? { ...d, quantity: d.quantity + 1 }
              : d
          );
        }

        return [...prev, { currency: currentCurrency, value, quantity: 1 }];
      });
    },
    [currentCurrency]
  );

  const updateDenominationQuantity = useCallback(
    (currency: Currency, value: number, quantity: number) => {
      setBillDenominations((prev) => {
        if (quantity <= 0) {
          return prev.filter((d) => !(d.currency === currency && d.value === value));
        }

        return prev.map((d) =>
          d.currency === currency && d.value === value ? { ...d, quantity } : d
        );
      });
    },
    []
  );

  const calculateBillsTotal = useCallback(() => {
    return billDenominations
      .filter((d) => d.currency === currentCurrency)
      .reduce((sum, d) => sum + d.value * d.quantity, 0);
  }, [billDenominations, currentCurrency]);

  const clearBillDenominations = useCallback(() => {
    setBillDenominations([]);
  }, []);

  const getBillsByCurrentCurrency = useCallback(() => {
    return billDenominations.filter((d) => d.currency === currentCurrency);
  }, [billDenominations, currentCurrency]);

  const availableDenominations = useMemo(
    () => BILL_DENOMINATIONS[currentCurrency] || [],
    [currentCurrency]
  );

  return {
    billDenominations,
    addBillDenomination,
    updateDenominationQuantity,
    calculateBillsTotal,
    clearBillDenominations,
    getBillsByCurrentCurrency,
    availableDenominations: availableDenominations,
  } as UseBillDenominationsResult & { availableDenominations: number[] };
}

export { BILL_DENOMINATIONS };


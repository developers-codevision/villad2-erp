import { useState, useCallback, useMemo } from "react";
import type { BillingSheetItemDto } from "../types/types";

interface BillingRow {
  itemId: number;
  conceptName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface ItemInput {
  quantity: number;
  price: number;
}

interface InvoiceTotals {
  subtotal: number;
  tip: number;
  tax10: number;
  total: number;
}

/**
 * Hook que encapsula toda la lógica de gestión de ítems en la factura en proceso
 * Maneja filas, cálculos y estado de tipAmount
 */
export function useBillingInvoice(defaultTaxRate: number = 0.1) {
  const [billingRows, setBillingRows] = useState<BillingRow[]>([]);
  const [tipAmount, setTipAmount] = useState(0);
  const [itemInputs, setItemInputs] = useState<Record<number, ItemInput>>({});

  const getItemInput = useCallback(
    (itemId: number, defaultPrice: number): ItemInput => {
      return itemInputs[itemId] || { quantity: 1, price: defaultPrice };
    },
    [itemInputs]
  );

  const updateItemInput = useCallback((itemId: number, field: keyof ItemInput, value: number) => {
    setItemInputs((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  }, []);

  const addItemToBilling = useCallback(
    (item: BillingSheetItemDto, conceptName: string) => {
      const input = getItemInput(item.id, Number(item.priceUsd) || 0);

      setBillingRows((prev) => {
        const existingRow = prev.find((row) => row.itemId === item.id);

        if (existingRow) {
          return prev.map((row) =>
            row.itemId === item.id
              ? {
                  ...row,
                  quantity: row.quantity + input.quantity,
                  subtotal: (row.quantity + input.quantity) * row.unitPrice,
                }
              : row
          );
        }

        return [
          ...prev,
          {
            itemId: item.id,
            conceptName,
            quantity: input.quantity,
            unitPrice: input.price,
            subtotal: input.quantity * input.price,
          },
        ];
      });
    },
    [getItemInput]
  );

  const updateRowQuantity = useCallback((itemId: number, quantity: number) => {
    setBillingRows((prev) =>
      prev.map((row) =>
        row.itemId === itemId
          ? { ...row, quantity, subtotal: quantity * row.unitPrice }
          : row
      )
    );
  }, []);

  const updateRowPrice = useCallback((itemId: number, unitPrice: number) => {
    setBillingRows((prev) =>
      prev.map((row) =>
        row.itemId === itemId
          ? { ...row, unitPrice, subtotal: row.quantity * unitPrice }
          : row
      )
    );
  }, []);

  const removeRow = useCallback((itemId: number) => {
    setBillingRows((prev) => prev.filter((row) => row.itemId !== itemId));
  }, []);

  const calculateTotals = useCallback((): InvoiceTotals => {
    const subtotal = billingRows.reduce((sum, row) => sum + row.subtotal, 0);
    const tip = tipAmount;
    const tax10 = subtotal * defaultTaxRate;
    const total = subtotal + tip + tax10;

    return { subtotal, tip, tax10, total };
  }, [billingRows, tipAmount, defaultTaxRate]);

  const clearInvoice = useCallback(() => {
    setBillingRows([]);
    setTipAmount(0);
    setItemInputs({});
  }, []);

  const totals = useMemo(() => calculateTotals(), [calculateTotals]);

  return {
    billingRows,
    tipAmount,
    setTipAmount,
    itemInputs,
    getItemInput,
    updateItemInput,
    addItemToBilling,
    updateRowQuantity,
    updateRowPrice,
    removeRow,
    calculateTotals,
    clearInvoice,
    totals,
    hasItems: billingRows.length > 0,
  };
}



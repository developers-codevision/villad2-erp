import { useMemo, useCallback, useState } from "react";
import type { BillingSheetDto } from "../types/types";

/**
 * Hook que encapsula la lógica de filtros para hojas de facturación
 * Mantiene estado de filtros y operaciones de búsqueda
 */
export function useSheetFilters(sheets: BillingSheetDto[] | undefined) {
  const [date, setDate] = useState("");
  const [minRate, setMinRate] = useState("");

  const filteredSheets = useMemo(() => {
    if (!sheets) return [];

    return sheets.filter((sheet) => {
      if (date && !sheet.date.includes(date)) return false;
      return !minRate || sheet.usdToCupRate >= Number(minRate);
    });
  }, [sheets, date, minRate]);

  const clearFilters = useCallback(() => {
    setDate("");
    setMinRate("");
  }, []);

  return {
    date,
    setDate,
    minRate,
    setMinRate,
    filteredSheets,
    clearFilters,
    hasActiveFilters: !!date || !!minRate,
  };
}



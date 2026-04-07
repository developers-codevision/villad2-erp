import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface ChangeBreakdownProps {
  paidInUsd: number;
  amountToPayInUsd: number;
  usdDifference: number;
  changeInCup: number;
  changeRate: number;
  onChangeRateChange: (rate: number) => void;
  disabled?: boolean;
}

/**
 * Componente que muestra el desglose del cálculo de cambio
 *
 * Lógica:
 * 1. Monto pagado USD - Monto a pagar USD = Diferencia USD
 * 2. Diferencia USD × Tasa de vuelto (CUP/USD) = Vuelto en CUP
 */
export function ChangeBreakdown({
  paidInUsd,
  amountToPayInUsd,
  usdDifference,
  changeInCup,
  changeRate,
  onChangeRateChange,
  disabled = false,
}: ChangeBreakdownProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
        Desglose de Cambio
      </h3>

      {/* Calculation Steps */}
      <div className="space-y-2 text-sm bg-white dark:bg-slate-900 rounded p-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Monto pagado:</span>
          <span className="font-medium">${paidInUsd.toFixed(2)} USD</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Monto a pagar:</span>
          <span className="font-medium">${amountToPayInUsd.toFixed(2)} USD</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-semibold">
          <span>Diferencia USD:</span>
          <span className={usdDifference >= 0 ? "text-green-600" : "text-red-600"}>
            ${usdDifference.toFixed(2)} USD
          </span>
        </div>
      </div>

      {/* Change Rate Input */}
      <div className="space-y-2">
        <Label htmlFor="changeRate" className="text-sm font-medium">
          Tasa de Vuelto (CUP por USD)
        </Label>
        <Input
          id="changeRate"
          type="number"
          step="0.01"
          min="0"
          value={changeRate}
          onChange={(e) => onChangeRateChange(parseFloat(e.target.value) || 400)}
          placeholder="400"
          disabled={disabled}
        />
      </div>

      {/* Final Change */}
      <div className="border-t pt-2 bg-green-50 dark:bg-green-950 p-3 rounded text-sm">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-muted-foreground">Vuelto Calculado:</span>
            <p className="text-xs text-muted-foreground mt-1">
              ${usdDifference.toFixed(2)} × {changeRate.toFixed(2)} = ₡{changeInCup.toFixed(2)}
            </p>
          </div>
          <span className="font-bold text-green-600 text-lg">
            ₡{changeInCup.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}


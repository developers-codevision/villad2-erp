import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React from "react";

interface PaymentSummaryProps {
  totalAmount: number;
  totalPaid: number;
  remaining: number;
  change: number;
  advanceBalance: number;
  useAdvanceBalance: boolean;
  onToggleAdvanceBalance: (checked: boolean) => void;
  newAdvanceBalance: number;
}

/**
 * Componente UI puro que muestra el resumen de cálculos de pagos
 * Maneja display de totales, cambio, anticipos
 */
export function PaymentSummary({
  totalAmount,
  totalPaid,
  remaining,
  change,
  advanceBalance,
  useAdvanceBalance,
  onToggleAdvanceBalance,
  newAdvanceBalance,
}: PaymentSummaryProps) {
  const totalWithAdvance = totalPaid + (useAdvanceBalance ? advanceBalance : 0);

  return (
    <div className="bg-primary/10 rounded-lg p-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span>Total a pagar:</span>
        <span className="font-semibold">${totalAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Total pagado:</span>
        <span className="font-semibold">${totalPaid.toFixed(2)}</span>
      </div>
      {advanceBalance > 0 && (
        <div className="flex justify-between items-center text-sm border-t pt-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="useAdvance"
              checked={useAdvanceBalance}
              onCheckedChange={(checked) => onToggleAdvanceBalance(checked === true)}
            />
            <Label htmlFor="useAdvance" className="cursor-pointer font-normal">
              Usar anticipo disponible:
            </Label>
          </div>
          <span className="font-semibold text-green-600">${advanceBalance.toFixed(2)}</span>
        </div>
      )}
      {useAdvanceBalance && (
        <div className="flex justify-between text-sm">
          <span>Total con anticipo:</span>
          <span className="font-semibold">${totalWithAdvance.toFixed(2)}</span>
        </div>
      )}
      <div className="border-t pt-2 space-y-2">
        {remaining > 0 ? (
          <div className="flex justify-between text-lg font-bold">
            <span>Falta por pagar:</span>
            <span className="text-destructive">${remaining.toFixed(2)}</span>
          </div>
        ) : remaining === 0 ? (
          <div className="flex justify-between text-lg font-bold">
            <span>Estado:</span>
            <span className="text-green-600">✓ Pago Exacto</span>
          </div>
        ) : (
          <>
            <div className="flex justify-between text-lg font-bold">
              <span>Vuelto:</span>
              <span className="text-green-600">${change.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm bg-green-50 dark:bg-green-950 p-2 rounded">
              <span className="text-green-700 dark:text-green-300">Anticipo acumulado:</span>
              <span className="font-semibold text-green-700 dark:text-green-300">
                ${newAdvanceBalance.toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


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
  usdToCupRate?: number;
  changeRate?: number;
}

/**
 * Componente UI que muestra el resumen de pagos
 * Muestra: pagos, cambio en CUP, anticipo
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
  usdToCupRate = 1,
  changeRate = 400,
}: PaymentSummaryProps) {
  const totalWithAdvance = totalPaid + (useAdvanceBalance ? advanceBalance : 0);

  // Estado: diferencia en USD (pagado - a pagar)
  const estateUsd = totalPaid - totalAmount;

  // Vuelto: diferencia en CUP (estado USD * tasa de vuelto)
  const vueltoInCup = Math.max(0, estateUsd * changeRate);

  return (
    <div className="bg-primary/10 rounded-lg p-4 space-y-4">
      {/* Pagos y Estado */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Total pagado:</span>
          <span className="font-semibold">${totalPaid.toFixed(2)} USD</span>
        </div>

        {advanceBalance > 0 && (
          <div className="flex justify-between items-center text-sm">
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
            <span className="font-semibold text-green-600">${advanceBalance.toFixed(2)} USD</span>
          </div>
        )}

        {useAdvanceBalance && (
          <div className="flex justify-between text-sm">
            <span>Total con anticipo:</span>
            <span className="font-semibold">${totalWithAdvance.toFixed(2)} USD</span>
          </div>
        )}

        <div className="border-t pt-2 space-y-2">
          {remaining > 0.01 ? (
            <div className="flex justify-between text-lg font-bold">
              <span>Falta por pagar:</span>
              <span className="text-destructive">${remaining.toFixed(2)} USD</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estado:</span>
                <span className={`font-semibold ${estateUsd > 0.01 ? "text-green-600" : "text-muted-foreground"}`}>
                  ${estateUsd.toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Vuelto:</span>
                <span className="text-green-600">₡{vueltoInCup.toFixed(2)} CUP</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


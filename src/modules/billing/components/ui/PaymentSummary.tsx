import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface PaymentSummaryProps {
  totalAmount: number;
  totalPaid: number;
  remaining: number;
  advanceBalance: number;
  useAdvanceBalance: boolean;
  onToggleAdvanceBalance: (checked: boolean) => void;
  changeRate?: number;
  leaveFund: boolean;
  fundAmount: number;
  onToggleLeaveFund: (checked: boolean) => void;
  onFundAmountChange: (value: number) => void;
  leaveTip: boolean;
  tipAmount: number;
  onToggleLeaveTip: (checked: boolean) => void;
  onTipAmountChange: (value: number) => void;
}

export function PaymentSummary({
  totalAmount,
  totalPaid,
  remaining,
  advanceBalance,
  useAdvanceBalance,
  onToggleAdvanceBalance,
  changeRate = 400,
  leaveFund,
  fundAmount,
  onToggleLeaveFund,
  onFundAmountChange,
  leaveTip,
  tipAmount,
  onToggleLeaveTip,
  onTipAmountChange,
}: PaymentSummaryProps) {
  const totalWithAdvance = totalPaid + (useAdvanceBalance ? advanceBalance : 0);

  // Diferencia en USD entre lo cubierto y lo que se debe
  const usdDifference = totalWithAdvance - totalAmount;

  // Vuelto en CUP: (Diferencia USD - Fondo USD) * tasa de vuelto
  const vueltoInCup = Math.max(0, (usdDifference - fundAmount) * changeRate);
  const finalChangeInCup = Math.max(0, vueltoInCup - (leaveTip ? tipAmount : 0));

  return (
    <div className="bg-primary/10 rounded-lg p-4 space-y-4">
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
                <span className="text-muted-foreground">Diferencia :</span>
                <span className={`font-semibold ${usdDifference > 0.01 ? "text-green-600" : "text-muted-foreground"}`}>
                  ${usdDifference.toFixed(2)} USD
                </span>
              </div>

              {/* Debajo de Diferencia: botón/input Dejar fondo */}
              <div className="rounded-md border bg-background p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="leaveFund"
                      checked={leaveFund}
                      onCheckedChange={(checked) => onToggleLeaveFund(checked === true)}
                    />
                    <Label htmlFor="leaveFund" className="cursor-pointer font-normal">
                      Dejar fondo
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground">Max: ${Math.max(0, usdDifference).toFixed(2)} USD</span>
                </div>

                {leaveFund && (
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-muted-foreground">$</span>
                    <Input
                      id="fundAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      max={Math.max(0, usdDifference)}
                      value={fundAmount}
                      onChange={(e) => onFundAmountChange(parseFloat(e.target.value) || 0)}
                      className="pl-7"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between text-sm font-bold">
                <span>Vuelto:</span>
                <span className="text-green-600">₡{vueltoInCup.toFixed(2)}</span>
              </div>

              <div className="rounded-md border bg-background p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="leaveTip"
                    checked={leaveTip}
                    onCheckedChange={(checked) => onToggleLeaveTip(checked === true)}
                  />
                  <Label htmlFor="leaveTip" className="cursor-pointer font-normal">
                    Dejar propina
                  </Label>
                </div>

                {leaveTip && (
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-muted-foreground">₡</span>
                    <Input
                      id="tipAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      max={vueltoInCup}
                      value={tipAmount}
                      onChange={(e) => onTipAmountChange(parseFloat(e.target.value) || 0)}
                      className="pl-7"
                    />
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vuelto despues de propina:</span>
                  <span className="font-semibold text-green-600">₡{finalChangeInCup.toFixed(2)}</span>
                </div>
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
}
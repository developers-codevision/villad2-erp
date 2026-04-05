import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
}

/**
 * Componente UI puro que muestra el resumen de cálculos de pagos
 * Maneja display de totales, cambio, anticipos con desglose tabular CUP/USD
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
}: PaymentSummaryProps) {
  const totalWithAdvance = totalPaid + (useAdvanceBalance ? advanceBalance : 0);

  // Calcular valores en ambas monedas (totalAmount es en USD)
  const subtotalUsd = totalAmount / 1.1; // Restar el 10% para obtener subtotal
  const subtotalCup = subtotalUsd * usdToCupRate;
  const tax10Usd = totalAmount - subtotalUsd;
  const tax10Cup = tax10Usd * usdToCupRate;
  const totalUsd = totalAmount;
  const totalCup = totalUsd * usdToCupRate;

  return (
    <div className="bg-primary/10 rounded-lg p-4 space-y-4">
      {/* Tabla de Desglose */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Desglose de Facturación</h3>
        <Table className="text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Concepto</TableHead>
              <TableHead className="text-right">CUP</TableHead>
              <TableHead className="text-right">USD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Subtotal */}
            <TableRow>
              <TableCell className="font-medium text-muted-foreground">Subtotal</TableCell>
              <TableCell className="text-right font-semibold">₡{subtotalCup.toFixed(2)}</TableCell>
              <TableCell className="text-right font-semibold">${subtotalUsd.toFixed(2)}</TableCell>
            </TableRow>

            {/* Impuesto 10% */}
            <TableRow>
              <TableCell className="font-medium text-muted-foreground">Impuesto 10%</TableCell>
              <TableCell className="text-right font-semibold text-orange-600">₡{tax10Cup.toFixed(2)}</TableCell>
              <TableCell className="text-right font-semibold text-orange-600">${tax10Usd.toFixed(2)}</TableCell>
            </TableRow>

            {/* Total */}
            <TableRow className="border-t-2 border-primary">
              <TableCell className="font-bold text-primary">Total</TableCell>
              <TableCell className="text-right font-bold text-primary">₡{totalCup.toFixed(2)}</TableCell>
              <TableCell className="text-right font-bold text-primary">${totalUsd.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Pagos */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Total pagado:</span>
          <span className="font-semibold">${totalPaid.toFixed(2)}</span>
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
    </div>
  );
}


import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface InvoiceSummaryProps {
  subtotal: number;
  tax10: number;
  total: number;
  usdToCupRate?: number;
}

/**
 * Componente UI puro que muestra el resumen de totales de la factura en formato tabular
 * Dos columnas: CUP y USD
 */
export function InvoiceSummary({ subtotal, tax10, total, usdToCupRate = 1 }: InvoiceSummaryProps) {
  // Calcular valores en ambas monedas (USD es el estándar)
  const subtotalUsd = subtotal;
  const subtotalCup = subtotalUsd * usdToCupRate;
  const tax10Usd = tax10;
  const tax10Cup = tax10Usd * usdToCupRate;
  const totalUsd = total;
  const totalCup = totalUsd * usdToCupRate;

  return (
    <div className="bg-primary/10 rounded-lg p-4 space-y-2 h-fit">
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

      {/* Nueva línea: A pagar en CUP (texto negro, sin fondo) */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-black font-semibold">A pagar en CUP</span>
        <span className="text-black font-semibold">₡{totalCup.toFixed(2)}</span>
      </div>
    </div>
  );
}

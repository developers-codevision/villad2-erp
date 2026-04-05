import React from "react";

interface InvoiceSummaryProps {
  subtotal: number;
  tip: number;
  tax10: number;
  total: number;
}

/**
 * Componente UI puro que muestra el resumen de totales de la factura
 */
export function InvoiceSummary({ subtotal, tip, tax10, total }: InvoiceSummaryProps) {
  return (
    <div className="bg-primary/10 rounded-lg p-4 space-y-2 h-fit">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal:</span>
        <span className="font-semibold">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Propina:</span>
        <span className="font-semibold text-green-600">${tip.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Impuesto 10%:</span>
        <span className="font-semibold text-blue-600">${tax10.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-lg font-bold border-t pt-2">
        <span>Total a Pagar:</span>
        <span className="text-primary">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}


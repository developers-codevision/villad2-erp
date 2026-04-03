import { Button } from "@/components/ui/button";

interface BillingModalFooterProps {
  payments: Array<{
    paymentMethod: string;
    amount: number;
    billDenominations: any[];
  }>;
  change: number;
  totalPaid: number;
  totalAmount: number;
  tip: number;
  onCancel: () => void;
}

export function BillingModalFooter({
  payments,
  change,
  totalPaid,
  totalAmount,
  tip,
  onCancel
}: BillingModalFooterProps) {
  return (
    <div className="flex justify-between items-center pt-4 border-t">
      <div className="text-sm text-muted-foreground">
        {payments.length === 0 ? (
          <span className="text-orange-600">⚠️ Debe agregar al menos un método de pago</span>
        ) : change < 0 ? (
          <span className="text-red-600">⚠️ Falta pagar ${Math.abs(change).toFixed(2)}</span>
        ) : (
          <span className="text-green-600">✓ Listo para facturar</span>
        )}
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={payments.length === 0 || totalPaid < totalAmount + tip}
          className="min-w-[150px]"
        >
          💾 Crear Factura
        </Button>
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";

interface PaymentSummaryCardsProps {
  totalAmount: number;
  totalPaid: number;
  change: number;
  tip: number;
}

export function PaymentSummaryCards({ totalAmount, totalPaid, change, tip }: PaymentSummaryCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
        <div className="text-sm text-muted-foreground mb-1">Total a Pagar</div>
        <div className="text-2xl font-bold text-primary">
          ${Number(totalAmount + tip).toFixed(2)}
        </div>
      </div>
      <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <div className="text-sm text-muted-foreground mb-1">Total Recibido</div>
        <div className="text-2xl font-bold text-blue-600">
          ${Number(totalPaid).toFixed(2)}
        </div>
      </div>
      <div className={`p-4 rounded-lg border ${change >= 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
        <div className="text-sm text-muted-foreground mb-1">Vuelto</div>
        <div className={`text-2xl font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ${Number(change).toFixed(2)}
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import type { BillDenominationDto } from "../types/types";
import { PAYMENT_METHODS } from "../utils/paymentUtils";

interface PaymentData {
  paymentMethod: string;
  amount: number;
  billDenominations: BillDenominationDto[];
}

interface AddedPaymentsListProps {
  payments: PaymentData[];
  handleRemovePayment: (index: number) => void;
}

export function AddedPaymentsList({ payments, handleRemovePayment }: AddedPaymentsListProps) {
  if (payments.length === 0) return null;

  return (
    <div>
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <span className="text-green-600">✓</span> Pagos Agregados ({payments.length})
      </h4>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {payments.map((payment, index) => (
          <div key={index} className="p-3 rounded-lg border bg-green-500/5 border-green-500/20 relative">
            <Button
              type="button"
              onClick={() => handleRemovePayment(index)}
              className="absolute top-2 right-2"
              variant="ghost"
              size="icon"
              title="Eliminar pago"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>

            <div className="pr-8">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">
                  {PAYMENT_METHODS.find(m => m.value === payment.paymentMethod)?.label || payment.paymentMethod}
                </span>
                <Badge variant="secondary">USD</Badge>
              </div>
              <div className="text-lg font-bold text-green-700">
                ${payment.amount.toFixed(2)}
              </div>
              {payment.billDenominations && payment.billDenominations.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {payment.billDenominations.map((denom, idx) => (
                    <span key={idx} className="text-xs bg-background px-2 py-0.5 rounded border">
                      ${denom.value} × {denom.quantity}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

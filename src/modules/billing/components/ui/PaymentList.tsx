import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { BillingPaymentDto } from "../types/types";
import { PAYMENT_METHODS } from "./PaymentMethodSelector";
import React from "react";

interface PaymentListProps {
  payments: BillingPaymentDto[];
  onRemovePayment: (index: number) => void;
}

/**
 * Componente UI puro que muestra la lista de pagos agregados
 * Con botón para remover cada pago
 */
export function PaymentList({ payments, onRemovePayment }: PaymentListProps) {
  if (payments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">Pagos Agregados</h3>
      <div className="space-y-2">
        {payments.map((payment, index) => (
          <div
            key={index}
            className="flex items-start justify-between bg-card border rounded-lg p-3"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {PAYMENT_METHODS.find((m) => m.value === payment.paymentMethod)?.label}
                </span>
                <Badge variant="secondary">${payment.amount?.toFixed(2)}</Badge>
              </div>
              {payment.billDenominations && payment.billDenominations.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  {payment.billDenominations.map((d, i) => (
                    <span key={i} className="mr-2">
                      {d.quantity}×{d.value} {d.currency}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemovePayment(index)}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}


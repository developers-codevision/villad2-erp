import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaymentMethod } from "../types/types";
import React from "react";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string; supportsBills: boolean }[] = [
  { value: "cash_usd", label: "Efectivo USD", supportsBills: true },
  { value: "cash_eur", label: "Efectivo EUR", supportsBills: true },
  { value: "cash_cup", label: "Efectivo CUP", supportsBills: true },
  { value: "transfer_mobile", label: "Transferencia Móvil", supportsBills: false },
  { value: "bizum", label: "Bizum", supportsBills: false },
  { value: "zelle", label: "Zelle", supportsBills: false },
  { value: "transfer_abroad", label: "Transferencia del Exterior", supportsBills: false },
  { value: "stripe", label: "Stripe", supportsBills: false },
  { value: "paypal", label: "PayPal", supportsBills: false },
];

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="paymentMethod">Método de Pago</Label>
      <Select value={value} onValueChange={(v) => onChange(v as PaymentMethod)}>
        <SelectTrigger id="paymentMethod">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAYMENT_METHODS.map((method) => (
            <SelectItem key={method.value} value={method.value}>
              {method.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { PAYMENT_METHODS };
export type { PaymentMethod };


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { PaymentMethod } from "../types/types";
import { PAYMENT_METHODS } from "../utils/paymentUtils";

interface PaymentFormProps {
  newPayment: {
    paymentMethod: PaymentMethod;
    amount: number;
  };
  setNewPayment: (payment: { paymentMethod: PaymentMethod; amount: number }) => void;
  newBillCounts: Record<number, number>;
  billDenominations: number[];
  isCashPayment: boolean;
  handleNewBillCountChange: (denomination: number, count: number) => void;
  handleAddPayment: () => void;
}

export function PaymentForm({
  newPayment,
  setNewPayment,
  newBillCounts,
  billDenominations,
  isCashPayment,
  handleNewBillCountChange,
  handleAddPayment,
}: PaymentFormProps) {
  return (
    <div>
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <span className="text-primary">💳</span> Agregar Método de Pago
      </h4>

      <div className="p-4 rounded-lg border bg-card space-y-3">
        <div>
          <Label className="text-xs mb-2 block">Método de Pago</Label>
          <Select
            value={newPayment.paymentMethod}
            onValueChange={(value) => setNewPayment({ ...newPayment, paymentMethod: value as PaymentMethod })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar método" />
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

        <div>
          <Label htmlFor="newAmount" className="text-xs">Monto (USD)</Label>
          <Input
            id="newAmount"
            type="number"
            step="0.01"
            min="0"
            value={newPayment.amount || ''}
            onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
            placeholder="0.00"
            className="mt-1"
          />
        </div>

        {isCashPayment && (
          <div className="pt-2 border-t">
            <Label className="text-xs mb-2 block">Denominaciones de billetes</Label>
            <div className="grid grid-cols-5 gap-2">
              {billDenominations.map((denom) => (
                <div key={denom} className="space-y-1">
                  <Label htmlFor={`newBill-${denom}`} className="text-xs text-center block">
                    ${denom}
                  </Label>
                  <Input
                    id={`newBill-${denom}`}
                    type="number"
                    min="0"
                    value={newBillCounts[denom] || ''}
                    onChange={(e) => handleNewBillCountChange(denom, Number(e.target.value))}
                    placeholder="0"
                    className="text-center text-sm h-8"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          type="button"
          onClick={handleAddPayment}
          className="w-full"
          variant="default"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar este Pago
        </Button>
      </div>
    </div>
  );
}

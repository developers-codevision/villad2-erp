import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import type { PaymentInputDto } from "../types/types";

interface MixedPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billingRecordId: number;
  totalAmount: number;
  onProcessPayment: (
    recordId: number,
    payments: PaymentInputDto[],
    useAdvanceBalance: boolean
  ) => void;
}

const PAYMENT_METHODS = [
  { value: "cash", label: "Efectivo" },
  { value: "card", label: "Tarjeta" },
  { value: "transfer", label: "Transferencia" },
  { value: "check", label: "Cheque" },
];

const CURRENCIES = [
  { value: "CUP", label: "CUP (Peso Cubano)" },
  { value: "USD", label: "USD (Dólar)" },
  { value: "EUR", label: "EUR (Euro)" },
];

export function MixedPaymentModal({
  open,
  onOpenChange,
  billingRecordId,
  totalAmount,
  onProcessPayment,
}: MixedPaymentModalProps) {
  const [payments, setPayments] = useState<PaymentInputDto[]>([]);
  const [useAdvanceBalance, setUseAdvanceBalance] = useState(false);
  
  // New payment form state
  const [newPayment, setNewPayment] = useState<Partial<PaymentInputDto>>({
    method: "cash",
    currency: "CUP",
    amount: 0,
  });

  const handleAddPayment = () => {
    if (!newPayment.method || !newPayment.currency || !newPayment.amount || newPayment.amount <= 0) {
      alert("Por favor completa todos los campos del pago");
      return;
    }

    setPayments([
      ...payments,
      {
        method: newPayment.method,
        currency: newPayment.currency,
        amount: newPayment.amount,
        exchangeRate: newPayment.exchangeRate,
      } as PaymentInputDto,
    ]);

    // Reset form
    setNewPayment({
      method: "cash",
      currency: "CUP",
      amount: 0,
    });
  };

  const handleRemovePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = totalAmount - totalPaid;

  const handleSubmit = () => {
    if (payments.length === 0) {
      alert("Debes agregar al menos un método de pago");
      return;
    }

    if (totalPaid < totalAmount && !useAdvanceBalance) {
      const confirm = window.confirm(
        `El total pagado (${totalPaid.toFixed(2)}) es menor que el monto total (${totalAmount.toFixed(2)}). ¿Deseas continuar?`
      );
      if (!confirm) return;
    }

    onProcessPayment(billingRecordId, payments, useAdvanceBalance);
    onOpenChange(false);
    setPayments([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Procesar Pagos Mixtos</DialogTitle>
          <DialogDescription>
            Agrega múltiples métodos de pago en diferentes monedas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Total a Pagar</p>
              <p className="text-lg font-bold">${totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pagado</p>
              <p className={`text-lg font-bold ${totalPaid < totalAmount ? 'text-orange-500' : 'text-green-500'}`}>
                ${totalPaid.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Restante</p>
              <p className={`text-lg font-bold ${remaining > 0 ? 'text-red-500' : 'text-green-500'}`}>
                ${remaining.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Add Payment Form */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-semibold">Agregar Pago</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Método</Label>
                <Select
                  value={newPayment.method}
                  onValueChange={(value) => setNewPayment({ ...newPayment, method: value })}
                >
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label>Moneda</Label>
                <Select
                  value={newPayment.currency}
                  onValueChange={(value) => setNewPayment({ ...newPayment, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Monto</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newPayment.amount || 0}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label>Tasa (opcional)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newPayment.exchangeRate || ""}
                  onChange={(e) => setNewPayment({ ...newPayment, exchangeRate: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="Auto"
                />
              </div>
            </div>

            <Button onClick={handleAddPayment} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Pago
            </Button>
          </div>

          {/* Payments List */}
          {payments.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Pagos Agregados</h4>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Método</TableHead>
                      <TableHead>Moneda</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead className="text-right">Tasa</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell className="capitalize">{payment.method}</TableCell>
                        <TableCell>{payment.currency}</TableCell>
                        <TableCell className="text-right">{payment.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          {payment.exchangeRate ? payment.exchangeRate.toFixed(2) : "Auto"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemovePayment(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Use Advance Balance */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="useAdvanceBalance"
              checked={useAdvanceBalance}
              onChange={(e) => setUseAdvanceBalance(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="useAdvanceBalance" className="cursor-pointer">
              Usar balance de anticipos para cubrir diferencia
            </Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={payments.length === 0}
            >
              Procesar Pago
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

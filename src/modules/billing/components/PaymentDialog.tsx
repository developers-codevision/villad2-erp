import { Plus, X, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { BillingPaymentDto, PaymentMethod, BillDenominationDto, Currency } from "../types/types";
import { Badge } from "@/components/ui/badge";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payments: BillingPaymentDto[]) => void;
  totalAmount: number;
  advanceBalance?: number;
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

const BILL_DENOMINATIONS = {
  USD: [1, 2, 5, 10, 20, 50, 100],
  EUR: [5, 10, 20, 50, 100, 200, 500],
  CUP: [1, 3, 5, 10, 20, 50, 100, 200, 500, 1000],
};

export function PaymentDialog({ open, onOpenChange, onSave, totalAmount, advanceBalance = 0 }: PaymentDialogProps) {
  const [payments, setPayments] = useState<BillingPaymentDto[]>([]);
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod>("cash_usd");
  const [currentAmount, setCurrentAmount] = useState("");
  const [billDenominations, setBillDenominations] = useState<BillDenominationDto[]>([]);
  const [useAdvanceBalance, setUseAdvanceBalance] = useState(false);
  
  const currentMethodInfo = PAYMENT_METHODS.find((m) => m.value === currentMethod);
  const supportsBills = currentMethodInfo?.supportsBills || false;
  
  const getCurrencyFromMethod = (method: PaymentMethod): Currency => {
    if (method.includes("usd")) return "USD";
    if (method.includes("eur")) return "EUR";
    if (method.includes("cup")) return "CUP";
    return "USD";
  };

  const currentCurrency = getCurrencyFromMethod(currentMethod);

  const addBillDenomination = (value: number) => {
    const existing = billDenominations.find(
      (d) => d.currency === currentCurrency && d.value === value
    );
    
    if (existing) {
      setBillDenominations(
        billDenominations.map((d) =>
          d.currency === currentCurrency && d.value === value
            ? { ...d, quantity: d.quantity + 1 }
            : d
        )
      );
    } else {
      setBillDenominations([
        ...billDenominations,
        { currency: currentCurrency, value, quantity: 1 },
      ]);
    }
  };

  const updateDenominationQuantity = (currency: Currency, value: number, quantity: number) => {
    if (quantity <= 0) {
      setBillDenominations(
        billDenominations.filter((d) => !(d.currency === currency && d.value === value))
      );
    } else {
      setBillDenominations(
        billDenominations.map((d) =>
          d.currency === currency && d.value === value ? { ...d, quantity } : d
        )
      );
    }
  };

  const calculateBillsTotal = () => {
    return billDenominations
      .filter((d) => d.currency === currentCurrency)
      .reduce((sum, d) => sum + d.value * d.quantity, 0);
  };

  const addPayment = () => {
    let paymentAmount = 0;
    let denominations: BillDenominationDto[] = [];

    if (supportsBills && billDenominations.length > 0) {
      paymentAmount = calculateBillsTotal();
      denominations = billDenominations.filter((d) => d.currency === currentCurrency);
    } else {
      paymentAmount = parseFloat(currentAmount);
      if (!paymentAmount || paymentAmount <= 0) return;
    }

    const newPayment: BillingPaymentDto = {
      paymentMethod: currentMethod,
      amount: paymentAmount,
      ...(denominations.length > 0 && { billDenominations: denominations }),
    };

    setPayments([...payments, newPayment]);
    setCurrentAmount("");
    setBillDenominations([]);
  };

  const removePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const effectiveBalance = useAdvanceBalance ? advanceBalance : 0;
  const totalWithAdvance = totalPaid + effectiveBalance;
  const remaining = totalAmount - totalWithAdvance;
  const change = totalWithAdvance > totalAmount ? totalWithAdvance - totalAmount : 0;
  const newAdvanceBalance = change;

  const handleSave = () => {
    onSave(payments);
    setPayments([]);
    setCurrentAmount("");
    setBillDenominations([]);
    setUseAdvanceBalance(false);
  };

  const handleCancel = () => {
    setPayments([]);
    setCurrentAmount("");
    setBillDenominations([]);
    setUseAdvanceBalance(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Procesar Pago</DialogTitle>
          <DialogDescription>
            Total a pagar: <span className="font-bold text-lg text-foreground">${totalAmount.toFixed(2)} USD</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Pago
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Método de Pago</Label>
              <Select value={currentMethod} onValueChange={(v) => {
                setCurrentMethod(v as PaymentMethod);
                setBillDenominations([]);
              }}>
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

            {supportsBills ? (
              <div className="space-y-3">
                <Label>Denominaciones de Billetes ({currentCurrency})</Label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {BILL_DENOMINATIONS[currentCurrency].map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addBillDenomination(value)}
                      className="flex flex-col h-auto py-2"
                    >
                      <Banknote className="h-4 w-4 mb-1" />
                      <span className="text-xs font-bold">{value}</span>
                    </Button>
                  ))}
                </div>

                {billDenominations.filter((d) => d.currency === currentCurrency).length > 0 && (
                  <div className="space-y-2 mt-3">
                    <Label className="text-xs">Billetes Agregados</Label>
                    <div className="space-y-1">
                      {billDenominations
                        .filter((d) => d.currency === currentCurrency)
                        .map((denom, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-card p-2 rounded border">
                            <Badge variant="outline" className="w-16">
                              {denom.value} {denom.currency}
                            </Badge>
                            <span className="text-sm">×</span>
                            <Input
                              type="number"
                              value={denom.quantity}
                              onChange={(e) =>
                                updateDenominationQuantity(
                                  denom.currency,
                                  denom.value,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16 h-7 text-center"
                              min={0}
                            />
                            <span className="text-sm font-mono ml-auto">
                              = {denom.value * denom.quantity} {denom.currency}
                            </span>
                          </div>
                        ))}
                    </div>
                    <div className="bg-primary/10 p-2 rounded font-semibold text-right">
                      Total: {calculateBillsTotal()} {currentCurrency}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="amount">Monto (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            )}

            <Button onClick={addPayment} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Pago
            </Button>
          </div>

          {payments.length > 0 && (
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
                      onClick={() => removePayment(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-primary/10 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total a pagar:</span>
              <span className="font-semibold">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total pagado:</span>
              <span className="font-semibold">${totalPaid.toFixed(2)}</span>
            </div>
            {advanceBalance > 0 && (
              <div className="flex justify-between items-center text-sm border-t pt-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="useAdvance"
                    checked={useAdvanceBalance}
                    onCheckedChange={(checked) => setUseAdvanceBalance(checked === true)}
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

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={payments.length === 0}
          >
            {remaining > 0 ? "Registrar Pago Parcial" : remaining === 0 ? "Confirmar Pago" : "Confirmar y Dar Vuelto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

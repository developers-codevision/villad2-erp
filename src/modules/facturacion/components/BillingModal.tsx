import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/hooks/use-toast";
import type { BillDenominationDto, CreateBillingRecordDTO, PaymentMethod } from "../types/types";

interface BillingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billingId: number;
  selectedItems: Array<{
    conceptId: number;
    conceptName: string;
    quantity: number;
    price: number;
    productId?: number; // ID del producto de inventario
    productQuantity?: number; // Cantidad del producto
  }>;
  onCreateRecord: (data: CreateBillingRecordDTO) => void;
}

const PAYMENT_METHODS: Array<{ value: PaymentMethod; label: string; currency?: string }> = [
  { value: "cash_usd", label: "Efectivo USD", currency: "USD" },
  { value: "cash_eur", label: "Efectivo EUR", currency: "EUR" },
  { value: "cash_cup", label: "Efectivo CUP", currency: "CUP" },
  { value: "transfer_mobile", label: "Transferencia móvil" },
  { value: "bizum", label: "Bizum" },
  { value: "zelle", label: "Zelle" },
  { value: "transfer_abroad", label: "Transferencia internacional" },
  { value: "stripe", label: "Stripe" },
  { value: "paypal", label: "PayPal" },
];

const getBillDenominations = (paymentMethod: PaymentMethod) => {
  if (paymentMethod === 'cash_eur') {
    return [5, 10, 20, 50, 100, 200, 500];
  }
  if (paymentMethod === 'cash_cup') {
    return [1, 3, 5, 10, 20, 50, 100, 200, 500, 1000];
  }
  // USD and others
  return [1, 5, 10, 20, 50, 100];
};

const getCurrency = (paymentMethod: PaymentMethod): 'USD' | 'EUR' | 'CUP' => {
  if (paymentMethod === 'cash_eur') return 'EUR';
  if (paymentMethod === 'cash_cup') return 'CUP';
  return 'USD';
};

export function BillingModal({ 
  open, 
  onOpenChange, 
  billingId,
  selectedItems,
  onCreateRecord 
}: BillingModalProps) {
  const { toast } = useToast();
  const [tip, setTip] = useState(0);
  const [consumeImmediately, setConsumeImmediately] = useState(false);
  const [lateBilling, setLateBilling] = useState(false);
  const [payments, setPayments] = useState<Array<{
    paymentMethod: PaymentMethod;
    amount: number;
    billDenominations: BillDenominationDto[];
  }>>([]);
  const [newPayment, setNewPayment] = useState<{
    paymentMethod: PaymentMethod;
    amount: number;
  }>({
    paymentMethod: "cash_usd",
    amount: 0,
  });
  const [newBillCounts, setNewBillCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!open) {
      setTip(0);
      setConsumeImmediately(false);
      setLateBilling(false);
      setPayments([]);
      setNewPayment({
        paymentMethod: "cash_usd",
        amount: 0,
      });
      setNewBillCounts({});
    }
  }, [open]);

  useEffect(() => {
    // Reset bill counts when payment method changes
    setNewBillCounts({});
  }, [newPayment.paymentMethod]);

  const billDenominations = getBillDenominations(newPayment.paymentMethod);
  const currency = getCurrency(newPayment.paymentMethod);
  const isCashPayment = newPayment.paymentMethod.startsWith('cash_');

  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  const change = totalPaid - totalAmount - tip;

  const handleNewBillCountChange = (denomination: number, count: number) => {
    setNewBillCounts(prev => ({
      ...prev,
      [denomination]: Math.max(0, count),
    }));
  };

  const handleAddPayment = () => {
    if (!newPayment.paymentMethod || newPayment.amount <= 0) {
      alert("Por favor completa todos los campos del pago (método y monto)");
      return;
    }

    const billDenoms: BillDenominationDto[] = billDenominations
      .filter(denom => newBillCounts[denom] > 0)
      .map(denom => ({
        value: denom,
        quantity: newBillCounts[denom],
        currency: currency,
      }));

    // Only require bill denominations for cash payments
    if (isCashPayment && billDenoms.length === 0) {
      alert("Debes especificar las denominaciones para pagos en efectivo");
      return;
    }

    const newPaymentObj = {
      paymentMethod: newPayment.paymentMethod,
      amount: newPayment.amount,
      billDenominations: billDenoms,
    };

    console.log("Adding payment:", newPaymentObj);
    
    setPayments([...payments, newPaymentObj]);

    // Reset form
    setNewPayment({
      paymentMethod: "cash_usd",
      amount: 0,
    });
    setNewBillCounts({});
    
    // Show success message
    toast({
      title: "Pago agregado",
      description: `Se agregó el pago de $${newPayment.amount} ${currency}`,
    });
  };

  const handleRemovePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (payments.length === 0) {
      alert("Debes agregar al menos un método de pago");
      return;
    }

    if (!lateBilling && totalPaid < totalAmount + tip) {
      alert("El monto pagado no es suficiente");
      return;
    }

    // Map items to the new simplified format (productId + productQuantity)
    const items = selectedItems.map(item => ({
      productId: item.productId || 0,
      productQuantity: item.productQuantity || item.quantity || 1,
    }));

    // Format payments according to new schema
    const formattedPayments = payments.map(p => {
      const payment: any = {
        paymentMethod: p.paymentMethod,
      };
      
      // Add amount if specified (optional if billDenominations are provided for cash)
      if (p.amount > 0) {
        payment.amount = p.amount;
      }
      
      // Add bill denominations for cash payments
      if (p.billDenominations && p.billDenominations.length > 0) {
        payment.billDenominations = p.billDenominations;
      }
      
      return payment;
    });

    const payload: CreateBillingRecordDTO = {
      billingId,
      items,
      tip,
      payments: formattedPayments,
      consumeImmediately,
      lateBilling,
    };

    console.log("=== BILLING MODAL PAYLOAD ===");
    console.log("Items:", items);
    console.log("Payments:", formattedPayments);
    console.log("Full payload:", JSON.stringify(payload, null, 2));
    console.log("============================");

    onCreateRecord(payload);
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Factura</DialogTitle>
          <DialogDescription>
            Agregue los métodos de pago y complete la información de la factura.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Summary Cards - Top Section */}
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
          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Items & Details */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-primary">📋</span> Conceptos a Facturar
                </h4>
                <div className="rounded-lg border bg-muted/30">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Concepto</TableHead>
                        <TableHead className="text-right">Cant.</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedItems.map((item) => (
                        <TableRow key={item.conceptId}>
                          <TableCell className="font-medium">{item.conceptName}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">${Number(item.price).toFixed(2)}</TableCell>
                          <TableCell className="text-right font-semibold">
                            ${Number(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted">
                        <TableCell colSpan={3} className="text-right font-semibold">Subtotal:</TableCell>
                        <TableCell className="text-right font-bold">${Number(totalAmount).toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="tip" className="text-xs">Propina (USD)</Label>
                  <Input
                    id="tip"
                    type="number"
                    step="0.01"
                    min="0"
                    value={tip}
                    onChange={(e) => setTip(Number(e.target.value))}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>

                {/* Options */}
                <div className="p-3 rounded-lg border bg-muted/30 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      id="consumeImmediately"
                      type="checkbox"
                      checked={consumeImmediately}
                      onChange={(e) => setConsumeImmediately(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <Label htmlFor="consumeImmediately" className="text-sm cursor-pointer">
                      ⚡ Consumir inventario inmediatamente
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="lateBilling"
                      type="checkbox"
                      checked={lateBilling}
                      onChange={(e) => setLateBilling(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <Label htmlFor="lateBilling" className="text-sm cursor-pointer">
                      🕐 Facturación tardía
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payments */}
            <div className="space-y-4">
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

              {/* Added Payments List */}
              {payments.length > 0 && (
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
                              {PAYMENT_METHODS.find(m => m.value === payment.method)?.label || payment.method}
                            </span>
                            <Badge variant="secondary">{payment.currency}</Badge>
                          </div>
                          <div className="text-lg font-bold text-green-700">
                            ${payment.amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Tasa: {payment.exchangeRate} | En USD: ${(payment.amount * payment.exchangeRate).toFixed(2)}
                          </div>
                          {payment.billDenominations.length > 0 && (
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
              )}
            </div>
          </div>

          {/* Footer - Action Buttons */}
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
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
        </form>
      </DialogContent>
    </Dialog>
  );
}

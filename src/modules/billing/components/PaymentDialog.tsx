import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import type { BillingPaymentDto, PaymentMethod, Currency } from "../types/types";
import { usePaymentCalculations } from "../hooks/usePaymentCalculations";
import { useBillDenominations } from "../hooks/useBillDenominations";
import { PaymentMethodSelector, PAYMENT_METHODS } from "./ui/PaymentMethodSelector";
import { BillDenominationPicker } from "./ui/BillDenominationPicker";
import { BillDenominationList } from "./ui/BillDenominationList";
import { AmountInput } from "./ui/AmountInput";
import { PaymentList } from "./ui/PaymentList";
import { PaymentSummary } from "./ui/PaymentSummary";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payments: BillingPaymentDto[]) => void;
  totalAmount: number;
  advanceBalance?: number;
}

/**
 * Dialog refactorizado usando hooks personalizados y componentes UI puros
 * Responsabilidades: orquestación de datos y renderizado
 */
export function PaymentDialog({
  open,
  onOpenChange,
  onSave,
  totalAmount,
  advanceBalance = 0,
}: PaymentDialogProps) {
  const [payments, setPayments] = useState<BillingPaymentDto[]>([]);
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod>("cash_usd");
  const [currentAmount, setCurrentAmount] = useState("");
  const [useAdvanceBalance, setUseAdvanceBalance] = useState(false);

  // Helpers
  const getCurrencyFromMethod = (method: PaymentMethod): Currency => {
    if (method.includes("usd")) return "USD";
    if (method.includes("eur")) return "EUR";
    if (method.includes("cup")) return "CUP";
    return "USD";
  };

  const currentCurrency = getCurrencyFromMethod(currentMethod);
  const currentMethodInfo = PAYMENT_METHODS.find((m) => m.value === currentMethod);
  const supportsBills = currentMethodInfo?.supportsBills || false;

  // Hooks personalizados
  const denominationHook = useBillDenominations(currentCurrency);
  const calculationsHook = usePaymentCalculations(totalAmount, payments, advanceBalance, useAdvanceBalance);

  const addPayment = () => {
    const denominations = denominationHook.getBillsByCurrentCurrency();
    let paymentAmount: number;

    if (supportsBills && denominations.length > 0) {
      paymentAmount = denominationHook.calculateBillsTotal();
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
    denominationHook.clearBillDenominations();
  };

  const removePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(payments);
    setPayments([]);
    setCurrentAmount("");
    denominationHook.clearBillDenominations();
    setUseAdvanceBalance(false);
  };

  const handleCancel = () => {
    setPayments([]);
    setCurrentAmount("");
    denominationHook.clearBillDenominations();
    setUseAdvanceBalance(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Procesar Pago</DialogTitle>
          <DialogDescription>
            Total a pagar:{" "}
            <span className="font-bold text-lg text-foreground">${totalAmount.toFixed(2)} USD</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Method & Amount Input */}
          <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Pago
            </h3>

            <PaymentMethodSelector value={currentMethod} onChange={(method) => {
              setCurrentMethod(method);
              denominationHook.clearBillDenominations();
            }} />

            {/* Denominaciones o Input de Monto */}
            {supportsBills ? (
              <div className="space-y-3">
                <BillDenominationPicker
                  denominations={denominationHook.availableDenominations}
                  onSelectDenomination={denominationHook.addBillDenomination}
                />
                <BillDenominationList
                  denominations={denominationHook.getBillsByCurrentCurrency()}
                  onUpdateQuantity={denominationHook.updateDenominationQuantity}
                />
                {denominationHook.getBillsByCurrentCurrency().length > 0 && (
                  <div className="bg-primary/10 p-2 rounded font-semibold text-right">
                    Total: {denominationHook.calculateBillsTotal()} {currentCurrency}
                  </div>
                )}
              </div>
            ) : (
              <AmountInput value={currentAmount} onChange={setCurrentAmount} />
            )}

            <Button onClick={addPayment} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Pago
            </Button>
          </div>

          {/* Payments List */}
          <PaymentList payments={payments} onRemovePayment={removePayment} />

          {/* Payment Summary */}
          <PaymentSummary
            totalAmount={totalAmount}
            totalPaid={calculationsHook.totalPaid}
            remaining={calculationsHook.remaining}
            change={calculationsHook.change}
            advanceBalance={advanceBalance}
            useAdvanceBalance={useAdvanceBalance}
            onToggleAdvanceBalance={setUseAdvanceBalance}
            newAdvanceBalance={calculationsHook.newAdvanceBalance}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={payments.length === 0}
          >
            {calculationsHook.remaining > 0
              ? "Registrar Pago Parcial"
              : calculationsHook.remaining === 0
                ? "Confirmar Pago"
                : "Confirmar y Dar Vuelto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { BillingPaymentDto, PaymentMethod, Currency } from "../types/types";
import { useChangeCalculation } from "../hooks/useChangeCalculation";
import { useCoordinatedBillingValues } from "../hooks/useCoordinatedBillingValues";
import { useBillDenominations } from "../hooks/useBillDenominations";
import { PaymentMethodSelector, PAYMENT_METHODS } from "./ui/PaymentMethodSelector";
import { BillDenominationPicker } from "./ui/BillDenominationPicker";
import { BillDenominationList } from "./ui/BillDenominationList";
import { AmountInput } from "./ui/AmountInput";
import { PaymentList } from "./ui/PaymentList";
import { PaymentSummary } from "./ui/PaymentSummary";
import { BillingValuesForm } from "./ui/BillingValuesForm";

export interface BillingRecordPayloadDto {
  payments: BillingPaymentDto[];
  houseAccount: boolean;
  tip: number;
  consumeImmediately: boolean;
  lateBilling: boolean;
  chargeRate: number;
  changeRate: number;
  advanceBalance?: number;
  change?: number;
}

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: BillingRecordPayloadDto) => void;
  totalAmount: number;
  advanceBalance?: number;
  usdToCupRate?: number;
}

/**
 * Dialog para procesar pagos completo
 * Estructura:
 * 1. HouseAccount (prioridad)
 * 2. Métodos y pagos
 * 3. Opciones de facturación y distribución de cambio (al final)
 */
export function PaymentDialog({
  open,
  onOpenChange,
  onSave,
  totalAmount,
  advanceBalance = 0,
  usdToCupRate = 1,
}: PaymentDialogProps) {
  // Main options
  const [houseAccount, setHouseAccount] = useState(false);
  const [consumeImmediately, setConsumeImmediately] = useState(true);
  const [lateBilling, setLateBilling] = useState(false);

  // Exchange rates
  const [chargeRate, setChargeRate] = useState(usdToCupRate.toString());
  const [changeRate, setChangeRate] = useState("400");

  // Payment form
  const [payments, setPayments] = useState<BillingPaymentDto[]>([]);
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod>("cash_usd");
  const [currentAmount, setCurrentAmount] = useState("");
  const [useAdvanceBalance, setUseAdvanceBalance] = useState(false);

  // ...existing code...
  const getCurrencyFromMethod = (method: PaymentMethod): Currency => {
    if (method.includes("usd")) return "USD";
    if (method.includes("eur")) return "EUR";
    if (method.includes("cup")) return "CUP";
    return "USD";
  };

  const currentCurrency = getCurrencyFromMethod(currentMethod);
  const currentMethodInfo = PAYMENT_METHODS.find((m) => m.value === currentMethod);
  const supportsBills = currentMethodInfo?.supportsBills || false;

  const denominationHook = useBillDenominations(currentCurrency);
  const chargeRateNum = parseFloat(chargeRate) || usdToCupRate;
  const changeRateNum = parseFloat(changeRate) || 400;

  const calculationsHook = useChangeCalculation(
    totalAmount,
    payments,
    chargeRateNum,
    changeRateNum,
    advanceBalance,
    useAdvanceBalance
  );

  // IMPORTANTE: Este hook siempre se llama, pero solo se usa cuando hay cambio
  // Los hooks deben llamarse SIEMPRE en el mismo orden - no pueden estar dentro de condicionales
  const billingValues = useCoordinatedBillingValues(
    !houseAccount && calculationsHook.changeInCup > 0 ? calculationsHook.changeInCup : 0
  );

  const handleHouseAccountToggle = (checked: boolean) => {
    setHouseAccount(checked);
    if (checked) {
      setPayments([]);
      setCurrentAmount("");
      denominationHook.clearBillDenominations();
      setUseAdvanceBalance(false);
    }
  };

  const addPayment = () => {
    if (houseAccount) return;

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

  const isFullPayment = houseAccount || calculationsHook.isFullPayment;

  const handleSave = () => {
    if (!isFullPayment) return;

    onSave({
      payments: houseAccount ? [] : payments,
      houseAccount,
      tip: billingValues.tip,
      consumeImmediately,
      lateBilling,
      chargeRate: chargeRateNum,
      changeRate: changeRateNum,
      advanceBalance: billingValues.advanceBalance,
      change: billingValues.changeRemaining,
    });

    resetForm();
  };

  const resetForm = () => {
    setHouseAccount(false);
    setConsumeImmediately(true);
    setLateBilling(false);
    setChargeRate(usdToCupRate.toString());
    setChangeRate("400");
    setPayments([]);
    setCurrentAmount("");
    denominationHook.clearBillDenominations();
    setUseAdvanceBalance(false);
  };

  const handleCancel = () => {
    resetForm();
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
          {/* SECTION 1: HouseAccount - Priority */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="houseAccount"
                checked={houseAccount}
                onCheckedChange={(checked) => handleHouseAccountToggle(checked === true)}
              />
              <Label htmlFor="houseAccount" className="cursor-pointer font-semibold text-base flex-1">
                Cuenta de Casa (sin cargo)
              </Label>
              {houseAccount && (
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                  $0.00 USD
                </span>
              )}
            </div>
          </div>

          {/* SECTION 2: Payment Methods and Processing */}
          {!houseAccount && (
            <>
              {/* Payment Method & Amount Input */}
              <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Pago
                </h3>

                <PaymentMethodSelector
                  value={currentMethod}
                  onChange={(method) => {
                    setCurrentMethod(method);
                    denominationHook.clearBillDenominations();
                  }}
                />

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
              {payments.length > 0 && (
                <PaymentList payments={payments} onRemovePayment={removePayment} />
              )}

              {/* Payment Summary */}
              <PaymentSummary
                totalAmount={totalAmount}
                usdToCupRate={chargeRateNum}
                totalPaid={calculationsHook.paidInUsd}
                remaining={Math.max(0, totalAmount - calculationsHook.paidInUsd - (useAdvanceBalance ? advanceBalance : 0))}
                change={calculationsHook.changeInCup}
                advanceBalance={advanceBalance}
                useAdvanceBalance={useAdvanceBalance}
                onToggleAdvanceBalance={setUseAdvanceBalance}
                newAdvanceBalance={calculationsHook.changeInCup}
                changeRate={changeRateNum}
              />
            </>
          )}

          {/* SECTION 3: Billing Options (Bottom - Consumir, Diferida, Tasas) */}
          {!houseAccount && (
            <div className="bg-secondary/30 rounded-lg p-4 space-y-3 border-t-2">
              <h3 className="font-semibold text-sm">Opciones de Facturación</h3>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="consumeImmediately"
                    checked={consumeImmediately}
                    onCheckedChange={(checked) => setConsumeImmediately(checked === true)}
                  />
                  <Label htmlFor="consumeImmediately" className="cursor-pointer font-normal">
                    Consumir inventario inmediatamente
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="lateBilling"
                    checked={lateBilling}
                    onCheckedChange={(checked) => setLateBilling(checked === true)}
                  />
                  <Label htmlFor="lateBilling" className="cursor-pointer font-normal">
                    Facturación diferida (crear deuda)
                  </Label>
                </div>
              </div>

              {/* Exchange Rates */}
              <div className="border-t pt-3 grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="chargeRate" className="text-sm font-medium">
                    Tasa de Cobro (USD a CUP)
                  </Label>
                  <Input
                    id="chargeRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={chargeRate}
                    onChange={(e) => setChargeRate(e.target.value)}
                    disabled={false}
                  />
                  <p className="text-xs text-muted-foreground">
                    Default: {usdToCupRate.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="changeRate" className="text-sm font-medium">
                    Tasa de Vuelto (CUP por USD)
                  </Label>
                  <Input
                    id="changeRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={changeRate}
                    onChange={(e) => setChangeRate(e.target.value)}
                    disabled={false}
                  />
                  <p className="text-xs text-muted-foreground">
                    Default: 400 CUP/USD
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: Coordinated Billing Values (Propina, Fondo, Devolución) */}
          {!houseAccount && calculationsHook.changeInCup > 0 && (
            <BillingValuesForm
              totalChangeInCup={calculationsHook.changeInCup}
              tip={billingValues.tip}
              onTipChange={billingValues.setTip}
              advanceBalance={billingValues.advanceBalance}
              onAdvanceBalanceChange={billingValues.setAdvanceBalance}
              changeRemaining={billingValues.changeRemaining}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isFullPayment}>
            {houseAccount
              ? "Registrar Cuenta de Casa"
              : isFullPayment
                ? "Confirmar Pago"
                : "Pago Incompleto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

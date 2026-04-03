import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { BillDenominationDto, CreateBillingRecordDTO, PaymentMethod, BillingPaymentDto } from "../types/types";
import { getBillDenominations, getCurrency, isCashPayment } from "../utils/paymentUtils";

interface BillingItem {
  conceptId: number;
  conceptName: string;
  quantity: number;
  price: number;
  productId?: number;
  productQuantity?: number;
}

interface PaymentData {
  paymentMethod: PaymentMethod;
  amount: number;
  billDenominations: BillDenominationDto[];
}

interface UseBillingPaymentProps {
  selectedItems: BillingItem[];
  billingId: number;
  onCreateRecord: (data: CreateBillingRecordDTO) => void;
}

export const useBillingPayment = ({ selectedItems, billingId, onCreateRecord }: UseBillingPaymentProps) => {
  const { toast } = useToast();

  const [tip, setTip] = useState(0);
  const [consumeImmediately, setConsumeImmediately] = useState(false);
  const [lateBilling, setLateBilling] = useState(false);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [newPayment, setNewPayment] = useState<{
    paymentMethod: PaymentMethod;
    amount: number;
  }>({
    paymentMethod: "cash_usd",
    amount: 0,
  });
  const [newBillCounts, setNewBillCounts] = useState<Record<number, number>>({});

  // Reset state when modal opens/closes
  const resetState = () => {
    setTip(0);
    setConsumeImmediately(false);
    setLateBilling(false);
    setPayments([]);
    setNewPayment({
      paymentMethod: "cash_usd",
      amount: 0,
    });
    setNewBillCounts({});
  };

  // Reset bill counts when payment method changes
  useEffect(() => {
    setNewBillCounts({});
  }, [newPayment.paymentMethod]);

  // Calculations
  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const change = totalPaid - totalAmount - tip;

  // Payment method helpers
  const billDenominations = getBillDenominations(newPayment.paymentMethod);
  const currency = getCurrency(newPayment.paymentMethod);
  const currentIsCashPayment = isCashPayment(newPayment.paymentMethod);

  // Handlers
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
    if (currentIsCashPayment && billDenoms.length === 0) {
      alert("Debes especificar las denominaciones para pagos en efectivo");
      return;
    }

    const newPaymentObj: PaymentData = {
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
      const payment: BillingPaymentDto = {
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

    console.log("=== BILLING PAYMENT PAYLOAD ===");
    console.log("Items:", items);
    console.log("Payments:", formattedPayments);
    console.log("Full payload:", JSON.stringify(payload, null, 2));
    console.log("============================");

    onCreateRecord(payload);
  };

  // Validation
  const canSubmit = payments.length > 0 && (lateBilling || totalPaid >= totalAmount + tip);

  return {
    // State
    tip,
    setTip,
    consumeImmediately,
    setConsumeImmediately,
    lateBilling,
    setLateBilling,
    payments,
    newPayment,
    setNewPayment,
    newBillCounts,

    // Computed values
    totalAmount,
    totalPaid,
    change,
    billDenominations,
    currency,
    isCashPayment: currentIsCashPayment,
    canSubmit,

    // Handlers
    handleNewBillCountChange,
    handleAddPayment,
    handleRemovePayment,
    handleSubmit,
    resetState,
  };
};

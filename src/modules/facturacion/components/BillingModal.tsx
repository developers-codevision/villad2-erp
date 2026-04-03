import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CreateBillingRecordDTO } from "../types/types";
import { useBillingPayment } from "../hooks/useBillingPayment";
import { PaymentSummaryCards } from "./PaymentSummaryCards";
import { BillingItemsTable } from "./BillingItemsTable";
import { BillingDetails } from "./BillingDetails";
import { PaymentForm } from "./PaymentForm";
import { AddedPaymentsList } from "./AddedPaymentsList";
import { BillingModalFooter } from "./BillingModalFooter";

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
    billingItemId?: number;
  }>;
  concepts: Array<{
    id: string;
    name: string;
    priceUsd: number;
    category: string;
    products?: Array<{ productId: number; quantity: number }>;
  }>;
  onCreateRecord: (data: CreateBillingRecordDTO) => void;
}

export function BillingModal({
  open,
  onOpenChange,
  billingId,
  selectedItems,
  concepts,
  onCreateRecord
}: BillingModalProps) {
  const {
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
    totalAmount,
    totalPaid,
    change,
    billDenominations,
    isCashPayment,
    handleNewBillCountChange,
    handleAddPayment,
    handleRemovePayment,
    handleSubmit,
    resetState,
  } = useBillingPayment({ selectedItems, billingId, onCreateRecord, concepts });

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open, resetState]);

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
          <PaymentSummaryCards
            totalAmount={totalAmount}
            tip={tip}
            totalPaid={totalPaid}
            change={change}
          />

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Items & Details */}
            <div className="space-y-4">
              {/* Items Table */}
              <BillingItemsTable selectedItems={selectedItems} totalAmount={totalAmount} />

              {/* Details */}
              <BillingDetails
                tip={tip}
                setTip={setTip}
                consumeImmediately={consumeImmediately}
                setConsumeImmediately={setConsumeImmediately}
                lateBilling={lateBilling}
                setLateBilling={setLateBilling}
              />
            </div>

            {/* Right Column - Payments */}
            <div className="space-y-4">
              <PaymentForm
                newPayment={newPayment}
                setNewPayment={setNewPayment}
                newBillCounts={newBillCounts}
                billDenominations={billDenominations}
                isCashPayment={isCashPayment}
                handleNewBillCountChange={handleNewBillCountChange}
                handleAddPayment={handleAddPayment}
              />

              <AddedPaymentsList
                payments={payments}
                handleRemovePayment={handleRemovePayment}
              />
            </div>
          </div>

          {/* Footer - Action Buttons */}
          <BillingModalFooter
            payments={payments}
            change={change}
            totalPaid={totalPaid}
            totalAmount={totalAmount}
            tip={tip}
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

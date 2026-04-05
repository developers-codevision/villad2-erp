import { useState, useEffect } from "react";
import { ShoppingCart, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BillingSheetItemDto, BillingPaymentDto } from "../types/types";
import { PaymentDialog } from "./PaymentDialog.tsx";
import { useBillingItem } from "../hooks/useBilling";
import { useBillingInvoice } from "../hooks/useBillingInvoice";
import { AvailableItemsTable } from "./ui/AvailableItemsTable";
import { InvoiceItemsTable } from "./ui/InvoiceItemsTable";
import { InvoiceOptions } from "./ui/InvoiceOptions";
import { InvoiceSummary } from "./ui/InvoiceSummaryCard";

interface BillingItemCardProps {
  items: BillingSheetItemDto[];
  onCreateRecord: (
    itemId: number,
    quantity: number,
    unitPrice: number,
    tip: number,
    tax10: number,
    payments: BillingPaymentDto[],
    consumeImmediately: boolean,
    lateBilling: boolean
  ) => void;
}

/**
 * Componente refactorizado que gestiona la facturación de items
 * Usa hook useBillingInvoice para toda la lógica de estado
 */
export function BillingItemCard({ items, onCreateRecord }: BillingItemCardProps) {
  const [consumeImmediately, setConsumeImmediately] = useState(true);
  const [lateBilling, setLateBilling] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [itemsWithConcept, setItemsWithConcept] = useState<Record<number, BillingSheetItemDto>>({});

  // Hook con toda la lógica de gestión de la factura
  const invoice = useBillingInvoice();

  // Load items que necesitan concepto
  const itemsMissingConcept = items.filter(item => !item.concept && !item.conceptName).map(item => item.id);
  const itemToLoad = itemsMissingConcept[0];
  const { data: loadedItem } = useBillingItem(itemToLoad ? itemToLoad : null);

  // Update itemsWithConcept cuando se carga un item
  useEffect(() => {
    if (loadedItem) {
      setItemsWithConcept(prev => ({
        ...prev,
        [loadedItem.id]: loadedItem
      }));
    }
  }, [loadedItem]);

  // Combinar items con datos cargados
  const enrichedItems = items.map(item => itemsWithConcept[item.id] || item);

  // Helper para obtener nombre del concepto
  const getConceptName = (item: BillingSheetItemDto): string => {
    if (item.concept?.name) return item.concept.name;
    if (item.conceptName) return item.conceptName;
    return `Concepto ${item.conceptId}`;
  };

  // Preparar items para la tabla disponible
  const availableItems = enrichedItems.map(item => ({
    id: item.id,
    conceptName: getConceptName(item),
    price: Number(item.priceUsd) || 0,
  }));

  const handleAddItem = (itemId: number) => {
    const item = enrichedItems.find(i => i.id === itemId);
    if (item) {
      invoice.addItemToBilling(item, getConceptName(item));
    }
  };

  const handleProcessPayment = (payments: BillingPaymentDto[]) => {
    if (invoice.billingRows.length === 0) return;

    const firstRow = invoice.billingRows[0];
    onCreateRecord(
      firstRow.itemId,
      firstRow.quantity,
      firstRow.unitPrice,
      invoice.totals.tip,
      invoice.totals.tax10,
      payments,
      consumeImmediately,
      lateBilling
    );

    invoice.clearInvoice();
    setPaymentDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Conceptos de Facturación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Available Items Table */}
          <div>
            <Label className="text-sm font-semibold mb-2 block">Conceptos Disponibles</Label>
            <AvailableItemsTable
              items={availableItems}
              itemInputs={invoice.itemInputs}
              onUpdateInput={invoice.updateItemInput}
              onAddItem={handleAddItem}
            />
          </div>

          {/* Invoice in Process */}
          {invoice.hasItems && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Factura en Proceso</Label>
              <InvoiceItemsTable
                rows={invoice.billingRows}
                onUpdateQuantity={invoice.updateRowQuantity}
                onUpdatePrice={invoice.updateRowPrice}
                onRemoveRow={invoice.removeRow}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InvoiceOptions
                  tipAmount={invoice.tipAmount}
                  onTipChange={invoice.setTipAmount}
                  consumeImmediately={consumeImmediately}
                  onConsumeImmediatelyChange={setConsumeImmediately}
                  lateBilling={lateBilling}
                  onLateBillingChange={setLateBilling}
                />

                <InvoiceSummary
                  subtotal={invoice.totals.subtotal}
                  tip={invoice.totals.tip}
                  tax10={invoice.totals.tax10}
                  total={invoice.totals.total}
                />
              </div>

              <Button
                onClick={() => setPaymentDialogOpen(true)}
                className="w-full"
                size="lg"
                disabled={invoice.billingRows.length === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Procesar Pago
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onSave={handleProcessPayment}
        totalAmount={invoice.totals.total}
      />
    </>
  );
}

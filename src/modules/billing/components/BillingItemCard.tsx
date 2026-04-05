import { useState, useEffect } from "react";
import { ShoppingCart, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { BillingSheetItemDto, BillingPaymentDto } from "../types/types";
import { PaymentDialog } from "./PaymentDialog.tsx";
import { useBillingItem } from "../hooks/useBilling";

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

interface BillingRow {
  itemId: number;
  conceptName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface ItemInput {
  quantity: number;
  price: number;
}

export function BillingItemCard({ items, onCreateRecord }: BillingItemCardProps) {
  const [billingRows, setBillingRows] = useState<BillingRow[]>([]);
  const [tipAmount, setTipAmount] = useState(0);
  const [consumeImmediately, setConsumeImmediately] = useState(true);
  const [lateBilling, setLateBilling] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  
  // Track inputs for each item
  const [itemInputs, setItemInputs] = useState<Record<number, ItemInput>>({});

  // State to store items with full concept information
  const [itemsWithConcept, setItemsWithConcept] = useState<Record<number, BillingSheetItemDto>>({});

  // Load items that need concept data
  const itemsMissingConcept = items.filter(item => !item.concept && !item.conceptName).map(item => item.id);

  // Use the billing item hook to load missing concept data (only for the first missing item per render to avoid too many requests)
  const itemToLoad = itemsMissingConcept[0];
  const { data: loadedItem } = useBillingItem(itemToLoad ? itemToLoad : null);

  // Update itemsWithConcept when loaded item comes back
  useEffect(() => {
    if (loadedItem) {
      setItemsWithConcept(prev => ({
        ...prev,
        [loadedItem.id]: loadedItem
      }));
    }
  }, [loadedItem]);

  // Combine items with loaded data
  const enrichedItems = items.map(item => itemsWithConcept[item.id] || item);

  const getItemInput = (itemId: number, defaultPrice: number): ItemInput => {
    return itemInputs[itemId] || { quantity: 1, price: defaultPrice };
  };

  const updateItemInput = (itemId: number, field: keyof ItemInput, value: number) => {
    setItemInputs(prev => ({
      ...prev,
      [itemId]: {
        ...getItemInput(itemId, 0),
        [field]: value
      }
    }));
  };

  const getConceptName = (item: BillingSheetItemDto): string => {
    // Priorizar el nombre del concepto desde el objeto concept
    if (item.concept?.name) {
      return item.concept.name;
    }
    // Fallback a conceptName si existe
    if (item.conceptName) {
      return item.conceptName;
    }
    // Fallback final
    return `Concepto ${item.conceptId}`;
  };

  const addItemToBilling = (item: BillingSheetItemDto) => {
    const input = getItemInput(item.id, Number(item.priceUsd) || 0);
    const conceptName = getConceptName(item);
    const existingRow = billingRows.find((row) => row.itemId === item.id);
    
    if (existingRow) {
      setBillingRows(
        billingRows.map((row) =>
          row.itemId === item.id
            ? { 
                ...row, 
                quantity: row.quantity + input.quantity,
                subtotal: (row.quantity + input.quantity) * row.unitPrice 
              }
            : row
        )
      );
    } else {
      setBillingRows([
        ...billingRows,
        {
          itemId: item.id,
          conceptName: conceptName,
          quantity: input.quantity,
          unitPrice: input.price,
          subtotal: input.quantity * input.price,
        },
      ]);
    }
  };

  const updateRowQuantity = (itemId: number, quantity: number) => {
    setBillingRows(
      billingRows.map((row) =>
        row.itemId === itemId
          ? { ...row, quantity, subtotal: quantity * row.unitPrice }
          : row
      )
    );
  };

  const updateRowPrice = (itemId: number, unitPrice: number) => {
    setBillingRows(
      billingRows.map((row) =>
        row.itemId === itemId
          ? { ...row, unitPrice, subtotal: row.quantity * unitPrice }
          : row
      )
    );
  };

  const removeRow = (itemId: number) => {
    setBillingRows(billingRows.filter((row) => row.itemId !== itemId));
  };

  const calculateTotal = () => {
    const subtotal = billingRows.reduce((sum, row) => sum + row.subtotal, 0);
    const tip = tipAmount;
    const tax10 = subtotal * 0.1; // SIEMPRE 10% del subtotal
    const total = subtotal + tip + tax10;
    return { subtotal, tip, tax10, total };
  };

  const handleProcessPayment = (payments: BillingPaymentDto[]) => {
    if (billingRows.length === 0) return;

    const { tip, tax10 } = calculateTotal();
    const firstRow = billingRows[0];
    
    onCreateRecord(
      firstRow.itemId,
      firstRow.quantity,
      firstRow.unitPrice,
      tip,
      tax10,
      payments,
      consumeImmediately,
      lateBilling
    );

    setBillingRows([]);
    setPaymentDialogOpen(false);
  };

  const { subtotal, tip, tax10, total } = calculateTotal();

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
          <div>
            <Label className="text-sm font-semibold mb-2 block">Conceptos Disponibles</Label>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>ID</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrichedItems.map((item) => {
                    const input = getItemInput(item.id, Number(item.priceUsd) || 0);
                    const conceptName = getConceptName(item);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs">{item.id}</TableCell>
                        <TableCell className="font-medium">{conceptName}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={input.price}
                            onChange={(e) => updateItemInput(item.id, 'price', parseFloat(e.target.value) || 0)}
                            className="w-24 h-8 font-mono"
                            placeholder={(Number(item.priceUsd) || 0).toFixed(2)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={input.quantity}
                            onChange={(e) => updateItemInput(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-20 h-8 text-center"
                            min={1}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => addItemToBilling(item)}
                          >
                            Facturar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {billingRows.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Factura en Proceso</Label>
              <div className="rounded-md border border-primary/30">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead className="font-bold">Concepto</TableHead>
                      <TableHead className="font-bold">Cantidad</TableHead>
                      <TableHead className="font-bold">Precio Unit.</TableHead>
                      <TableHead className="font-bold">Subtotal</TableHead>
                      <TableHead className="text-right font-bold">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingRows.map((row) => (
                      <TableRow key={row.itemId}>
                        <TableCell className="font-medium">{row.conceptName}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={row.quantity}
                            onChange={(e) => updateRowQuantity(row.itemId, parseInt(e.target.value) || 0)}
                            className="w-20 h-8 text-center"
                            min={1}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={row.unitPrice}
                            onChange={(e) => updateRowPrice(row.itemId, parseFloat(e.target.value) || 0)}
                            className="w-24 h-8 font-mono"
                          />
                        </TableCell>
                        <TableCell className="font-mono font-semibold">
                          ${row.subtotal.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeRow(row.itemId)}
                            className="text-destructive hover:text-destructive"
                          >
                            Quitar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="tipAmount">Propina (USD)</Label>
                    <Input
                      id="tipAmount"
                      type="number"
                      step="0.01"
                      value={tipAmount}
                      onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
                      className="font-mono"
                      placeholder="0.00"
                    />
                    <p className="text-xs text-muted-foreground">Ingrese el monto exacto de la propina</p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="consumeImmediately"
                        checked={consumeImmediately}
                        onCheckedChange={(checked) => setConsumeImmediately(checked === true)}
                      />
                      <Label htmlFor="consumeImmediately" className="text-sm font-normal cursor-pointer">
                        Consumir inventario inmediatamente
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lateBilling"
                        checked={lateBilling}
                        onCheckedChange={(checked) => setLateBilling(checked === true)}
                      />
                      <Label htmlFor="lateBilling" className="text-sm font-normal cursor-pointer">
                        Facturación diferida (crear deuda)
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-lg p-4 space-y-2 h-fit">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Propina:</span>
                    <span className="font-semibold text-green-600">${tip.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Impuesto 10%:</span>
                    <span className="font-semibold text-blue-600">${tax10.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total a Pagar:</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setPaymentDialogOpen(true)}
                className="w-full"
                size="lg"
                disabled={billingRows.length === 0}
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
        totalAmount={total}
      />
    </>
  );
}

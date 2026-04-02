import { useState, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BillDenominationDto, ConceptConsumptionDto } from "../types/types";

interface BillingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billingId: number;
  selectedItems: Array<{
    conceptId: number;
    conceptName: string;
    quantity: number;
    price: number;
  }>;
  onCreateRecord: (data: {
    billingId: number;
    date: string;
    billDenominations: BillDenominationDto[];
    totalPaid: number;
    totalAmount: number;
    change: number;
    tip: number;
    tax10Percent: number;
    conceptConsumptions: ConceptConsumptionDto[];
  }) => void;
}

const BILL_DENOMINATIONS = [1, 3, 5, 10, 20, 50, 100, 200, 500, 1000];

export function BillingModal({ 
  open, 
  onOpenChange, 
  billingId,
  selectedItems,
  onCreateRecord 
}: BillingModalProps) {
  const [billCounts, setBillCounts] = useState<Record<number, number>>({});
  const [tip, setTip] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!open) {
      setBillCounts({});
      setTip(0);
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [open]);

  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  
  const totalPaid = BILL_DENOMINATIONS.reduce(
    (sum, denom) => sum + denom * (billCounts[denom] || 0), 
    0
  );
  
  const change = totalPaid - totalAmount - tip;
  const tax10Percent = totalAmount * 0.1;

  const handleBillCountChange = (denomination: number, count: number) => {
    setBillCounts(prev => ({
      ...prev,
      [denomination]: Math.max(0, count),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (totalPaid < totalAmount + tip) {
      alert("El monto pagado no es suficiente");
      return;
    }

    const billDenominations: BillDenominationDto[] = BILL_DENOMINATIONS
      .filter(denom => billCounts[denom] > 0)
      .map(denom => ({
        value: denom,
        quantity: billCounts[denom],
      }));

    const conceptConsumptions: ConceptConsumptionDto[] = selectedItems.map(item => ({
      conceptId: item.conceptId,
      conceptName: item.conceptName,
      quantityConsumed: item.quantity,
    }));

    onCreateRecord({
      billingId,
      date,
      billDenominations,
      totalPaid,
      totalAmount,
      change,
      tip,
      tax10Percent,
      conceptConsumptions,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Registro de Pago</DialogTitle>
          <DialogDescription>
            Complete la información del pago para crear el registro.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div>
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Items Summary */}
          <div>
            <h4 className="font-semibold mb-2">Conceptos a facturar:</h4>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Precio Unit.</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedItems.map((item) => (
                    <TableRow key={item.conceptId}>
                      <TableCell>{item.conceptName}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${Number(item.price).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        ${Number(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Bill Denominations */}
          <div>
            <h4 className="font-semibold mb-2">Denominaciones de billetes:</h4>
            <div className="grid grid-cols-5 gap-3">
              {BILL_DENOMINATIONS.map((denom) => (
                <div key={denom} className="space-y-1">
                  <Label htmlFor={`bill-${denom}`}>${denom}</Label>
                  <Input
                    id={`bill-${denom}`}
                    type="number"
                    min="0"
                    value={billCounts[denom] || 0}
                    onChange={(e) => handleBillCountChange(denom, Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div>
            <Label htmlFor="tip">Propina</Label>
            <Input
              id="tip"
              type="number"
              step="0.01"
              min="0"
              value={tip}
              onChange={(e) => setTip(Number(e.target.value))}
            />
          </div>

          {/* Summary */}
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <div className="flex justify-between">
              <span>Total a pagar:</span>
              <span className="font-semibold">${Number(totalAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Propina:</span>
              <span className="font-semibold">${Number(tip).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total entregado:</span>
              <span className="font-semibold">${Number(totalPaid).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Vuelto:</span>
              <span className={`font-semibold ${change < 0 ? 'text-destructive' : ''}`}>
                ${Number(change).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>10% (impuesto/servicio):</span>
              <span>${Number(tax10Percent).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={totalPaid < totalAmount + tip}>
              Crear Registro
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

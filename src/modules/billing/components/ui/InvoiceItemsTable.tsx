import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

interface BillingRow {
  itemId: number;
  conceptName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface InvoiceItemsTableProps {
  rows: BillingRow[];
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onUpdatePrice: (itemId: number, price: number) => void;
  onRemoveRow: (itemId: number) => void;
}

/**
 * Componente UI puro que muestra la tabla de ítems en la factura en proceso
 */
export function InvoiceItemsTable({
  rows,
  onUpdateQuantity,
  onUpdatePrice,
  onRemoveRow,
}: InvoiceItemsTableProps) {
  return (
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
          {rows.map((row) => (
            <TableRow key={row.itemId}>
              <TableCell className="font-medium">{row.conceptName}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={row.quantity}
                  onChange={(e) => onUpdateQuantity(row.itemId, parseInt(e.target.value) || 0)}
                  className="w-20 h-8 text-center"
                  min={1}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  step="0.01"
                  value={row.unitPrice}
                  onChange={(e) => onUpdatePrice(row.itemId, parseFloat(e.target.value) || 0)}
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
                  onClick={() => onRemoveRow(row.itemId)}
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
  );
}


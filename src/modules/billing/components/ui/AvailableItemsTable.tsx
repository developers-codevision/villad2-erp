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

interface AvailableItemsTableProps {
  items: Array<{
    id: number;
    conceptName: string;
    price: number;
  }>;
  itemInputs: Record<number, { quantity: number; price: number }>;
  onUpdateInput: (itemId: number, field: "quantity" | "price", value: number) => void;
  onAddItem: (itemId: number) => void;
}

/**
 * Componente UI puro que muestra la tabla de conceptos disponibles
 */
export function AvailableItemsTable({
  items,
  itemInputs,
  onUpdateInput,
  onAddItem,
}: AvailableItemsTableProps) {
  return (
    <div>
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
            {items.map((item) => {
              const input = itemInputs[item.id] || { quantity: 1, price: item.price };
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.conceptName}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={input.price}
                      onChange={(e) => onUpdateInput(item.id, "price", parseFloat(e.target.value) || 0)}
                      className="w-24 h-8 font-mono"
                      placeholder={item.price.toFixed(2)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={input.quantity}
                      onChange={(e) => onUpdateInput(item.id, "quantity", parseInt(e.target.value) || 1)}
                      className="w-20 h-8 text-center"
                      min={1}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => onAddItem(item.id)}>
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
  );
}


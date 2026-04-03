import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Receipt } from "lucide-react";
import type { FacturacionItem } from "../types/types";

interface ConceptsTableProps {
  concepts: FacturacionItem[];
  onUpdateItem: (category: string, id: string, field: 'price' | 'quantity', value: number) => void;
  onBillingClick: (conceptId: string, conceptName: string, price: number, quantity: number) => void;
  selectedBillingId: number | null;
}

export function ConceptsTable({
  concepts,
  onUpdateItem,
  onBillingClick,
  selectedBillingId,
}: ConceptsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead className="w-32">Precio</TableHead>
          <TableHead className="w-32">Cantidad</TableHead>
          <TableHead className="w-32">Subtotal</TableHead>
          <TableHead className="w-32">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {concepts.map((i) => (
          <TableRow key={i.id}>
            <TableCell>{i.name}</TableCell>
            <TableCell>
              <Input
                type="number"
                step="0.01"
                value={i.price}
                onChange={(e) => onUpdateItem(i.category, i.id, 'price', Number(e.target.value))}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                min="0"
                value={i.quantity}
                onChange={(e) => onUpdateItem(i.category, i.id, 'quantity', Number(e.target.value))}
              />
            </TableCell>
            <TableCell className="text-right">
              ${Number(i.price * i.quantity).toFixed(2)}
            </TableCell>
            <TableCell>
              <Button
                size="sm"
                onClick={() => onBillingClick(i.id, i.name, i.price, i.quantity)}
                disabled={i.quantity <= 0 || !selectedBillingId}
              >
                <Receipt className="h-4 w-4 mr-1" />
                Facturar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

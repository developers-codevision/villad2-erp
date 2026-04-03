import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface BillingItem {
  conceptId: number;
  conceptName: string;
  quantity: number;
  price: number;
  productId?: number;
  productQuantity?: number;
}

interface BillingItemsTableProps {
  selectedItems: BillingItem[];
  totalAmount: number;
}

export function BillingItemsTable({ selectedItems, totalAmount }: BillingItemsTableProps) {
  return (
    <div>
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <span className="text-primary">📋</span> Conceptos a Facturar
      </h4>
      <div className="rounded-lg border bg-muted/30">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concepto</TableHead>
              <TableHead className="text-right">Cant.</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedItems.map((item) => (
              <TableRow key={item.conceptId}>
                <TableCell className="font-medium">{item.conceptName}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">${Number(item.price).toFixed(2)}</TableCell>
                <TableCell className="text-right font-semibold">
                  ${Number(item.price * item.quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted">
              <TableCell colSpan={3} className="text-right font-semibold">Subtotal:</TableCell>
              <TableCell className="text-right font-bold">${Number(totalAmount).toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Billing } from "../types/types";
import { Trash2, Eye, Archive, Package } from "lucide-react";

interface BillingsListProps {
  billings: Billing[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onPark?: (id: number) => void;
  onConsume?: (id: number) => void;
  loading?: boolean;
}

export function BillingsList({ 
  billings, 
  selectedId, 
  onSelect, 
  onDelete,
  onPark,
  onConsume,
  loading 
}: BillingsListProps) {
  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Cargando...</div>;
  }

  if (billings.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No hay hojas de facturación. Crea una nueva.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>USD/CUP</TableHead>
            <TableHead>EUR/CUP</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {billings.map((billing) => (
            <TableRow 
              key={billing.id}
              className={selectedId === billing.id ? 'bg-muted' : ''}
            >
              <TableCell className="font-medium">
                {billing.id}
                {selectedId === billing.id && (
                  <Badge variant="secondary" className="ml-2">
                    Seleccionada
                  </Badge>
                )}
              </TableCell>
              <TableCell>{new Date(billing.date).toLocaleDateString()}</TableCell>
              <TableCell>{Number(billing.usdToCupRate || 0).toFixed(2)}</TableCell>
              <TableCell>{Number(billing.eurToCupRate || 0).toFixed(2)}</TableCell>
              <TableCell className="text-right">
                {billing.totalAmount 
                  ? `$${Number(billing.totalAmount).toFixed(2)}`
                  : '-'}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelect(billing.id)}
                    title="Ver detalles"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {onPark && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        if (confirm('¿Deseas aparcar esta factura (marcar como no pagada)?')) {
                          onPark(billing.id);
                        }
                      }}
                      title="Aparcar factura"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  )}
                  {onConsume && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        if (confirm('¿Ejecutar consumo de inventario pendiente?')) {
                          onConsume(billing.id);
                        }
                      }}
                      title="Consumir inventario"
                    >
                      <Package className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm('¿Seguro que deseas eliminar esta facturación?')) {
                        onDelete(billing.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

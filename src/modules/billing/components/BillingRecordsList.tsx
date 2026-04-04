import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import type { BillingRecordDto } from "../types/types";

interface BillingRecordsListProps {
  records: BillingRecordDto[];
}

const formatNumber = (value: any): string => {
  const num = Number(value);
  return isNaN(num) ? "0.00" : num.toFixed(2);
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

export function BillingRecordsList({ records }: BillingRecordsListProps) {
  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Registros de Facturación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay registros de facturación para esta hoja.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Registros de Facturación ({records.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>ID</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio Unit.</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Propina</TableHead>
                <TableHead>Tax 10%</TableHead>
                <TableHead>Consumo Inmediato</TableHead>
                <TableHead>Facturación Diferida</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    <Badge variant="outline">#{record.id}</Badge>
                  </TableCell>
                  <TableCell>{record.quantity || 0}</TableCell>
                  <TableCell className="font-mono">
                    ${formatNumber(record.unitPrice)}
                  </TableCell>
                  <TableCell className="font-mono font-semibold">
                    ${formatNumber(record.totalAmount)}
                  </TableCell>
                  <TableCell className="font-mono">
                    {record.tip && Number(record.tip) > 0 ? (
                      <span className="text-green-600">${formatNumber(record.tip)}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono">
                    {record.tax10 && Number(record.tax10) > 0 ? (
                      <span className="text-blue-600">${formatNumber(record.tax10)}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={record.consumeImmediately ? "default" : "secondary"}>
                      {record.consumeImmediately ? "Sí" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={record.lateBilling ? "destructive" : "outline"}>
                      {record.lateBilling ? "Sí" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {record.createdAt ? formatDate(record.createdAt) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

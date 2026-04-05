import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BillingSheetDto } from "../../types/types";

interface SheetSummaryCardsProps {
  sheet: BillingSheetDto;
}

/**
 * Componente que muestra el resumen de la hoja de facturación en formato tabular
 * Dos columnas: CUP y USD
 */
export function SheetSummaryCards({ sheet }: SheetSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Cantidad de Conceptos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Cantidad de Conceptos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">
            {sheet.items?.length || 0}
          </p>
        </CardContent>
      </Card>

      {/* Resumen Tabular */}
      {sheet.summary && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Resumen de Facturación</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Concepto</TableHead>
                  <TableHead className="text-right">CUP</TableHead>
                  <TableHead className="text-right">USD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Subtotal */}
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground">Subtotal</TableCell>
                  <TableCell className="text-right font-semibold">₡{sheet.summary.subtotalCup.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-semibold">${sheet.summary.subtotalUsd.toFixed(2)}</TableCell>
                </TableRow>

                {/* Impuesto 10% */}
                <TableRow>
                  <TableCell className="font-medium text-muted-foreground">Impuesto 10%</TableCell>
                  <TableCell className="text-right font-semibold text-orange-600">₡{sheet.summary.tax10PercentCup.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-semibold text-orange-600">${sheet.summary.tax10PercentUsd.toFixed(2)}</TableCell>
                </TableRow>

                {/* Total */}
                <TableRow className="border-t-2 border-primary">
                  <TableCell className="font-bold text-primary">Total</TableCell>
                  <TableCell className="text-right font-bold text-primary text-lg">₡{sheet.summary.totalCup.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-bold text-primary text-lg">${sheet.summary.totalUsd.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


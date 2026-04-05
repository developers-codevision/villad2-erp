import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BillingSheetDto } from "../types/types";

interface SheetSummaryCardsProps {
  sheet: BillingSheetDto;
}

/**
 * Componente que muestra las tarjetas de resumen de la hoja
 */
export function SheetSummaryCards({ sheet }: SheetSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
      {sheet.summary && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Subtotal USD</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                ${sheet.summary.subtotalUsd.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Subtotal CUP</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                ₡{sheet.summary.subtotalCup.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Impuesto 10%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">
                ₡{sheet.summary.tax10Percent.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total CUP</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                ₡{sheet.summary.totalCup.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}


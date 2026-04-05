import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BillingSheetDto } from "../types/types";

interface ExchangeRateCardsProps {
  sheet: BillingSheetDto;
}

/**
 * Componente que muestra las tarjetas de tasas de cambio
 */
export function ExchangeRateCards({ sheet }: ExchangeRateCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Tasa USD → CUP</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">{sheet.usdToCupRate}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Tasa EUR → CUP</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">{sheet.eurToCupRate}</p>
        </CardContent>
      </Card>
    </div>
  );
}


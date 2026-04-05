import { ArrowLeft, Package, TrendingUp, Trash2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillingItemCard, BillingRecordsList } from "../components";
import type { BillingSheetDto, BillingRecordDto, BillingPaymentDto } from "../types/types";
import { SheetDetailHeader } from "../components/sections/SheetDetailHeader";
import { ExchangeRateCards } from "../components/sections/ExchangeRateCards";
import { SheetSummaryCards } from "../components/sections/SheetSummaryCards";
import { SheetDetailsTabs } from "../components/sections/SheetDetailsTabs";
import { UpdateRatesDialog } from "../components/dialogs/UpdateRatesDialog";

interface DetailSheetViewProps {
  sheet: BillingSheetDto;
  records: BillingRecordDto[];
  rates: { usd: number; eur: number };
  onRatesChange: (rates: { usd: number; eur: number }) => void;
  isSheetLoading: boolean;
  isRecordsLoading: boolean;
  isDeleting: boolean;
  onBack: () => void;
  onCreateConcept: () => void;
  onUpdateRates: () => void;
  onDelete: () => void;
  onCreateRecord: (
    itemId: number,
    quantity: number,
    unitPrice: number,
    tip: number,
    tax10: number,
    payments: BillingPaymentDto[],
    consumeImmediately: boolean,
    lateBilling: boolean,
    houseAccount: boolean,
    advanceBalance: number,
    change: number,
    chargeRate: number
  ) => void;
}

/**
 * Vista de detalle de una hoja de facturación
 * Contiene header, tasas, resumen y tabs
 */
export function DetailSheetView({
  sheet,
  records,
  rates,
  onRatesChange,
  isSheetLoading,
  isRecordsLoading,
  isDeleting,
  onBack,
  onCreateConcept,
  onUpdateRates,
  onDelete,
  onCreateRecord,
}: DetailSheetViewProps) {
  return (
    <div className="p-6 space-y-6">
      <SheetDetailHeader
        title={`Hoja de Facturación - ${new Date(sheet.date).toLocaleDateString("es-ES")}`}
        sheetId={sheet.id}
        onBack={onBack}
        onCreateConcept={onCreateConcept}
        onUpdateRates={onUpdateRates}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />

      <ExchangeRateCards sheet={sheet} />
      <SheetSummaryCards sheet={sheet} />

      <SheetDetailsTabs
        sheet={sheet}
        items={sheet.items || []}
        records={records}
        isItemsLoading={isSheetLoading}
        isRecordsLoading={isRecordsLoading}
        onCreateRecord={onCreateRecord}
      />

      <UpdateRatesDialog
        open={false}
        onOpenChange={() => {}}
        usdRate={rates.usd}
        onUsdRateChange={(val) => onRatesChange({ ...rates, usd: val })}
        eurRate={rates.eur}
        onEurRateChange={(val) => onRatesChange({ ...rates, eur: val })}
        onSave={() => {}}
      />
    </div>
  );
}


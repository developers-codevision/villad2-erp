import { Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillingItemCard, BillingRecordsList } from "../index";
import type { BillingSheetItemDto, BillingRecordDto, BillingPaymentDto } from "../../types/types";

interface SheetDetailsTabsProps {
  items: BillingSheetItemDto[];
  records: BillingRecordDto[];
  isItemsLoading: boolean;
  isRecordsLoading: boolean;
  onCreateRecord: (
    itemId: number,
    quantity: number,
    unitPrice: number,
    tip: number,
    tax10: number,
    payments: BillingPaymentDto[],
    consumeImmediately: boolean,
    lateBilling: boolean
  ) => void;
}

/**
 * Componente que contiene los tabs de items y registros
 */
export function SheetDetailsTabs({
  items,
  records,
  isItemsLoading,
  isRecordsLoading,
  onCreateRecord,
}: SheetDetailsTabsProps) {
  return (
    <Tabs defaultValue="items" className="space-y-4">
      <TabsList>
        <TabsTrigger value="items">Conceptos de Facturación</TabsTrigger>
        <TabsTrigger value="records">Registros</TabsTrigger>
      </TabsList>

      <TabsContent value="items" className="space-y-4">
        {isItemsLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Cargando items...
          </div>
        ) : items && items.length > 0 ? (
          <BillingItemCard items={items} onCreateRecord={onCreateRecord} />
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No hay items disponibles en esta hoja de facturación</p>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="records">
        {isRecordsLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Cargando registros...
          </div>
        ) : (
          <BillingRecordsList records={records || []} />
        )}
      </TabsContent>
    </Tabs>
  );
}


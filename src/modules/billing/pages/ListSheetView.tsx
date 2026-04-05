import { Plus, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { BillingSheetDto } from "../types/types";
import { SheetFiltersSection } from "../components/sections/SheetFiltersSection";
import { SheetsTableSection } from "../components/sections/SheetsTableSection";
import { CreateSheetDialog } from "../components/dialogs/CreateSheetDialog";
import { format } from "date-fns";

interface ListSheetViewProps {
  sheets: BillingSheetDto[];
  isLoading: boolean;
  filterDate: string;
  onFilterDateChange: (date: string) => void;
  filterMinRate: string;
  onFilterMinRateChange: (rate: string) => void;
  onClearFilters: () => void;
  onSelectSheet: (sheetId: number) => void;
  onCreateNew: () => void;
}

/**
 * Vista de listado de hojas de facturación
 * Contiene filtros y tabla
 */
export function ListSheetView({
  sheets,
  isLoading,
  filterDate,
  onFilterDateChange,
  filterMinRate,
  onFilterMinRateChange,
  onClearFilters,
  onSelectSheet,
  onCreateNew,
}: ListSheetViewProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Facturación</h2>
        <Button onClick={onCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Hoja de Facturación
        </Button>
      </div>

      <SheetFiltersSection
        date={filterDate}
        onDateChange={onFilterDateChange}
        minRate={filterMinRate}
        onMinRateChange={onFilterMinRateChange}
        onClearFilters={onClearFilters}
      />

      <SheetsTableSection
        sheets={sheets}
        isLoading={isLoading}
        isEmpty={sheets.length === 0}
        onSelectSheet={onSelectSheet}
        onCreateNew={onCreateNew}
      />

      <CreateSheetDialog
        open={false}
        onOpenChange={() => {}}
        date={new Date().toISOString().split("T")[0]}
        onDateChange={() => {}}
        onCreate={onCreateNew}
      />
    </div>
  );
}


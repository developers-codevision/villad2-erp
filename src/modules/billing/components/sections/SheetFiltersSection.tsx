import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { BillingSheetDto } from "../../types/types";

interface SheetFiltersSectionProps {
  date: string;
  onDateChange: (date: string) => void;
  minRate: string;
  onMinRateChange: (rate: string) => void;
  onClearFilters: () => void;
}

/**
 * Componente que contiene la sección de filtros
 * Separado de BillingPage para reducir complejidad
 */
export function SheetFiltersSection({
  date,
  onDateChange,
  minRate,
  onMinRateChange,
  onClearFilters,
}: SheetFiltersSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <CardTitle className="text-base">Filtros</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filterDate">Fecha</Label>
            <Input
              id="filterDate"
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              placeholder="Filtrar por fecha..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filterRate">Tasa USD mínima</Label>
            <Input
              id="filterRate"
              type="number"
              value={minRate}
              onChange={(e) => onMinRateChange(e.target.value)}
              placeholder="Ej: 150"
            />
          </div>
          <div className="flex items-end">
            <Button variant="outline" onClick={onClearFilters} className="w-full">
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


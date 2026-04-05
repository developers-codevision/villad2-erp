import { Receipt, Plus } from "lucide-react";
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
import { format } from "date-fns";
import type { BillingSheetDto } from "../types/types";

interface SheetsTableSectionProps {
  sheets: BillingSheetDto[];
  isLoading: boolean;
  isEmpty: boolean;
  onSelectSheet: (sheetId: number) => void;
  onCreateNew: () => void;
}

/**
 * Componente que contiene la tabla de hojas de facturación
 * Separado de BillingPage para reducir complejidad
 */
export function SheetsTableSection({
  sheets,
  isLoading,
  isEmpty,
  onSelectSheet,
  onCreateNew,
}: SheetsTableSectionProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Cargando hojas de facturación...
      </div>
    );
  }

  if (isEmpty) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="mb-4">No hay hojas de facturación disponibles</p>
            <Button onClick={onCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Primera Hoja
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tasa USD→CUP</TableHead>
                <TableHead>Tasa EUR→CUP</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sheets.map((sheet) => (
                <TableRow key={sheet.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <Badge variant="outline">#{sheet.id}</Badge>
                  </TableCell>
                  <TableCell>{format(new Date(sheet.date), "dd/MM/yyyy")}</TableCell>
                  <TableCell className="font-mono">{sheet.usdToCupRate}</TableCell>
                  <TableCell className="font-mono">{sheet.eurToCupRate}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => onSelectSheet(sheet.id)}>
                      Ver Detalles
                    </Button>
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


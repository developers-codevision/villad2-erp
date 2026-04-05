import { Button } from "@/components/ui/button";
import { TrendingUp, Package, Trash2 } from "lucide-react";

interface SheetDetailHeaderProps {
  title: string;
  sheetId: number;
  onBack: () => void;
  onCreateConcept: () => void;
  onUpdateRates: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

/**
 * Componente que contiene el header de la vista de detalle
 */
export function SheetDetailHeader({
  title,
  sheetId,
  onBack,
  onCreateConcept,
  onUpdateRates,
  onDelete,
  isDeleting = false,
}: SheetDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          ← Volver
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">ID: {sheetId}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCreateConcept}>
          <Package className="h-4 w-4 mr-2" />
          Crear Concepto
        </Button>
        <Button onClick={onUpdateRates}>
          <TrendingUp className="h-4 w-4 mr-2" />
          Actualizar Tasas
        </Button>
        <Button
          variant="destructive"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isDeleting ? "Eliminando..." : "Eliminar"}
        </Button>
      </div>
    </div>
  );
}


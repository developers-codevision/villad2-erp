import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CreateSheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  onDateChange: (date: string) => void;
  onCreate: () => void;
  isCreating?: boolean;
}

/**
 * Componente del diálogo para crear nueva hoja de facturación
 */
export function CreateSheetDialog({
  open,
  onOpenChange,
  date,
  onDateChange,
  onCreate,
  isCreating = false,
}: CreateSheetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Hoja de Facturación</DialogTitle>
          <DialogDescription>
            Crea una nueva hoja de facturación diaria
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            Cancelar
          </Button>
          <Button onClick={onCreate} disabled={isCreating}>
            {isCreating ? "Creando..." : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


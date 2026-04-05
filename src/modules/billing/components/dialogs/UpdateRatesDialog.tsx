import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface UpdateRatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usdRate: number;
  onUsdRateChange: (rate: number) => void;
  eurRate: number;
  onEurRateChange: (rate: number) => void;
  onSave: () => void;
}

/**
 * Componente del diálogo para actualizar tasas de cambio
 */
export function UpdateRatesDialog({
  open,
  onOpenChange,
  usdRate,
  onUsdRateChange,
  eurRate,
  onEurRateChange,
  onSave,
}: UpdateRatesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar Tasas de Cambio</DialogTitle>
          <DialogDescription>
            Modifica las tasas de conversión de moneda
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="usdRate">Tasa USD → CUP</Label>
            <Input
              id="usdRate"
              type="number"
              step="0.01"
              value={usdRate}
              onChange={(e) => onUsdRateChange(parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eurRate">Tasa EUR → CUP</Label>
            <Input
              id="eurRate"
              type="number"
              step="0.01"
              value={eurRate}
              onChange={(e) => onEurRateChange(parseFloat(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


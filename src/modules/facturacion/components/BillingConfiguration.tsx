import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface BillingConfigurationProps {
  date: string;
  setDate: (date: string) => void;
  usdRate: number;
  setUsdRate: (rate: number) => void;
  euroRate: number;
  setEuroRate: (rate: number) => void;
  selectedBillingId: number | null;
  updating: boolean;
  onUpdateRates: () => void;
}

export function BillingConfiguration({
  date,
  setDate,
  usdRate,
  setUsdRate,
  euroRate,
  setEuroRate,
  selectedBillingId,
  updating,
  onUpdateRates,
}: BillingConfigurationProps) {
  return (
    <div className="space-y-6">
      {/* Billing Configuration */}
      <div className="grid grid-cols-3 gap-4 max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="date">Fecha</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="usdRate">Valor USD</Label>
          <Input
            id="usdRate"
            type="number"
            step="0.01"
            value={usdRate}
            onChange={(e) => setUsdRate(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="euroRate">Valor Euro</Label>
          <Input
            id="euroRate"
            type="number"
            step="0.01"
            value={euroRate}
            onChange={(e) => setEuroRate(Number(e.target.value))}
          />
        </div>
      </div>

      {selectedBillingId && (
        <div className="flex gap-2">
          <Button
            onClick={onUpdateRates}
            disabled={updating}
            variant="outline"
          >
            {updating ? 'Actualizando...' : 'Actualizar Tasas'}
          </Button>
          <div className="text-sm text-muted-foreground flex items-center">
            Facturación seleccionada: #{selectedBillingId}
          </div>
        </div>
      )}
    </div>
  );
}

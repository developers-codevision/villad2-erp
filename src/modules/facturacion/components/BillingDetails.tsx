import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BillingDetailsProps {
  tip: number;
  setTip: (tip: number) => void;
  consumeImmediately: boolean;
  setConsumeImmediately: (consume: boolean) => void;
  lateBilling: boolean;
  setLateBilling: (late: boolean) => void;
}

export function BillingDetails({
  tip,
  setTip,
  consumeImmediately,
  setConsumeImmediately,
  lateBilling,
  setLateBilling
}: BillingDetailsProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="tip" className="text-xs">Propina (USD)</Label>
        <Input
          id="tip"
          type="number"
          step="0.01"
          min="0"
          value={tip}
          onChange={(e) => setTip(Number(e.target.value))}
          placeholder="0.00"
          className="mt-1"
        />
      </div>

      {/* Options */}
      <div className="p-3 rounded-lg border bg-muted/30 space-y-2">
        <div className="flex items-center space-x-2">
          <input
            id="consumeImmediately"
            type="checkbox"
            checked={consumeImmediately}
            onChange={(e) => setConsumeImmediately(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <Label htmlFor="consumeImmediately" className="text-sm cursor-pointer">
            ⚡ Consumir inventario inmediatamente
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="lateBilling"
            type="checkbox"
            checked={lateBilling}
            onChange={(e) => setLateBilling(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <Label htmlFor="lateBilling" className="text-sm cursor-pointer">
            🕐 Facturación tardía
          </Label>
        </div>
      </div>
    </div>
  );
}

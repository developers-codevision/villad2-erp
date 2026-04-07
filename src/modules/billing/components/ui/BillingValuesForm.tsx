import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

interface BillingValuesFormProps {
  totalChangeInCup: number;
  tip: number;
  onTipChange: (value: number) => void;
  changeRemaining: number;
  disabled?: boolean;
}

/**
 * Formulario coordinado final:
 * - Propina (editable)
 * - Vuelto (calculado)
 *
 * Fondo ya NO se configura aquí.
 */
export function BillingValuesForm({
  totalChangeInCup,
  tip,
  onTipChange,
  changeRemaining,
  disabled = false,
}: BillingValuesFormProps) {
  const [leaveTip, setLeaveTip] = React.useState(tip > 0);
  const effectiveTip = leaveTip ? tip : 0;
  const baseVuelto = changeRemaining + effectiveTip;
  const changeAfterTip = Math.max(0, baseVuelto - effectiveTip);
  const totalUsed = effectiveTip + changeRemaining;
  const isBalanced = Math.abs(totalUsed - totalChangeInCup) < 0.01;
  const remaining = totalChangeInCup - totalUsed;

  const handleToggleLeaveTip = (checked: boolean) => {
    setLeaveTip(checked);
    if (!checked) {
      onTipChange(0);
    }
  };

  return (
    <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Propina y Vuelto (₡{totalChangeInCup.toFixed(2)})</h3>
        {!isBalanced && remaining > 0.01 && (
          <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">
            Faltan: ₡{remaining.toFixed(2)}
          </span>
        )}
        {!isBalanced && remaining < -0.01 && (
          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
            Exceso: ₡{Math.abs(remaining).toFixed(2)}
          </span>
        )}
        {isBalanced && (
          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
            ✓ Balanceado
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="changeRemaining" className="text-sm font-medium">
            Vuelto
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-muted-foreground">₡</span>
            <Input
              id="changeRemaining"
              type="number"
              step="0.01"
              min="0"
              value={changeRemaining}
              readOnly
              disabled
              placeholder="0.00"
              className="pl-6 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">Vuelto base para distribuir</p>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="leaveTip"
            checked={leaveTip}
            onCheckedChange={(checked) => handleToggleLeaveTip(checked === true)}
            disabled={disabled}
          />
          <Label htmlFor="leaveTip" className="cursor-pointer font-normal">
            Dejar propina
          </Label>
        </div>

        {leaveTip && (
          <div className="space-y-2">
            <Label htmlFor="tip" className="text-sm font-medium">
              Propina
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-muted-foreground">₡</span>
              <Input
                id="tip"
                type="number"
                step="0.01"
                min="0"
                value={tip}
                onChange={(e) => onTipChange(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                disabled={disabled}
                className="pl-6"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between text-sm font-semibold">
          <span>Vuelto despues de propina:</span>
          <span className="text-green-600">₡{changeAfterTip.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t pt-3 space-y-1 bg-white dark:bg-slate-900 p-3 rounded">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Propina:</span>
          <span className="font-semibold">₡{effectiveTip.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-bold">
          <span>Vuelto:</span>
          <span className="text-green-600">₡{changeAfterTip.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

interface InvoiceOptionsProps {
  tipAmount: number;
  onTipChange: (amount: number) => void;
  consumeImmediately: boolean;
  onConsumeImmediatelyChange: (checked: boolean) => void;
  lateBilling: boolean;
  onLateBillingChange: (checked: boolean) => void;
}

/**
 * Componente UI puro para opciones de la factura (propina y flags)
 */
export function InvoiceOptions({
  tipAmount,
  onTipChange,
  consumeImmediately,
  onConsumeImmediatelyChange,
  lateBilling,
  onLateBillingChange,
}: InvoiceOptionsProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="tipAmount">Propina (USD)</Label>
        <Input
          id="tipAmount"
          type="number"
          step="0.01"
          value={tipAmount}
          onChange={(e) => onTipChange(parseFloat(e.target.value) || 0)}
          className="font-mono"
          placeholder="0.00"
        />
        <p className="text-xs text-muted-foreground">Ingrese el monto exacto de la propina</p>
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="consumeImmediately"
            checked={consumeImmediately}
            onCheckedChange={(checked) => onConsumeImmediatelyChange(checked === true)}
          />
          <Label htmlFor="consumeImmediately" className="text-sm font-normal cursor-pointer">
            Consumir inventario inmediatamente
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="lateBilling"
            checked={lateBilling}
            onCheckedChange={(checked) => onLateBillingChange(checked === true)}
          />
          <Label htmlFor="lateBilling" className="text-sm font-normal cursor-pointer">
            Facturación diferida (crear deuda)
          </Label>
        </div>
      </div>
    </div>
  );
}


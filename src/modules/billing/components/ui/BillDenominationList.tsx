import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import type { BillDenominationDto, Currency } from "../types/types";
import React from "react";

interface BillDenominationListProps {
  denominations: BillDenominationDto[];
  onUpdateQuantity: (currency: Currency, value: number, quantity: number) => void;
  onRemove?: (currency: Currency, value: number) => void;
}

/**
 * Componente UI puro que muestra la lista de denominaciones agregadas
 * Con inputs para actualizar cantidades
 */
export function BillDenominationList({
  denominations,
  onUpdateQuantity,
  onRemove,
}: BillDenominationListProps) {
  if (denominations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mt-3">
      <Label className="text-xs">Billetes Agregados</Label>
      <div className="space-y-1">
        {denominations.map((denom, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-card p-2 rounded border">
            <Badge variant="outline" className="w-16">
              {denom.value} {denom.currency}
            </Badge>
            <span className="text-sm">×</span>
            <Input
              type="number"
              value={denom.quantity}
              onChange={(e) =>
                onUpdateQuantity(denom.currency, denom.value, parseInt(e.target.value) || 0)
              }
              className="w-16 h-7 text-center"
              min={0}
            />
            <span className="text-sm font-mono ml-auto">
              = {denom.value * denom.quantity} {denom.currency}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


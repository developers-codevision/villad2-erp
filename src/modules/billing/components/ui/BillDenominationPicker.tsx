import { Button } from "@/components/ui/button";
import { Banknote } from "lucide-react";
import React from "react";

interface BillDenominationPickerProps {
  denominations: number[];
  onSelectDenomination: (value: number) => void;
}

/**
 * Componente UI puro que muestra los botones de denominaciones de billetes
 * No contiene lógica, solo presentación
 */
export function BillDenominationPicker({
  denominations,
  onSelectDenomination,
}: BillDenominationPickerProps) {
  return (
    <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
      {denominations.map((value) => (
        <Button
          key={value}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onSelectDenomination(value)}
          className="flex flex-col h-auto py-2"
        >
          <Banknote className="h-4 w-4 mb-1" />
          <span className="text-xs font-bold">{value}</span>
        </Button>
      ))}
    </div>
  );
}


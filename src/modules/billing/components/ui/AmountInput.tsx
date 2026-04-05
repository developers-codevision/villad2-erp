import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

/**
 * Componente UI puro para entrada de montos
 * Usado cuando el método de pago no soporta denominaciones de billetes
 */
export function AmountInput({
  value,
  onChange,
  label = "Monto (USD)",
  placeholder = "0.00",
}: AmountInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="amount">{label}</Label>
      <Input
        id="amount"
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateShiftSelectorProps {
  fecha: string;
  jefesDeTurno: string;
  onFechaChange: (fecha: string) => void;
  onJefesChange: (jefes: string) => void;
}

export function DateShiftSelector({
  fecha,
  jefesDeTurno,
  onFechaChange,
  onJefesChange,
}: DateShiftSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <Label htmlFor="fecha">Fecha</Label>
        <Input
          id="fecha"
          type="date"
          value={fecha}
          onChange={(e) => onFechaChange(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="jefes">Jefes de Turno</Label>
        <Input
          id="jefes"
          value={jefesDeTurno}
          onChange={(e) => onJefesChange(e.target.value)}
          placeholder="Ej: Jenifer/Fabio"
        />
      </div>
    </div>
  );
}

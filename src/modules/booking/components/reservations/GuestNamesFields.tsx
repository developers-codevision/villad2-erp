import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type GuestNamesFieldsProps = {
  names: string[];
  onChange: (index: number, value: string) => void;
  idPrefix: string;
};

export function GuestNamesFields({ names, onChange, idPrefix }: GuestNamesFieldsProps) {
  return (
    <>
      {names.map((value, idx) => (
        <div key={`${idPrefix}-${idx}`} className="space-y-2">
          <Label htmlFor={`${idPrefix}-${idx}`}>{`Nombre y apellidos - Persona ${idx + 1}`}</Label>
          <Input
            id={`${idPrefix}-${idx}`}
            value={value}
            onChange={(e) => onChange(idx, e.target.value)}
          />
        </div>
      ))}
    </>
  );
}

export default GuestNamesFields;


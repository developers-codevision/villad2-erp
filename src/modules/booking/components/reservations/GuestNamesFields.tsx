import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type GuestNameInput = {
  firstName: string;
  lastName: string;
};

type GuestNamesFieldsProps = {
  guests: GuestNameInput[];
  onChange: (index: number, field: keyof GuestNameInput, value: string) => void;
  idPrefix: string;
};

export function GuestNamesFields({ guests, onChange, idPrefix }: GuestNamesFieldsProps) {
  return (
    <>
      {guests.map((guest, idx) => (
        <div key={`${idPrefix}-${idx}`} className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-name-${idx}`}>{`Nombre - Persona ${idx + 1}`}</Label>
            <Input
              id={`${idPrefix}-name-${idx}`}
              value={guest.firstName}
              onChange={(e) => onChange(idx, "firstName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-last-${idx}`}>{`Apellidos - Persona ${idx + 1}`}</Label>
            <Input
              id={`${idPrefix}-last-${idx}`}
              value={guest.lastName}
              onChange={(e) => onChange(idx, "lastName", e.target.value)}
            />
          </div>
        </div>
      ))}
    </>
  );
}

export default GuestNamesFields;

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ExampleRoom = {
  id: number;
  number: string;
  name: string;
  roomType: string;
};

type RoomSelectFieldProps = {
  id: string;
  label: string;
  value: string;
  rooms: ExampleRoom[];
  onChange: (value: string) => void;
};

export function RoomSelectField({ id, label, value, rooms, onChange }: RoomSelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {rooms.map((room) => (
            <SelectItem key={room.id} value={String(room.id)}>{`${room.number} - ${room.name}`}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default RoomSelectField;


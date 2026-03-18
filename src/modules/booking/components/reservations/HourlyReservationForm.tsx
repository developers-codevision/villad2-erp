import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReservationStatus, type ReservationWithDetails } from "@/modules/booking/types/types";
import { GuestNamesFields } from "./GuestNamesFields";
import { RoomSelectField, type ExampleRoom } from "./RoomSelectField";

type HourlyReservationFormProps = {
  rooms: ExampleRoom[];
  onCancel: () => void;
  onCreate: (reservation: ReservationWithDetails) => void;
};

export function HourlyReservationForm({ rooms, onCancel, onCreate }: HourlyReservationFormProps) {
  const [selectedRoom, setSelectedRoom] = useState<string>(String(rooms[0]?.id ?? 0));
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [hoursCount, setHoursCount] = useState<string>("2");
  const [personsCount, setPersonsCount] = useState<number>(1);
  const [guestNames, setGuestNames] = useState<string[]>([""]);
  const [observations, setObservations] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const handlePersonCount = (n: number) => {
    const nextCount = Math.max(1, n || 1);
    setPersonsCount(nextCount);
    setGuestNames((prev) => {
      const next = [...prev];
      while (next.length < nextCount) next.push("");
      while (next.length > nextCount) next.pop();
      return next;
    });
  };

  const handleGuestNameChange = (index: number, value: string) => {
    setGuestNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSave = () => {
    if (!date || !time) {
      alert("Fecha y hora son obligatorias");
      return;
    }

    const roomId = Number(selectedRoom) || 0;
    const room = rooms.find((r) => r.id === roomId);

    const reservation: ReservationWithDetails = {
      id: Date.now(),
      roomId,
      checkInDate: new Date(`${date}T${time}`).toISOString(),
      checkOutDate: new Date(new Date(`${date}T${time}`).getTime() + Number(hoursCount) * 3600000).toISOString(),
      status: ReservationStatus.CONFIRMED,
      mainGuest: {
        firstName: guestNames[0] || "N/D",
        lastName: "",
        email: "",
        phone: "",
        sex: "M",
      },
      baseGuestsCount: personsCount,
      extraGuestsCount: 0,
      totalPrice: Number(price) || 0,
      notes: observations,
      earlyCheckIn: false,
      lateCheckOut: false,
      transferOneWay: false,
      transferRoundTrip: false,
      breakfasts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      room: room
        ? { number: room.number, name: room.name, roomType: room.roomType }
        : { number: "-", name: "Reserva por horas", roomType: "hourly" },
    };

    onCreate(reservation);
  };

  return (
    <>
      <div className="space-y-4 py-2">
        <RoomSelectField
          id="roomHours"
          label="Habitacion"
          value={selectedRoom}
          rooms={rooms}
          onChange={setSelectedRoom}
        />

        <div className="space-y-2">
          <Label htmlFor="date">Fecha</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Hora de entrada</Label>
          <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hours">Horas</Label>
          <Select value={hoursCount} onValueChange={setHoursCount}>
            <SelectTrigger id="hours">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 horas</SelectItem>
              <SelectItem value="3">3 horas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="persons">Cantidad de personas</Label>
          <Input
            id="persons"
            type="number"
            min={1}
            value={String(personsCount)}
            onChange={(e) => handlePersonCount(Number(e.target.value))}
          />
        </div>

        <GuestNamesFields names={guestNames} onChange={handleGuestNameChange} idPrefix="guest-hours" />

        <div className="space-y-2">
          <Label htmlFor="obs">Observaciones</Label>
          <Input id="obs" value={observations} onChange={(e) => setObservations(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Precio</Label>
          <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleSave}>Guardar reserva</Button>
      </DialogFooter>
    </>
  );
}

export default HourlyReservationForm;


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReservationStatus, type ReservationWithDetails } from "@/modules/booking/types/types";
import { GuestNamesFields } from "./GuestNamesFields";
import { RoomSelectField, type ExampleRoom } from "./RoomSelectField";

type NightlyReservationFormProps = {
  rooms: ExampleRoom[];
  onCancel: () => void;
  onCreate: (reservation: ReservationWithDetails) => void;
};

export function NightlyReservationForm({ rooms, onCancel, onCreate }: NightlyReservationFormProps) {
  const [selectedRoom, setSelectedRoom] = useState<string>(String(rooms[0]?.id ?? 0));
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [nightsCount, setNightsCount] = useState<string>("1");
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
    if (!checkInDate) {
      alert("La fecha de entrada es obligatoria");
      return;
    }

    const checkIn = new Date(`${checkInDate}T15:00`);
    const checkOut = new Date(checkIn.getTime() + (Number(nightsCount) || 1) * 86400000);
    const roomId = Number(selectedRoom) || 0;
    const room = rooms.find((r) => r.id === roomId);

    const reservation: ReservationWithDetails = {
      id: Date.now(),
      roomId,
      checkInDate: checkIn.toISOString(),
      checkOutDate: checkOut.toISOString(),
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
        : { number: "-", name: "Reserva por noches", roomType: "nightly" },
    };

    onCreate(reservation);
  };

  return (
    <>
      <div className="space-y-4 py-2">
        <RoomSelectField
          id="roomNoches"
          label="Habitacion"
          value={selectedRoom}
          rooms={rooms}
          onChange={setSelectedRoom}
        />

        <div className="space-y-2">
          <Label htmlFor="checkInDate">Fecha de entrada</Label>
          <Input id="checkInDate" type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nights">Noches</Label>
          <Select value={nightsCount} onValueChange={setNightsCount}>
            <SelectTrigger id="nights">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 noche</SelectItem>
              <SelectItem value="2">2 noches</SelectItem>
              <SelectItem value="3">3 noches</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="personsNoches">Cantidad de personas</Label>
          <Input
            id="personsNoches"
            type="number"
            min={1}
            value={String(personsCount)}
            onChange={(e) => handlePersonCount(Number(e.target.value))}
          />
        </div>

        <GuestNamesFields names={guestNames} onChange={handleGuestNameChange} idPrefix="guest-noches" />

        <div className="space-y-2">
          <Label htmlFor="obsNoches">Observaciones</Label>
          <Input id="obsNoches" value={observations} onChange={(e) => setObservations(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceNoches">Precio</Label>
          <Input id="priceNoches" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleSave}>Guardar reserva</Button>
      </DialogFooter>
    </>
  );
}

export default NightlyReservationForm;


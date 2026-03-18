import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReservationStatus, type ReservationWithDetails } from "@/modules/booking/types/types";

type TerraceReservationFormProps = {
  onCancel: () => void;
  onCreate: (reservation: ReservationWithDetails) => void;
};

export function TerraceReservationForm({ onCancel, onCreate }: TerraceReservationFormProps) {
  const [reservationDate, setReservationDate] = useState<string>("");
  const [personsCount, setPersonsCount] = useState<string>("1");
  const [hoursCount, setHoursCount] = useState<string>("1");
  const [price, setPrice] = useState<string>("");
  const [observations, setObservations] = useState<string>("");

  const handleSave = () => {
    if (!reservationDate) {
      alert("La fecha de reserva es obligatoria");
      return;
    }

    const checkIn = new Date(`${reservationDate}T12:00`);
    const checkOut = new Date(checkIn.getTime() + (Number(hoursCount) || 1) * 3600000);

    const reservation: ReservationWithDetails = {
      id: Date.now(),
      roomId: 0,
      checkInDate: checkIn.toISOString(),
      checkOutDate: checkOut.toISOString(),
      status: ReservationStatus.CONFIRMED,
      mainGuest: {
        firstName: "N/D",
        lastName: "",
        email: "",
        phone: "",
        sex: "M",
      },
      baseGuestsCount: Number(personsCount) || 1,
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
      room: {
        number: "T-1",
        name: "Reserva Terraza",
        roomType: "terrace",
      },
    };

    onCreate(reservation);
  };

  return (
    <>
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="terraceDate">Fecha de reserva</Label>
          <Input
            id="terraceDate"
            type="date"
            value={reservationDate}
            onChange={(e) => setReservationDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="terracePersons">Cantidad de personas</Label>
          <Input
            id="terracePersons"
            type="number"
            min={1}
            value={personsCount}
            onChange={(e) => setPersonsCount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="terraceHours">Cantidad de horas</Label>
          <Input
            id="terraceHours"
            type="number"
            min={1}
            value={hoursCount}
            onChange={(e) => setHoursCount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="terracePrice">Precio</Label>
          <Input
            id="terracePrice"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="terraceObservations">Observaciones</Label>
          <Input
            id="terraceObservations"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleSave}>Guardar reserva</Button>
      </DialogFooter>
    </>
  );
}

export default TerraceReservationForm;


import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReservationStatus, type ReservationWithDetails } from "@/modules/booking/types/types";
import { GuestNamesFields } from "./GuestNamesFields";
import { RoomSelectField, type ExampleRoom } from "./RoomSelectField";

type StayReservationFormProps = {
  rooms: ExampleRoom[];
  onCancel: () => void;
  onCreate: (reservation: ReservationWithDetails) => void;
};

export function StayReservationForm({ rooms, onCancel, onCreate }: StayReservationFormProps) {
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [timeIn, setTimeIn] = useState<string>("15:00");
  const [timeOut, setTimeOut] = useState<string>("12:00");
  const [selectedRoom, setSelectedRoom] = useState<string>(String(rooms[0]?.id ?? 0));
  const [personsCount, setPersonsCount] = useState<number>(1);
  const [guestNames, setGuestNames] = useState<string[]>([""]);
  const [observations, setObservations] = useState<string>("");

  const [priceAccommodation, setPriceAccommodation] = useState<string>("");
  const [pickupAirport, setPickupAirport] = useState<boolean>(false);
  const [pickupFee, setPickupFee] = useState<string>("0");
  const [transferReturn, setTransferReturn] = useState<boolean>(false);
  const [transferReturnFee, setTransferReturnFee] = useState<string>("0");
  const [earlyCheckIn, setEarlyCheckIn] = useState<boolean>(false);
  const [earlyCheckInFee, setEarlyCheckInFee] = useState<string>("0");
  const [lateCheckOut, setLateCheckOut] = useState<boolean>(false);
  const [lateCheckOutFee, setLateCheckOutFee] = useState<string>("0");

  const [breakfast1Count, setBreakfast1Count] = useState<number>(0);
  const [breakfast2Count, setBreakfast2Count] = useState<number>(0);
  const [breakfast3Count, setBreakfast3Count] = useState<number>(0);
  const [breakfast1Price, setBreakfast1Price] = useState<string>("0");
  const [breakfast2Price, setBreakfast2Price] = useState<string>("0");
  const [breakfast3Price, setBreakfast3Price] = useState<string>("0");

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

  const total = useMemo(() => {
    const accommodation = Number(priceAccommodation) || 0;
    const services =
      (pickupAirport ? Number(pickupFee) || 0 : 0) +
      (transferReturn ? Number(transferReturnFee) || 0 : 0) +
      (earlyCheckIn ? Number(earlyCheckInFee) || 0 : 0) +
      (lateCheckOut ? Number(lateCheckOutFee) || 0 : 0);
    const breakfasts =
      breakfast1Count * (Number(breakfast1Price) || 0) +
      breakfast2Count * (Number(breakfast2Price) || 0) +
      breakfast3Count * (Number(breakfast3Price) || 0);
    return accommodation + services + breakfasts;
  }, [
    priceAccommodation,
    pickupAirport,
    pickupFee,
    transferReturn,
    transferReturnFee,
    earlyCheckIn,
    earlyCheckInFee,
    lateCheckOut,
    lateCheckOutFee,
    breakfast1Count,
    breakfast1Price,
    breakfast2Count,
    breakfast2Price,
    breakfast3Count,
    breakfast3Price,
  ]);

  const handleSave = () => {
    if (!checkInDate || !checkOutDate) {
      alert("Fechas de entrada y salida son obligatorias");
      return;
    }

    const start = new Date(`${checkInDate}T${timeIn}`);
    const end = new Date(`${checkOutDate}T${timeOut}`);
    if (end <= start) {
      alert("La fecha/hora de salida debe ser posterior a la de entrada");
      return;
    }

    const roomId = Number(selectedRoom) || 0;
    const room = rooms.find((r) => r.id === roomId);

    const reservation: ReservationWithDetails = {
      id: Date.now(),
      roomId,
      checkInDate: start.toISOString(),
      checkOutDate: end.toISOString(),
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
      totalPrice: total,
      notes: observations,
      earlyCheckIn,
      lateCheckOut,
      transferOneWay: pickupAirport,
      transferRoundTrip: transferReturn,
      breakfasts: breakfast1Count + breakfast2Count + breakfast3Count,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      room: room
        ? { number: room.number, name: room.name, roomType: room.roomType }
        : { number: "-", name: "Reserva estancia", roomType: "estancia" },
    };

    onCreate(reservation);
  };

  return (
    <>
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="checkInDateEst">Fecha de entrada</Label>
            <Input id="checkInDateEst" type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkOutDateEst">Fecha de salida</Label>
            <Input id="checkOutDateEst" type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timeInEst">Hora de entrada</Label>
            <Input id="timeInEst" type="time" value={timeIn} onChange={(e) => setTimeIn(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeOutEst">Hora de salida</Label>
            <Input id="timeOutEst" type="time" value={timeOut} onChange={(e) => setTimeOut(e.target.value)} />
          </div>
        </div>

        <RoomSelectField
          id="roomEst"
          label="Habitacion"
          value={selectedRoom}
          rooms={rooms}
          onChange={setSelectedRoom}
        />

        <div className="space-y-2">
          <Label htmlFor="personsEst">Cantidad de personas</Label>
          <Input
            id="personsEst"
            type="number"
            min={1}
            value={String(personsCount)}
            onChange={(e) => handlePersonCount(Number(e.target.value))}
          />
        </div>

        <GuestNamesFields names={guestNames} onChange={handleGuestNameChange} idPrefix="guest-est" />

        <div className="space-y-2">
          <Label htmlFor="observationsEst">Observaciones</Label>
          <Input id="observationsEst" value={observations} onChange={(e) => setObservations(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceAccommodation">Precio del alojamiento</Label>
          <Input id="priceAccommodation" type="number" value={priceAccommodation} onChange={(e) => setPriceAccommodation(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="pickupAirport" checked={pickupAirport} onCheckedChange={(v) => setPickupAirport(Boolean(v))} />
              <Label htmlFor="pickupAirport">Recogida en Aeropuerto</Label>
            </div>
            <Input id="pickupFee" type="number" value={pickupFee} onChange={(e) => setPickupFee(e.target.value)} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="transferReturn" checked={transferReturn} onCheckedChange={(v) => setTransferReturn(Boolean(v))} />
              <Label htmlFor="transferReturn">Transfer de vuelta a Aeropuerto</Label>
            </div>
            <Input id="transferReturnFee" type="number" value={transferReturnFee} onChange={(e) => setTransferReturnFee(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="earlyCheckIn" checked={earlyCheckIn} onCheckedChange={(v) => setEarlyCheckIn(Boolean(v))} />
              <Label htmlFor="earlyCheckIn">Early check-in</Label>
            </div>
            <Input id="earlyCheckInFee" type="number" value={earlyCheckInFee} onChange={(e) => setEarlyCheckInFee(e.target.value)} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="lateCheckOut" checked={lateCheckOut} onCheckedChange={(v) => setLateCheckOut(Boolean(v))} />
              <Label htmlFor="lateCheckOut">Late checkout</Label>
            </div>
            <Input id="lateCheckOutFee" type="number" value={lateCheckOutFee} onChange={(e) => setLateCheckOutFee(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Desayunos</Label>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label htmlFor="bf1">Tipo 1 - Cantidad</Label>
              <Input id="bf1" type="number" min={0} value={String(breakfast1Count)} onChange={(e) => setBreakfast1Count(Number(e.target.value) || 0)} />
              <Input id="bf1Price" type="number" placeholder="Precio unidad" value={breakfast1Price} onChange={(e) => setBreakfast1Price(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bf2">Tipo 2 - Cantidad</Label>
              <Input id="bf2" type="number" min={0} value={String(breakfast2Count)} onChange={(e) => setBreakfast2Count(Number(e.target.value) || 0)} />
              <Input id="bf2Price" type="number" placeholder="Precio unidad" value={breakfast2Price} onChange={(e) => setBreakfast2Price(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bf3">Tipo 3 - Cantidad</Label>
              <Input id="bf3" type="number" min={0} value={String(breakfast3Count)} onChange={(e) => setBreakfast3Count(Number(e.target.value) || 0)} />
              <Input id="bf3Price" type="number" placeholder="Precio unidad" value={breakfast3Price} onChange={(e) => setBreakfast3Price(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="rounded-md border p-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Resumen de precio</p>
          <p>Total: {total.toFixed(2)}</p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleSave}>Guardar reserva</Button>
      </DialogFooter>
    </>
  );
}

export default StayReservationForm;


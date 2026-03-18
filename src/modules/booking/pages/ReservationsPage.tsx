import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ReservationCalendar } from "../components/ReservationCalendar";
import { ReservationCreateDialog } from "../components/reservations/ReservationCreateDialog";
import { ReservationStatus, type ReservationWithDetails } from "../types/types";
import type { ExampleRoom } from "../components/reservations/RoomSelectField";

const EXAMPLE_ROOMS: ExampleRoom[] = [
  { id: 1, number: "101", name: "Suite Ejecutiva", roomType: "suite_balcony" },
  { id: 2, number: "102", name: "Habitacion Doble", roomType: "double" },
  { id: 3, number: "201", name: "Terraza Superior", roomType: "terrace" },
];

const INITIAL_RESERVATIONS: ReservationWithDetails[] = [
  {
    id: 1,
    roomId: 1,
    checkInDate: new Date().toISOString(),
    checkOutDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: ReservationStatus.CONFIRMED,
    mainGuest: {
      firstName: "Juan",
      lastName: "Perez",
      email: "juan@example.com",
      phone: "123456789",
      sex: "M",
    },
    baseGuestsCount: 2,
    extraGuestsCount: 0,
    totalPrice: 150,
    earlyCheckIn: false,
    lateCheckOut: false,
    transferOneWay: false,
    transferRoundTrip: false,
    breakfasts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    room: {
      number: "101",
      name: "Suite Ejecutiva",
      roomType: "suite_balcony",
    },
  },
];

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<ReservationWithDetails[]>(INITIAL_RESERVATIONS);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const handleCreateReservation = (reservation: ReservationWithDetails) => {
    setReservations((prev) => [reservation, ...prev]);
    setOpenCreateDialog(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calendario de Reservas</h1>
        <Button onClick={() => setOpenCreateDialog(true)}>Nueva reserva</Button>
      </div>

      <ReservationCalendar
        reservations={reservations}
        onReservationClick={(reservation) => console.log("Reservation clicked:", reservation)}
      />

      <ReservationCreateDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        rooms={EXAMPLE_ROOMS}
        onCreate={handleCreateReservation}
      />
    </div>
  );
}

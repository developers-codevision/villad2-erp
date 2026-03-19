import { useChecking } from "../hooks/useChecking";
import { useReservations } from "@/modules/booking/hooks/useReservations";
import { RoomsGrid } from "../components/RoomsGrid";
import { TodaysReservations } from "../components/TodaysReservations";
import { CheckInDialog } from "../components/CheckInDialog";
import { useState } from "react";
import type { Reservation } from "@/modules/booking/types/types";

export default function Checking() {
  const { rooms, changeStatus } = useChecking();
  const { reservations, checkIn, markNoShow } = useReservations();
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const todaysReservations = Array.isArray(reservations) ? reservations.filter(
    (r) => r.checkInDate === today
  ) : [];

  const handleCheckIn = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setCheckInDialogOpen(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Checking — Estado de Habitaciones
      </h2>
      <RoomsGrid rooms={rooms} onChangeStatus={changeStatus} />
      <TodaysReservations
        reservations={todaysReservations}
        rooms={rooms}
        onCheckIn={handleCheckIn}
        onMarkNoShow={markNoShow}
      />
      <CheckInDialog
        open={checkInDialogOpen}
        onOpenChange={setCheckInDialogOpen}
        reservation={selectedReservation}
      />
    </div>
  );
}

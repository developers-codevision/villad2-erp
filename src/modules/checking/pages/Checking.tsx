import { useChecking } from "../hooks/useChecking";
import { useReservations } from "@/modules/booking/hooks/useReservations";
import { RoomsGrid } from "../components/RoomsGrid";
import { TodaysReservations } from "../components/TodaysReservations";
import { CheckInDialog } from "../components/CheckInDialog";
import { useState } from "react";
import type { Reservation } from "@/modules/booking/types/types";

export default function Checking() {
  const { rooms, changeStatus, isLoading } = useChecking();
  const today = new Date().toISOString().split("T")[0];
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split("T")[0];

const { reservations, checkIn, markNoShow } = useReservations({
  checkInDateFrom: today,
  checkInDateTo: tomorrowStr,
});
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const todaysReservations = Array.isArray(reservations) ? reservations : [];

  const handleCheckIn = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setCheckInDialogOpen(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Checking — Estado de Habitaciones
      </h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando habitaciones...</div>
        </div>
      ) : (
        <>
          <RoomsGrid rooms={rooms} onChangeStatus={changeStatus} />
          <TodaysReservations
            reservations={todaysReservations}
            rooms={rooms}
            onCheckIn={handleCheckIn}
            onMarkNoShow={markNoShow}
          />
        </>
      )}
      <CheckInDialog
        open={checkInDialogOpen}
        onOpenChange={setCheckInDialogOpen}
        reservation={selectedReservation}
        onCheckIn={checkIn}
        rooms={rooms}
      />
    </div>
  );
}

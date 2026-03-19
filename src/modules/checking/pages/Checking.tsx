import { useChecking } from "../hooks/useChecking";
import { useReservations } from "@/modules/booking/hooks/useReservations";
import { RoomsGrid } from "../components/RoomsGrid";
import { TodaysReservations } from "../components/TodaysReservations";

export default function Checking() {
  const { rooms, changeStatus } = useChecking();
  const { reservations, checkIn, markNoShow } = useReservations();

  const today = new Date().toISOString().split("T")[0];
  const todaysReservations = Array.isArray(reservations) ? reservations.filter(
    (r) => r.checkInDate === today
  ) : [];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Checking — Estado de Habitaciones
      </h2>
      <RoomsGrid rooms={rooms} onChangeStatus={changeStatus} />
      <TodaysReservations
        reservations={todaysReservations}
        rooms={rooms}
        onCheckIn={checkIn}
        onMarkNoShow={markNoShow}
      />
    </div>
  );
}

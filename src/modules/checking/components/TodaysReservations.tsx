import { Button } from "@/components/ui/button";
import type { Reservation } from "@/modules/booking/types/types";
import type { Room } from "../types/types";

interface TodaysReservationsProps {
  reservations: Reservation[];
  rooms: Room[];
  onCheckIn: (id: number) => void;
  onMarkNoShow: (id: number) => void;
}

export function TodaysReservations({
  reservations,
  rooms,
  onCheckIn,
  onMarkNoShow,
}: TodaysReservationsProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">Reservas del Día</h3>
      {reservations.length === 0 ? (
        <p>No hay reservas para hoy.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => {
            const room = rooms.find((r) => r.id === reservation.roomId);
            return (
              <div
                key={reservation.id}
                className="border rounded p-4 bg-card"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p>
                      <strong>Habitación:</strong> {room?.number || reservation.roomId}
                    </p>
                    <p>
                      <strong>Huésped:</strong> {reservation.mainGuest.firstName}{" "}
                      {reservation.mainGuest.lastName}
                    </p>
                    <p>
                      <strong>Check-in:</strong> {reservation.checkInDate}
                    </p>
                    <p>
                      <strong>Check-out:</strong> {reservation.checkOutDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => onCheckIn(reservation.id)}>Check In</Button>
                    <Button
                      variant="destructive"
                      onClick={() => onMarkNoShow(reservation.id)}
                    >
                      No Show
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

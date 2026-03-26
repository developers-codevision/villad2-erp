import { Button } from "@/components/ui/button";
import { ReservationCalendar } from "../components/ReservationCalendar";
import { ReservationCreateDialog } from "../components/reservations/ReservationCreateDialog";
import { useReservations } from "../hooks/useReservations";
import { useRooms } from "../hooks/useRooms";

export default function ReservationsPage() {
	const { reservations, dialogOpen, setDialogOpen, handleSave } = useReservations();
	const { rooms: exampleRooms } = useRooms();

	return (
		<div className="container mx-auto py-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold">Calendario de Reservas</h1>
				<Button onClick={() => setDialogOpen(true)}>Nueva reserva</Button>
			</div>

			<ReservationCalendar
				reservations={reservations}
				onReservationClick={(reservation) => console.log("Reservation clicked:", reservation)}
			/>

			<ReservationCreateDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				rooms={exampleRooms}
				onCreate={handleSave}
			/>
		</div>
	);
}

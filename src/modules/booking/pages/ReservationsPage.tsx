import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReservationCalendar } from "../components/ReservationCalendar";
import { ReservationList } from "../components/ReservationList";
import { ReservationFilters } from "../components/ReservationFilters";
import { ReservationCreateDialog } from "../components/reservations/ReservationCreateDialog";
import { useReservations } from "../hooks/useReservations";
import { useRooms } from "../hooks/useRooms";

export default function ReservationsPage() {
	const [filters, setFilters] = useState<Record<string, any>>({});
	const { reservations, dialogOpen, setDialogOpen, handleSave, openEdit, openDelete } = useReservations(filters);
	const { rooms: exampleRooms } = useRooms();

	return (
		<div className="container mx-auto py-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold">Reservas</h1>
				<Button onClick={() => setDialogOpen(true)}>Nueva reserva</Button>
			</div>

			<Tabs defaultValue="calendar" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="calendar">Calendario</TabsTrigger>
					<TabsTrigger value="list">Lista</TabsTrigger>
				</TabsList>

				<TabsContent value="calendar">
					<ReservationCalendar
						reservations={reservations}
						onReservationClick={(reservation) => console.log("Reservation clicked:", reservation)}
					/>
				</TabsContent>

				<TabsContent value="list">
					<ReservationFilters onFiltersChange={setFilters} />
					<ReservationList
						reservations={reservations}
						onEdit={openEdit}
						onDelete={openDelete}
					/>
				</TabsContent>
			</Tabs>

			<ReservationCreateDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				rooms={exampleRooms}
				onCreate={handleSave}
			/>
		</div>
	);
}

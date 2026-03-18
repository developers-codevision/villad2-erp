import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ReservationWithDetails } from "@/modules/booking/types/types";
import { HourlyReservationForm } from "./HourlyReservationForm";
import { NightlyReservationForm } from "./NightlyReservationForm";
import { StayReservationForm } from "./StayReservationForm";
import { TerraceReservationForm } from "./TerraceReservationForm";
import type { ExampleRoom } from "./RoomSelectField";

type ReservationCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rooms: ExampleRoom[];
  onCreate: (reservation: ReservationWithDetails) => void;
};

export function ReservationCreateDialog({ open, onOpenChange, rooms, onCreate }: ReservationCreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nueva reserva</DialogTitle>
          <DialogDescription>Selecciona el modo de reserva y completa los datos.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="horas" className="min-h-0">
          <TabsList>
            <TabsTrigger value="horas">Por horas</TabsTrigger>
            <TabsTrigger value="noches">Por noches</TabsTrigger>
            <TabsTrigger value="estancia">Estancia</TabsTrigger>
            <TabsTrigger value="terraza">Terraza</TabsTrigger>
          </TabsList>

          <TabsContent value="horas" className="max-h-[68vh] px-4 overflow-y-auto">
            <HourlyReservationForm
              rooms={rooms}
              onCancel={() => onOpenChange(false)}
              onCreate={onCreate}
            />
          </TabsContent>

          <TabsContent value="noches" className="max-h-[68vh] px-4  overflow-y-auto ">
            <NightlyReservationForm
              rooms={rooms}
              onCancel={() => onOpenChange(false)}
              onCreate={onCreate}
            />
          </TabsContent>

          <TabsContent value="estancia" className="max-h-[68vh] px-4  overflow-y-auto ">
            <StayReservationForm
              rooms={rooms}
              onCancel={() => onOpenChange(false)}
              onCreate={onCreate}
            />
          </TabsContent>

          <TabsContent value="terraza" className="max-h-[68vh] px-4 min-h-[68vh] overflow-y-auto ">
            <TerraceReservationForm
              onCancel={() => onOpenChange(false)}
              onCreate={onCreate}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default ReservationCreateDialog;

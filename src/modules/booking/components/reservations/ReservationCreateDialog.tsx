import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ReservationWithDetails } from "@/modules/booking/types/types";
import { HourlyReservationForm } from "./HourlyReservationForm";
import { NightlyReservationForm } from "./NightlyReservationForm";
import { StayReservationForm } from "./StayReservationForm";
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva reserva</DialogTitle>
          <DialogDescription>Selecciona el modo de reserva y completa los datos.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="horas">
          <TabsList>
            <TabsTrigger value="horas">Por horas</TabsTrigger>
            <TabsTrigger value="noches">Por noches</TabsTrigger>
            <TabsTrigger value="estancia">Estancia</TabsTrigger>
            <TabsTrigger value="terraza">Terraza</TabsTrigger>
          </TabsList>

          <TabsContent value="horas">
            <HourlyReservationForm
              rooms={rooms}
              onCancel={() => onOpenChange(false)}
              onCreate={onCreate}
            />
          </TabsContent>

          <TabsContent value="noches">
            <NightlyReservationForm
              rooms={rooms}
              onCancel={() => onOpenChange(false)}
              onCreate={onCreate}
            />
          </TabsContent>

          <TabsContent value="estancia">
            <StayReservationForm
              rooms={rooms}
              onCancel={() => onOpenChange(false)}
              onCreate={onCreate}
            />
          </TabsContent>

          <TabsContent value="terraza">
            <div className="py-6 text-sm text-muted-foreground">Modo "Terraza" pendiente de implementar.</div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default ReservationCreateDialog;


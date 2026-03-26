import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RESERVATION_STATUS_LABELS, RESERVATION_STATUS_VARIANTS, type ReservationWithDetails } from "../types/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Edit, Trash2 } from "lucide-react";

interface ReservationListProps {
  reservations: ReservationWithDetails[];
  onEdit: (reservation: ReservationWithDetails) => void;
  onDelete: (reservation: ReservationWithDetails) => void;
}

export function ReservationList({ reservations, onEdit, onDelete }: ReservationListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Reservas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Habitación</TableHead>
              <TableHead>Huésped</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.id}</TableCell>
                <TableCell>{reservation.room?.number || reservation.roomId}</TableCell>
                <TableCell>{reservation.mainGuest.firstName} {reservation.mainGuest.lastName}</TableCell>
                <TableCell>{format(new Date(reservation.checkInDate), "dd/MM/yyyy", { locale: es })}</TableCell>
                <TableCell>{format(new Date(reservation.checkOutDate), "dd/MM/yyyy", { locale: es })}</TableCell>
                <TableCell>
                  <Badge variant={RESERVATION_STATUS_VARIANTS[reservation.status]}>
                    {RESERVATION_STATUS_LABELS[reservation.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(reservation)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(reservation)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

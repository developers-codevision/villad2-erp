import { useEffect, useState } from "react";
import type { Reservation, CreateReservationDto } from "../types/types";
import { ReservationStatus } from "../types/types";
import { reservationsService } from "../services/reservationsService";

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [deleting, setDeleting] = useState<Reservation | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock data for now
      const mockReservations: Reservation[] = [
        {
          id: 1,
          roomId: 1,
          checkInDate: "2026-03-19",
          checkOutDate: "2026-03-20",
          mainGuest: {
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan@example.com",
            phone: "123456789",
            sex: "M",
          },
          baseGuestsCount: 2,
          extraGuestsCount: 0,
          totalPrice: 100,
          status: ReservationStatus.CONFIRMED,
          notes: "Mock reservation",
          earlyCheckIn: false,
          lateCheckOut: false,
          transferOneWay: false,
          transferRoundTrip: false,
          breakfasts: 0,
          createdAt: "2026-03-18T10:00:00Z",
          updatedAt: "2026-03-18T10:00:00Z",
        },
      ];
      setReservations(mockReservations);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (reservation: Reservation) => {
    setEditing(reservation);
    setDialogOpen(true);
  };

  const openDelete = (reservation: Reservation) => {
    setDeleting(reservation);
    setDeleteDialogOpen(true);
  };

  const handleSave = async (payload: CreateReservationDto | Partial<CreateReservationDto>) => {
    try {
      if (editing) {
        await reservationsService.update(editing.id, payload as Partial<CreateReservationDto>);
      } else {
        await reservationsService.create(payload as CreateReservationDto);
      }
      await load();
      setDialogOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await reservationsService.remove(deleting.id);
      await load();
      setDeleteDialogOpen(false);
      setDeleting(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const checkIn = async (id: number) => {
    try {
      await reservationsService.update(id, { status: ReservationStatus.CHECKED_IN });
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const markNoShow = async (id: number) => {
    try {
      await reservationsService.update(id, { status: ReservationStatus.NO_SHOW });
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return {
    reservations,
    loading,
    error,
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    editing,
    deleting,
    openCreate,
    openEdit,
    openDelete,
    handleSave,
    handleDelete,
    checkIn,
    markNoShow,
    reload: load,
  } as const;
}

export default useReservations;


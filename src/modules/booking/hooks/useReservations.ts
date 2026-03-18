import { useEffect, useState } from "react";
import type { Reservation, CreateReservationDto } from "../types/types";
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
      const data = await reservationsService.list();
      setReservations(data || []);
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
    reload: load,
  } as const;
}

export default useReservations;




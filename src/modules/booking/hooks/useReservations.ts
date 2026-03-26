import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { Reservation, CreateReservationDto } from "../types/types";
import { ReservationStatus } from "../types/types";
import { reservationsService } from "../services/reservationsService";

export function useReservations(query?: Record<string, string | number | boolean | undefined>) {
  const queryClient = useQueryClient();

  const { data: reservations = [], isLoading: loading, error } = useQuery({
    queryKey: ["reservations", query],
    queryFn: () => reservationsService.list(query),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateReservationDto) => reservationsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<CreateReservationDto> }) =>
      reservationsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => reservationsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });

  const checkInMutation = useMutation({
    mutationFn: (id: string | number) => reservationsService.checkIn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [deleting, setDeleting] = useState<Reservation | null>(null);

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
        await updateMutation.mutateAsync({ id: editing.id, payload });
      } else {
        await createMutation.mutateAsync(payload as CreateReservationDto);
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      setDeleteDialogOpen(false);
      setDeleting(null);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const checkIn = async (id: number) => {
    await checkInMutation.mutateAsync(id);
  };

  const markNoShow = async (id: number) => {
    await updateMutation.mutateAsync({ id, payload: { status: ReservationStatus.NO_SHOW } });
  };

  return {
    reservations,
    loading,
    error: error?.message || null,
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
    reload: queryClient.invalidateQueries.bind(queryClient, { queryKey: ["reservations"] }),
  } as const;
}

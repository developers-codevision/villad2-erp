import { useEffect, useState } from "react";
import type { Liquidation, CreateLiquidationDto } from "../types/types";
import { liquidationsService } from "../services/liquidationsService";

export function useLiquidations() {
  const [liquidations, setLiquidations] = useState<Liquidation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Liquidation | null>(null);
  const [deleting, setDeleting] = useState<Liquidation | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = await liquidationsService.list();
      if (data && typeof data === 'object' && 'data' in data) {
        data = (data as any).data;
      }
      setLiquidations(Array.isArray(data) ? data : []);
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

  const openEdit = (liquidation: Liquidation) => {
    setEditing(liquidation);
    setDialogOpen(true);
  };

  const openDelete = (liquidation: Liquidation) => {
    setDeleting(liquidation);
    setDeleteDialogOpen(true);
  };

  const handleSave = async (payload: CreateLiquidationDto | Partial<CreateLiquidationDto>) => {
    try {
      if (editing) {
        await liquidationsService.update(editing.id, payload as Partial<CreateLiquidationDto>);
      } else {
        await liquidationsService.create(payload as CreateLiquidationDto);
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
      await liquidationsService.remove(deleting.id);
      await load();
      setDeleteDialogOpen(false);
      setDeleting(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return {
    liquidations,
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

export default useLiquidations;

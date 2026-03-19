import { useEffect, useState } from "react";
import type { IPVData, CreateIPVData } from "../types/types";
import { ipvService } from "../services/ipvService";

export function useIPV() {
  const [ipvs, setIpvs] = useState<IPVData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<IPVData | null>(null);
  const [deleting, setDeleting] = useState<IPVData | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = await ipvService.list();
      if (data && typeof data === 'object' && 'data' in data) {
        data = (data as any).data;
      }
      setIpvs(Array.isArray(data) ? data : []);
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

  const openEdit = (ipv: IPVData) => {
    setEditing(ipv);
    setDialogOpen(true);
  };

  const openDelete = (ipv: IPVData) => {
    setDeleting(ipv);
    setDeleteDialogOpen(true);
  };

  const handleSave = async (payload: CreateIPVData | Partial<CreateIPVData>) => {
    try {
      if (editing) {
        await ipvService.update(editing.id, payload as Partial<CreateIPVData>);
      } else {
        await ipvService.create(payload as CreateIPVData);
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
      await ipvService.remove(deleting.id);
      await load();
      setDeleteDialogOpen(false);
      setDeleting(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return {
    ipvs,
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

export default useIPV;

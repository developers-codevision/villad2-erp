import { useEffect, useState } from "react";
import type { WorkerDTO, CreateWorkerDTO, UpdateWorkerDTO } from "@/modules/workers/types/types";
import { workersService } from "@/modules/workers/services/workersService";

export function useWorkers() {
  const [workers, setWorkers] = useState<WorkerDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WorkerDTO | null>(null);
  const [deleting, setDeleting] = useState<WorkerDTO | null>(null);
  const [formName, setFormName] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workersService.list();
      setWorkers(data || []);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormName("");
    setDialogOpen(true);
  };

  const openEdit = (w: WorkerDTO) => {
    setEditing(w);
    setFormName(w.name);
    setDialogOpen(true);
  };

  const openDelete = (w: WorkerDTO) => {
    setDeleting(w);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    try {
      if (editing) {
        await workersService.update(editing.id, {
          name: formName.trim(),
        });
      } else {
        const payload: CreateWorkerDTO = {
          name: formName.trim(),
        };
        await workersService.create(payload);
      }
      await load();
      setDialogOpen(false);
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await workersService.remove(deleting.id);
      await load();
      setDeleteDialogOpen(false);
      setDeleting(null);
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  return {
    workers,
    loading,
    error,
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    editing,
    deleting,
    formName,
    setFormName,
    openCreate,
    openEdit,
    openDelete,
    handleSave,
    handleDelete,
    reload: load,
  } as const;
}

export default useWorkers;

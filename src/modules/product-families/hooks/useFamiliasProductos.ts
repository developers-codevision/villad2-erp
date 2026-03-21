import { useEffect, useState } from "react";
import type { FamiliaProductoDTO, CreateFamiliaProductoDTO, UpdateFamiliaProductoDTO } from "@/modules/product-families/types/types";
import { familiasService } from "@/modules/product-families/services/familiasService";

export function useFamiliasProductos() {
  const [familias, setFamilias] = useState<FamiliaProductoDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FamiliaProductoDTO | null>(null);
  const [deleting, setDeleting] = useState<FamiliaProductoDTO | null>(null);
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await familiasService.list();
      setFamilias(data || []);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormName("");
    setFormCode("");
    setDialogOpen(true);
  };

  const openEdit = (f: FamiliaProductoDTO) => {
    setEditing(f);
    setFormName(f.name);
    setFormCode(String(f.code));
    setDialogOpen(true);
  };

  const openDelete = (f: FamiliaProductoDTO) => {
    setDeleting(f);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formCode.trim()) return;
    try {
      if (editing) {
        await familiasService.update(editing.id, { name: formName.trim(), code: Number(formCode) });
      } else {
        const payload: CreateFamiliaProductoDTO = { name: formName.trim(), code: Number(formCode) };
        await familiasService.create(payload);
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
      await familiasService.remove(deleting.id);
      await load();
      setDeleteDialogOpen(false);
      setDeleting(null);
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  return {
    familias,
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
    formCode,
    setFormCode,
    openCreate,
    openEdit,
    openDelete,
    handleSave,
    handleDelete,
    reload: load,
  } as const;
}

export default useFamiliasProductos;


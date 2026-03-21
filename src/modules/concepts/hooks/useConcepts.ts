import { useEffect, useState } from "react";
import type { ConceptDTO, CreateConceptDTO, UpdateConceptDTO } from "@/modules/concepts/types/types";
import { conceptsService } from "@/modules/concepts/services/conceptsService";

export function useConcepts() {
  const [concepts, setConcepts] = useState<ConceptDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ConceptDTO | null>(null);
  const [deleting, setDeleting] = useState<ConceptDTO | null>(null);
  const [formName, setFormName] = useState("");
  const [formPriceUsd, setFormPriceUsd] = useState("");
  const [formCategory, setFormCategory] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await conceptsService.list();
      setConcepts(data?.map(c => ({ ...c, priceUsd: Number(c.priceUsd) })) || []);
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
    setFormPriceUsd("");
    setFormCategory("");
    setDialogOpen(true);
  };

  const openEdit = (c: ConceptDTO) => {
    setEditing(c);
    setFormName(c.name);
    setFormPriceUsd(String(c.priceUsd));
    setFormCategory(c.category);
    setDialogOpen(true);
  };

  const openDelete = (c: ConceptDTO) => {
    setDeleting(c);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formPriceUsd.trim() || !formCategory.trim()) return;
    try {
      if (editing) {
        await conceptsService.update(editing.id, { name: formName.trim(), priceUsd: Number(formPriceUsd), category: formCategory.trim() });
      } else {
        const payload: CreateConceptDTO = { name: formName.trim(), priceUsd: Number(formPriceUsd), category: formCategory.trim() };
        await conceptsService.create(payload);
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
      await conceptsService.remove(deleting.id);
      await load();
      setDeleteDialogOpen(false);
      setDeleting(null);
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  return {
    concepts,
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
    formPriceUsd,
    setFormPriceUsd,
    formCategory,
    setFormCategory,
    openCreate,
    openEdit,
    openDelete,
    handleSave,
    handleDelete,
    reload: load,
  } as const;
}

export default useConcepts;

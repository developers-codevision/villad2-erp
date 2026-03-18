import { useEffect, useState } from "react";
import type { ProductDTO, CreateProductDTO, UpdateProductDTO } from "@/modules/products/types/types";
import { productsService } from "@/modules/products/services/productsService";

export function useProducts() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProductDTO | null>(null);
  const [deleting, setDeleting] = useState<ProductDTO | null>(null);
  const [formName, setFormName] = useState("");
  const [formFamilyId, setFormFamilyId] = useState("");
  const [formQuantity, setFormQuantity] = useState("");
  const [formUnit, setFormUnit] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsService.list();
      setProducts(data || []);
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
    setFormFamilyId("");
    setFormQuantity("");
    setFormUnit("");
    setDialogOpen(true);
  };

  const openEdit = (p: ProductDTO) => {
    setEditing(p);
    setFormName(p.name);
    setFormFamilyId(p.familyId);
    setFormQuantity(String(p.quantity));
    setFormUnit(p.unit);
    setDialogOpen(true);
  };

  const openDelete = (p: ProductDTO) => {
    setDeleting(p);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formFamilyId.trim() || !formQuantity.trim() || !formUnit.trim()) return;
    try {
      if (editing) {
        await productsService.update(editing.id, { name: formName.trim(), familyId: formFamilyId.trim(), quantity: Number(formQuantity), unit: formUnit.trim() });
      } else {
        const payload: CreateProductDTO = { name: formName.trim(), familyId: formFamilyId.trim(), quantity: Number(formQuantity), unit: formUnit.trim() };
        await productsService.create(payload);
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
      await productsService.remove(deleting.id);
      await load();
      setDeleteDialogOpen(false);
      setDeleting(null);
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  return {
    products,
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
    formFamilyId,
    setFormFamilyId,
    formQuantity,
    setFormQuantity,
    formUnit,
    setFormUnit,
    openCreate,
    openEdit,
    openDelete,
    handleSave,
    handleDelete,
    reload: load,
  } as const;
}

export default useProducts;


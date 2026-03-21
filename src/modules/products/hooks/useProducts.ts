import { useEffect, useState } from "react";
import type { ProductDTO, CreateProductDTO, UpdateProductDTO } from "@/modules/products/types/types";
import { productsService } from "@/modules/products/services/productsService";
import useFamiliasProductos from "@/modules/product-families/hooks/useFamiliasProductos.ts";

export function useProducts() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProductDTO | null>(null);
  const [deleting, setDeleting] = useState<ProductDTO | null>(null);
  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formProductFamilyId, setFormProductFamilyId] = useState("");
  const [formVolume, setFormVolume] = useState("");
  const [formUnitMeasure, setFormUnitMeasure] = useState("");

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
    setFormCode("");
    setFormName("");
    setFormProductFamilyId("");
    setFormVolume("");
    setFormUnitMeasure("");
    setDialogOpen(true);
  };

  const openEdit = (p: ProductDTO) => {
    setEditing(p);
    setFormCode(String(p.code));
    setFormName(p.name);
    setFormProductFamilyId(String(p.productFamilyId));
    setFormVolume(p.volume);
    setFormUnitMeasure(p.unitMeasure);
    setDialogOpen(true);
  };

  const openDelete = (p: ProductDTO) => {
    setDeleting(p);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formCode.trim() || !formName.trim() || !formProductFamilyId.trim() || !formUnitMeasure.trim()) return;
    try {
      if (editing) {
        await productsService.update(editing.id, { code: Number(formCode), name: formName.trim(), productFamilyId: Number(formProductFamilyId), volume: formVolume.trim(), unitMeasure: formUnitMeasure.trim() });
      } else {
        const payload: CreateProductDTO = { code: Number(formCode), name: formName.trim(), productFamilyId: Number(formProductFamilyId), volume: formVolume.trim(), unitMeasure: formUnitMeasure.trim() };
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
    formCode,
    setFormCode,
    formName,
    setFormName,
    formProductFamilyId,
    setFormProductFamilyId,
    formVolume,
    setFormVolume,
    formUnitMeasure,
    setFormUnitMeasure,
    openCreate,
    openEdit,
    openDelete,
    handleSave,
    handleDelete,
    reload: load,
  } as const;
}

export default useProducts;


import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import type { ProductDTO } from "@/modules/products/types/types";
import { useProducts } from "@/modules/products/hooks/useProducts";
import { getFamilias } from "@/modules/product-families/api/familiasProducto";
import type { FamiliaProductoDTO } from "@/modules/product-families/types/types";

export default function ProductsPage() {
  const {
    products,
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
  } = useProducts();

  const [familias, setFamilias] = useState<FamiliaProductoDTO[]>([]);

  // load familias on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getFamilias();
        if (!mounted) return;
        setFamilias(data || []);
      } catch (err) {
        // ignore for now
      }
    })();
    return () => {
      mounted = false;
    };
  }, [setFamilias]);

  // map id -> familia
  const familiaMap = useMemo(() => {
    const m = new Map<string, FamiliaProductoDTO>();
    const list: FamiliaProductoDTO[] = Array.isArray(familias) ? familias : [];
    for (const f of list) m.set(f.id, f);
    return m;
  }, [familias]);

  // Helper to show familia name
  const familiaName = (id: string) => familiaMap.get(id)?.name || id;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Productos</h2>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Familia</TableHead>
              <TableHead className="w-24">Cant.</TableHead>
              <TableHead className="w-24">Unidad</TableHead>
              <TableHead className="w-28 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p: ProductDTO) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell className="font-mono">{familiaName(p.familyId)}</TableCell>
                <TableCell className="font-mono font-semibold">{p.quantity}</TableCell>
                <TableCell>{p.unit}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDelete(p)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No hay productos registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
            <DialogDescription>{editing ? "Modifica los datos del producto." : "Ingresa los datos del nuevo producto."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ej: Café" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="family">Familia</Label>
              <Select onValueChange={(v) => setFormFamilyId(v)} value={formFamilyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una familia" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(familias) && familias.length > 0 ? (
                    familias.map((f: FamiliaProductoDTO) => (
                      <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem key="none" value="">No hay familias</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input id="quantity" type="number" value={formQuantity} onChange={(e) => setFormQuantity(e.target.value)} placeholder="Ej: 10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unidad</Label>
                <Input id="unit" value={formUnit} onChange={(e) => setFormUnit(e.target.value)} placeholder="Ej: kg" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Producto</DialogTitle>
            <DialogDescription>¿Estás seguro de eliminar <strong>{deleting?.name}</strong>? Esta acción no se puede deshacer.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

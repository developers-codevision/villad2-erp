import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";

interface FamiliaProducto {
  id: string;
  name: string;
  code: number;
}

const initialData: FamiliaProducto[] = [
  { id: "fp1", name: "Bebidas", code: 1 },
  { id: "fp2", name: "Snacks", code: 2 },
  { id: "fp3", name: "Licores", code: 3 },
  { id: "fp4", name: "Alimentos", code: 4 },
  { id: "fp5", name: "Amenidades", code: 5 },
];

export default function FamiliasProductos() {
  const [familias, setFamilias] = useState<FamiliaProducto[]>(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FamiliaProducto | null>(null);
  const [deleting, setDeleting] = useState<FamiliaProducto | null>(null);
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");

  const openCreate = () => {
    setEditing(null);
    setFormName("");
    setFormCode("");
    setDialogOpen(true);
  };

  const openEdit = (f: FamiliaProducto) => {
    setEditing(f);
    setFormName(f.name);
    setFormCode(String(f.code));
    setDialogOpen(true);
  };

  const openDelete = (f: FamiliaProducto) => {
    setDeleting(f);
    setDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formCode.trim()) return;
    if (editing) {
      setFamilias((prev) =>
        prev.map((f) =>
          f.id === editing.id ? { ...f, name: formName.trim(), code: Number(formCode) } : f
        )
      );
    } else {
      setFamilias((prev) => [
        ...prev,
        { id: `fp-${Date.now()}`, name: formName.trim(), code: Number(formCode) },
      ]);
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleting) {
      setFamilias((prev) => prev.filter((f) => f.id !== deleting.id));
    }
    setDeleteDialogOpen(false);
    setDeleting(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Familias de Productos</h2>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Familia
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="w-28 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {familias.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-mono font-semibold">{f.code}</TableCell>
                <TableCell>{f.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(f)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDelete(f)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {familias.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  No hay familias registradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Familia" : "Nueva Familia"}</DialogTitle>
            <DialogDescription>
              {editing ? "Modifica los datos de la familia de productos." : "Ingresa los datos de la nueva familia."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                type="number"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                placeholder="Ej: 1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ej: Bebidas"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Familia</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar <strong>{deleting?.name}</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
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

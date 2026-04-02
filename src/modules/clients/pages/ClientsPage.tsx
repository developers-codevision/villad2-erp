import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import type { ClientDTO } from "@/modules/clients/types/types";
import { useClients } from "@/modules/clients/hooks/useClients";

export default function ClientsPage() {
  const {
    clients,
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    editing,
    deleting,
    formName,
    setFormName,
    formLastName,
    setFormLastName,
    formCiOrPassport,
    setFormCiOrPassport,
    formBirthDate,
    setFormBirthDate,
    formPhone,
    setFormPhone,
    formObservations,
    setFormObservations,
    openCreate,
    openEdit,
    openDelete,
    handleSave,
    handleDelete,
  } = useClients();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Clientes</h2>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellidos</TableHead>
              <TableHead>CI/Pasaporte</TableHead>
              <TableHead>Fecha Nacimiento</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Observaciones</TableHead>
              <TableHead className="w-28 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(clients) && clients.map((c: ClientDTO) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.lastName}</TableCell>
                <TableCell className="font-mono">{c.ciOrPassport}</TableCell>
                <TableCell>{c.birthDate}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell className="max-w-xs truncate">{c.observations}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDelete(c)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!clients || clients.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No hay clientes registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
            <DialogDescription>{editing ? "Modifica los datos del cliente." : "Ingresa los datos del nuevo cliente."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ej: Juan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellidos</Label>
                <Input id="lastName" value={formLastName} onChange={(e) => setFormLastName(e.target.value)} placeholder="Ej: Pérez" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ciOrPassport">CI o Pasaporte</Label>
                <Input id="ciOrPassport" value={formCiOrPassport} onChange={(e) => setFormCiOrPassport(e.target.value)} placeholder="Ej: 12345678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                <Input id="birthDate" type="date" value={formBirthDate} onChange={(e) => setFormBirthDate(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="Ej: +53 12345678" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea id="observations" value={formObservations} onChange={(e) => setFormObservations(e.target.value)} placeholder="Observaciones adicionales..." />
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
            <DialogTitle>Eliminar Cliente</DialogTitle>
            <DialogDescription>¿Estás seguro de eliminar <strong>{deleting?.name} {deleting?.lastName}</strong>? Esta acción no se puede deshacer.</DialogDescription>
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

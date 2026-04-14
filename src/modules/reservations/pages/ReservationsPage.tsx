import { Plus, Pencil, Trash2, Search } from "lucide-react";
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
import type { ReservationDTO } from "@/modules/reservations/types/types";
import { useReservations } from "@/modules/reservations/hooks/useReservations";

export default function ReservationsPage() {
  const {
    filteredReservations,
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    editing,
    deleting,
    formClientNumber,
    setFormClientNumber,
    formName,
    setFormName,
    formLastName,
    setFormLastName,
    formCiOrPassport,
    setFormCiOrPassport,
    formNationality,
    setFormNationality,
    formBirthDate,
    setFormBirthDate,
    formCheckInDate,
    setFormCheckInDate,
    formCheckOutDate,
    setFormCheckOutDate,
    formCheckInTime,
    setFormCheckInTime,
    formCheckOutTime,
    setFormCheckOutTime,
    formStayHours,
    setFormStayHours,
    formPhone,
    setFormPhone,
    formRoom,
    setFormRoom,
    formObservations,
    setFormObservations,
    formInvoiceNumber,
    setFormInvoiceNumber,
    formCupAmount,
    setFormCupAmount,
    filterName,
    setFilterName,
    filterCheckInFrom,
    setFilterCheckInFrom,
    filterCheckInTo,
    setFilterCheckInTo,
    openCreate,
    openEdit,
    openDelete,
    handleSave,
    handleDelete,
  } = useReservations();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Reservaciones</h2>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Reservación
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-4 mb-4">
          <Search className="h-5 w-5" />
          <span className="font-medium">Filtros</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filterName">Nombre o Apellidos</Label>
            <Input
              id="filterName"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder=""
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filterCheckInFrom">Fecha Check-in Desde</Label>
            <Input
              id="filterCheckInFrom"
              type="date"
              value={filterCheckInFrom}
              onChange={(e) => setFilterCheckInFrom(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filterCheckInTo">Fecha Check-in Hasta</Label>
            <Input
              id="filterCheckInTo"
              type="date"
              value={filterCheckInTo}
              onChange={(e) => setFilterCheckInTo(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Cliente</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellidos</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Habitación</TableHead>
              <TableHead className="w-28 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.map((r: ReservationDTO) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono">{r.clientNumber}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.lastName}</TableCell>
                <TableCell>{r.checkInDate}</TableCell>
                <TableCell>{r.room}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDelete(r)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredReservations.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No hay reservaciones registradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Reservación" : "Nueva Reservación"}</DialogTitle>
            <DialogDescription>{editing ? "Modifica los datos de la reservación." : "Ingresa los datos de la nueva reservación."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientNumber">N° Cliente</Label>
                <Input id="clientNumber" value={formClientNumber} onChange={(e) => setFormClientNumber(e.target.value)} placeholder="" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellidos</Label>
                <Input id="lastName" value={formLastName} onChange={(e) => setFormLastName(e.target.value)} placeholder="" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ciOrPassport">CI o Pasaporte</Label>
                <Input id="ciOrPassport" value={formCiOrPassport} onChange={(e) => setFormCiOrPassport(e.target.value)} placeholder="" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nationality">Nacionalidad</Label>
                <Input id="nationality" value={formNationality} onChange={(e) => setFormNationality(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                <Input id="birthDate" type="date" value={formBirthDate} onChange={(e) => setFormBirthDate(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkInDate">Fecha de Entrada</Label>
                <Input id="checkInDate" type="date" value={formCheckInDate} onChange={(e) => setFormCheckInDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOutDate">Fecha de Salida</Label>
                <Input id="checkOutDate" type="date" value={formCheckOutDate} onChange={(e) => setFormCheckOutDate(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkInTime">Hora de Entrada</Label>
                <Input id="checkInTime" type="time" value={formCheckInTime} onChange={(e) => setFormCheckInTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOutTime">Hora de Salida</Label>
                <Input id="checkOutTime" type="time" value={formCheckOutTime} onChange={(e) => setFormCheckOutTime(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stayHours">Horas de Estancia</Label>
                <Input id="stayHours" type="number" value={formStayHours} onChange={(e) => setFormStayHours(e.target.value)} placeholder="" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room">Habitación</Label>
                <Input id="room" value={formRoom} onChange={(e) => setFormRoom(e.target.value)} placeholder="" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Factura</Label>
                <Input id="invoiceNumber" value={formInvoiceNumber} onChange={(e) => setFormInvoiceNumber(e.target.value)} placeholder="" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cupAmount">Importe CUP</Label>
                <Input id="cupAmount" type="number" step="0.01" value={formCupAmount} onChange={(e) => setFormCupAmount(e.target.value)} placeholder="" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea id="observations" value={formObservations} onChange={(e) => setFormObservations(e.target.value)} placeholder="" />
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
            <DialogTitle>Eliminar Reservación</DialogTitle>
            <DialogDescription>¿Estás seguro de eliminar la reservación de <strong>{deleting?.name} {deleting?.lastName}</strong>? Esta acción no se puede deshacer.</DialogDescription>
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

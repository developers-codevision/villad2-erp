import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Reservation } from "@/modules/booking/types/types";

interface CheckInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation | null;
  onCheckIn: (id: number) => void;
}

export function CheckInDialog({ open, onOpenChange, reservation, onCheckIn }: CheckInDialogProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    ciOrPassport: "",
    nationality: "",
    birthDate: "",
    checkInDate: "",
    checkOutDate: "",
    checkInTime: "",
    checkOutTime: "",
    stayHours: "",
    phone: "",
    room: "",
    observations: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can handle the check-in logic
    console.log("Check-in data:", formData);
    onCheckIn(reservation?.id as number); // Assuming reservation.id is the identifier needed
    onOpenChange(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Check-in</DialogTitle>
          <DialogDescription>
            Completa los datos del huésped para el check-in.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="Nombre"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Apellidos</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Apellidos"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ciOrPassport">CI o Pasaporte</Label>
              <Input
                id="ciOrPassport"
                value={formData.ciOrPassport}
                onChange={(e) => handleChange("ciOrPassport", e.target.value)}
                placeholder="CI o Pasaporte"
              />
            </div>
            <div>
              <Label htmlFor="nationality">Nacionalidad</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleChange("nationality", e.target.value)}
                placeholder="Nacionalidad"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="birthDate">Fecha de nacimiento</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkInDate">Fecha de entrada</Label>
              <Input
                id="checkInDate"
                type="date"
                value={formData.checkInDate}
                onChange={(e) => handleChange("checkInDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="checkOutDate">Fecha de salida</Label>
              <Input
                id="checkOutDate"
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => handleChange("checkOutDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkInTime">Hora de entrada</Label>
              <Input
                id="checkInTime"
                type="time"
                value={formData.checkInTime}
                onChange={(e) => handleChange("checkInTime", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="checkOutTime">Hora de salida</Label>
              <Input
                id="checkOutTime"
                type="time"
                value={formData.checkOutTime}
                onChange={(e) => handleChange("checkOutTime", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stayHours">Horas de estancia</Label>
              <Input
                id="stayHours"
                type="number"
                value={formData.stayHours}
                onChange={(e) => handleChange("stayHours", e.target.value)}
                placeholder="Horas"
              />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Teléfono"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="room">Habitación</Label>
            <Input
              id="room"
              value={formData.room}
              onChange={(e) => handleChange("room", e.target.value)}
              placeholder="Habitación"
            />
          </div>

          <div>
            <Label htmlFor="observations">Observaciones</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleChange("observations", e.target.value)}
              placeholder="Observaciones"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Confirmar Check-in</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

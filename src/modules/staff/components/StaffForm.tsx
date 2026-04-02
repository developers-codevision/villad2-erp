// Staff Form Component - Form for creating/editing staff

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Staff, CreateStaffDTO, UpdateStaffDTO } from '../types/types';

interface StaffFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingStaff: Staff | null;
  onSubmit: (data: CreateStaffDTO | UpdateStaffDTO) => void;
  loading?: boolean;
}

export function StaffForm({
  open,
  onOpenChange,
  editingStaff,
  onSubmit,
  loading
}: StaffFormProps) {
  const [staffname, setStaffname] = useState('');

  useEffect(() => {
    if (editingStaff) {
      setStaffname(editingStaff.staffname);
    } else {
      setStaffname('');
    }
  }, [editingStaff, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!staffname.trim()) {
      alert('El nombre del staff es requerido');
      return;
    }

    onSubmit({ staffname: staffname.trim() });
    if (!editingStaff) {
      setStaffname('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingStaff ? 'Editar Staff' : 'Crear Nuevo Staff'}
          </DialogTitle>
          <DialogDescription>
            {editingStaff
              ? 'Modifica los datos del staff seleccionado.'
              : 'Ingresa los datos del nuevo staff.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staffname">Nombre del Staff *</Label>
            <Input
              id="staffname"
              type="text"
              value={staffname}
              onChange={(e) => setStaffname(e.target.value)}
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : editingStaff ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

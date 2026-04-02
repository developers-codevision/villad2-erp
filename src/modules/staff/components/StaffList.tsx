// Staff List Component - Display all staffs in a table

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Staff } from "../types/types";
import { Edit, Trash2 } from "lucide-react";

interface StaffListProps {
  staffs: Staff[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onEdit: (staff: Staff) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export function StaffList({
  staffs,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  loading
}: StaffListProps) {
  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Cargando staffs...</div>;
  }

  if (staffs.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No hay staffs registrados. Crea uno nuevo.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Fecha de Creación</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffs.map((staff) => (
            <TableRow
              key={staff.id}
              className={selectedId === staff.id ? 'bg-muted' : ''}
            >
              <TableCell className="font-medium">
                {staff.id}
                {selectedId === staff.id && (
                  <Badge variant="secondary" className="ml-2">
                    Seleccionado
                  </Badge>
                )}
              </TableCell>
              <TableCell>{staff.staffname}</TableCell>
              <TableCell>{new Date(staff.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(staff)}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm('¿Seguro que deseas eliminar este staff?')) {
                        onDelete(staff.id);
                      }
                    }}
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

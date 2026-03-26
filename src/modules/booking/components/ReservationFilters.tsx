import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReservationStatus } from "../types/types";

interface ReservationFiltersProps {
  onFiltersChange: (filters: {
    status?: ReservationStatus;
    checkInDateFrom?: string;
    checkInDateTo?: string;
    clientName?: string;
  }) => void;
}

export function ReservationFilters({ onFiltersChange }: ReservationFiltersProps) {
  const [filters, setFilters] = useState({
    status: "all",
    checkInDateFrom: "",
    checkInDateTo: "",
    clientName: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange({
      ...newFilters,
      status: newFilters.status === "all" ? undefined : newFilters.status as ReservationStatus || undefined,
      checkInDateFrom: newFilters.checkInDateFrom || undefined,
      checkInDateTo: newFilters.checkInDateTo || undefined,
      clientName: newFilters.clientName || undefined,
    });
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      checkInDateFrom: "",
      checkInDateTo: "",
      clientName: "",
    });
    onFiltersChange({});
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="status">Estado</Label>
        <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value={ReservationStatus.PENDING}>Pendiente</SelectItem>
            <SelectItem value={ReservationStatus.CONFIRMED}>Confirmada</SelectItem>
            <SelectItem value={ReservationStatus.CANCELLED}>Cancelada</SelectItem>
            <SelectItem value={ReservationStatus.FINISHED}>Terminada</SelectItem>
            <SelectItem value={ReservationStatus.CHECKED_IN}>Check-in</SelectItem>
            <SelectItem value={ReservationStatus.NO_SHOW}>No Show</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="checkInDateFrom">Check-in desde</Label>
        <Input
          id="checkInDateFrom"
          type="date"
          value={filters.checkInDateFrom}
          onChange={(e) => handleFilterChange("checkInDateFrom", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="checkInDateTo">Check-in hasta</Label>
        <Input
          id="checkInDateTo"
          type="date"
          value={filters.checkInDateTo}
          onChange={(e) => handleFilterChange("checkInDateTo", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="clientName">Nombre del cliente</Label>
        <Input
          id="clientName"
          value={filters.clientName}
          onChange={(e) => handleFilterChange("clientName", e.target.value)}
          placeholder="Buscar por nombre"
        />
      </div>

      <div className="flex items-end">
        <Button variant="outline" onClick={clearFilters}>
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
}

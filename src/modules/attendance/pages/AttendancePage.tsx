import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { WorkerAttendance } from "@/modules/attendance/types/types";
import { useAttendance } from "@/modules/attendance/hooks/useAttendance";

export default function AttendancePage() {
  const {
    workers,
    loading,
    error,
    selectedDate,
    handleDateChange,
    toggleAttendance,
    handleSave,
  } = useAttendance();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Asistencia</h2>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="mr-2 h-4 w-4" /> Guardar
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Fecha</Label>
        <Input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-red-500">{error}</div>
      )}

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trabajador</TableHead>
              <TableHead>Asistió</TableHead>
              <TableHead>Hora de Asistencia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workers.map((w: WorkerAttendance) => (
              <TableRow key={w.workerId}>
                <TableCell>{w.workerName}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={!!w.checkInTime}
                    onCheckedChange={() => toggleAttendance(w.workerId)}
                  />
                </TableCell>
                <TableCell>{w.checkInTime || '-'}</TableCell>
              </TableRow>
            ))}
            {workers.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  No hay trabajadores registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

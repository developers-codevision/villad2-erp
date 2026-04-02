// Distribution Modal Component - Modal for distributing tips/tax among workers

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { WorkerInputDto } from '../types/types';
import { staffService } from '@/modules/staff/services/staffService';

interface DistributionModalProps {
  open: boolean;
  onClose: () => void;
  recordId: number;
  amount: number;
  type: 'tips' | 'tax10';
  onDistribute: (recordId: number, workers: WorkerInputDto[]) => void;
}

export function DistributionModal({
  open,
  onClose,
  recordId,
  amount,
  type,
  onDistribute
}: DistributionModalProps) {
  const [workers, setWorkers] = useState<WorkerInputDto[]>([]);
  const [availableWorkers, setAvailableWorkers] = useState<Array<{id: number, staffname: string}>>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);

  useEffect(() => {
    if (open) {
      loadWorkers();
      setWorkers([]); // Reset workers when modal opens
    }
  }, [open]);

  const loadWorkers = async () => {
    setLoadingWorkers(true);
    try {
      const data = await staffService.getAllStaffs();
      setAvailableWorkers(data.map(w => ({ id: w.id, staffname: w.staffname })));
    } catch (error) {
      console.error('Error loading workers:', error);
    } finally {
      setLoadingWorkers(false);
    }
  };

  const addWorker = (workerId: number, workerName: string) => {
    if (!workers.find(w => w.workerId === workerId)) {
      setWorkers(prev => [...prev, { workerId, workerName, percentage: 0 }]);
    }
  };

  const removeWorker = (workerId: number) => {
    setWorkers(prev => prev.filter(w => w.workerId !== workerId));
  };

  const updatePercentage = (workerId: number, percentage: number) => {
    setWorkers(prev => prev.map(w =>
      w.workerId === workerId ? { ...w, percentage } : w
    ));
  };

  const getTotalPercentage = () => {
    return workers.reduce((sum, w) => sum + w.percentage, 0);
  };

  const handleSubmit = () => {
    if (workers.length === 0) {
      alert('Debe seleccionar al menos un trabajador');
      return;
    }

    const totalPercentage = getTotalPercentage();
    if (totalPercentage !== 100) {
      alert('El porcentaje total debe ser 100%');
      return;
    }

    onDistribute(recordId, workers);

    onClose();
  };

  const distributeEvenly = () => {
    if (workers.length === 0) return;

    const evenPercentage = Math.floor(100 / workers.length);
    const remainder = 100 % workers.length;

    setWorkers(prev => prev.map((w, index) => ({
      ...w,
      percentage: evenPercentage + (index < remainder ? 1 : 0)
    })));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Distribuir {type === 'tips' ? 'Propinas' : 'Impuesto 10%'}
          </DialogTitle>
          <DialogDescription>
            Selecciona los trabajadores y asigna porcentajes para distribuir ${amount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Available Workers */}
          <div>
            <Label className="text-sm font-medium">Trabajadores Disponibles</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {loadingWorkers ? (
                <div className="text-sm text-muted-foreground">Cargando...</div>
              ) : (
                availableWorkers.map(worker => {
                  const isSelected = workers.some(w => w.workerId === worker.id);
                  return (
                    <Button
                      key={worker.id}
                      size="sm"
                      variant={isSelected ? "secondary" : "outline"}
                      onClick={() => isSelected
                        ? removeWorker(worker.id)
                        : addWorker(worker.id, worker.staffname)
                      }
                    >
                      {worker.staffname}
                    </Button>
                  );
                })
              )}
            </div>
          </div>

          {/* Selected Workers */}
          {workers.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Trabajadores Seleccionados</Label>
                <Button size="sm" variant="outline" onClick={distributeEvenly}>
                  Distribuir Igualmente
                </Button>
              </div>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trabajador</TableHead>
                      <TableHead className="w-32">Porcentaje</TableHead>
                      <TableHead className="w-32">Monto</TableHead>
                      <TableHead className="w-20">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workers.map(worker => (
                      <TableRow key={worker.workerId}>
                        <TableCell>{worker.workerName}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={worker.percentage}
                            onChange={(e) => updatePercentage(worker.workerId, Number(e.target.value))}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          ${(amount * worker.percentage / 100).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeWorker(worker.workerId)}
                          >
                            ✕
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span>Total porcentaje: <Badge variant={getTotalPercentage() === 100 ? "default" : "destructive"}>
                  {getTotalPercentage()}%
                </Badge></span>
                <span>Total distribuido: ${workers.reduce((sum, w) => sum + (amount * w.percentage / 100), 0).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onClose()}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={workers.length === 0 || getTotalPercentage() !== 100}
          >
            Distribuir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

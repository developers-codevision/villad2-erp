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
import type { BillingRecord, PaymentInputDto } from "../types/types";
import { Trash2, TrendingUp, CreditCard } from "lucide-react";
import { DistributionModal } from "./DistributionModal";
import { MixedPaymentModal } from "./MixedPaymentModal";
import { useState } from "react";
import type { WorkerInputDto } from "../types/types";

interface BillingRecordsListProps {
  records: BillingRecord[];
  onDelete: (id: number) => void;
  onDistributeTips?: (recordId: number, workers: WorkerInputDto[]) => void;
  onDistributeTax10?: (recordId: number, workers: WorkerInputDto[]) => void;
  onProcessMixedPayments?: (recordId: number, payments: PaymentInputDto[], useAdvanceBalance: boolean) => void;
  loading?: boolean;
}

export function BillingRecordsList({ 
  records, 
  onDelete,
  onDistributeTips,
  onDistributeTax10,
  onProcessMixedPayments,
  loading 
}: BillingRecordsListProps) {
  const [distributionModal, setDistributionModal] = useState<{
    open: boolean;
    recordId: number;
    amount: number;
    type: 'tips' | 'tax10';
  }>({
    open: false,
    recordId: 0,
    amount: 0,
    type: 'tips'
  });

  const [mixedPaymentModal, setMixedPaymentModal] = useState<{
    open: boolean;
    recordId: number;
    totalAmount: number;
  }>({
    open: false,
    recordId: 0,
    totalAmount: 0,
  });

  // Ensure records is always an array
  const safeRecords = Array.isArray(records) ? records : [];

  const handleDistributeTips = (recordId: number) => {
    const record = safeRecords.find(r => r.id === recordId);
    if (record && record.tip > 0) {
      setDistributionModal({
        open: true,
        recordId,
        amount: Number(record.tip || 0),
        type: 'tips'
      });
    }
  };

  const handleDistributeTax10 = (recordId: number) => {
    const record = safeRecords.find(r => r.id === recordId);
    if (record && record.tax10Percent > 0) {
      setDistributionModal({
        open: true,
        recordId,
        amount: Number(record.tax10Percent || 0),
        type: 'tax10'
      });
    }
  };

  const handleModalClose = () => {
    setDistributionModal(prev => ({ ...prev, open: false }));
  };

  const handleDistribute = (recordId: number, workers: WorkerInputDto[]) => {
    if (distributionModal.type === 'tips' && onDistributeTips) {
      onDistributeTips(recordId, workers);
    } else if (distributionModal.type === 'tax10' && onDistributeTax10) {
      onDistributeTax10(recordId, workers);
    }
  };

  const handleOpenMixedPayment = (recordId: number) => {
    const record = safeRecords.find(r => r.id === recordId);
    if (record) {
      setMixedPaymentModal({
        open: true,
        recordId,
        totalAmount: Number(record.totalAmount || 0),
      });
    }
  };

  const handleProcessMixedPayments = (
    recordId: number,
    payments: PaymentInputDto[],
    useAdvanceBalance: boolean
  ) => {
    if (onProcessMixedPayments) {
      onProcessMixedPayments(recordId, payments, useAdvanceBalance);
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Cargando registros...</div>;
  }

  if (safeRecords.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No hay registros de pago para esta facturación.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Total Pagado</TableHead>
            <TableHead className="text-right">Total Cuenta</TableHead>
            <TableHead className="text-right">Vuelto</TableHead>
            <TableHead className="text-right">Propina</TableHead>
            <TableHead className="text-right">10%</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.id}</TableCell>
              <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                ${Number(record.totalPaid || 0).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                ${Number(record.totalAmount || 0).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                ${Number(record.change || 0).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                ${Number(record.tip || 0).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                ${Number(record.tax10Percent || 0).toFixed(2)}
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  {onProcessMixedPayments && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleOpenMixedPayment(record.id)}
                      title="Procesar pagos mixtos"
                    >
                      <CreditCard className="h-4 w-4 mr-1" />
                      Pagar
                    </Button>
                  )}
                  {onDistributeTips && record.tip > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDistributeTips(record.id)}
                      title="Distribuir propinas"
                    >
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Tips
                    </Button>
                  )}
                  {onDistributeTax10 && record.tax10Percent > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDistributeTax10(record.id)}
                      title="Distribuir 10%"
                    >
                      <TrendingUp className="h-4 w-4 mr-1" />
                      10%
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm('¿Seguro que deseas eliminar este registro?')) {
                        onDelete(record.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {distributionModal.open && (
        <DistributionModal
          open={distributionModal.open}
          onClose={handleModalClose}
          recordId={distributionModal.recordId}
          amount={distributionModal.amount}
          type={distributionModal.type}
          onDistribute={handleDistribute}
        />
      )}
      {mixedPaymentModal.open && (
        <MixedPaymentModal
          open={mixedPaymentModal.open}
          onOpenChange={(open) => setMixedPaymentModal(prev => ({ ...prev, open }))}
          billingRecordId={mixedPaymentModal.recordId}
          totalAmount={mixedPaymentModal.totalAmount}
          onProcessPayment={handleProcessMixedPayments}
        />
      )}
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { BillingRecordDto } from "../../types/types";
import React from "react";
import { useDeleteBillingRecord } from "../../hooks/useBilling";

interface RecordRowProps {
  record: BillingRecordDto;
  isExpanded: boolean;
  onToggle: () => void;
}

const formatNumber = (value: number | string | undefined): string => {
  const num = Number(value);
  return isNaN(num) ? "0.00" : num.toFixed(2);
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge className="bg-green-600">Pagado</Badge>;
    case "pending":
      return <Badge className="bg-red-600">Pendiente</Badge>;
    case "partial":
      return <Badge className="bg-yellow-600">Parcial</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

/**
 * Componente UI puro para fila de tabla de registros
 * Muestra información colapsable del registro
 */
export function RecordRow({ record, isExpanded, onToggle }: RecordRowProps) {
  const deleteRecord = useDeleteBillingRecord();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`¿Eliminar registro #${record.id}? Esta acción no se puede deshacer.`)) return;
    deleteRecord.mutate(record.id);
  };
  return (
    <>
      <div
        className="cursor-pointer hover:bg-muted/50 flex items-center gap-2 px-4 py-3 border-b"
        onClick={onToggle}
      >
        <span className="w-8 text-center text-muted-foreground">
          {isExpanded ? "▼" : "▶"}
        </span>
        <span className="w-20 font-mono text-sm">#{record.id}</span>
        <span className="flex-1 text-sm">{formatDate(record.date || record.createdAt)}</span>
        <span className="w-24 font-mono font-semibold text-right">${formatNumber(record.totalAmount)}</span>
        <span className="w-24 font-mono text-right">
          {Number(record.tip) > 0 ? (
            <span className="text-green-600">${formatNumber(record.tip)}</span>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </span>
        <span className="w-24 font-mono text-right">
          {Number(record.tax10Percent) > 0 ? (
            <span className="text-blue-600">${formatNumber(record.tax10Percent)}</span>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </span>
        <span className="w-32 font-mono font-bold text-primary text-right">
          ${formatNumber(record.grandTotal)}
        </span>
        <span className="w-24">{getPaymentStatusBadge(record.paymentStatus)}</span>
        <span className="w-24 font-mono text-right">
          {Number(record.pendingAmount) > 0 ? (
            <span className="text-red-600">${formatNumber(record.pendingAmount)}</span>
          ) : (
            <span className="text-green-600">-</span>
          )}
        </span>
        <span className="w-24 text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleteRecord.isLoading}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </span>
      </div>
    </>
  );
}


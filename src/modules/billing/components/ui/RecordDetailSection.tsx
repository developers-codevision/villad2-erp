import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign } from "lucide-react";
import type { BillingRecordDto } from "../types/types";
import React from "react";

interface RecordDetailSectionProps {
  record: BillingRecordDto;
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

/**
 * Componente UI puro que muestra detalles expandidos de un registro de facturación
 */
export function RecordDetailSection({ record }: RecordDetailSectionProps) {
  return (
    <div className="space-y-4 p-4 bg-muted/20">
      {/* Summary Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Saldo Adelantado</p>
          <p className="text-sm font-semibold">${formatNumber(record.advanceBalance)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Fuente</p>
          <p className="text-sm font-semibold capitalize">{record.conceptSource || "-"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Habitación</p>
          <p className="text-sm font-semibold">{record.roomNumber || "-"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Reserva ID</p>
          <p className="text-sm font-semibold">{record.reservationId || "-"}</p>
        </div>
      </div>

      {/* Flags Section */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant={record.isParked ? "destructive" : "outline"}>
          {record.isParked ? "Estacionado" : "No Estacionado"}
        </Badge>
        <Badge variant={record.lateBilling ? "destructive" : "outline"}>
          {record.lateBilling ? "Facturación Diferida" : "Facturación Inmediata"}
        </Badge>
        <Badge variant={record.pendingConsumption ? "destructive" : "outline"}>
          {record.pendingConsumption ? "Consumo Pendiente" : "Sin Consumo Pendiente"}
        </Badge>
      </div>

      {/* Payments Section */}
      {record.payments && record.payments.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Pagos ({record.payments.length})
          </h4>
          <div className="space-y-2">
            {record.payments.map((payment, idx) => (
              <div key={payment.id || idx} className="bg-background rounded p-3 border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Método</p>
                    <p className="font-semibold capitalize">{payment.paymentMethod.replace(/_/g, " ")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Moneda</p>
                    <p className="font-semibold">{payment.currency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Monto</p>
                    <p className="font-semibold">{payment.currency} {formatNumber(payment.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">En USD</p>
                    <p className="font-semibold">USD {formatNumber(payment.amountInUsd)}</p>
                  </div>
                  {payment.exchangeRate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Tasa</p>
                      <p className="font-semibold">{payment.exchangeRate}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha</p>
                    <p className="font-semibold text-xs">{formatDate(payment.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bill Denominations */}
      {record.payments?.some(p => p.billDenominations?.length) && (
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Denominaciones de Billetes
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {record.payments?.map((payment) =>
              payment.billDenominations?.map((denom, idx) => (
                <div key={`${payment.id}-${idx}`} className="bg-background rounded p-2 border text-sm">
                  <span className="font-semibold">{denom.quantity}x {denom.currency} {denom.value}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}


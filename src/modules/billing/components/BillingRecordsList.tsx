import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ChevronDown, ChevronRight, DollarSign, CreditCard } from "lucide-react";
import type { BillingRecordDto } from "../types/types";

interface BillingRecordsListProps {
  records: BillingRecordDto[];
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

export function BillingRecordsList({ records }: BillingRecordsListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Registros de Facturación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay registros de facturación para esta hoja.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Registros de Facturación ({records.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Propina</TableHead>
                <TableHead>Impuesto</TableHead>
                <TableHead>Gran Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Pendiente</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <>
                  <TableRow
                    key={`row-${record.id}`}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                  >
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(expandedId === record.id ? null : record.id);
                        }}
                      >
                        {expandedId === record.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Badge variant="outline">#{record.id}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(record.date || record.createdAt)}
                    </TableCell>
                    <TableCell className="font-mono font-semibold">
                      ${formatNumber(record.totalAmount)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {Number(record.tip) > 0 ? (
                        <span className="text-green-600">${formatNumber(record.tip)}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono">
                      {Number(record.tax10Percent) > 0 ? (
                        <span className="text-blue-600">${formatNumber(record.tax10Percent)}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono font-bold text-primary">
                      ${formatNumber(record.grandTotal)}
                    </TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(record.paymentStatus)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {Number(record.pendingAmount) > 0 ? (
                        <span className="text-red-600">${formatNumber(record.pendingAmount)}</span>
                      ) : (
                        <span className="text-green-600">-</span>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Expanded Details Row */}
                  {expandedId === record.id && (
                    <TableRow key={`details-${record.id}`} className="bg-muted/20">
                      <TableCell colSpan={10} className="p-4">
                        <div className="space-y-4">
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
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

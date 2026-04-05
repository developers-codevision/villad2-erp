import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { BillingRecordDto } from "../types/types";
import { RecordRow } from "./ui/RecordRow";
import { RecordDetailSection } from "./ui/RecordDetailSection";

interface BillingRecordsListProps {
  records: BillingRecordDto[];
}

/**
 * Componente refactorizado que muestra lista de registros de facturación
 * Usa componentes UI puros RecordRow y RecordDetailSection
 */
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
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          {/* Header Row */}
          <div className="bg-muted/50 font-semibold text-sm px-4 py-3 flex items-center gap-2 border-b">
            <span className="w-8 text-center"></span>
            <span className="w-20">ID</span>
            <span className="flex-1">Fecha</span>
            <span className="w-24 text-right">Total</span>
            <span className="w-24 text-right">Propina</span>
            <span className="w-24 text-right">Impuesto</span>
            <span className="w-32 text-right">Gran Total</span>
            <span className="w-24 text-right">Estado</span>
            <span className="w-24 text-right">Pendiente</span>
          </div>

          {/* Body Rows */}
          <div>
            {records.map((record) => (
              <div key={record.id}>
                <RecordRow
                  record={record}
                  isExpanded={expandedId === record.id}
                  onToggle={() => setExpandedId(expandedId === record.id ? null : record.id)}
                />
                {expandedId === record.id && (
                  <RecordDetailSection record={record} />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

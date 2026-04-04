import { DollarSign, Calendar, TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BillingSheetDto } from "../types/types";
import { format } from "date-fns";

interface BillingSheetCardProps {
  sheet: BillingSheetDto;
  onSelect: (id: number) => void;
}

export function BillingSheetCard({ sheet, onSelect }: BillingSheetCardProps) {
  const totalItems = sheet.items?.length || 0;
  const totalValue = sheet.items?.reduce((sum, item) => sum + (Number(item.totalUsd) || 0), 0) || 0;

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-primary"
      onClick={() => onSelect(sheet.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {format(new Date(sheet.date), "dd/MM/yyyy")}
          </CardTitle>
          <Badge variant="outline" className="bg-primary/10">
            ID: {sheet.id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              USD → CUP
            </div>
            <p className="text-lg font-semibold">{sheet.usdToCupRate}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              EUR → CUP
            </div>
            <p className="text-lg font-semibold">{sheet.eurToCupRate}</p>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{totalItems} conceptos</span>
            <span className="font-semibold text-primary">${totalValue.toFixed(2)} USD</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

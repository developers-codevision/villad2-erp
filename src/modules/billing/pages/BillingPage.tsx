import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateConceptDialog } from "../components";
import {
  useBillingSheets,
  useBillingSheet,
  useUpdateBillingSheet,
  useDeleteBillingSheet,
  useBillingRecords,
  useCreateBillingRecord,
} from "../hooks/useBilling";
import { useDialogStates } from "../hooks/useDialogStates";
import { useSheetFilters } from "../hooks/useSheetFilters";
import type { BillingPaymentDto } from "../types/types";
import { DetailSheetView } from "./DetailSheetView";
import { ListSheetView } from "./ListSheetView";

export default function BillingPage() {
  const [selectedSheetId, setSelectedSheetId] = useState<number | null>(null);
  const [newSheetDate, setNewSheetDate] = useState(new Date().toISOString().split("T")[0]);
  const [rates, setRates] = useState({ usd: 150, eur: 160 });

  const dialogs = useDialogStates();
  const { data: sheets, isLoading: sheetsLoading } = useBillingSheets();
  const { data: selectedSheet, isLoading: sheetLoading } = useBillingSheet(selectedSheetId);
  const { data: records, isLoading: recordsLoading } = useBillingRecords(selectedSheetId);
  const filters = useSheetFilters(sheets);
  const updateSheet = useUpdateBillingSheet();
  const deleteSheet = useDeleteBillingSheet();
  const createRecord = useCreateBillingRecord();

  const handleUpdateSheet = () => {
    if (!selectedSheetId) return;
    updateSheet.mutate({ id: selectedSheetId, payload: { usdToCupRate: rates.usd, eurToCupRate: rates.eur } }, {
      onSuccess: () => dialogs.closeDialog("updateDialogOpen"),
    });
  };

  const handleCreateRecord = (itemId: number, quantity: number, unitPrice: number, tip: number, tax10: number, payments: BillingPaymentDto[], consumeImmediately: boolean, lateBilling: boolean) => {
    if (!selectedSheetId) return;
    createRecord.mutate({
      billingId: selectedSheetId,
      payload: { billingId: selectedSheetId, billingItemId: itemId, quantity, unitPrice, tip, tax10, items: [], payments, consumeImmediately, lateBilling },
    });
  };

  const handleDeleteSheet = () => {
    if (selectedSheetId) deleteSheet.mutate(selectedSheetId, {
      onSuccess: () => { dialogs.closeDialog("deleteConfirmOpen"); setSelectedSheetId(null); },
    });
  };

  // Detail View
  const detailView = selectedSheetId && selectedSheet && (
    <DetailSheetView
      sheet={selectedSheet}
      records={records || []}
      rates={rates}
      onRatesChange={setRates}
      isSheetLoading={sheetLoading}
      isRecordsLoading={recordsLoading}
      isDeleting={deleteSheet.isPending}
      onBack={() => setSelectedSheetId(null)}
      onCreateConcept={() => dialogs.openDialog("createConceptDialogOpen")}
      onUpdateRates={() => {
        setRates({ usd: selectedSheet.usdToCupRate, eur: selectedSheet.eurToCupRate });
        dialogs.openDialog("updateDialogOpen");
      }}
      onDelete={() => dialogs.openDialog("deleteConfirmOpen")}
      onCreateRecord={handleCreateRecord}
    />
  );

  // List View
  const listView = (
    <ListSheetView
      sheets={filters.filteredSheets}
      isLoading={sheetsLoading}
      filterDate={filters.date}
      onFilterDateChange={filters.setDate}
      filterMinRate={filters.minRate}
      onFilterMinRateChange={filters.setMinRate}
      onClearFilters={filters.clearFilters}
      onSelectSheet={setSelectedSheetId}
      onCreateNew={() => dialogs.openDialog("createDialogOpen")}
    />
  );

  return (
    <>
      {detailView || listView}

      {selectedSheetId && (
        <CreateConceptDialog
          open={dialogs.createConceptDialogOpen}
          onOpenChange={dialogs.setCreateConceptDialogOpen}
          billingId={selectedSheetId}
          onSuccess={() => window.location.reload()}
        />
      )}

      <AlertDialog open={dialogs.deleteConfirmOpen} onOpenChange={dialogs.setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Hoja de Facturación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteSheet.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSheet}
              disabled={deleteSheet.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteSheet.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={dialogs.updateDialogOpen} onOpenChange={dialogs.setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Tasas de Cambio</DialogTitle>
            <DialogDescription>Modifica las tasas de conversión de moneda</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usdRate">Tasa USD → CUP</Label>
              <Input id="usdRate" type="number" step="0.01" value={rates.usd} onChange={(e) => setRates({ ...rates, usd: parseFloat(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eurRate">Tasa EUR → CUP</Label>
              <Input id="eurRate" type="number" step="0.01" value={rates.eur} onChange={(e) => setRates({ ...rates, eur: parseFloat(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => dialogs.setUpdateDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateSheet}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

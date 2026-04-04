import { useState } from "react";
import { Plus, ArrowLeft, Receipt, TrendingUp, Trash2, Package, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BillingItemCard, BillingRecordsList, CreateConceptDialog } from "../components";
import {
  useBillingSheets,
  useBillingSheet,
  useCreateBillingSheet,
  useUpdateBillingSheet,
  useDeleteBillingSheet,
  useBillingRecords,
  useCreateBillingRecord,
} from "../hooks/useBilling";
import type { BillingPaymentDto, BillingItemDto } from "../types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function BillingPage() {
  const [selectedSheetId, setSelectedSheetId] = useState<number | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [createConceptDialogOpen, setCreateConceptDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [newSheetDate, setNewSheetDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [usdToCupRate, setUsdToCupRate] = useState(150);
  const [eurToCupRate, setEurToCupRate] = useState(160);
  
  // Filters
  const [filterDate, setFilterDate] = useState("");
  const [filterMinRate, setFilterMinRate] = useState("");

  const { data: sheets, isLoading: sheetsLoading } = useBillingSheets();
  const { data: selectedSheet, isLoading: sheetLoading } = useBillingSheet(selectedSheetId);
  const { data: records, isLoading: recordsLoading } = useBillingRecords(selectedSheetId);
  const createSheetMutation = useCreateBillingSheet();
  const updateSheetMutation = useUpdateBillingSheet();
  const deleteSheetMutation = useDeleteBillingSheet();
  const createRecordMutation = useCreateBillingRecord();

  const handleCreateSheet = () => {
    createSheetMutation.mutate(
      { date: newSheetDate },
      {
        onSuccess: () => {
          setCreateDialogOpen(false);
          setNewSheetDate(new Date().toISOString().split("T")[0]);
        },
      }
    );
  };

  const handleUpdateSheet = () => {
    if (!selectedSheetId) return;
    updateSheetMutation.mutate(
      {
        id: selectedSheetId,
        payload: {
          usdToCupRate,
          eurToCupRate,
        },
      },
      {
        onSuccess: () => {
          setUpdateDialogOpen(false);
        },
      }
    );
  };

  const handleCreateRecord = (
    itemId: number,
    quantity: number,
    unitPrice: number,
    tip: number,
    tax10: number,
    payments: BillingPaymentDto[],
    consumeImmediately: boolean,
    lateBilling: boolean
  ) => {
    if (!selectedSheetId) return;

    const items: BillingItemDto[] = [];

    createRecordMutation.mutate({
      billingId: selectedSheetId,
      payload: {
        billingId: selectedSheetId,
        billingItemId: itemId,
        quantity,
        unitPrice,
        tip,
        tax10,
        items,
        payments,
        consumeImmediately,
        lateBilling,
      },
    });
  };

  const handleBackToList = () => {
    setSelectedSheetId(null);
  };

  const handleDeleteSheet = () => {
    if (selectedSheetId) {
      deleteSheetMutation.mutate(selectedSheetId, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setSelectedSheetId(null);
        },
      });
    }
  };

  // Filter sheets
  const filteredSheets = sheets?.filter((sheet) => {
    if (filterDate && !sheet.date.includes(filterDate)) return false;
    return !filterMinRate || sheet.usdToCupRate >= Number(filterMinRate);
  }) || [];

  // Detail View
  const detailView = selectedSheetId && selectedSheet && (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Hoja de Facturación - {format(new Date(selectedSheet.date), "dd/MM/yyyy")}
            </h2>
            <p className="text-sm text-muted-foreground">ID: {selectedSheet.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCreateConceptDialogOpen(true)}
          >
            <Package className="h-4 w-4 mr-2" />
            Crear Concepto
          </Button>
          <Button onClick={() => {
            setUsdToCupRate(selectedSheet.usdToCupRate);
            setEurToCupRate(selectedSheet.eurToCupRate);
            setUpdateDialogOpen(true);
          }}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Actualizar Tasas
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteConfirmOpen(true)}
            disabled={deleteSheetMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteSheetMutation.isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </div>

      {/* Exchange Rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Tasa USD → CUP</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {selectedSheet.usdToCupRate}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Tasa EUR → CUP</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {selectedSheet.eurToCupRate}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Items Count & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Cantidad de Conceptos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {selectedSheet.items?.length || 0}
            </p>
          </CardContent>
        </Card>
        {selectedSheet.summary && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Subtotal USD</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  ${selectedSheet.summary.subtotalUsd.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Subtotal CUP</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  ₡{selectedSheet.summary.subtotalCup.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Impuesto 10%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">
                  ₡{selectedSheet.summary.tax10Percent.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total CUP</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  ₡{selectedSheet.summary.totalCup.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Conceptos de Facturación</TabsTrigger>
          <TabsTrigger value="records">Registros</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          {sheetLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Cargando items...
            </div>
          ) : selectedSheet.items && selectedSheet.items.length > 0 ? (
            <BillingItemCard
              items={selectedSheet.items}
              onCreateRecord={handleCreateRecord}
            />
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No hay items disponibles en esta hoja de facturación</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="records">
          {recordsLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              Cargando registros...
            </div>
          ) : (
            <BillingRecordsList records={records || []} />
          )}
        </TabsContent>
      </Tabs>

      {/* Update Sheet Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Tasas de Cambio</DialogTitle>
            <DialogDescription>
              Modifica las tasas de conversión de moneda
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usdRate">Tasa USD → CUP</Label>
              <Input
                id="usdRate"
                type="number"
                step="0.01"
                value={usdToCupRate}
                onChange={(e) => setUsdToCupRate(parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eurRate">Tasa EUR → CUP</Label>
              <Input
                id="eurRate"
                type="number"
                step="0.01"
                value={eurToCupRate}
                onChange={(e) => setEurToCupRate(parseFloat(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateSheet}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  // List View - TABLE FORMAT
  const listView = (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Facturación</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Hoja de Facturación
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-base">Filtros</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filterDate">Fecha</Label>
              <Input
                id="filterDate"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Filtrar por fecha..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filterRate">Tasa USD mínima</Label>
              <Input
                id="filterRate"
                type="number"
                value={filterMinRate}
                onChange={(e) => setFilterMinRate(e.target.value)}
                placeholder="Ej: 150"
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterDate("");
                  setFilterMinRate("");
                }}
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sheets Table */}
      {sheetsLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Cargando hojas de facturación...
        </div>
      ) : filteredSheets.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tasa USD→CUP</TableHead>
                    <TableHead>Tasa EUR→CUP</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSheets.map((sheet) => (
                    <TableRow key={sheet.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <Badge variant="outline">#{sheet.id}</Badge>
                      </TableCell>
                      <TableCell>{format(new Date(sheet.date), "dd/MM/yyyy")}</TableCell>
                      <TableCell className="font-mono">{sheet.usdToCupRate}</TableCell>
                      <TableCell className="font-mono">{sheet.eurToCupRate}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => setSelectedSheetId(sheet.id)}
                        >
                          Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="mb-4">No hay hojas de facturación disponibles</p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primera Hoja
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Sheet Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Hoja de Facturación</DialogTitle>
            <DialogDescription>
              Crea una nueva hoja de facturación diaria
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={newSheetDate}
                onChange={(e) => setNewSheetDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateSheet}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <>
      {/* Render detail view or list view */}
      {detailView || listView}

      {/* Create Concept Dialog - Always rendered at component level */}
      {selectedSheetId && (
        <CreateConceptDialog
          open={createConceptDialogOpen}
          onOpenChange={setCreateConceptDialogOpen}
          billingId={selectedSheetId}
          onSuccess={() => {
            // Reload the sheet to get the new concept as billing item
            window.location.reload();
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Hoja de Facturación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar la hoja de facturación del{" "}
              {selectedSheet && format(new Date(selectedSheet.date), "dd/MM/yyyy")}? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteSheetMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSheet}
              disabled={deleteSheetMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteSheetMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

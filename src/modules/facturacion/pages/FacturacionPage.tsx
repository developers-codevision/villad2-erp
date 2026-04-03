import { useState } from "react";
import { useFacturacion } from "../hooks/useFacturacion";
import { useBillingRecords } from "../hooks/useBillingRecords";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { BillingModal } from "../components/BillingModal";
import { BillingsList } from "../components/BillingsList";
import { BillingRecordsList } from "../components/BillingRecordsList";
import { Plus, Receipt, X } from "lucide-react";
import type { CreateBillingRecordDTO } from "../types/types";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import type { CreateConceptDTO, ConceptProductDTO } from "../../concepts/types/types";
import { useProducts } from "../../products/hooks/useProducts";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function FacturacionPage() {
  const {
    usdRate,
    setUsdRate,
    euroRate,
    setEuroRate,
    date,
    setDate,
    groups,
    billings,
    selectedBillingId,
    setSelectedBillingId,
    updateItem,
    total,
    loading,
    createNewBilling,
    updateBilling,
    deleteBilling,
    createConcept,
    creating,
    updating,
  } = useFacturacion();

  const {
    records,
    loading: loadingRecords,
    createRecord,
    deleteRecord,
    distributeTips,
    distributeTax10,
    processMixedPayments,
  } = useBillingRecords(selectedBillingId || undefined);

  const { products } = useProducts();

  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [selectedForBilling, setSelectedForBilling] = useState<Array<{
    conceptId: number;
    conceptName: string;
    quantity: number;
    price: number;
  }>>([]);

  const [conceptDialogOpen, setConceptDialogOpen] = useState(false);
  const [conceptName, setConceptName] = useState("");
  const [conceptPrice, setConceptPrice] = useState("");
  const [conceptCategory, setConceptCategory] = useState("");
  const [conceptProducts, setConceptProducts] = useState<ConceptProductDTO[]>([]);

  const handleCreateBilling = async () => {
    await createNewBilling();
  };

  const handleUpdateRates = async () => {
    if (!selectedBillingId) return;
    
    await updateBilling(selectedBillingId, {
      usdToCupRate: usdRate,
      eurToCupRate: euroRate,
    });
  };

  const handleBillingClick = (conceptId: string, conceptName: string, price: number, quantity: number) => {
    if (quantity <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }
    if (!selectedBillingId) {
      alert("Primero debes seleccionar o crear una hoja de facturación");
      return;
    }

    setSelectedForBilling([{
      conceptId: Number(conceptId),
      conceptName,
      quantity,
      price,
    }]);
    setBillingModalOpen(true);
  };

  const handleCreateRecord = async (data: CreateBillingRecordDTO) => {
    await createRecord(data.billingId, data);
    // Reset quantities after successful billing
    setSelectedForBilling([]);
  };

  const handleOpenCreateConcept = () => {
    setConceptName("");
    setConceptPrice("");
    setConceptCategory("");
    setConceptProducts([]);
    setConceptDialogOpen(true);
  };

  const handleSaveConcept = async () => {
    if (!conceptName.trim() || !conceptCategory.trim() || !conceptPrice) {
      alert("Todos los campos son obligatorios");
      return;
    }
    const payload: CreateConceptDTO = {
      name: conceptName,
      category: conceptCategory,
      products: conceptProducts.length > 0 ? conceptProducts : undefined,
      billingId: selectedBillingId || undefined,
      price: Number(conceptPrice),
    };
    await createConcept(payload);
    setConceptDialogOpen(false);
  };

  const addProductToConcept = (productId: number, quantity: number) => {
    if (quantity <= 0) return;
    const existingIndex = conceptProducts.findIndex(p => p.productId === productId);
    if (existingIndex >= 0) {
      const updated = [...conceptProducts];
      updated[existingIndex].quantity += quantity;
      setConceptProducts(updated);
    } else {
      setConceptProducts([...conceptProducts, { productId, quantity }]);
    }
  };

  const removeProductFromConcept = (productId: number) => {
    setConceptProducts(conceptProducts.filter(p => p.productId !== productId));
  };

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Facturación</h2>
        <div className="flex gap-2">
          <Button onClick={handleOpenCreateConcept} variant="outline" disabled={!selectedBillingId}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Concepto
          </Button>
          <Button onClick={handleCreateBilling} disabled={creating}>
            <Plus className="h-4 w-4 mr-2" />
            {creating ? 'Creando...' : 'Nueva Hoja'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="billing" className="w-full">
        <TabsList>
          <TabsTrigger value="billing">Facturación</TabsTrigger>
          <TabsTrigger value="sheets">Hojas de Facturación</TabsTrigger>
          <TabsTrigger value="records">Registros de Pago</TabsTrigger>
        </TabsList>

        <TabsContent value="billing" className="space-y-6">
          {/* Billing Configuration */}
          <div className="grid grid-cols-3 gap-4 max-w-lg">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="usdRate">Valor USD</Label>
              <Input
                id="usdRate"
                type="number"
                step="0.01"
                value={usdRate}
                onChange={(e) => setUsdRate(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="euroRate">Valor Euro</Label>
              <Input
                id="euroRate"
                type="number"
                step="0.01"
                value={euroRate}
                onChange={(e) => setEuroRate(Number(e.target.value))}
              />
            </div>
          </div>

          {selectedBillingId && (
            <div className="flex gap-2">
              <Button 
                onClick={handleUpdateRates} 
                disabled={updating}
                variant="outline"
              >
                {updating ? 'Actualizando...' : 'Actualizar Tasas'}
              </Button>
              <div className="text-sm text-muted-foreground flex items-center">
                Facturación seleccionada: #{selectedBillingId}
              </div>
            </div>
          )}

          {/* Concepts by Category */}
          {groups.map((g) => (
            <div key={g.category} className="space-y-4">
              <h3 className="text-lg font-semibold">{g.category}</h3>
              <div className="rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="w-32">Precio</TableHead>
                      <TableHead className="w-32">Cantidad</TableHead>
                      <TableHead className="w-32">Subtotal</TableHead>
                      <TableHead className="w-32">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {g.items.map((i) => (
                      <TableRow key={i.id}>
                        <TableCell>{i.name}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={i.price}
                            onChange={(e) => updateItem(g.category, i.id, 'price', Number(e.target.value))}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={i.quantity}
                            onChange={(e) => updateItem(g.category, i.id, 'quantity', Number(e.target.value))}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          ${Number(i.price * i.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleBillingClick(i.id, i.name, i.price, i.quantity)}
                            disabled={i.quantity <= 0 || !selectedBillingId}
                          >
                            <Receipt className="h-4 w-4 mr-1" />
                            Facturar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}

          <div className="text-right text-xl font-bold">
            Total: ${Number(total).toFixed(2)}
          </div>
        </TabsContent>

        <TabsContent value="sheets" className="space-y-4">
          <BillingsList
            billings={billings}
            selectedId={selectedBillingId}
            onSelect={setSelectedBillingId}
            onDelete={deleteBilling}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          {!selectedBillingId ? (
            <div className="p-4 text-center text-muted-foreground">
              Selecciona una hoja de facturación para ver sus registros
            </div>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                Registros de la facturación #{selectedBillingId}
              </div>
              <BillingRecordsList
                records={records}
                onDelete={deleteRecord}
                onDistributeTips={distributeTips}
                onDistributeTax10={distributeTax10}
                onProcessMixedPayments={processMixedPayments}
                loading={loadingRecords}
              />
            </>
          )}
        </TabsContent>
      </Tabs>

      <BillingModal
        open={billingModalOpen}
        onOpenChange={setBillingModalOpen}
        billingId={selectedBillingId || 0}
        selectedItems={selectedForBilling}
        onCreateRecord={handleCreateRecord}
      />

      <Dialog open={conceptDialogOpen} onOpenChange={setConceptDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo Concepto</DialogTitle>
            <DialogDescription>
              Ingresa los datos del nuevo concepto para facturación.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="conceptName">Nombre</Label>
              <Input
                id="conceptName"
                value={conceptName}
                onChange={(e) => setConceptName(e.target.value)}
                placeholder="Ej: Cerveza"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="conceptPrice">Precio USD</Label>
                <Input
                  id="conceptPrice"
                  type="number"
                  step="0.01"
                  value={conceptPrice}
                  onChange={(e) => setConceptPrice(e.target.value)}
                  placeholder="Ej: 2.50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conceptCategory">Categoría</Label>
                <Input
                  id="conceptCategory"
                  value={conceptCategory}
                  onChange={(e) => setConceptCategory(e.target.value)}
                  placeholder="Ej: Bebidas"
                />
              </div>
            </div>

            {/* Products Section */}
            <div className="space-y-2">
              <Label>Productos (opcional)</Label>
              <div className="flex gap-2">
                <Select onValueChange={(value) => {
                  const productId = Number(value);
                  addProductToConcept(productId, 1);
                }}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={String(product.id)}>
                        {product.name} ({product.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const productId = products[0]?.id;
                    if (productId) addProductToConcept(productId, 1);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {conceptProducts.length > 0 && (
                <div className="space-y-2">
                  <Label>Productos seleccionados:</Label>
                  <div className="space-y-1">
                    {conceptProducts.map((cp) => {
                      const product = products.find(p => p.id === cp.productId);
                      return (
                        <div key={cp.productId} className="flex items-center justify-between p-2 border rounded">
                          <span>{product?.name} (x{cp.quantity})</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProductFromConcept(cp.productId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {selectedBillingId && (
              <div className="text-sm text-muted-foreground">
                Este concepto se asociará automáticamente a la facturación #{selectedBillingId}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConceptDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveConcept}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

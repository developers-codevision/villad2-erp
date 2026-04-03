import { useState } from "react";
import { useFacturacion } from "../hooks/useFacturacion";
import { useBillingRecords } from "../hooks/useBillingRecords";
import { useConceptCreation } from "../hooks/useConceptCreation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import type { CreateBillingRecordDTO } from "../types/types";
import { BillingModal } from "../components/BillingModal";
import { BillingsList } from "../components/BillingsList";
import { BillingRecordsList } from "../components/BillingRecordsList";
import { BillingConfiguration } from "../components/BillingConfiguration";
import { ConceptsTable } from "../components/ConceptsTable";
import { ConceptCreationDialog } from "../components/ConceptCreationDialog";
import { useProducts } from "../../products/hooks/useProducts";

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
    selectedBilling,
    updateItem,
    total,
    loading,
    createNewBilling,
    updateBilling,
    deleteBilling,
    createConcept,
    creating,
    updating,
    concepts,
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

  const conceptCreation = useConceptCreation({
    selectedBillingId,
    onCreateConcept: createConcept,
  });

  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [selectedForBilling, setSelectedForBilling] = useState<Array<{
    conceptId: number;
    conceptName: string;
    quantity: number;
    price: number;
    billingItemId?: number;
  }>>([]);

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

    // Find the billing item id for this concept
    const billingItem = selectedBilling?.items.find(item => item.conceptId === Number(conceptId));
    const billingItemId = billingItem?.id;

    setSelectedForBilling([{
      conceptId: Number(conceptId),
      conceptName,
      quantity,
      price,
      billingItemId,
    }]);
    setBillingModalOpen(true);
  };

  const handleCreateRecord = async (data: CreateBillingRecordDTO) => {
    await createRecord(data.billingId, data);
    // Reset quantities after successful billing
    setSelectedForBilling([]);
  };

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Facturación</h2>
        <div className="flex gap-2">
          <Button onClick={conceptCreation.openDialog} variant="outline" disabled={!selectedBillingId}>
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
          <BillingConfiguration
            date={date}
            setDate={setDate}
            usdRate={usdRate}
            setUsdRate={setUsdRate}
            euroRate={euroRate}
            setEuroRate={setEuroRate}
            selectedBillingId={selectedBillingId}
            updating={updating}
            onUpdateRates={handleUpdateRates}
          />

          {/* Concepts by Category */}
          {groups.map((g) => (
            <div key={g.category} className="space-y-4">
              <h3 className="text-lg font-semibold">{g.category}</h3>
              <div className="rounded-lg border bg-card">
                <ConceptsTable
                  concepts={g.items}
                  onUpdateItem={updateItem}
                  onBillingClick={handleBillingClick}
                  selectedBillingId={selectedBillingId}
                />
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
        concepts={concepts}
        onCreateRecord={handleCreateRecord}
      />

      <ConceptCreationDialog
        open={conceptCreation.dialogOpen}
        onOpenChange={conceptCreation.closeDialog}
        conceptName={conceptCreation.conceptName}
        setConceptName={conceptCreation.setConceptName}
        conceptPrice={conceptCreation.conceptPrice}
        setConceptPrice={conceptCreation.setConceptPrice}
        conceptCategory={conceptCreation.conceptCategory}
        setConceptCategory={conceptCreation.setConceptCategory}
        conceptProducts={conceptCreation.conceptProducts}
        products={products}
        selectedBillingId={selectedBillingId}
        addProductToConcept={conceptCreation.addProductToConcept}
        removeProductFromConcept={conceptCreation.removeProductFromConcept}
        handleSaveConcept={conceptCreation.handleSaveConcept}
      />
    </div>
  );
}

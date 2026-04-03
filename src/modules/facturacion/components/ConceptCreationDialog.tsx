import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import type { ConceptProductDTO } from "../../concepts/types/types";

interface ConceptCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conceptName: string;
  setConceptName: (name: string) => void;
  conceptPrice: string;
  setConceptPrice: (price: string) => void;
  conceptCategory: string;
  setConceptCategory: (category: string) => void;
  conceptProducts: ConceptProductDTO[];
  products: Array<{
    id: string;
    code: number;
    name: string;
  }>;
  selectedBillingId: number | null;
  addProductToConcept: (productId: number, quantity: number) => void;
  removeProductFromConcept: (productId: number) => void;
  handleSaveConcept: () => void;
  loading?: boolean;
}

export function ConceptCreationDialog({
  open,
  onOpenChange,
  conceptName,
  setConceptName,
  conceptPrice,
  setConceptPrice,
  conceptCategory,
  setConceptCategory,
  conceptProducts,
  products,
  selectedBillingId,
  addProductToConcept,
  removeProductFromConcept,
  handleSaveConcept,
}: ConceptCreationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  if (productId) addProductToConcept(Number(productId), 1);
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
                    const product = products.find(p => Number(p.id) === cp.productId);
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveConcept}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

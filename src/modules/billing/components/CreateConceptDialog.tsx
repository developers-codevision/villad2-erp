import { useState, useEffect } from "react";
import { Plus, X, Package } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { CreateConceptDTO, ConceptProductDTO } from "@/modules/concepts/types/types";
import type { ProductDTO } from "@/modules/products/types/types";
import { productsService } from "@/modules/products/services/productsService";
import { conceptsService } from "@/modules/concepts/services/conceptsService";

interface CreateConceptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billingId: number;
  onSuccess?: () => void;
}

export function CreateConceptDialog({
  open,
  onOpenChange,
  billingId,
  onSuccess,
}: CreateConceptDialogProps) {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ConceptProductDTO[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [open]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await productsService.list();
      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const addProduct = (productId: number) => {
    const existing = selectedProducts.find((p) => p.productId === productId);
    if (existing) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { productId, quantity: 1 }]);
    }
  };

  const updateProductQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setSelectedProducts(selectedProducts.filter((p) => p.productId !== productId));
    } else {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.productId === productId ? { ...p, quantity } : p
        )
      );
    }
  };

  const removeProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter((p) => p.productId !== productId));
  };

  const handleSave = async () => {
    if (!name.trim() || !category.trim()) {
      alert("Por favor completa el nombre y la categoría");
      return;
    }

    if (!price.trim()) {
      alert("El precio es obligatorio al crear un concepto desde la hoja de facturación");
      return;
    }

    setLoading(true);
    try {
      const payload: CreateConceptDTO = {
        name: name.trim(),
        category: category.trim(),
        price: parseFloat(price),
        billingId,
        products: selectedProducts.length > 0 ? selectedProducts : undefined,
      };

      await conceptsService.create(payload);
      
      // Reset form
      setName("");
      setCategory("");
      setPrice("");
      setSelectedProducts([]);
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating concept:", error);
      alert("Error al crear el concepto");
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId: number): string => {
    const product = products.find((p) => Number(p.id) === productId);
    return product ? product.name : `Producto #${productId}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Crear Nuevo Concepto
          </DialogTitle>
          <DialogDescription>
            El concepto se creará y se agregará automáticamente como item facturable en esta hoja. 
            El nombre y precio que ingreses aquí se usarán para la facturación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre del Concepto <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Cerveza Cristal 350ml"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Categoría <span className="text-destructive">*</span>
              </Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ej: Bebidas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">
                Precio (USD) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2.50"
              />
            </div>

            <div className="space-y-2">
              <Label>Hoja de Facturación</Label>
              <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                <Badge variant="outline">#{billingId}</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Productos Asociados (Opcional)</Label>
            <p className="text-sm text-muted-foreground">
              Selecciona los productos que conforman este concepto
            </p>

            {selectedProducts.length > 0 && (
              <Card>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {selectedProducts.map((sp) => (
                      <div
                        key={sp.productId}
                        className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50"
                      >
                        <span className="flex-1 text-sm font-medium">
                          {getProductName(sp.productId)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-muted-foreground">Cantidad:</Label>
                          <Input
                            type="number"
                            min="1"
                            value={sp.quantity}
                            onChange={(e) =>
                              updateProductQuantity(sp.productId, parseInt(e.target.value) || 0)
                            }
                            className="w-20 h-8"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeProduct(sp.productId)}
                            className="text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="rounded-md border max-h-64 overflow-y-auto">
              {loadingProducts ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Cargando productos...
                </div>
              ) : products.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No hay productos disponibles
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>ID</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Unidad</TableHead>
                      <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const isSelected = selectedProducts.some(
                        (p) => p.productId === Number(product.id)
                      );
                      return (
                        <TableRow key={product.id} className={isSelected ? "bg-primary/5" : ""}>
                          <TableCell className="font-mono text-xs">{product.id}</TableCell>
                          <TableCell className="font-mono">{product.code}</TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.unitMeasure}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant={isSelected ? "secondary" : "outline"}
                              onClick={() => addProduct(Number(product.id))}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {isSelected ? "Agregar más" : "Agregar"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Creando..." : "Crear Concepto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

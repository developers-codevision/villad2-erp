import { useFacturacion } from "../hooks/useFacturacion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { BillingModal } from "../components/BillingModal";
import { useState } from "react";

export default function FacturacionPage() {
  const { usdRate, setUsdRate, euroRate, setEuroRate, date, setDate, groups, updateItem, total, loading, saving, saveBilling } = useFacturacion();
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<{ id: string; name: string; price: number } | null>(null);

  const handleBill = (data: any) => {
    console.log("Billing data:", data);
    // Here you can handle the billing logic, e.g., send to API
  };

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Facturación</h2>

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
                        value={i.quantity}
                        onChange={(e) => updateItem(g.category, i.id, 'quantity', Number(e.target.value))}
                      />
                    </TableCell>
                    <TableCell className="text-right">{(i.price * i.quantity).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedConcept({ id: i.id, name: i.name, price: i.price });
                          setBillingModalOpen(true);
                        }}
                      >
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
        Total: {total.toFixed(2)} USD
      </div>

      <div className="flex justify-end">
        <Button onClick={saveBilling} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>

      <BillingModal
        open={billingModalOpen}
        onOpenChange={setBillingModalOpen}
        concept={selectedConcept}
        onBill={handleBill}
      />
    </div>
  );
}

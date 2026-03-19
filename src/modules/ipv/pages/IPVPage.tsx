import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DateShiftSelector } from "../components/DateShiftSelector";
import { InventoryTable } from "../components/InventoryTable";
import type { InventoryRow } from "../types/types";

const initialRows: InventoryRow[] = [
  {
    codigoProducto: "001",
    um: "kg",
    inicial: 10,
    entrada: 5,
    consumo: 8,
    merma: 1,
    cuentaCasa: 2,
    final: 4,
    observaciones: "",
  },
  {
    codigoProducto: "002",
    um: "l",
    inicial: 20,
    entrada: 10,
    consumo: 15,
    merma: 2,
    cuentaCasa: 3,
    final: 10,
    observaciones: "",
  },
];

export default function IPVPage() {
  const [seccion, setSeccion] = useState<'Bar' | 'Cocina'>('Bar');
  const [fecha, setFecha] = useState("2026-03-19");
  const [jefesDeTurno, setJefesDeTurno] = useState("Jenifer/Fabio");
  const [barRows, setBarRows] = useState<InventoryRow[]>(initialRows);
  const [cocinaRows, setCocinaRows] = useState<InventoryRow[]>(initialRows);

  const currentRows = seccion === 'Bar' ? barRows : cocinaRows;
  const setCurrentRows = seccion === 'Bar' ? setBarRows : setCocinaRows;

  const handleRowChange = (index: number, field: keyof InventoryRow, value: string | number) => {
    setCurrentRows(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  const handleSave = () => {
    console.log("Saving IPV data:", { fecha, jefesDeTurno, seccion, rows: currentRows });
    // Here you would call the service to save
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">IPV - Inventario de Productos Vendidos</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Sección</label>
        <Select value={seccion} onValueChange={(value: 'Bar' | 'Cocina') => setSeccion(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Bar">Bar</SelectItem>
            <SelectItem value="Cocina">Cocina</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DateShiftSelector
        fecha={fecha}
        jefesDeTurno={jefesDeTurno}
        onFechaChange={setFecha}
        onJefesChange={setJefesDeTurno}
      />

      <InventoryTable rows={currentRows} onRowChange={handleRowChange} />

      <div className="mt-4 flex justify-end">
        <Button onClick={handleSave}>Guardar</Button>
      </div>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { InventoryRow } from "../types/types";

interface InventoryTableProps {
  rows: InventoryRow[];
  onRowChange: (index: number, field: keyof InventoryRow, value: string | number) => void;
}

export function InventoryTable({ rows, onRowChange }: InventoryTableProps) {
  const handleChange = (index: number, field: keyof InventoryRow, value: string) => {
    const numFields: (keyof InventoryRow)[] = ['inicial', 'entrada', 'consumo', 'merma', 'cuentaCasa', 'final'];
    const parsedValue = numFields.includes(field) ? parseFloat(value) || 0 : value;
    onRowChange(index, field, parsedValue);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Código Producto</th>
            <th className="border border-gray-300 p-2">UM</th>
            <th className="border border-gray-300 p-2">Inicial</th>
            <th className="border border-gray-300 p-2">Entrada</th>
            <th className="border border-gray-300 p-2">Consumo</th>
            <th className="border border-gray-300 p-2">Merma</th>
            <th className="border border-gray-300 p-2">Cuenta Casa</th>
            <th className="border border-gray-300 p-2">Final</th>
            <th className="border border-gray-300 p-2">Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">
                <Input
                  value={row.codigoProducto}
                  onChange={(e) => handleChange(index, 'codigoProducto', e.target.value)}
                  className="w-full"
                  placeholder="Código"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <Input
                  value={row.um}
                  onChange={(e) => handleChange(index, 'um', e.target.value)}
                  className="w-full"
                  placeholder="UM"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <Input
                  type="number"
                  value={row.inicial}
                  onChange={(e) => handleChange(index, 'inicial', e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <Input
                  type="number"
                  value={row.entrada}
                  onChange={(e) => handleChange(index, 'entrada', e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <Input
                  type="number"
                  value={row.consumo}
                  onChange={(e) => handleChange(index, 'consumo', e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <Input
                  type="number"
                  value={row.merma}
                  onChange={(e) => handleChange(index, 'merma', e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <Input
                  type="number"
                  value={row.cuentaCasa}
                  onChange={(e) => handleChange(index, 'cuentaCasa', e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <Input
                  type="number"
                  value={row.final}
                  onChange={(e) => handleChange(index, 'final', e.target.value)}
                  className="w-full"
                />
              </td>
              <td className="border border-gray-300 p-2">
                <Textarea
                  value={row.observaciones}
                  onChange={(e) => handleChange(index, 'observaciones', e.target.value)}
                  className="w-full min-h-[60px]"
                  placeholder="Observaciones"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

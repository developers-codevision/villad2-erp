import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateLiquidationDto, IngresoRow, EfectivoRow, DenominacionRow } from "../types/types";

interface LiquidationFormProps {
  onCancel: () => void;
  onCreate: (liquidation: CreateLiquidationDto) => void;
  initialData?: Partial<CreateLiquidationDto>;
}

const initialIngresos: IngresoRow[] = [
  { concepto: "Alojamiento Turístico", ip: 0, pr: 0, m: 0, h: 0, lv: 0, c: 7650, o: 0, apto: 7650, clientesNoAlojados: 0, total: 7650 },
  { concepto: "Desayuno", ip: 0, pr: 0, m: 0, h: 0, lv: 0, c: 0, o: 0, apto: 0, clientesNoAlojados: 0, total: 0 },
  { concepto: "Almuerzo", ip: 0, pr: 0, m: 0, h: 0, lv: 0, c: 0, o: 0, apto: 0, clientesNoAlojados: 0, total: 0 },
  { concepto: "Cena", ip: 0, pr: 0, m: 0, h: 0, lv: 0, c: 0, o: 0, apto: 0, clientesNoAlojados: 0, total: 0 },
  { concepto: "Minibar", ip: 0, pr: 0, m: 0, h: 0, lv: 1632, c: 0, o: 1632, apto: 0, clientesNoAlojados: 1632, total: 1632 },
  { concepto: "Terraza Bar", ip: 0, pr: 0, m: 0, h: 0, lv: 0, c: 0, o: 0, apto: 0, clientesNoAlojados: 0, total: 0 },
  { concepto: "Souvenir", ip: 0, pr: 0, m: 0, h: 0, lv: 0, c: 0, o: 0, apto: 0, clientesNoAlojados: 0, total: 0 },
  { concepto: "Taxi", ip: 0, pr: 0, m: 0, h: 0, lv: 0, c: 0, o: 0, apto: 0, clientesNoAlojados: 0, total: 0 },
  { concepto: "Lavandería", ip: 0, pr: 0, m: 0, h: 0, lv: 0, c: 0, o: 0, apto: 0, clientesNoAlojados: 0, total: 0 },
  { concepto: "Otros", ip: 0, pr: 0, m: 0, h: 0, lv: 0, c: 0, o: 0, apto: 0, clientesNoAlojados: 0, total: 0 },
  { concepto: "Alquiler Terraza", ip: 0, pr: 0, m: 0, h: 0, lv: 0, c: 0, o: 0, apto: 0, clientesNoAlojados: 0, total: 0 },
  { concepto: "10%", ip: 0, pr: 0, m: 0, h: 0, lv: 1381.2, c: 0, o: 1381.2, apto: 0, clientesNoAlojados: 1381.2, total: 1381.2 },
  { concepto: "Propina", ip: 0, pr: 0, m: 0, h: 0, lv: 236.8, c: 0, o: 236.8, apto: 0, clientesNoAlojados: 236.8, total: 236.8 },
  { concepto: "Totales", ip: 0, pr: 0, m: 0, h: 0, lv: 10900, c: 0, o: 10900, apto: 0, clientesNoAlojados: 10900, total: 10900 },
];

const initialEfectivo: EfectivoRow[] = [
  {
    moneda: "CUP",
    denominaciones: [
      { denominacion: 1000, cantidad: 0, importe: 0 },
      { denominacion: 500, cantidad: -1, importe: -500 },
      { denominacion: 200, cantidad: 0, importe: 0 },
      { denominacion: 100, cantidad: -1, importe: -100 },
      { denominacion: 50, cantidad: 0, importe: 0 },
      { denominacion: 20, cantidad: 0, importe: 0 },
      { denominacion: 10, cantidad: 0, importe: 0 },
      { denominacion: 5, cantidad: 0, importe: 0 },
      { denominacion: 1, cantidad: 0, importe: 0 },
    ],
  },
  {
    moneda: "USD",
    denominaciones: [
      { denominacion: 1000, cantidad: 0, importe: 0 },
      { denominacion: 500, cantidad: 0, importe: 0 },
      { denominacion: 200, cantidad: 0, importe: 0 },
      { denominacion: 100, cantidad: 0, importe: 0 },
      { denominacion: 50, cantidad: 0, importe: 0 },
      { denominacion: 20, cantidad: 0, importe: 0 },
      { denominacion: 10, cantidad: 0, importe: 0 },
      { denominacion: 5, cantidad: 0, importe: 0 },
      { denominacion: 1, cantidad: 0, importe: 0 },
    ],
  },
  {
    moneda: "EUR",
    denominaciones: [
      { denominacion: 1000, cantidad: 0, importe: 0 },
      { denominacion: 500, cantidad: 0, importe: 0 },
      { denominacion: 200, cantidad: 0, importe: 0 },
      { denominacion: 100, cantidad: 0, importe: 0 },
      { denominacion: 50, cantidad: 0, importe: 0 },
      { denominacion: 20, cantidad: 1, importe: 20 },
      { denominacion: 10, cantidad: 0, importe: 0 },
      { denominacion: 5, cantidad: 0, importe: 0 },
      { denominacion: 1, cantidad: 0, importe: 0 },
    ],
  },
];

export function LiquidationForm({ onCancel, onCreate, initialData }: LiquidationFormProps) {
  const [fecha, setFecha] = useState(initialData?.fecha || "2026-03-19");
  const [jefesDeTurno, setJefesDeTurno] = useState(initialData?.jefesDeTurno || "Jenifer/Fabio");
  const [ingresos, setIngresos] = useState<IngresoRow[]>(initialData?.desgloseIngresos || initialIngresos);
  const [efectivo, setEfectivo] = useState<EfectivoRow[]>(initialData?.desgloseEfectivo || initialEfectivo);

  const handleIngresoChange = (index: number, field: keyof IngresoRow, value: string) => {
    const numValue = parseFloat(value) || 0;
    setIngresos(prev => prev.map((row, i) => i === index ? { ...row, [field]: numValue } : row));
  };

  const handleEfectivoChange = (monedaIndex: number, denomIndex: number, field: keyof DenominacionRow, value: string) => {
    const numValue = field === 'cantidad' ? parseInt(value) || 0 : parseFloat(value) || 0;
    setEfectivo(prev => prev.map((row, i) =>
      i === monedaIndex ? {
        ...row,
        denominaciones: row.denominaciones.map((d, j) => j === denomIndex ? { ...d, [field]: numValue, importe: field === 'cantidad' ? d.denominacion * numValue : d.importe } : d)
      } : row
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ fecha, jefesDeTurno, desgloseIngresos: ingresos, desgloseEfectivo: efectivo });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fecha">Fecha</Label>
          <Input id="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="jefes">Jefes de Turno</Label>
          <Input id="jefes" value={jefesDeTurno} onChange={(e) => setJefesDeTurno(e.target.value)} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Desglose de Ingresos</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Concepto</th>
                <th className="border border-gray-300 p-2">IP</th>
                <th className="border border-gray-300 p-2">PR</th>
                <th className="border border-gray-300 p-2">M</th>
                <th className="border border-gray-300 p-2">H</th>
                <th className="border border-gray-300 p-2">LV</th>
                <th className="border border-gray-300 p-2">C</th>
                <th className="border border-gray-300 p-2">O</th>
                <th className="border border-gray-300 p-2">Apto</th>
                <th className="border border-gray-300 p-2">Clientes no alojados</th>
                <th className="border border-gray-300 p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {ingresos.map((row, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{row.concepto}</td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      type="number"
                      value={row.ip}
                      onChange={(e) => handleIngresoChange(index, 'ip', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      type="number"
                      value={row.pr}
                      onChange={(e) => handleIngresoChange(index, 'pr', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      type="number"
                      value={row.m}
                      onChange={(e) => handleIngresoChange(index, 'm', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      type="number"
                      value={row.h}
                      onChange={(e) => handleIngresoChange(index, 'h', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      type="number"
                      value={row.lv}
                      onChange={(e) => handleIngresoChange(index, 'lv', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      type="number"
                      value={row.c}
                      onChange={(e) => handleIngresoChange(index, 'c', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      type="number"
                      value={row.o}
                      onChange={(e) => handleIngresoChange(index, 'o', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      type="number"
                      value={row.apto}
                      onChange={(e) => handleIngresoChange(index, 'apto', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      type="number"
                      value={row.clientesNoAlojados}
                      onChange={(e) => handleIngresoChange(index, 'clientesNoAlojados', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Input
                      type="number"
                      value={row.total}
                      onChange={(e) => handleIngresoChange(index, 'total', e.target.value)}
                      className="w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Desglose del Efectivo</h3>
        {efectivo.map((row, monedaIndex) => (
          <div key={row.moneda} className="mb-4">
            <h4 className="font-medium">Moneda: {row.moneda}</h4>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">Denominación</th>
                  <th className="border border-gray-300 p-2">Cantidad</th>
                  <th className="border border-gray-300 p-2">Importe</th>
                </tr>
              </thead>
              <tbody>
                {row.denominaciones.map((denom, denomIndex) => (
                  <tr key={denom.denominacion}>
                    <td className="border border-gray-300 p-2">{denom.denominacion}</td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        type="number"
                        value={denom.cantidad}
                        onChange={(e) => handleEfectivoChange(monedaIndex, denomIndex, 'cantidad', e.target.value)}
                        className="w-full"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">{denom.importe}</td>
                  </tr>
                ))}
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">Total</td>
                  <td className="border border-gray-300 p-2"></td>
                  <td className="border border-gray-300 p-2 font-semibold">
                    {row.denominaciones.reduce((sum, d) => sum + d.importe, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Crear Liquidación</Button>
      </div>
    </form>
  );
}

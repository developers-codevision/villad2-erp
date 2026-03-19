export interface InventoryRow {
  codigoProducto: string;
  um: string;
  inicial: number;
  entrada: number;
  consumo: number;
  merma: number;
  cuentaCasa: number;
  final: number;
  observaciones: string;
}

export interface IPVData {
  id: number;
  fecha: string;
  jefesDeTurno: string;
  seccion: 'Bar' | 'Cocina';
  rows: InventoryRow[];
}

export interface CreateIPVData {
  fecha: string;
  jefesDeTurno: string;
  seccion: 'Bar' | 'Cocina';
  rows: InventoryRow[];
}

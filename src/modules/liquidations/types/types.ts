export interface IngresoRow {
  concepto: string;
  ip: number;
  pr: number;
  m: number;
  h: number;
  lv: number;
  c: number;
  o: number;
  apto: number;
  clientesNoAlojados: number;
  total: number;
}

export interface DenominacionRow {
  denominacion: number;
  cantidad: number;
  importe: number;
}

export interface EfectivoRow {
  moneda: string;
  denominaciones: DenominacionRow[];
}

export interface Liquidation {
  id: number;
  fecha: string;
  jefesDeTurno: string;
  desgloseIngresos: IngresoRow[];
  desgloseEfectivo: EfectivoRow[];
}

export interface CreateLiquidationDto {
  fecha: string;
  jefesDeTurno: string;
  desgloseIngresos: IngresoRow[];
  desgloseEfectivo: EfectivoRow[];
}

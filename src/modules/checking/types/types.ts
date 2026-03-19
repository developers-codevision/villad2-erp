export type RoomStatus = "VL" | "VC" | "O" | "FO";

export interface Room {
  id: number;
  number: string;
  status: RoomStatus;
}

export const statusLabels: Record<RoomStatus, string> = {
  VL: "Vacío Limpio",
  VC: "Vacío Sucio",
  O: "Ocupado",
  FO: "Fuera de Orden",
};

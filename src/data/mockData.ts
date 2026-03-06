export type RoomStatus = "VL" | "VC" | "O" | "FO";

export interface Room {
  id: string;
  number: string;
  floor: number;
  status: RoomStatus;
}

export interface Reservation {
  id: string;
  roomId: string;
  guestName: string;
  startDate: string; // ISO date
  endDate: string;   // ISO date
  isHourly: boolean;
  startHour?: string;
  endHour?: string;
}

export const rooms: Room[] = [
  { id: "r1", number: "101", floor: 1, status: "VL" },
  { id: "r2", number: "102", floor: 1, status: "O" },
  { id: "r3", number: "201", floor: 2, status: "VC" },
  { id: "r4", number: "202", floor: 2, status: "FO" },
];

const today = new Date();
const fmt = (d: Date) => d.toISOString().split("T")[0];
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

export const reservations: Reservation[] = [
  {
    id: "res1",
    roomId: "r1",
    guestName: "Carlos García",
    startDate: fmt(addDays(today, 1)),
    endDate: fmt(addDays(today, 4)),
    isHourly: false,
  },
  {
    id: "res2",
    roomId: "r2",
    guestName: "María López",
    startDate: fmt(today),
    endDate: fmt(addDays(today, 2)),
    isHourly: false,
  },
  {
    id: "res3",
    roomId: "r3",
    guestName: "Juan Pérez",
    startDate: fmt(addDays(today, 5)),
    endDate: fmt(addDays(today, 5)),
    isHourly: true,
    startHour: "14:00",
    endHour: "18:00",
  },
  {
    id: "res4",
    roomId: "r1",
    guestName: "Ana Ruiz",
    startDate: fmt(addDays(today, 7)),
    endDate: fmt(addDays(today, 10)),
    isHourly: false,
  },
  {
    id: "res5",
    roomId: "r4",
    guestName: "Pedro Sánchez",
    startDate: fmt(addDays(today, 2)),
    endDate: fmt(addDays(today, 2)),
    isHourly: true,
    startHour: "09:00",
    endHour: "13:00",
  },
  {
    id: "res6",
    roomId: "r2",
    guestName: "Lucía Martín",
    startDate: fmt(addDays(today, 6)),
    endDate: fmt(addDays(today, 12)),
    isHourly: false,
  },
];

export const statusLabels: Record<RoomStatus, string> = {
  VL: "Vacía Limpia",
  VC: "Vacía Sucia",
  O: "Ocupada",
  FO: "Fuera de Orden",
};

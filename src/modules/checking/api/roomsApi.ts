import { apiFetch } from "@/api/client";
import type { Room } from "../types/types";

// Mapping from API status to frontend status
const apiToFrontendStatus = {
  vacia_limpia: "VL",
  vacia_sucia: "VC",
  ocupada: "O",
  fuera_de_orden: "FO",
} as const;

// Mapping from frontend status to API status
const frontendToApiStatus = {
  VL: "vacia_limpia",
  VC: "vacia_sucia",
  O: "ocupada",
  FO: "fuera_de_orden",
} as const;

type ApiRoom = {
  id: number;
  number: string;
  status: keyof typeof apiToFrontendStatus;
};

export async function getRooms(): Promise<Room[]> {
  const apiRooms = await apiFetch<ApiRoom[]>("/rooms", { method: "GET" });
  return apiRooms.map((room) => ({
    id: room.id,
    number: room.number,
    status: apiToFrontendStatus[room.status],
  }));
}

export async function updateRoomStatus(
  id: number,
  status: keyof typeof frontendToApiStatus
): Promise<Room> {
  const apiStatus = frontendToApiStatus[status];
  const apiRoom = await apiFetch<ApiRoom>(`/rooms/${id}/status/${apiStatus}`, {
    method: "PUT",
  });
  return {
    id: apiRoom.id,
    number: apiRoom.number,
    status: apiToFrontendStatus[apiRoom.status],
  };
}

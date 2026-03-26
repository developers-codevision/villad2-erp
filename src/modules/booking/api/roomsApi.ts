import { apiFetch } from "@/api/client";

export type ApiRoom = {
  id: number;
  number: string;
  name: string;
  roomType: string;
};

export async function getRooms(): Promise<ApiRoom[]> {
  return apiFetch<ApiRoom[]>("/rooms", { method: "GET" });
}

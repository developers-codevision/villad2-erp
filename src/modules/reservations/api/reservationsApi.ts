import { apiFetch } from "@/api/client";
import type { ReservationDTO, CreateReservationDTO, UpdateReservationDTO } from "../types/types";

const base = "/reservations";

export async function getReservations(query?: Record<string, any>) {
  return apiFetch<ReservationDTO[]>(base, { method: "GET", query });
}

export async function getReservation(id: string) {
  return apiFetch<ReservationDTO>(`${base}/${id}`, { method: "GET" });
}

export async function createReservation(payload: CreateReservationDTO) {
  return apiFetch<ReservationDTO>(base, { method: "POST", body: payload });
}

export async function updateReservation(id: string, payload: UpdateReservationDTO) {
  return apiFetch<ReservationDTO>(`${base}/${id}`, { method: "PATCH", body: payload });
}

export async function deleteReservation(id: string) {
  return apiFetch<void>(`${base}/${id}`, { method: "DELETE" });
}

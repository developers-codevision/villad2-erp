import { apiFetch } from "@/api/client";
import type { Reservation, CreateReservationDto } from "../types/api.types";

const base = "/reservations";

export async function getReservations(query?: Record<string, string | number | boolean | undefined>) {
  return apiFetch<Reservation[]>(base, { method: "GET", query });
}

export async function getReservation(id: string | number) {
  return apiFetch<Reservation>(`${base}/${id}`, { method: "GET" });
}

export async function createReservation(payload: CreateReservationDto) {
  return apiFetch<Reservation>(base, { method: "POST", body: payload });
}

export async function updateReservation(id: string | number, payload: Partial<CreateReservationDto>) {
  return apiFetch<Reservation>(`${base}/${id}`, { method: "PATCH", body: payload });
}

export async function deleteReservation(id: string | number) {
  return apiFetch<void>(`${base}/${id}`, { method: "DELETE" });
}

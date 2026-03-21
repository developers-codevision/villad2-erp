import { apiFetch } from "@/api/client";
import type { ClientDTO, CreateClientDTO, UpdateClientDTO } from "../types/types";

const base = "/clients";

export async function getClients(query?: Record<string, any>) {
  return apiFetch<ClientDTO[]>(base, { method: "GET", query });
}

export async function getClient(id: string) {
  return apiFetch<ClientDTO>(`${base}/${id}`, { method: "GET" });
}

export async function createClient(payload: CreateClientDTO) {
  return apiFetch<ClientDTO>(base, { method: "POST", body: payload });
}

export async function updateClient(id: string, payload: UpdateClientDTO) {
  return apiFetch<ClientDTO>(`${base}/${id}`, { method: "PATCH", body: payload });
}

export async function deleteClient(id: string) {
  return apiFetch<void>(`${base}/${id}`, { method: "DELETE" });
}

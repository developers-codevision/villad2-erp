import { apiFetch } from "@/api/client";
import type { IPVData, CreateIPVData } from "../types/types";

const base = "/ipv";

export async function getIPVs(query?: Record<string, string | number | boolean | undefined>) {
  return apiFetch<IPVData[]>(base, { method: "GET", query });
}

export async function getIPV(id: string | number) {
  return apiFetch<IPVData>(`${base}/${id}`, { method: "GET" });
}

export async function createIPV(payload: CreateIPVData) {
  return apiFetch<IPVData>(base, { method: "POST", body: payload });
}

export async function updateIPV(id: string | number, payload: Partial<CreateIPVData>) {
  return apiFetch<IPVData>(`${base}/${id}`, { method: "PATCH", body: payload });
}

export async function deleteIPV(id: string | number) {
  return apiFetch<void>(`${base}/${id}`, { method: "DELETE" });
}

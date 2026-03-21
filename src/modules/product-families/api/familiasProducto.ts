import { apiFetch } from "@/api/client";
import type { FamiliaProductoDTO, CreateFamiliaProductoDTO, UpdateFamiliaProductoDTO } from "../types";

const base = "/product-families";

export async function getFamilias(query?: Record<string, any>) {
  return apiFetch<FamiliaProductoDTO[]>(base, { method: "GET", query });
}

export async function getFamilia(id: string) {
  return apiFetch<FamiliaProductoDTO>(`${base}/${id}`, { method: "GET" });
}

export async function createFamilia(payload: CreateFamiliaProductoDTO) {
  return apiFetch<FamiliaProductoDTO>(base, { method: "POST", body: payload });
}

export async function updateFamilia(id: string, payload: UpdateFamiliaProductoDTO) {
  return apiFetch<FamiliaProductoDTO>(`${base}/${id}`, { method: "PATCH", body: payload });
}

export async function deleteFamilia(id: string) {
  return apiFetch<void>(`${base}/${id}`, { method: "DELETE" });
}

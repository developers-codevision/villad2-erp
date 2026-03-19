import { apiFetch } from "@/api/client";
import type { Liquidation, CreateLiquidationDto } from "../types/types";

const base = "/liquidations";

export async function getLiquidations(query?: Record<string, string | number | boolean | undefined>) {
  return apiFetch<Liquidation[]>(base, { method: "GET", query });
}

export async function getLiquidation(id: string | number) {
  return apiFetch<Liquidation>(`${base}/${id}`, { method: "GET" });
}

export async function createLiquidation(payload: CreateLiquidationDto) {
  return apiFetch<Liquidation>(base, { method: "POST", body: payload });
}

export async function updateLiquidation(id: string | number, payload: Partial<CreateLiquidationDto>) {
  return apiFetch<Liquidation>(`${base}/${id}`, { method: "PATCH", body: payload });
}

export async function deleteLiquidation(id: string | number) {
  return apiFetch<void>(`${base}/${id}`, { method: "DELETE" });
}

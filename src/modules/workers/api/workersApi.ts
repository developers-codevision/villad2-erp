import { apiFetch } from "@/api/client";
import type { WorkerDTO, CreateWorkerDTO, UpdateWorkerDTO } from "../types/types";

const base = "/trabajadores";

export async function getWorkers(query?: Record<string, any>) {
  return apiFetch<WorkerDTO[]>(base, { method: "GET", query });
}

export async function getWorker(id: string) {
  return apiFetch<WorkerDTO>(`${base}/${id}`, { method: "GET" });
}

export async function createWorker(payload: CreateWorkerDTO) {
  return apiFetch<WorkerDTO>(base, { method: "POST", body: payload });
}

export async function updateWorker(id: string, payload: UpdateWorkerDTO) {
  return apiFetch<WorkerDTO>(`${base}/${id}`, { method: "PATCH", body: payload });
}

export async function deleteWorker(id: string) {
  return apiFetch<void>(`${base}/${id}`, { method: "DELETE" });
}

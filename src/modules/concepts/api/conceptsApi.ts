import { apiFetch } from "@/api/client";
import type { ConceptDTO, CreateConceptDTO, UpdateConceptDTO } from "../types/types";

const base = "/concepts";

export async function getConcepts(query?: Record<string, any>) {
  return apiFetch<ConceptDTO[]>(base, { method: "GET", query });
}

export async function getConcept(id: string) {
  return apiFetch<ConceptDTO>(`${base}/${id}`, { method: "GET" });
}

export async function createConcept(payload: CreateConceptDTO) {
  return apiFetch<ConceptDTO>(base, { method: "POST", body: payload });
}

export async function updateConcept(id: string, payload: UpdateConceptDTO) {
  return apiFetch<ConceptDTO>(`${base}/${id}`, { method: "PATCH", body: payload });
}

export async function deleteConcept(id: string) {
  return apiFetch<void>(`${base}/${id}`, { method: "DELETE" });
}

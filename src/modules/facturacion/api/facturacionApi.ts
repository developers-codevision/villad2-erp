import { apiFetch } from "@/api/client";
import type { ConceptDTO } from "@/modules/concepts/types/types";
import type { CreateBillingDTO } from "../types/types";

const base = "/concepts";
const baseBilling = "/billing";

export async function getConceptsForFacturacion() {
  return apiFetch<ConceptDTO[]>(base, { method: "GET" });
}

export async function createBilling(payload: CreateBillingDTO) {
  return apiFetch(baseBilling, { method: "POST", body: payload });
}

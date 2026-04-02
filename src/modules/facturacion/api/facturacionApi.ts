import { apiFetch } from "@/api/client";
import type { ConceptDTO } from "@/modules/concepts/types/types";
import type {
  CreateBillingDTO,
  UpdateBillingDTO,
  CreateBillingRecordDTO,
  Billing,
  BillingRecord,
  DistributionResult,
  ReportResult,
  WorkerInputDto,
} from "../types/types";

const base = "/concepts";
const baseBilling = "/billing";
const baseBillingRecords = "/billing-records";

// Concepts
export async function getConceptsForFacturacion() {
  return apiFetch<ConceptDTO[]>(base, { method: "GET" });
}

// Billing CRUD
export async function getAllBillings() {
  return apiFetch<Billing[]>(baseBilling, { method: "GET" });
}

export async function createBilling(payload: CreateBillingDTO) {
  return apiFetch<Billing>(baseBilling, { method: "POST", body: payload });
}

export async function getBillingById(id: number) {
  return apiFetch<Billing>(`${baseBilling}/${id}`, { method: "GET" });
}

export async function updateBilling(id: number, payload: UpdateBillingDTO) {
  return apiFetch<Billing>(`${baseBilling}/${id}`, { method: "PATCH", body: payload });
}

export async function deleteBilling(id: number) {
  return apiFetch<void>(`${baseBilling}/${id}`, { method: "DELETE" });
}

export async function getBillingTemplate(date: string) {
  return apiFetch<Billing>(`${baseBilling}/template/${date}`, { method: "GET" });
}

// Billing Actions
export async function consumeBilling(id: number, date: string) {
  return apiFetch<any>(`${baseBilling}/${id}/consume?date=${encodeURIComponent(date)}`, { 
    method: "POST" 
  });
}

export async function parkBilling(id: number) {
  return apiFetch<Billing>(`${baseBilling}/${id}/park`, { method: "POST" });
}

// Process mixed payments - requires payment details
export async function processMixedPayments(
  billingRecordId: number, 
  payments: Array<{
    method: string;
    currency: string;
    amount: number;
    exchangeRate?: number;
    billDenominations?: Array<{ value: number; quantity: number }>;
  }>,
  useAdvanceBalance: boolean = false
) {
  return apiFetch<any>(`${baseBilling}/${billingRecordId}/pay`, { 
    method: "POST",
    body: { 
      payments,
      useAdvanceBalance 
    }
  });
}

export async function getPendingConsumption(id: number) {
  return apiFetch<any>(`${baseBilling}/${id}/pending-consumption`, { method: "GET" });
}

// Billing Records
export async function createBillingRecord(id: number, payload: CreateBillingRecordDTO) {
  return apiFetch<BillingRecord>(`${baseBilling}/${id}/record`, { method: "POST", body: payload });
}

export async function getAllBillingRecords() {
  return apiFetch<BillingRecord[]>(baseBillingRecords, { method: "POST" });
}

export async function getBillingRecordsByBillingId(billingId: number) {
  return apiFetch<BillingRecord[]>(`${baseBillingRecords}/billing/${billingId}`, { method: "GET" });
}

export async function getBillingRecordById(id: number) {
  return apiFetch<BillingRecord>(`${baseBillingRecords}/${id}`, { method: "GET" });
}

export async function deleteBillingRecord(id: number) {
  return apiFetch<void>(`${baseBillingRecords}/${id}`, { method: "DELETE" });
}

// Distribution and Reports
export async function distributeTips(recordId: number, workers: WorkerInputDto[]) {
  return apiFetch<DistributionResult[]>(`${baseBilling}/records/${recordId}/distribute-tips`, {
    method: "POST",
    body: { workers }
  });
}

export async function distributeTax10(recordId: number, workers: WorkerInputDto[]) {
  return apiFetch<DistributionResult[]>(`${baseBilling}/records/${recordId}/distribute-tax10`, {
    method: "POST",
    body: { workers }
  });
}

export async function getTipsReport(payload: { startDate: string; endDate: string }) {
  return apiFetch<ReportResult>(`${baseBilling}/reports/tips`, { 
    method: "POST", 
    body: payload 
  });
}

export async function getTax10Report(payload: { startDate: string; endDate: string }) {
  return apiFetch<ReportResult>(`${baseBilling}/reports/tax10`, { 
    method: "POST", 
    body: payload 
  });
}

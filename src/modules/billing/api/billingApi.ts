import { apiFetch } from "@/api/client";
import type {
  CreateBillingDto,
  UpdateBillingDto,
  BillingSheetDto,
  BillingSheetItemDto,
  CreateBillingRecordDto,
  BillingRecordDto,
  ProcessPaymentDto,
  DistributeTipDto,
} from "../types/types";

const base = "/billing";

// Billing Sheets
export async function getBillingSheets(query?: Record<string, any>) {
  return apiFetch<BillingSheetDto[]>(base, { method: "GET", query });
}

export async function getBillingSheet(id: number) {
  return apiFetch<BillingSheetDto>(`${base}/${id}`, { method: "GET" });
}

export async function createBillingSheet(payload: CreateBillingDto) {
  return apiFetch<BillingSheetDto>(base, { method: "POST", body: payload });
}

export async function updateBillingSheet(id: number, payload: UpdateBillingDto) {
  return apiFetch<BillingSheetDto>(`${base}/${id}`, { method: "PATCH", body: payload });
}

export async function deleteBillingSheet(id: number) {
  return apiFetch<void>(`${base}/${id}`, { method: "DELETE" });
}

export async function getBillingTemplate(date: string) {
  return apiFetch<BillingSheetDto>(`${base}/template/${date}`, { method: "GET" });
}

// Billing Items
export async function getBillingItem(id: number) {
  return apiFetch<BillingSheetItemDto>(`${base}/items/${id}`, { method: "GET" });
}

// Billing Records
export async function getAllBillingRecords(query?: Record<string, any>) {
  return apiFetch<BillingRecordDto[]>(`${base}/records/all`, { method: "GET", query });
}

export async function getBillingRecord(id: number) {
  return apiFetch<BillingRecordDto>(`${base}/records/${id}`, { method: "GET" });
}

export async function getBillingRecordsByBilling(billingId: number) {
  return apiFetch<BillingRecordDto[]>(`${base}/records/by-billing/${billingId}`, { method: "GET" });
}

export async function createBillingRecord(billingId: number, payload: CreateBillingRecordDto) {
  return apiFetch<BillingRecordDto>(`${base}/${billingId}/record`, { method: "POST", body: payload });
}

export async function deleteBillingRecord(id: number) {
  return apiFetch<void>(`${base}/records/${id}`, { method: "DELETE" });
}

export async function parkBillingRecord(id: number) {
  return apiFetch<BillingRecordDto>(`${base}/records/${id}/park`, { method: "POST" });
}

export async function processPayment(id: number, payload: ProcessPaymentDto) {
  return apiFetch<BillingRecordDto>(`${base}/records/${id}/pay`, { method: "POST", body: payload });
}

// Inventory
export async function consumeInventory(billingId: number) {
  return apiFetch<void>(`${base}/${billingId}/consume`, { method: "POST" });
}

export async function getPendingConsumption(billingId: number) {
  return apiFetch<BillingRecordDto[]>(`${base}/${billingId}/pending-consumption`, { method: "GET" });
}

// Tips and Tax Distribution
export async function distributeTips(id: number, payload: DistributeTipDto) {
  return apiFetch<void>(`${base}/records/${id}/distribute-tips`, { method: "POST", body: payload });
}

export async function distributeTax10(id: number, payload: DistributeTipDto) {
  return apiFetch<void>(`${base}/records/${id}/distribute-tax10`, { method: "POST", body: payload });
}

// Reports
export async function getInventoryReport(query?: Record<string, any>) {
  return apiFetch<any>(`${base}/reports/inventory`, { method: "GET", query });
}

export async function getTipReport(query?: Record<string, any>) {
  return apiFetch<any>(`${base}/reports/tips`, { method: "GET", query });
}

export async function getTax10Report(query?: Record<string, any>) {
  return apiFetch<any>(`${base}/reports/tax10`, { method: "GET", query });
}

export async function getDailyReport(date: string) {
  return apiFetch<any>(`${base}/reports/daily/${date}`, { method: "GET" });
}

import * as api from "@/modules/billing/api/billingApi";
import type {
  CreateBillingDto,
  UpdateBillingDto,
  CreateBillingRecordDto,
  ProcessPaymentDto,
  DistributeTipDto,
} from "@/modules/billing/types/types";

export const billingService = {
  // Billing Sheets
  listSheets: (query?: Record<string, any>) => api.getBillingSheets(query),
  getSheet: (id: number) => api.getBillingSheet(id),
  createSheet: (payload: CreateBillingDto) => api.createBillingSheet(payload),
  updateSheet: (id: number, payload: UpdateBillingDto) => api.updateBillingSheet(id, payload),
  removeSheet: (id: number) => api.deleteBillingSheet(id),
  getTemplate: (date: string) => api.getBillingTemplate(date),

  // Billing Items
  getItem: (id: number) => api.getBillingItem(id),

  // Billing Records
  listAllRecords: (query?: Record<string, any>) => api.getAllBillingRecords(query),
  getRecord: (id: number) => api.getBillingRecord(id),
  getRecordsByBilling: (billingId: number) => api.getBillingRecordsByBilling(billingId),
  createRecord: (billingId: number, payload: CreateBillingRecordDto) => 
    api.createBillingRecord(billingId, payload),
  removeRecord: (id: number) => api.deleteBillingRecord(id),
  parkRecord: (id: number) => api.parkBillingRecord(id),
  processPayment: (id: number, payload: ProcessPaymentDto) => api.processPayment(id, payload),

  // Inventory
  consumeInventory: (billingId: number) => api.consumeInventory(billingId),
  getPendingConsumption: (billingId: number) => api.getPendingConsumption(billingId),

  // Tips and Tax
  distributeTips: (id: number, payload: DistributeTipDto) => api.distributeTips(id, payload),
  distributeTax10: (id: number, payload: DistributeTipDto) => api.distributeTax10(id, payload),

  // Reports
  getInventoryReport: (query?: Record<string, any>) => api.getInventoryReport(query),
  getTipReport: (query?: Record<string, any>) => api.getTipReport(query),
  getTax10Report: (query?: Record<string, any>) => api.getTax10Report(query),
  getDailyReport: (date: string) => api.getDailyReport(date),
};

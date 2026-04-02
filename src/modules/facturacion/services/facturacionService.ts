import * as api from "../api/facturacionApi";
import type {
  CreateBillingDTO,
  UpdateBillingDTO,
  CreateBillingRecordDTO,
} from "../types/types";

export const facturacionService = {
  // Concepts
  getConcepts: () => api.getConceptsForFacturacion(),

  // Billing CRUD
  getAllBillings: () => api.getAllBillings(),
  createBilling: (payload: CreateBillingDTO) => api.createBilling(payload),
  getBillingById: (id: number) => api.getBillingById(id),
  updateBilling: (id: number, payload: UpdateBillingDTO) => api.updateBilling(id, payload),
  deleteBilling: (id: number) => api.deleteBilling(id),
  getBillingTemplate: (date: string) => api.getBillingTemplate(date),

  // Billing Actions
  consumeBilling: (id: number) => api.consumeBilling(id),
  parkBilling: (id: number) => api.parkBilling(id),
  payBilling: (id: number) => api.payBilling(id),
  getPendingConsumption: (id: number) => api.getPendingConsumption(id),

  // Billing Records
  createBillingRecord: (id: number, payload: CreateBillingRecordDTO) => 
    api.createBillingRecord(id, payload),
  getAllBillingRecords: () => api.getAllBillingRecords(),
  getBillingRecordsByBillingId: (billingId: number) => 
    api.getBillingRecordsByBillingId(billingId),
  getBillingRecordById: (id: number) => api.getBillingRecordById(id),
  deleteBillingRecord: (id: number) => api.deleteBillingRecord(id),

  // Distribution and Reports
  distributeTips: (recordId: number, workers: WorkerInputDto[]) => api.distributeTips(recordId, workers),
  distributeTax10: (recordId: number, workers: WorkerInputDto[]) => api.distributeTax10(recordId, workers),
  getTipsReport: (startDate: string, endDate: string) =>
    api.getTipsReport({ startDate, endDate }),
  getTax10Report: (startDate: string, endDate: string) => 
    api.getTax10Report({ startDate, endDate }),
};

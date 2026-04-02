export interface FacturacionItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface FacturacionGroup {
  category: string;
  items: FacturacionItem[];
}

// Billing DTOs from API
export interface CreateBillingDTO {
  date?: string; // YYYY-MM-DD, defaults to today if not provided
}

export interface UpdateBillingItemDto {
  conceptId: number;
  quantity: number;
}

export interface BillDenominationDto {
  value: number; // Valor del billete (ej: 10, 20, 50)
  quantity: number; // Cantidad de billetes
}

export interface ConceptConsumptionDto {
  conceptId: number;
  conceptName: string;
  quantityConsumed: number;
}

export interface ProductConsumptionDto {
  productId: number;
  productName: string;
  quantityConsumed: number;
}

export interface UpdateBillingDTO {
  usdToCupRate?: number;
  eurToCupRate?: number;
  items?: UpdateBillingItemDto[];
  billDenominations?: BillDenominationDto[];
  totalPaid?: number;
  totalAmount?: number;
  change?: number;
  tip?: number;
  tax10Percent?: number;
  productConsumptions?: ProductConsumptionDto[];
}

export interface CreateBillingRecordDTO {
  billingId: number;
  date: string; // YYYY-MM-DD
  billDenominations: BillDenominationDto[];
  totalPaid: number;
  totalAmount: number;
  change: number;
  tip: number;
  tax10Percent: number;
  conceptConsumptions: ConceptConsumptionDto[];
}

export interface Billing {
  id: number;
  date: string;
  usdToCupRate: number;
  eurToCupRate: number;
  totalAmount?: number;
  totalPaid?: number;
  change?: number;
  tip?: number;
  tax10Percent?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BillingRecord {
  id: number;
  billingId: number;
  date: string;
  totalPaid: number;
  totalAmount: number;
  change: number;
  tip: number;
  tax10Percent: number;
  createdAt: string;
  updatedAt: string;
}

export interface DistributionResult {
  staffId: number;
  staffName: string;
  amount: number;
}

export interface ReportResult {
  totalAmount: number;
  distributions: DistributionResult[];
}

export interface WorkerInputDto {
  workerId: number;
  workerName: string;
  percentage: number;
}

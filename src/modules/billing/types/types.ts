// Payment Methods
export type PaymentMethod =
  | "cash_usd"
  | "cash_eur"
  | "cash_cup"
  | "transfer_mobile"
  | "bizum"
  | "zelle"
  | "transfer_abroad"
  | "stripe"
  | "paypal";

export type Currency = "USD" | "EUR" | "CUP";

// Bill Denomination
export interface BillDenominationDto {
  currency: Currency;
  value: number;
  quantity: number;
}

// Billing Payment
export interface BillingPaymentDto {
  paymentMethod: PaymentMethod;
  amount?: number;
  billDenominations?: BillDenominationDto[];
}

// Billing Item (for inventory consumption)
export interface BillingItemDto {
  productId: number;
  productQuantity: number;
}

// Update Billing Item
export interface UpdateBillingItemDto {
  conceptId: number;
  quantity: number;
  priceUsd: number;
}

// Create Billing
export interface CreateBillingDto {
  date?: string; // YYYY-MM-DD format
}

// Update Billing
export interface UpdateBillingDto {
  usdToCupRate?: number;
  eurToCupRate?: number;
  items?: UpdateBillingItemDto[];
}

// Billing Sheet Response
export interface BillingSheetDto {
  id: number;
  date: string;
  usdToCupRate: number;
  eurToCupRate: number;
  items: BillingSheetItemDto[];
  createdAt: string;
  updatedAt: string;
}

// Concept
export interface ConceptDto {
  id: number;
  name: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// Billing Sheet Item
export interface BillingSheetItemDto {
  id: number;
  billingId?: number;
  conceptId: number;
  conceptName?: string;
  quantity: number;
  priceUsd: number;
  totalUsd: number;
  totalCup?: number;
  concept?: ConceptDto;
}

// Create Billing Record
export interface CreateBillingRecordDto {
  billingId: number;
  billingItemId: number;
  quantity: number;
  unitPrice: number;
  reservationId?: number;
  items: BillingItemDto[];
  tip: number;
  tax10?: number;
  payments?: BillingPaymentDto[];
  consumeImmediately?: boolean;
  lateBilling?: boolean;
}

// Billing Record Response
export interface BillingRecordDto {
  id: number;
  billingId: number;
  billingItemId: number;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  tip: number;
  tax10?: number;
  reservationId?: number;
  consumeImmediately: boolean;
  lateBilling: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  payments?: PaymentDto[];
}

// Payment Input
export interface PaymentInputDto {
  paymentMethod: PaymentMethod;
  currency: Currency;
  amount: number;
  exchangeRate?: number;
  billDenominations?: BillDenominationDto[];
  isAdvance?: boolean;
}

// Process Payment
export interface ProcessPaymentDto {
  payments: PaymentInputDto[];
  useAdvanceBalance?: boolean;
}

// Payment Response
export interface PaymentDto {
  id: number;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: Currency;
  exchangeRate?: number;
  createdAt: string;
}

// Worker Input for tip distribution
export interface WorkerInputDto {
  workerId: number;
  workerName: string;
  percentage: number;
}

// Distribute Tip
export interface DistributeTipDto {
  workers: WorkerInputDto[];
}

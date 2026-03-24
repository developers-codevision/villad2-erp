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

export interface BillingItem {
  conceptId: string;
  quantity: number;
}

export interface CreateBillingDTO {
  date: string;
  usdToCupRate: number;
  eurToCupRate: number;
  items: BillingItem[];
}

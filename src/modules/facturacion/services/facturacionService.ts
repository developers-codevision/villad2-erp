import * as api from "../api/facturacionApi";
import type { CreateBillingDTO } from "../types/types";

export const facturacionService = {
  getConcepts: () => api.getConceptsForFacturacion(),
  create: (payload: CreateBillingDTO) => api.createBilling(payload),
};

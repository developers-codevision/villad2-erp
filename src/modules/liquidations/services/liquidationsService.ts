import * as api from "../api/liquidations";
import type { CreateLiquidationDto } from "../types/types";

export const liquidationsService = {
  list: (query?: Record<string, any>) => api.getLiquidations(query),
  get: (id: string | number) => api.getLiquidation(id),
  create: (payload: CreateLiquidationDto) => api.createLiquidation(payload),
  update: (id: string | number, payload: Partial<CreateLiquidationDto>) => api.updateLiquidation(id, payload),
  remove: (id: string | number) => api.deleteLiquidation(id),
};

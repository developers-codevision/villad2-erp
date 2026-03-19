import * as api from "../api/ipv";
import type { CreateIPVData } from "../types/types";

export const ipvService = {
  list: (query?: Record<string, any>) => api.getIPVs(query),
  get: (id: string | number) => api.getIPV(id),
  create: (payload: CreateIPVData) => api.createIPV(payload),
  update: (id: string | number, payload: Partial<CreateIPVData>) => api.updateIPV(id, payload),
  remove: (id: string | number) => api.deleteIPV(id),
};

import * as api from "@/modules/product-families/api/familiasProducto";
import type { CreateFamiliaProductoDTO, UpdateFamiliaProductoDTO } from "@/modules/product-families/types/types";

export const familiasService = {
  list: (query?: Record<string, any>) => api.getFamilias(query),
  get: (id: string) => api.getFamilia(id),
  create: (payload: CreateFamiliaProductoDTO) => api.createFamilia(payload),
  update: (id: string, payload: UpdateFamiliaProductoDTO) => api.updateFamilia(id, payload),
  remove: (id: string) => api.deleteFamilia(id),
};

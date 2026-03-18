import * as api from "@/modules/products/api/productsApi";
import type { CreateProductDTO, UpdateProductDTO } from "@/modules/products/types/types";

export const productsService = {
  list: (query?: Record<string, any>) => api.getProducts(query),
  get: (id: string) => api.getProduct(id),
  create: (payload: CreateProductDTO) => api.createProduct(payload),
  update: (id: string, payload: UpdateProductDTO) => api.updateProduct(id, payload),
  remove: (id: string) => api.deleteProduct(id),
};


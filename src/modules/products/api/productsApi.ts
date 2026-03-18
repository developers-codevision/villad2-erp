import { apiFetch } from "@/api/client";
import type { ProductDTO, CreateProductDTO, UpdateProductDTO } from "../types/types";

const base = "/products";

export async function getProducts(query?: Record<string, any>) {
  return apiFetch<ProductDTO[]>(base, { method: "GET", query });
}

export async function getProduct(id: string) {
  return apiFetch<ProductDTO>(`${base}/${id}`, { method: "GET" });
}

export async function createProduct(payload: CreateProductDTO) {
  return apiFetch<ProductDTO>(base, { method: "POST", body: payload });
}

export async function updateProduct(id: string, payload: UpdateProductDTO) {
  return apiFetch<ProductDTO>(`${base}/${id}`, { method: "PATCH", body: payload });
}

export async function deleteProduct(id: string) {
  return apiFetch<void>(`${base}/${id}`, { method: "DELETE" });
}


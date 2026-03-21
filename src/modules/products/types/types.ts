export interface ProductDTO {
  id: string;
  code: number;
  name: string;
  unitMeasure: string;
  volume: string;
  productFamilyId: number;
}

export type CreateProductDTO = Omit<ProductDTO, "id">;
export type UpdateProductDTO = Partial<CreateProductDTO>;

export interface ProductDTO {
  id: string;
  name: string;
  familyId: string; // referencia a la familia de producto
  quantity: number;
  unit: string; // unidad de medida
}

export type CreateProductDTO = Omit<ProductDTO, "id">;
export type UpdateProductDTO = Partial<CreateProductDTO>;


export interface FamiliaProductoDTO {
  id: string;
  name: string;
  code: number;
}

export type CreateFamiliaProductoDTO = Omit<FamiliaProductoDTO, "id">;
export type UpdateFamiliaProductoDTO = Partial<CreateFamiliaProductoDTO>;


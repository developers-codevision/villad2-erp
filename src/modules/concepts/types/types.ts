export interface ConceptDTO {
  id: string;
  name: string;
  priceUsd: number;
  category: string;
}

export type CreateConceptDTO = Omit<ConceptDTO, "id">;
export type UpdateConceptDTO = Partial<CreateConceptDTO>;

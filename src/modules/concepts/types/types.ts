export interface ConceptDTO {
  id: string;
  name: string;
  priceUsd: number;
  category: string;
  products?: ConceptProductDTO[];
}

export interface ConceptProductDTO {
  productId: number;
  quantity: number;
}

export type CreateConceptDTO = {
  name: string;
  category?: string;
  products?: ConceptProductDTO[];
  billingId?: number;
  price?: number;
};

export type UpdateConceptDTO = Partial<CreateConceptDTO>;

import * as api from "@/modules/concepts/api/conceptsApi";
import type { CreateConceptDTO, UpdateConceptDTO } from "@/modules/concepts/types/types";

export const conceptsService = {
  list: (query?: Record<string, any>) => api.getConcepts(query),
  get: (id: string) => api.getConcept(id),
  create: (payload: CreateConceptDTO) => api.createConcept(payload),
  update: (id: string, payload: UpdateConceptDTO) => api.updateConcept(id, payload),
  remove: (id: string) => api.deleteConcept(id),
};

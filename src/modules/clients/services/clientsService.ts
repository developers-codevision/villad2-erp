import * as api from "@/modules/clients/api/clientsApi";
import type { CreateClientDTO, UpdateClientDTO } from "@/modules/clients/types/types";

export const clientsService = {
  list: (query?: Record<string, any>) => api.getClients(query),
  get: (id: string) => api.getClient(id),
  create: (payload: CreateClientDTO) => api.createClient(payload),
  update: (id: string, payload: UpdateClientDTO) => api.updateClient(id, payload),
  remove: (id: string) => api.deleteClient(id),
};

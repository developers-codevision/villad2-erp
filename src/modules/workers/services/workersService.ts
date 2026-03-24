import * as api from "@/modules/workers/api/workersApi";
import type { CreateWorkerDTO, UpdateWorkerDTO } from "@/modules/workers/types/types";

export const workersService = {
  list: (query?: Record<string, any>) => api.getWorkers(query),
  get: (id: string) => api.getWorker(id),
  create: (payload: CreateWorkerDTO) => api.createWorker(payload),
  update: (id: string, payload: UpdateWorkerDTO) => api.updateWorker(id, payload),
  remove: (id: string) => api.deleteWorker(id),
};

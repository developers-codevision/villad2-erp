export interface WorkerDTO {
  id: string;
  name: string;
}

export type CreateWorkerDTO = Omit<WorkerDTO, "id">;
export type UpdateWorkerDTO = Partial<CreateWorkerDTO>;

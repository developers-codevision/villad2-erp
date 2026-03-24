import * as api from "@/modules/reservations/api/reservationsApi";
import type { CreateReservationDTO, UpdateReservationDTO } from "@/modules/reservations/types/types";

export const reservationsService = {
  list: (query?: Record<string, any>) => api.getReservations(query),
  get: (id: string) => api.getReservation(id),
  create: (payload: CreateReservationDTO) => api.createReservation(payload),
  update: (id: string, payload: UpdateReservationDTO) => api.updateReservation(id, payload),
  remove: (id: string) => api.deleteReservation(id),
};

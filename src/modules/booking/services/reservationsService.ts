import * as api from "../api/reservations";
import type { CreateReservationDto } from "../types/types";

export const reservationsService = {
  list: (query?: Record<string, any>) => api.getReservations(query),
  get: (id: string | number) => api.getReservation(id),
  create: (payload: CreateReservationDto) => api.createReservation(payload),
  update: (id: string | number, payload: Partial<CreateReservationDto>) => api.updateReservation(id, payload),
  remove: (id: string | number) => api.deleteReservation(id),
};




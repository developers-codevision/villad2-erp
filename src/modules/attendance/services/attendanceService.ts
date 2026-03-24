import * as api from "@/modules/attendance/api/attendanceApi";
import type { CreateAttendanceDTO, UpdateAttendanceDTO } from "@/modules/attendance/types/types";

export const attendanceService = {
  list: (date: string) => api.getAttendances(date),
  get: (id: string) => api.getAttendance(id),
  create: (payload: CreateAttendanceDTO) => api.createAttendance(payload),
  update: (id: string, payload: UpdateAttendanceDTO) => api.updateAttendance(id, payload),
  remove: (id: string) => api.deleteAttendance(id),
};

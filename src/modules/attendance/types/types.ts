export interface AttendanceDTO {
  id: string;
  workerId: string;
  date: string; // YYYY-MM-DD
  checkInTime: string | null; // HH:MM
}

export type CreateAttendanceDTO = Omit<AttendanceDTO, "id">;
export type UpdateAttendanceDTO = Partial<CreateAttendanceDTO>;

export interface WorkerAttendance {
  workerId: string;
  workerName: string;
  checkInTime: string | null;
}

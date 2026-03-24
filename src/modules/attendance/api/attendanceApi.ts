import { apiFetch } from "@/api/client";
import type { AttendanceDTO, CreateAttendanceDTO, UpdateAttendanceDTO } from "../types/types";

const base = "/attendance";

export async function getAttendances(date: string) {
  return apiFetch<AttendanceDTO[]>(base, { method: "GET", query: { date } });
}

export async function getAttendance(id: string) {
  return apiFetch<AttendanceDTO>(`${base}/${id}`, { method: "GET" });
}

export async function createAttendance(payload: CreateAttendanceDTO) {
  return apiFetch<AttendanceDTO>(base, { method: "POST", body: payload });
}

export async function updateAttendance(id: string, payload: UpdateAttendanceDTO) {
  return apiFetch<AttendanceDTO>(`${base}/${id}`, { method: "PATCH", body: payload });
}

export async function deleteAttendance(id: string) {
  return apiFetch<void>(`${base}/${id}`, { method: "DELETE" });
}

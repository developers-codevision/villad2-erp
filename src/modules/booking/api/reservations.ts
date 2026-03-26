import { apiFetch } from "@/api/client";
import type { ReservationWithDetails, Reservation, CreateReservationDto } from "../types/types";

const base = "/reservations";

export async function getReservations(query?: Record<string, string | number | boolean | undefined>) {
  const response = await apiFetch<{ reservations: any[] }>(base, { method: "GET", query });
  return response.reservations.map((res: any) => ({
    id: res.id,
    roomId: res.room.id,
    userId: res.clientId,
    checkInDate: res.checkInDate.split('T')[0], // Extract date part
    checkOutDate: res.checkOutDate.split('T')[0],
    mainGuest: {
      firstName: res.client.firstName,
      lastName: res.client.lastName,
      email: res.client.email,
      phone: res.client.phone,
      sex: res.client.sex,
    },
    baseGuestsCount: res.baseGuestsCount,
    extraGuestsCount: res.extraGuestsCount,
    totalPrice: parseFloat(res.totalPrice),
    status: res.status,
    notes: res.notes,
    additionalGuests: res.additionalGuests,
    earlyCheckIn: res.earlyCheckIn,
    lateCheckOut: res.lateCheckOut,
    transferOneWay: res.transferOneWay,
    transferRoundTrip: res.transferRoundTrip,
    breakfasts: res.breakfasts,
    createdAt: res.reservedAt,
    updatedAt: res.reservedAt, // Assuming no updatedAt in response
    room: {
      number: res.room.number,
      name: res.room.name,
      roomType: res.room.roomType,
    },
  })) as ReservationWithDetails[];
}

export async function getReservation(id: string | number) {
  return apiFetch<Reservation>(`${base}/${id}`, { method: "GET" });
}

export async function createReservation(payload: CreateReservationDto) {
  return apiFetch<Reservation>(base, { method: "POST", body: payload });
}

export async function updateReservation(id: string | number, payload: Partial<CreateReservationDto>) {
  return apiFetch<Reservation>(`${base}/${id}`, { method: "PATCH", body: payload });
}

export async function deleteReservation(id: string | number) {
  return apiFetch<void>(`${base}/${id}`, { method: "DELETE" });
}

export async function checkInReservation(id: string | number) {
  return apiFetch<Reservation>(`${base}/${id}/check-in`, { method: "POST" });
}

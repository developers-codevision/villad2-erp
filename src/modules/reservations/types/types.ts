export interface ReservationDTO {
  id: string;
  clientNumber: string;
  name: string;
  lastName: string;
  ciOrPassport: string;
  nationality: string;
  birthDate: string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkOutTime: string;
  stayHours: number;
  phone: string;
  room: string;
  observations: string;
  invoiceNumber: string;
  cupAmount: number;
}

export type CreateReservationDTO = Omit<ReservationDTO, "id">;
export type UpdateReservationDTO = Partial<CreateReservationDTO>;

// API Types and Interfaces - Single Source of Truth

// ============================================
// ENUMS
// ============================================

export enum RoomType {
  STANDARD_ECONOMIC = 'standard_economic',
  STANDARD = 'standard',
  STANDARD_PLUS = 'standard_plus',
  SUITE_BALCONY = 'suite_balcony',
}

export enum RoomStatus {
  VACIA_LIMPIA = 'vacia_limpia',
  VACIA_SUCIA = 'vacia_sucia',
  FUERA_DE_ORDEN = 'fuera_de_orden',
  OCUPADA = 'ocupada',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum ReservationStatus {
  PENDING = 'pendiente',
  CONFIRMED = 'confirmada',
  CANCELLED = 'cancelada',
  FINISHED = 'terminada',
  CHECKED_IN = 'checked_in',
  NO_SHOW = 'no_show',
}

// ============================================
// ROOM INTERFACES
// ============================================

export interface Room {
  id: number;
  number: string;
  name: string;
  description: string;
  pricePerNight: number;
  baseCapacity: number;
  extraCapacity: number;
  extraGuestCharge: number;
  roomType: RoomType;
  roomAmenities: string[];
  bathroomAmenities: string[];
  status: RoomStatus;
  mainPhoto: string[];
  additionalPhotos: string[];
}

// ============================================
// GUEST INTERFACES
// ============================================

export interface GuestInfo {
  firstName: string;
  lastName: string;
  sex: 'M' | 'F' | 'otro';
}

export interface MainGuestInfo extends GuestInfo {
  email: string;
  phone: string;
}

// ============================================
// RESERVATION INTERFACES
// ============================================

export interface Reservation {
  id: number;
  roomId: number;
  userId?: number;
  checkInDate: string;
  checkOutDate: string;
  mainGuest: MainGuestInfo;
  baseGuestsCount: number;
  extraGuestsCount: number;
  totalPrice: number;
  status: ReservationStatus;
  notes?: string;
  additionalGuests?: GuestInfo[];
  earlyCheckIn: boolean;
  lateCheckOut: boolean;
  transferOneWay: boolean;
  transferRoundTrip: boolean;
  breakfasts: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationDto {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  mainGuest: MainGuestInfo;
  baseGuestsCount: number;
  extraGuestsCount: number;
  status?: ReservationStatus;
  notes?: string;
  additionalGuests?: GuestInfo[];
  earlyCheckIn?: boolean;
  lateCheckOut?: boolean;
  transferOneWay?: boolean;
  transferRoundTrip?: boolean;
  breakfasts?: number;
}


/**
 * Extended reservation with room details for admin view
 */
export interface ReservationWithDetails extends Reservation {
  room?: {
    number: string;
    name: string;
    roomType: string;
  };
}

/**
 * Spanish labels for reservation statuses
 */
export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: 'Pendiente',
  [ReservationStatus.CONFIRMED]: 'Confirmada',
  [ReservationStatus.CANCELLED]: 'Cancelada',
  [ReservationStatus.FINISHED]: 'Terminada',
  [ReservationStatus.CHECKED_IN]: 'Checkeado',
  [ReservationStatus.NO_SHOW]: 'No Show',
};

/**
 * Badge variants for reservation statuses
 */
export const RESERVATION_STATUS_VARIANTS: Record<
  ReservationStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  [ReservationStatus.PENDING]: 'outline',
  [ReservationStatus.CONFIRMED]: 'default',
  [ReservationStatus.CANCELLED]: 'destructive',
  [ReservationStatus.FINISHED]: 'secondary',
  [ReservationStatus.CHECKED_IN]: 'default',
  [ReservationStatus.NO_SHOW]: 'destructive',
};

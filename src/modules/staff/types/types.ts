// Staff Types - TypeScript definitions for staff management

export interface Staff {
  id: number;
  staffname: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffDTO {
  staffname: string;
}

export interface UpdateStaffDTO {
  staffname?: string;
}

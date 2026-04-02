// Staff API - API calls for staff management

import { apiFetch } from '@/api/client';
import type { Staff, CreateStaffDTO, UpdateStaffDTO } from '../types/types';

const STAFF_API_BASE = '/staff';

export const staffApi = {
  // Get all staffs
  getAllStaffs: async (): Promise<Staff[]> => {
    const response = await apiFetch<Staff[]>(STAFF_API_BASE, { method: 'GET' });
    return response;
  },

  // Get staff by ID
  getStaffById: async (id: number): Promise<Staff> => {
    const response = await apiFetch<Staff>(`${STAFF_API_BASE}/${id}`, { method: 'GET' });
    return response;
  },

  // Create new staff
  createStaff: async (data: CreateStaffDTO): Promise<Staff> => {
    const response = await apiFetch<Staff>(STAFF_API_BASE, { method: 'POST', body: data });
    return response;
  },

  // Update staff
  updateStaff: async (id: number, data: UpdateStaffDTO): Promise<Staff> => {
    const response = await apiFetch<Staff>(`${STAFF_API_BASE}/${id}`, { method: 'PATCH', body: data });
    return response;
  },

  // Delete staff
  deleteStaff: async (id: number): Promise<void> => {
    await apiFetch<void>(`${STAFF_API_BASE}/${id}`, { method: 'DELETE' });
  },
};

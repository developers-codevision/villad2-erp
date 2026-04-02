// Staff Service - Service layer for staff operations

import { staffApi } from '../api/staffApi';
import type { Staff, CreateStaffDTO, UpdateStaffDTO } from '../types/types';

export const staffService = {
  // Get all staffs
  getAllStaffs: () => staffApi.getAllStaffs(),

  // Get staff by ID
  getStaffById: (id: number) => staffApi.getStaffById(id),

  // Create new staff
  createStaff: (data: CreateStaffDTO) => staffApi.createStaff(data),

  // Update staff
  updateStaff: (id: number, data: UpdateStaffDTO) => staffApi.updateStaff(id, data),

  // Delete staff
  deleteStaff: (id: number) => staffApi.deleteStaff(id),
};

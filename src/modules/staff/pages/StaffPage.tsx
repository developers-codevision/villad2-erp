// Staff Page - Main page for staff management

import { useState } from 'react';
import { useStaff } from '../hooks/useStaff';
import { StaffList } from '../components/StaffList';
import { StaffForm } from '../components/StaffForm';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Staff, CreateStaffDTO, UpdateStaffDTO } from '../types/types';

export default function StaffPage() {
  const {
    staffs,
    selectedStaffId,
    setSelectedStaffId,
    loading,
    createStaff,
    updateStaff,
    deleteStaff,
    creating,
    updating,
  } = useStaff();

  const [formOpen, setFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const handleCreate = () => {
    setEditingStaff(null);
    setFormOpen(true);
  };

  const handleEdit = (staff: Staff) => {
    setEditingStaff(staff);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: CreateStaffDTO | UpdateStaffDTO) => {
    if (editingStaff) {
      await updateStaff(editingStaff.id, data);
    } else {
      await createStaff(data as CreateStaffDTO);
    }
    setFormOpen(false);
  };

  const handleDelete = async (id: number) => {
    await deleteStaff(id);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Staff</h2>
        <Button onClick={handleCreate} disabled={creating}>
          <Plus className="h-4 w-4 mr-2" />
          {creating ? 'Creando...' : 'Nuevo Staff'}
        </Button>
      </div>

      <StaffList
        staffs={staffs}
        selectedId={selectedStaffId}
        onSelect={setSelectedStaffId}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <StaffForm
        open={formOpen}
        onOpenChange={setFormOpen}
        editingStaff={editingStaff}
        onSubmit={handleFormSubmit}
        loading={creating || updating}
      />
    </div>
  );
}

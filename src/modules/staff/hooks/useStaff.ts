// Staff Hook - React hook for staff management

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService } from '../services/staffService';
import type { Staff, CreateStaffDTO, UpdateStaffDTO } from '../types/types';
import { useToast } from '@/hooks/use-toast';

export const useStaff = () => {
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all staffs
  const {
    data: staffs = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['staffs'],
    queryFn: staffService.getAllStaffs,
  });

  // Create staff mutation
  const createStaffMutation = useMutation({
    mutationFn: (data: CreateStaffDTO) => staffService.createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffs'] });
      toast({
        title: 'Staff creado',
        description: 'El staff se ha creado correctamente.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo crear el staff.',
        variant: 'destructive',
      });
    },
  });

  // Update staff mutation
  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStaffDTO }) =>
      staffService.updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffs'] });
      toast({
        title: 'Staff actualizado',
        description: 'El staff se ha actualizado correctamente.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el staff.',
        variant: 'destructive',
      });
    },
  });

  // Delete staff mutation
  const deleteStaffMutation = useMutation({
    mutationFn: (id: number) => staffService.deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffs'] });
      toast({
        title: 'Staff eliminado',
        description: 'El staff se ha eliminado correctamente.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el staff.',
        variant: 'destructive',
      });
    },
  });

  const createStaff = async (data: CreateStaffDTO) => {
    await createStaffMutation.mutateAsync(data);
  };

  const updateStaff = async (id: number, data: UpdateStaffDTO) => {
    await updateStaffMutation.mutateAsync({ id, data });
  };

  const deleteStaff = async (id: number) => {
    await deleteStaffMutation.mutateAsync(id);
  };

  return {
    // State
    staffs,
    selectedStaffId,
    setSelectedStaffId,
    loading,
    error,

    // Actions
    createStaff,
    updateStaff,
    deleteStaff,

    // Mutation states
    creating: createStaffMutation.isPending,
    updating: updateStaffMutation.isPending,
    deleting: deleteStaffMutation.isPending,
  };
};

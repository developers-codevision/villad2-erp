import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingService } from "../services/billingService";
import type {
  CreateBillingDto,
  UpdateBillingDto,
  CreateBillingRecordDto,
  ProcessPaymentDto,
} from "../types/types";
import { toast } from "sonner";

// Query Keys
export const billingKeys = {
  all: ["billing"] as const,
  sheets: () => [...billingKeys.all, "sheets"] as const,
  sheet: (id: number) => [...billingKeys.all, "sheet", id] as const,
  records: (billingId: number) => [...billingKeys.all, "records", billingId] as const,
  item: (id: number) => [...billingKeys.all, "item", id] as const,
};

// Billing Sheets Hooks
export function useBillingSheets() {
  return useQuery({
    queryKey: billingKeys.sheets(),
    queryFn: () => billingService.listSheets(),
  });
}

export function useBillingSheet(id: number | null) {
  return useQuery({
    queryKey: billingKeys.sheet(id!),
    queryFn: () => billingService.getSheet(id!),
    enabled: id !== null,
  });
}

export function useCreateBillingSheet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBillingDto) => billingService.createSheet(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.sheets() });
      toast.success("Hoja de facturación creada exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al crear hoja de facturación");
    },
  });
}

export function useUpdateBillingSheet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBillingDto }) =>
      billingService.updateSheet(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: billingKeys.sheet(variables.id) });
      queryClient.invalidateQueries({ queryKey: billingKeys.sheets() });
      toast.success("Hoja de facturación actualizada");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar hoja de facturación");
    },
  });
}

export function useDeleteBillingSheet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => billingService.removeSheet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.sheets() });
      toast.success("Hoja de facturación eliminada");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar hoja de facturación");
    },
  });
}

// Billing Items Hook
export function useBillingItem(id: number | null) {
  return useQuery({
    queryKey: billingKeys.item(id!),
    queryFn: () => billingService.getItem(id!),
    enabled: id !== null,
  });
}

// Billing Records Hooks
export function useBillingRecords(billingId: number | null) {
  return useQuery({
    queryKey: billingKeys.records(billingId!),
    queryFn: () => billingService.getRecordsByBilling(billingId!),
    enabled: billingId !== null,
  });
}

export function useCreateBillingRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ billingId, payload }: { billingId: number; payload: CreateBillingRecordDto }) =>
      billingService.createRecord(billingId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: billingKeys.records(variables.billingId) });
      queryClient.invalidateQueries({ queryKey: billingKeys.sheet(variables.billingId) });
      toast.success("Registro de facturación creado");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al crear registro de facturación");
    },
  });
}

export function useDeleteBillingRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => billingService.removeRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
      toast.success("Registro eliminado");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar registro");
    },
  });
}

export function useProcessPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProcessPaymentDto }) =>
      billingService.processPayment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
      toast.success("Pago procesado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al procesar pago");
    },
  });
}

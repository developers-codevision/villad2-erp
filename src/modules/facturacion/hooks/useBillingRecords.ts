import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { facturacionService } from "../services/facturacionService";
import type { CreateBillingRecordDTO, PaymentInputDto } from "../types/types";
import { useToast } from "@/hooks/use-toast";
import type { WorkerInputDto } from "../types/types";

export const useBillingRecords = (billingId?: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch records for a specific billing
  const { data: records = [], isLoading } = useQuery({
    queryKey: ['billing-records', billingId],
    queryFn: () => billingId 
      ? facturacionService.getBillingRecordsByBillingId(billingId) 
      : Promise.resolve([]),
    enabled: !!billingId,
  });

  // Create billing record mutation
  const createRecordMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateBillingRecordDTO }) => 
      facturacionService.createBillingRecord(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-records'] });
      toast({
        title: "Registro creado",
        description: "El registro de pago se ha creado correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "No se pudo crear el registro.",
        variant: "destructive",
      });
    },
  });

  // Delete billing record mutation
  const deleteRecordMutation = useMutation({
    mutationFn: (id: number) => facturacionService.deleteBillingRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-records'] });
      toast({
        title: "Registro eliminado",
        description: "El registro se ha eliminado correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el registro.",
        variant: "destructive",
      });
    },
  });

  const distributeTipsMutation = useMutation({
    mutationFn: ({ recordId, workers }: { recordId: number; workers: WorkerInputDto[] }) =>
      facturacionService.distributeTips(recordId, workers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-records'] });
      toast({
        title: 'Propinas distribuidas',
        description: 'Las propinas se han distribuido correctamente.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudieron distribuir las propinas.',
        variant: 'destructive',
      });
    },
  });

  const distributeTax10Mutation = useMutation({
    mutationFn: ({ recordId, workers }: { recordId: number; workers: WorkerInputDto[] }) =>
      facturacionService.distributeTax10(recordId, workers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-records'] });
      toast({
        title: 'Impuesto distribuido',
        description: 'El impuesto se ha distribuido correctamente.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo distribuir el impuesto.',
        variant: 'destructive',
      });
    },
  });

  // Process mixed payments mutation
  const processMixedPaymentsMutation = useMutation({
    mutationFn: ({ 
      recordId, 
      payments, 
      useAdvanceBalance 
    }: { 
      recordId: number; 
      payments: PaymentInputDto[]; 
      useAdvanceBalance: boolean;
    }) => facturacionService.processMixedPayments(recordId, payments, useAdvanceBalance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-records'] });
      toast({
        title: 'Pago procesado',
        description: 'Los pagos mixtos se han procesado correctamente.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.message || 'No se pudieron procesar los pagos.',
        variant: 'destructive',
      });
    },
  });

  return {
    records,
    loading: isLoading,
    createRecord: (id: number, payload: CreateBillingRecordDTO) => 
      createRecordMutation.mutateAsync({ id, payload }),
    deleteRecord: (id: number) => deleteRecordMutation.mutateAsync(id),
    distributeTips: (recordId: number, workers: WorkerInputDto[]) =>
      distributeTipsMutation.mutateAsync({ recordId, workers }),
    distributeTax10: (recordId: number, workers: WorkerInputDto[]) =>
      distributeTax10Mutation.mutateAsync({ recordId, workers }),
    processMixedPayments: (recordId: number, payments: PaymentInputDto[], useAdvanceBalance: boolean) =>
      processMixedPaymentsMutation.mutateAsync({ recordId, payments, useAdvanceBalance }),
    creating: createRecordMutation.isPending,
    deleting: deleteRecordMutation.isPending,
  };
};

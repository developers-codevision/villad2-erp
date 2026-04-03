import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { facturacionService } from "../services/facturacionService";
import * as conceptsApi from "../../concepts/api/conceptsApi";
import type { FacturacionGroup, CreateBillingDTO, UpdateBillingDTO } from "../types/types";
import type { CreateConceptDTO } from "../../concepts/types/types";
import { useToast } from "@/hooks/use-toast";

export const useFacturacion = () => {
  const [usdRate, setUsdRate] = useState(1);
  const [euroRate, setEuroRate] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [selectedBillingId, setSelectedBillingId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch concepts
  const { data: concepts = [], isLoading: loadingConcepts } = useQuery({
    queryKey: ['concepts-for-facturacion'],
    queryFn: facturacionService.getConcepts,
  });

  // Fetch all billings
  const { data: billings = [], isLoading: loadingBillings } = useQuery({
    queryKey: ['billings'],
    queryFn: facturacionService.getAllBillings,
  });

  // Fetch selected billing details
  const { data: selectedBilling } = useQuery({
    queryKey: ['billing', selectedBillingId],
    queryFn: () => selectedBillingId ? facturacionService.getBillingById(selectedBillingId) : null,
    enabled: !!selectedBillingId,
  });

  // Compute groups from concepts using useMemo to avoid unnecessary recalculations
  const groups = useMemo(() => {
    return concepts.reduce((acc, c) => {
      const group = acc.find(g => g.category === c.category);
      const conceptId = String(c.id);
      const quantity = quantities[conceptId] || 0;
      // Ensure price is always a number, never undefined
      const price = prices[conceptId] !== undefined ? prices[conceptId] : (c.priceUsd || 0);
      
      if (group) {
        group.items.push({ 
          id: conceptId, 
          name: c.name, 
          category: c.category, 
          price, 
          quantity 
        });
      } else {
        acc.push({ 
          category: c.category, 
          items: [{ 
            id: conceptId, 
            name: c.name, 
            category: c.category, 
            price, 
            quantity 
          }] 
        });
      }
      return acc;
    }, [] as FacturacionGroup[]);
  }, [concepts, quantities, prices]);

  // Create billing mutation
  const createBillingMutation = useMutation({
    mutationFn: (payload: CreateBillingDTO) => facturacionService.createBilling(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['billings'] });
      setSelectedBillingId(data.id);
      toast({
        title: "Facturación creada",
        description: "La hoja de facturación se ha creado correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la facturación.",
        variant: "destructive",
      });
    },
  });

  // Update billing mutation
  const updateBillingMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBillingDTO }) => 
      facturacionService.updateBilling(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billings'] });
      toast({
        title: "Facturación actualizada",
        description: "La facturación se ha actualizado correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la facturación.",
        variant: "destructive",
      });
    },
  });

  // Delete billing mutation
  const deleteBillingMutation = useMutation({
    mutationFn: (id: number) => facturacionService.deleteBilling(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billings'] });
      toast({
        title: "Facturación eliminada",
        description: "La facturación se ha eliminado correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la facturación.",
        variant: "destructive",
      });
    },
  });

  // Update rates when billing is selected
  useEffect(() => {
    if (selectedBillingId && billings.length > 0) {
      const selectedBilling = billings.find(b => b.id === selectedBillingId);
      if (selectedBilling) {
        const newUsdRate = Number(selectedBilling.usdToCupRate || 1);
        const newEuroRate = Number(selectedBilling.eurToCupRate || 1);
        
        // Only update if the values have actually changed
        setUsdRate(prev => prev !== newUsdRate ? newUsdRate : prev);
        setEuroRate(prev => prev !== newEuroRate ? newEuroRate : prev);
      }
    }
  }, [selectedBillingId, billings]);

  const updateItem = (category: string, id: string, field: 'price' | 'quantity', value: number) => {
    if (field === 'quantity') {
      setQuantities(prev => ({ ...prev, [id]: value }));
    } else if (field === 'price') {
      setPrices(prev => ({ ...prev, [id]: value }));
    }
  };

  const createNewBilling = async () => {
    const payload: CreateBillingDTO = {};
    await createBillingMutation.mutateAsync(payload);
  };

  const updateBilling = async (id: number, payload: UpdateBillingDTO) => {
    await updateBillingMutation.mutateAsync({ id, payload });
  };

  const deleteBilling = async (id: number) => {
    await deleteBillingMutation.mutateAsync(id);
  };

  // Create concept mutation
  const createConceptMutation = useMutation({
    mutationFn: (payload: CreateConceptDTO) => conceptsApi.createConcept(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concepts-for-facturacion'] });
      toast({
        title: "Concepto creado",
        description: "El concepto se ha creado correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear el concepto.",
        variant: "destructive",
      });
    },
  });

  const createConcept = async (payload: CreateConceptDTO) => {
    await createConceptMutation.mutateAsync(payload);
  };

  const total = groups.reduce((sum, g) => sum + g.items.reduce((s, i) => s + i.price * i.quantity, 0), 0);

  return {
    // State
    usdRate,
    setUsdRate,
    euroRate,
    setEuroRate,
    date,
    setDate,
    groups,
    billings,
    selectedBillingId,
    setSelectedBillingId,
    selectedBilling,

    // Computed
    total,
    loading: loadingConcepts || loadingBillings,
    
    // Actions
    updateItem,
    createNewBilling,
    updateBilling,
    deleteBilling,
    createConcept,

    // Mutation states
    creating: createBillingMutation.isPending,
    updating: updateBillingMutation.isPending,
    deleting: deleteBillingMutation.isPending,
  };
};

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { facturacionService } from "../services/facturacionService";
import type { FacturacionGroup, CreateBillingDTO } from "../types/types";
import type { ConceptDTO } from "@/modules/concepts/types/types";
import { useToast } from "@/hooks/use-toast";

export const useFacturacion = () => {
  const [usdRate, setUsdRate] = useState(1);
  const [euroRate, setEuroRate] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [groups, setGroups] = useState<FacturacionGroup[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const { data: concepts = [], isLoading } = useQuery({
    queryKey: ['concepts-for-facturacion'],
    queryFn: facturacionService.getConcepts,
  });

  useEffect(() => {
    const newGroups = concepts.reduce((acc, c) => {
      const group = acc.find(g => g.category === c.category);
      if (group) {
        group.items.push({ id: c.id, name: c.name, category: c.category, price: c.priceUsd, quantity: 0 });
      } else {
        acc.push({ category: c.category, items: [{ id: c.id, name: c.name, category: c.category, price: c.priceUsd, quantity: 0 }] });
      }
      return acc;
    }, [] as FacturacionGroup[]);
    setGroups(newGroups);
  }, [concepts]);

  const updateItem = (category: string, id: string, field: 'price' | 'quantity', value: number) => {
    setGroups(prev => prev.map(g => g.category === category ? {
      ...g,
      items: g.items.map(i => i.id === id ? { ...i, [field]: value } : i)
    } : g));
  };

  const saveBilling = async () => {
    const items = groups.flatMap(g => g.items.filter(i => i.quantity > 0).map(i => ({ conceptId: i.id, quantity: i.quantity })));
    const payload: CreateBillingDTO = {
      date,
      usdToCupRate: usdRate,
      eurToCupRate: euroRate,
      items,
    };
    setSaving(true);
    try {
      await facturacionService.create(payload);
      toast({
        title: "Facturación guardada",
        description: "La facturación se ha guardado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la facturación.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const total = groups.reduce((sum, g) => sum + g.items.reduce((s, i) => s + i.price * i.quantity, 0), 0);

  return {
    usdRate,
    setUsdRate,
    euroRate,
    setEuroRate,
    date,
    setDate,
    groups,
    updateItem,
    total,
    loading: isLoading,
    saving,
    saveBilling,
  };
};

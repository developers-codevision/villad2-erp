import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { CreateConceptDTO, ConceptProductDTO } from "../../concepts/types/types";

interface UseConceptCreationProps {
  selectedBillingId: number | null;
  onCreateConcept: (payload: CreateConceptDTO) => Promise<void>;
}

export const useConceptCreation = ({ selectedBillingId, onCreateConcept }: UseConceptCreationProps) => {
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [conceptName, setConceptName] = useState("");
  const [conceptPrice, setConceptPrice] = useState("");
  const [conceptCategory, setConceptCategory] = useState("");
  const [conceptProducts, setConceptProducts] = useState<ConceptProductDTO[]>([]);

  const resetForm = () => {
    setConceptName("");
    setConceptPrice("");
    setConceptCategory("");
    setConceptProducts([]);
  };

  const openDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  const addProductToConcept = (productId: number, quantity: number) => {
    if (quantity <= 0) return;
    const existingIndex = conceptProducts.findIndex(p => p.productId === productId);
    if (existingIndex >= 0) {
      const updated = [...conceptProducts];
      updated[existingIndex].quantity += quantity;
      setConceptProducts(updated);
    } else {
      setConceptProducts([...conceptProducts, { productId, quantity }]);
    }
  };

  const removeProductFromConcept = (productId: number) => {
    setConceptProducts(conceptProducts.filter(p => p.productId !== productId));
  };

  const handleSaveConcept = async () => {
    if (!conceptName.trim() || !conceptCategory.trim() || !conceptPrice) {
      toast({
        title: "Error de validación",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    const payload: CreateConceptDTO = {
      name: conceptName,
      category: conceptCategory,
      products: conceptProducts.length > 0 ? conceptProducts : undefined,
      billingId: selectedBillingId || undefined,
      price: Number(conceptPrice),
    };

    try {
      await onCreateConcept(payload);
      closeDialog();
    } catch (error) {
      // Error handling is done in the onCreateConcept function
    }
  };

  return {
    // State
    dialogOpen,
    conceptName,
    setConceptName,
    conceptPrice,
    setConceptPrice,
    conceptCategory,
    setConceptCategory,
    conceptProducts,

    // Actions
    openDialog,
    closeDialog,
    addProductToConcept,
    removeProductFromConcept,
    handleSaveConcept,
  };
};

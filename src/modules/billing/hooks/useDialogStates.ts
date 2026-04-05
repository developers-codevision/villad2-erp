import { useState, useCallback } from "react";

type DialogName =
  | "createDialogOpen"
  | "updateDialogOpen"
  | "deleteConfirmOpen"
  | "createConceptDialogOpen"
  | "paymentDialogOpen";

interface DialogStates {
  createDialogOpen: boolean;
  updateDialogOpen: boolean;
  deleteConfirmOpen: boolean;
  createConceptDialogOpen: boolean;
  paymentDialogOpen: boolean;
}

/**
 * Hook que centraliza la gestión de todos los estados de diálogos
 * Reduce el prop drilling y simplifica el código del componente principal
 */
export function useDialogStates() {
  const [dialogs, setDialogs] = useState<DialogStates>({
    createDialogOpen: false,
    updateDialogOpen: false,
    deleteConfirmOpen: false,
    createConceptDialogOpen: false,
    paymentDialogOpen: false,
  });

  const openDialog = useCallback((dialogName: DialogName) => {
    setDialogs((prev) => ({ ...prev, [dialogName]: true }));
  }, []);

  const closeDialog = useCallback((dialogName: DialogName) => {
    setDialogs((prev) => ({ ...prev, [dialogName]: false }));
  }, []);

  const toggleDialog = useCallback((dialogName: DialogName) => {
    setDialogs((prev) => ({ ...prev, [dialogName]: !prev[dialogName] }));
  }, []);

  const closeAllDialogs = useCallback(() => {
    setDialogs({
      createDialogOpen: false,
      updateDialogOpen: false,
      deleteConfirmOpen: false,
      createConceptDialogOpen: false,
      paymentDialogOpen: false,
    });
  }, []);

  // Setters individuales para compatibilidad directa con Dialog onOpenChange
  const setCreateDialogOpen = useCallback((open: boolean) => {
    setDialogs((prev) => ({ ...prev, createDialogOpen: open }));
  }, []);

  const setUpdateDialogOpen = useCallback((open: boolean) => {
    setDialogs((prev) => ({ ...prev, updateDialogOpen: open }));
  }, []);

  const setDeleteConfirmOpen = useCallback((open: boolean) => {
    setDialogs((prev) => ({ ...prev, deleteConfirmOpen: open }));
  }, []);

  const setCreateConceptDialogOpen = useCallback((open: boolean) => {
    setDialogs((prev) => ({ ...prev, createConceptDialogOpen: open }));
  }, []);

  const setPaymentDialogOpen = useCallback((open: boolean) => {
    setDialogs((prev) => ({ ...prev, paymentDialogOpen: open }));
  }, []);

  return {
    ...dialogs,
    openDialog,
    closeDialog,
    toggleDialog,
    closeAllDialogs,
    setCreateDialogOpen,
    setUpdateDialogOpen,
    setDeleteConfirmOpen,
    setCreateConceptDialogOpen,
    setPaymentDialogOpen,
  };
}

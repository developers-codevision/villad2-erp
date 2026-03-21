import { useEffect, useState } from "react";
import type { ClientDTO, CreateClientDTO, UpdateClientDTO } from "@/modules/clients/types/types";
import { clientsService } from "@/modules/clients/services/clientsService";

export function useClients() {
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ClientDTO | null>(null);
  const [deleting, setDeleting] = useState<ClientDTO | null>(null);
  const [formName, setFormName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formCiOrPassport, setFormCiOrPassport] = useState("");
  const [formBirthDate, setFormBirthDate] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formObservations, setFormObservations] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientsService.list();
      setClients(data || []);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormName("");
    setFormLastName("");
    setFormCiOrPassport("");
    setFormBirthDate("");
    setFormPhone("");
    setFormObservations("");
    setDialogOpen(true);
  };

  const openEdit = (c: ClientDTO) => {
    setEditing(c);
    setFormName(c.name);
    setFormLastName(c.lastName);
    setFormCiOrPassport(c.ciOrPassport);
    setFormBirthDate(c.birthDate);
    setFormPhone(c.phone);
    setFormObservations(c.observations);
    setDialogOpen(true);
  };

  const openDelete = (c: ClientDTO) => {
    setDeleting(c);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formLastName.trim() || !formCiOrPassport.trim() || !formBirthDate.trim() || !formPhone.trim()) return;
    try {
      if (editing) {
        await clientsService.update(editing.id, {
          name: formName.trim(),
          lastName: formLastName.trim(),
          ciOrPassport: formCiOrPassport.trim(),
          birthDate: formBirthDate.trim(),
          phone: formPhone.trim(),
          observations: formObservations.trim()
        });
      } else {
        const payload: CreateClientDTO = {
          name: formName.trim(),
          lastName: formLastName.trim(),
          ciOrPassport: formCiOrPassport.trim(),
          birthDate: formBirthDate.trim(),
          phone: formPhone.trim(),
          observations: formObservations.trim()
        };
        await clientsService.create(payload);
      }
      await load();
      setDialogOpen(false);
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await clientsService.remove(deleting.id);
      await load();
      setDeleteDialogOpen(false);
      setDeleting(null);
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  return {
    clients,
    loading,
    error,
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    editing,
    deleting,
    formName,
    setFormName,
    formLastName,
    setFormLastName,
    formCiOrPassport,
    setFormCiOrPassport,
    formBirthDate,
    setFormBirthDate,
    formPhone,
    setFormPhone,
    formObservations,
    setFormObservations,
    openCreate,
    openEdit,
    openDelete,
    handleSave,
    handleDelete,
    reload: load,
  } as const;
}

export default useClients;

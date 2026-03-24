import { useEffect, useMemo, useState } from "react";
import type { ReservationDTO, CreateReservationDTO, UpdateReservationDTO } from "@/modules/reservations/types/types";
import { reservationsService } from "@/modules/reservations/services/reservationsService";

export function useReservations() {
  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ReservationDTO | null>(null);
  const [deleting, setDeleting] = useState<ReservationDTO | null>(null);
  const [formClientNumber, setFormClientNumber] = useState("");
  const [formName, setFormName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formCiOrPassport, setFormCiOrPassport] = useState("");
  const [formNationality, setFormNationality] = useState("");
  const [formBirthDate, setFormBirthDate] = useState("");
  const [formCheckInDate, setFormCheckInDate] = useState("");
  const [formCheckOutDate, setFormCheckOutDate] = useState("");
  const [formCheckInTime, setFormCheckInTime] = useState("");
  const [formCheckOutTime, setFormCheckOutTime] = useState("");
  const [formStayHours, setFormStayHours] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRoom, setFormRoom] = useState("");
  const [formObservations, setFormObservations] = useState("");
  const [formInvoiceNumber, setFormInvoiceNumber] = useState("");
  const [formCupAmount, setFormCupAmount] = useState("");

  const [filterName, setFilterName] = useState("");
  const [filterCheckInFrom, setFilterCheckInFrom] = useState("");
  const [filterCheckInTo, setFilterCheckInTo] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reservationsService.list();
      setReservations(Array.isArray(data) ? data : []);
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
    setFormClientNumber("");
    setFormName("");
    setFormLastName("");
    setFormCiOrPassport("");
    setFormNationality("");
    setFormBirthDate("");
    setFormCheckInDate("");
    setFormCheckOutDate("");
    setFormCheckInTime("");
    setFormCheckOutTime("");
    setFormStayHours("");
    setFormPhone("");
    setFormRoom("");
    setFormObservations("");
    setFormInvoiceNumber("");
    setFormCupAmount("");
    setDialogOpen(true);
  };

  const openEdit = (r: ReservationDTO) => {
    setEditing(r);
    setFormClientNumber(r.clientNumber);
    setFormName(r.name);
    setFormLastName(r.lastName);
    setFormCiOrPassport(r.ciOrPassport);
    setFormNationality(r.nationality);
    setFormBirthDate(r.birthDate);
    setFormCheckInDate(r.checkInDate);
    setFormCheckOutDate(r.checkOutDate);
    setFormCheckInTime(r.checkInTime);
    setFormCheckOutTime(r.checkOutTime);
    setFormStayHours(String(r.stayHours));
    setFormPhone(r.phone);
    setFormRoom(r.room);
    setFormObservations(r.observations);
    setFormInvoiceNumber(r.invoiceNumber);
    setFormCupAmount(String(r.cupAmount));
    setDialogOpen(true);
  };

  const openDelete = (r: ReservationDTO) => {
    setDeleting(r);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formClientNumber.trim() || !formName.trim() || !formLastName.trim()) return;
    try {
      if (editing) {
        await reservationsService.update(editing.id, {
          clientNumber: formClientNumber.trim(),
          name: formName.trim(),
          lastName: formLastName.trim(),
          ciOrPassport: formCiOrPassport.trim(),
          nationality: formNationality.trim(),
          birthDate: formBirthDate.trim(),
          checkInDate: formCheckInDate.trim(),
          checkOutDate: formCheckOutDate.trim(),
          checkInTime: formCheckInTime.trim(),
          checkOutTime: formCheckOutTime.trim(),
          stayHours: Number(formStayHours),
          phone: formPhone.trim(),
          room: formRoom.trim(),
          observations: formObservations.trim(),
          invoiceNumber: formInvoiceNumber.trim(),
          cupAmount: Number(formCupAmount),
        });
      } else {
        const payload: CreateReservationDTO = {
          clientNumber: formClientNumber.trim(),
          name: formName.trim(),
          lastName: formLastName.trim(),
          ciOrPassport: formCiOrPassport.trim(),
          nationality: formNationality.trim(),
          birthDate: formBirthDate.trim(),
          checkInDate: formCheckInDate.trim(),
          checkOutDate: formCheckOutDate.trim(),
          checkInTime: formCheckInTime.trim(),
          checkOutTime: formCheckOutTime.trim(),
          stayHours: Number(formStayHours),
          phone: formPhone.trim(),
          room: formRoom.trim(),
          observations: formObservations.trim(),
          invoiceNumber: formInvoiceNumber.trim(),
          cupAmount: Number(formCupAmount),
        };
        await reservationsService.create(payload);
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
      await reservationsService.remove(deleting.id);
      await load();
      setDeleteDialogOpen(false);
      setDeleting(null);
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  const filteredReservations = useMemo(() => {
    return (Array.isArray(reservations) ? reservations : []).filter(r => {
      if (filterName && !r.name.toLowerCase().includes(filterName.toLowerCase()) && !r.lastName.toLowerCase().includes(filterName.toLowerCase())) return false;
      if (filterCheckInFrom && r.checkInDate < filterCheckInFrom) return false;
      if (filterCheckInTo && r.checkInDate > filterCheckInTo) return false;
      return true;
    });
  }, [reservations, filterName, filterCheckInFrom, filterCheckInTo]);

  return {
    reservations,
    filteredReservations,
    loading,
    error,
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    editing,
    deleting,
    formClientNumber,
    setFormClientNumber,
    formName,
    setFormName,
    formLastName,
    setFormLastName,
    formCiOrPassport,
    setFormCiOrPassport,
    formNationality,
    setFormNationality,
    formBirthDate,
    setFormBirthDate,
    formCheckInDate,
    setFormCheckInDate,
    formCheckOutDate,
    setFormCheckOutDate,
    formCheckInTime,
    setFormCheckInTime,
    formCheckOutTime,
    setFormCheckOutTime,
    formStayHours,
    setFormStayHours,
    formPhone,
    setFormPhone,
    formRoom,
    setFormRoom,
    formObservations,
    setFormObservations,
    formInvoiceNumber,
    setFormInvoiceNumber,
    formCupAmount,
    setFormCupAmount,
    filterName,
    setFilterName,
    filterCheckInFrom,
    setFilterCheckInFrom,
    filterCheckInTo,
    setFilterCheckInTo,
    openCreate,
    openEdit,
    openDelete,
    handleSave,
    handleDelete,
    reload: load,
  } as const;
}

export default useReservations;


import { useState } from 'react';
import { ReservationCalendar } from '../components/ReservationCalendar';
import { ReservationStatus } from '../types/types';
import { ReservationWithDetails } from '../types/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function ReservationsPage() {
  // Mock data for demonstration purposes
  const [mockReservations, setMockReservations] = useState<ReservationWithDetails[]>([
    {
      id: 1,
      roomId: 1,
      checkInDate: new Date().toISOString(),
      checkOutDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      status: ReservationStatus.CONFIRMED,
      mainGuest: {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '123456789',
        sex: 'M',
      },
      baseGuestsCount: 2,
      extraGuestsCount: 0,
      totalPrice: 150.0,
      earlyCheckIn: false,
      lateCheckOut: false,
      transferOneWay: false,
      transferRoundTrip: false,
      breakfasts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      room: {
        number: '101',
        name: 'Suite Ejecutiva',
        roomType: 'suite_balcony',
      }
    }
  ]);

  // Example rooms (temporary data)
  const exampleRooms = [
    { id: 1, number: '101', name: 'Suite Ejecutiva', roomType: 'suite_balcony' },
    { id: 2, number: '102', name: 'Habitación Doble', roomType: 'double' },
    { id: 3, number: '201', name: 'Terraza Superior', roomType: 'terrace' },
  ];

  // Selected room per mode (store as string because Select uses string values)
  const [selectedRoomHours, setSelectedRoomHours] = useState<string>(String(exampleRooms[0].id));
  const [selectedRoomNoches, setSelectedRoomNoches] = useState<string>(String(exampleRooms[0].id));

  // Dialog state — single dialog with tabs for all modes
  const [openReserve, setOpenReserve] = useState(false);

  // Form state for Por Horas
  const [date, setDate] = useState<string>(''); // ISO date string yyyy-mm-dd
  const [time, setTime] = useState<string>(''); // HH:MM
  const [hoursCount, setHoursCount] = useState<string>('2');
  const [personsCount, setPersonsCount] = useState<number>(1);
  const [guestNames, setGuestNames] = useState<string[]>(['']);
  const [observations, setObservations] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  // Form state for Por Noches (separado para mantener independencia)
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [nightsCount, setNightsCount] = useState<string>('1');
  const [personsCountNoches, setPersonsCountNoches] = useState<number>(1);
  const [guestNamesNoches, setGuestNamesNoches] = useState<string[]>(['']);
  const [observationsNoches, setObservationsNoches] = useState<string>('');
  const [priceNoches, setPriceNoches] = useState<string>('');

  // ------------------- Modo: Estancia -------------------
  const [checkInDateEst, setCheckInDateEst] = useState<string>('');
  const [checkOutDateEst, setCheckOutDateEst] = useState<string>('');
  const [timeInEst, setTimeInEst] = useState<string>('15:00');
  const [timeOutEst, setTimeOutEst] = useState<string>('12:00');
  const [selectedRoomEstancia, setSelectedRoomEstancia] = useState<string>(String(exampleRooms[0].id));
  const [personsCountEst, setPersonsCountEst] = useState<number>(1);
  const [guestNamesEst, setGuestNamesEst] = useState<string[]>(['']);
  const [observationsEst, setObservationsEst] = useState<string>('');

  // Price composition fields
  const [priceAccommodation, setPriceAccommodation] = useState<string>('');
  const [pickupAirport, setPickupAirport] = useState<boolean>(false);
  const [pickupFee, setPickupFee] = useState<string>('0');
  const [transferReturn, setTransferReturn] = useState<boolean>(false);
  const [transferReturnFee, setTransferReturnFee] = useState<string>('0');
  const [earlyCheckIn, setEarlyCheckIn] = useState<boolean>(false);
  const [earlyCheckInFee, setEarlyCheckInFee] = useState<string>('0');
  const [lateCheckOut, setLateCheckOut] = useState<boolean>(false);
  const [lateCheckOutFee, setLateCheckOutFee] = useState<string>('0');

  const [breakfast1Count, setBreakfast1Count] = useState<number>(0);
  const [breakfast2Count, setBreakfast2Count] = useState<number>(0);
  const [breakfast3Count, setBreakfast3Count] = useState<number>(0);
  const [breakfast1Price, setBreakfast1Price] = useState<string>('0');
  const [breakfast2Price, setBreakfast2Price] = useState<string>('0');
  const [breakfast3Price, setBreakfast3Price] = useState<string>('0');

  const openCreateReserve = () => {
    // reset all forms' minimal fields
    // Horas
    setDate('');
    setTime('');
    setHoursCount('2');
    setPersonsCount(1);
    setGuestNames(['']);
    setObservations('');
    setPrice('');
    setSelectedRoomHours(String(exampleRooms[0].id));
    // Noches
    setCheckInDate('');
    setNightsCount('1');
    setPersonsCountNoches(1);
    setGuestNamesNoches(['']);
    setObservationsNoches('');
    setPriceNoches('');
    setSelectedRoomNoches(String(exampleRooms[0].id));
    // Estancia
    setCheckInDateEst('');
    setCheckOutDateEst('');
    setTimeInEst('15:00');
    setTimeOutEst('12:00');
    setSelectedRoomEstancia(String(exampleRooms[0].id));
    setPersonsCountEst(1);
    setGuestNamesEst(['']);
    setObservationsEst('');
    setPriceAccommodation('');
    setPickupAirport(false);
    setPickupFee('0');
    setTransferReturn(false);
    setTransferReturnFee('0');
    setEarlyCheckIn(false);
    setEarlyCheckInFee('0');
    setLateCheckOut(false);
    setLateCheckOutFee('0');
    setBreakfast1Count(0);
    setBreakfast2Count(0);
    setBreakfast3Count(0);
    setBreakfast1Price('0');
    setBreakfast2Price('0');
    setBreakfast3Price('0');

    setOpenReserve(true);
  };

  const handlePersonCountChange = (n: number) => {
    setPersonsCount(n);
    setGuestNames((prev) => {
      const next = [...prev];
      while (next.length < n) next.push('');
      while (next.length > n) next.pop();
      return next;
    });
  };

  const handleGuestNameChange = (index: number, value: string) => {
    setGuestNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSaveHoras = () => {
    if (!date || !time) {
      // required fields
      alert('Fecha y hora son obligatorias');
      return;
    }

    // build reservation object (simple mock)
    const selRoomId = Number(selectedRoomHours) || 0;
    const selRoom = exampleRooms.find((r) => r.id === selRoomId);
    const newRes: ReservationWithDetails = {
      id: Date.now(),
      roomId: selRoomId,
      checkInDate: new Date(`${date}T${time}`).toISOString(),
      checkOutDate: new Date(new Date(`${date}T${time}`).getTime() + Number(hoursCount) * 3600000).toISOString(),
      status: ReservationStatus.CONFIRMED,
      mainGuest: {
        firstName: guestNames[0] || 'N/D',
        lastName: '',
        email: '',
        phone: '',
        sex: 'M',
      },
      baseGuestsCount: personsCount,
      extraGuestsCount: 0,
      totalPrice: parseFloat(price) || 0,
      earlyCheckIn: false,
      lateCheckOut: false,
      transferOneWay: false,
      transferRoundTrip: false,
      breakfasts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      room: selRoom ? { number: selRoom.number, name: selRoom.name, roomType: selRoom.roomType } : { number: '—', name: 'Reserva por horas', roomType: 'hourly' }
    };

    setMockReservations((prev) => [newRes, ...prev]);
    setOpenReserve(false);
  };

  // ------------------- Modo: Por noches -------------------
  const openCreateNoches = () => {
    // kept for backward compatibility if needed, but not used directly
    setCheckInDate('');
    setNightsCount('1');
    setPersonsCountNoches(1);
    setGuestNamesNoches(['']);
    setObservationsNoches('');
    setPriceNoches('');
    setOpenReserve(true);
  };

  const handlePersonCountChangeNoches = (n: number) => {
    setPersonsCountNoches(n);
    setGuestNamesNoches((prev) => {
      const next = [...prev];
      while (next.length < n) next.push('');
      while (next.length > n) next.pop();
      return next;
    });
  };

  const handleGuestNameChangeNoches = (index: number, value: string) => {
    setGuestNamesNoches((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSaveNoches = () => {
    if (!checkInDate) {
      alert('La fecha de entrada es obligatoria');
      return;
    }

    const nights = Number(nightsCount) || 1;
    const checkIn = new Date(`${checkInDate}T15:00`); // asumimos check-in 15:00
    const checkOut = new Date(checkIn.getTime() + nights * 86400000);

    const selRoomId = Number(selectedRoomNoches) || 0;
    const selRoom = exampleRooms.find((r) => r.id === selRoomId);
    const newRes: ReservationWithDetails = {
      id: Date.now(),
      roomId: selRoomId,
      checkInDate: checkIn.toISOString(),
      checkOutDate: checkOut.toISOString(),
      status: ReservationStatus.CONFIRMED,
      mainGuest: {
        firstName: guestNamesNoches[0] || 'N/D',
        lastName: '',
        email: '',
        phone: '',
        sex: 'M',
      },
      baseGuestsCount: personsCountNoches,
      extraGuestsCount: 0,
      totalPrice: parseFloat(priceNoches) || 0,
      earlyCheckIn: false,
      lateCheckOut: false,
      transferOneWay: false,
      transferRoundTrip: false,
      breakfasts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      room: selRoom ? { number: selRoom.number, name: selRoom.name, roomType: selRoom.roomType } : { number: '—', name: 'Reserva por noches', roomType: 'nightly' }
    };

    setMockReservations((prev) => [newRes, ...prev]);
    setOpenReserve(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Calendario de Reservas</h1>
        <div className="flex gap-2">
          <Button onClick={openCreateReserve}>Nueva reserva</Button>
        </div>
      </div>

      <ReservationCalendar
        reservations={mockReservations}
        onReservationClick={(r) => console.log('Reservation clicked:', r)}
      />

      {/* Single Dialog with Tabs for all modes */}
      <Dialog open={openReserve} onOpenChange={setOpenReserve}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva reserva</DialogTitle>
            <DialogDescription>Selecciona el modo de reserva y completa los datos. Campos obligatorios varían por modo.</DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Tabs defaultValue="horas">
              <TabsList>
                <TabsTrigger value="horas">Por horas</TabsTrigger>
                <TabsTrigger value="noches">Por noches</TabsTrigger>
                <TabsTrigger value="estancia">Estancia</TabsTrigger>
                <TabsTrigger value="terraza">Terraza</TabsTrigger>
              </TabsList>

              <TabsContent value="horas">
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="roomHours">Habitación</Label>
                    <Select value={selectedRoomHours} onValueChange={(v) => setSelectedRoomHours(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {exampleRooms.map((r) => (
                          <SelectItem key={r.id} value={String(r.id)}>{`${r.number} — ${r.name}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Hora de entrada</Label>
                    <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hours">Horas</Label>
                    <Select value={hoursCount} onValueChange={(v) => setHoursCount(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 horas</SelectItem>
                        <SelectItem value="3">3 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="persons">Cantidad de personas</Label>
                    <Input id="persons" type="number" min={1} value={String(personsCount)} onChange={(e) => handlePersonCountChange(Number(e.target.value) || 1)} />
                  </div>

                  {Array.from({ length: personsCount }).map((_, idx) => (
                    <div key={idx} className="space-y-2">
                      <Label htmlFor={`guest-${idx}`}>Nombre y apellidos — Persona {idx + 1}</Label>
                      <Input id={`guest-${idx}`} value={guestNames[idx] || ''} onChange={(e) => handleGuestNameChange(idx, e.target.value)} />
                    </div>
                  ))}

                  <div className="space-y-2">
                    <Label htmlFor="obs">Observaciones</Label>
                    <Input id="obs" value={observations} onChange={(e) => setObservations(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Precio</Label>
                    <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenReserve(false)}>Cancelar</Button>
                  <Button onClick={handleSaveHoras}>Guardar reserva</Button>
                </DialogFooter>
              </TabsContent>

              <TabsContent value="noches">
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="roomNoches">Habitación</Label>
                    <Select value={selectedRoomNoches} onValueChange={(v) => setSelectedRoomNoches(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {exampleRooms.map((r) => (
                          <SelectItem key={r.id} value={String(r.id)}>{`${r.number} — ${r.name}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkInDate">Fecha de entrada</Label>
                    <Input id="checkInDate" type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nights">Noches</Label>
                    <Select value={nightsCount} onValueChange={(v) => setNightsCount(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 noche</SelectItem>
                        <SelectItem value="2">2 noches</SelectItem>
                        <SelectItem value="3">3 noches</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="personsNoches">Cantidad de personas</Label>
                    <Input id="personsNoches" type="number" min={1} value={String(personsCountNoches)} onChange={(e) => handlePersonCountChangeNoches(Number(e.target.value) || 1)} />
                  </div>

                  {Array.from({ length: personsCountNoches }).map((_, idx) => (
                    <div key={idx} className="space-y-2">
                      <Label htmlFor={`guestNoches-${idx}`}>Nombre y apellidos — Persona {idx + 1}</Label>
                      <Input id={`guestNoches-${idx}`} value={guestNamesNoches[idx] || ''} onChange={(e) => handleGuestNameChangeNoches(idx, e.target.value)} />
                    </div>
                  ))}

                  <div className="space-y-2">
                    <Label htmlFor="obsNoches">Observaciones</Label>
                    <Input id="obsNoches" value={observationsNoches} onChange={(e) => setObservationsNoches(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priceNoches">Precio</Label>
                    <Input id="priceNoches" type="number" value={priceNoches} onChange={(e) => setPriceNoches(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenReserve(false)}>Cancelar</Button>
                  <Button onClick={handleSaveNoches}>Guardar reserva</Button>
                </DialogFooter>
              </TabsContent>

              <TabsContent value="estancia">
                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkInDateEst">Fecha de entrada</Label>
                      <Input id="checkInDateEst" type="date" value={checkInDateEst} onChange={(e) => setCheckInDateEst(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkOutDateEst">Fecha de salida</Label>
                      <Input id="checkOutDateEst" type="date" value={checkOutDateEst} onChange={(e) => setCheckOutDateEst(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeInEst">Hora de entrada</Label>
                      <Input id="timeInEst" type="time" value={timeInEst} onChange={(e) => setTimeInEst(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeOutEst">Hora de salida</Label>
                      <Input id="timeOutEst" type="time" value={timeOutEst} onChange={(e) => setTimeOutEst(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roomEst">Habitación</Label>
                    <Select value={selectedRoomEstancia} onValueChange={(v) => setSelectedRoomEstancia(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {exampleRooms.map((r) => (
                          <SelectItem key={r.id} value={String(r.id)}>{`${r.number} — ${r.name}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="personsEst">Cantidad de personas</Label>
                    <Input id="personsEst" type="number" min={1} value={String(personsCountEst)} onChange={(e) => handlePersonCountChangeEst(Number(e.target.value) || 1)} />
                  </div>

                  {Array.from({ length: personsCountEst }).map((_, idx) => (
                    <div key={idx} className="space-y-2">
                      <Label htmlFor={`guestEst-${idx}`}>Nombre y apellidos — Persona {idx + 1}</Label>
                      <Input id={`guestEst-${idx}`} value={guestNamesEst[idx] || ''} onChange={(e) => handleGuestNameChangeEst(idx, e.target.value)} />
                    </div>
                  ))}

                  <div className="space-y-2">
                    <Label htmlFor="observationsEst">Observaciones</Label>
                    <Input id="observationsEst" value={observationsEst} onChange={(e) => setObservationsEst(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priceAccommodation">Precio del alojamiento</Label>
                    <Input id="priceAccommodation" type="number" value={priceAccommodation} onChange={(e) => setPriceAccommodation(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 flex items-center gap-2">
                      <input id="pickupAirport" type="checkbox" checked={pickupAirport} onChange={(e) => setPickupAirport(e.target.checked)} className="h-4 w-4" />
                      <Label htmlFor="pickupAirport">Recogida en Aeropuerto</Label>
                      <Input id="pickupFee" type="number" value={pickupFee} onChange={(e) => setPickupFee(e.target.value)} className="w-24 ml-2" />
                    </div>
                    <div className="space-y-2 flex items-center gap-2">
                      <input id="transferReturn" type="checkbox" checked={transferReturn} onChange={(e) => setTransferReturn(e.target.checked)} className="h-4 w-4" />
                      <Label htmlFor="transferReturn">Transfer de vuelta a Aeropuerto</Label>
                      <Input id="transferReturnFee" type="number" value={transferReturnFee} onChange={(e) => setTransferReturnFee(e.target.value)} className="w-24 ml-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 flex items-center gap-2">
                      <input id="earlyCheckIn" type="checkbox" checked={earlyCheckIn} onChange={(e) => setEarlyCheckIn(e.target.checked)} className="h-4 w-4" />
                      <Label htmlFor="earlyCheckIn">Early check-in</Label>
                      <Input id="earlyCheckInFee" type="number" value={earlyCheckInFee} onChange={(e) => setEarlyCheckInFee(e.target.value)} className="w-24 ml-2" />
                    </div>
                    <div className="space-y-2 flex items-center gap-2">
                      <input id="lateCheckOut" type="checkbox" checked={lateCheckOut} onChange={(e) => setLateCheckOut(e.target.checked)} className="h-4 w-4" />
                      <Label htmlFor="lateCheckOut">Late checkout</Label>
                      <Input id="lateCheckOutFee" type="number" value={lateCheckOutFee} onChange={(e) => setLateCheckOutFee(e.target.value)} className="w-24 ml-2" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Desayunos</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="bf1">Tipo 1 — Cantidad</Label>
                        <Input id="bf1" type="number" min={0} value={String(breakfast1Count)} onChange={(e) => setBreakfast1Count(Number(e.target.value) || 0)} />
                        <Input id="bf1price" type="number" placeholder="Precio unidad" value={breakfast1Price} onChange={(e) => setBreakfast1Price(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="bf2">Tipo 2 — Cantidad</Label>
                        <Input id="bf2" type="number" min={0} value={String(breakfast2Count)} onChange={(e) => setBreakfast2Count(Number(e.target.value) || 0)} />
                        <Input id="bf2price" type="number" placeholder="Precio unidad" value={breakfast2Price} onChange={(e) => setBreakfast2Price(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="bf3">Tipo 3 — Cantidad</Label>
                        <Input id="bf3" type="number" min={0} value={String(breakfast3Count)} onChange={(e) => setBreakfast3Count(Number(e.target.value) || 0)} />
                        <Input id="bf3price" type="number" placeholder="Precio unidad" value={breakfast3Price} onChange={(e) => setBreakfast3Price(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Resumen de precio</Label>
                    <div className="text-sm text-muted-foreground">
                      <p>Alojamiento: {priceAccommodation || '0'}</p>
                      <p>Servicios: {(pickupAirport ? pickupFee : '0')} + {(transferReturn ? transferReturnFee : '0')} + {(earlyCheckIn ? earlyCheckInFee : '0')} + {(lateCheckOut ? lateCheckOutFee : '0')}</p>
                      <p>Desayunos: {String(breakfast1Count)}x{breakfast1Price} + {String(breakfast2Count)}x{breakfast2Price} + {String(breakfast3Count)}x{breakfast3Price}</p>
                      <p className="font-semibold">Total: {(() => {
                        const acc = Number(priceAccommodation) || 0;
                        const svc = (pickupAirport ? Number(pickupFee) : 0) + (transferReturn ? Number(transferReturnFee) : 0) + (earlyCheckIn ? Number(earlyCheckInFee) : 0) + (lateCheckOut ? Number(lateCheckOutFee) : 0);
                        const bf = (Number(breakfast1Count) * (Number(breakfast1Price) || 0)) + (Number(breakfast2Count) * (Number(breakfast2Price) || 0)) + (Number(breakfast3Count) * (Number(breakfast3Price) || 0));
                        return (acc + svc + bf).toFixed(2);
                      })()}</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenReserve(false)}>Cancelar</Button>
                  <Button onClick={() => {
                    // Validate dates
                    if (!checkInDateEst || !checkOutDateEst) { alert('Fechas de entrada y salida son obligatorias'); return; }
                    const start = new Date(`${checkInDateEst}T${timeInEst}`);
                    const end = new Date(`${checkOutDateEst}T${timeOutEst}`);
                    if (end <= start) { alert('La fecha/hora de salida debe ser posterior a la de entrada'); return; }

                    // Build reservation
                    const selRoomId = Number(selectedRoomEstancia) || 0;
                    const selRoom = exampleRooms.find((r) => r.id === selRoomId);
                    const total = (Number(priceAccommodation) || 0) + (pickupAirport ? Number(pickupFee) : 0) + (transferReturn ? Number(transferReturnFee) : 0) + (earlyCheckIn ? Number(earlyCheckInFee) : 0) + (lateCheckOut ? Number(lateCheckOutFee) : 0) + (Number(breakfast1Count) * (Number(breakfast1Price) || 0)) + (Number(breakfast2Count) * (Number(breakfast2Price) || 0)) + (Number(breakfast3Count) * (Number(breakfast3Price) || 0));
                    const newRes: ReservationWithDetails = {
                      id: Date.now(),
                      roomId: selRoomId,
                      checkInDate: start.toISOString(),
                      checkOutDate: end.toISOString(),
                      status: ReservationStatus.CONFIRMED,
                      mainGuest: {
                        firstName: guestNamesEst[0] || 'N/D',
                        lastName: '', email: '', phone: '', sex: 'M',
                      },
                      baseGuestsCount: personsCountEst,
                      extraGuestsCount: 0,
                      totalPrice: total,
                      earlyCheckIn: earlyCheckIn,
                      lateCheckOut: lateCheckOut,
                      transferOneWay: pickupAirport,
                      transferRoundTrip: transferReturn,
                      breakfasts: Number(breakfast1Count) + Number(breakfast2Count) + Number(breakfast3Count),
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      room: selRoom ? { number: selRoom.number, name: selRoom.name, roomType: selRoom.roomType } : { number: '—', name: 'Reserva estancia', roomType: 'estancia' }
                    };
                    setMockReservations((prev) => [newRes, ...prev]);
                    setOpenReserve(false);
                  }}>Guardar reserva</Button>
                </DialogFooter>
              </TabsContent>

              <TabsContent value="terraza">
                <div className="py-6 text-sm text-muted-foreground">Modo "Terraza" pendiente de implementar.</div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { ReservationCalendar } from '../components/ReservationCalendar';
import { ReservationStatus } from '../types/types';
import { ReservationWithDetails } from '../types/types';

export default function ReservationsPage() {
  // Mock data for demonstration purposes
  const mockReservations: ReservationWithDetails[] = [
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
  ];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Calendario de Reservas</h1>
      <ReservationCalendar
        reservations={mockReservations}
        onReservationClick={(r) => console.log('Reservation clicked:', r)}
      />
    </div>
  );
}


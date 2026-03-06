import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rooms, reservations, type Reservation } from "@/data/mockData";

const DAYS_COUNT = 15;

const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const fmt = (d: Date) => d.toISOString().split("T")[0];

const formatDay = (d: Date) =>
  d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });

export default function Booking() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const days = useMemo(
    () => Array.from({ length: DAYS_COUNT }, (_, i) => addDays(startDate, i)),
    [startDate]
  );

  const getReservationsForCell = (roomId: string, date: string): Reservation[] =>
    reservations.filter(
      (r) => r.roomId === roomId && r.startDate <= date && r.endDate >= date
    );

  // Calculate span for a reservation starting on a given date
  const getSpan = (res: Reservation, dayIdx: number): number => {
    let span = 0;
    for (let i = dayIdx; i < DAYS_COUNT; i++) {
      if (fmt(days[i]) <= res.endDate) span++;
      else break;
    }
    return span;
  };

  // Track which cells are "covered" by a multi-day span
  const coveredCells = useMemo(() => {
    const covered = new Set<string>();
    rooms.forEach((room) => {
      days.forEach((day, dayIdx) => {
        const dateStr = fmt(day);
        const cellRes = getReservationsForCell(room.id, dateStr);
        cellRes.forEach((res) => {
          if (res.startDate === dateStr || dayIdx === 0) {
            const span = getSpan(res, dayIdx);
            for (let s = 1; s < span; s++) {
              covered.add(`${room.id}-${fmt(days[dayIdx + s])}`);
            }
          }
        });
      });
    });
    return covered;
  }, [startDate]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Booking — Calendario de Reservas</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setStartDate((d) => addDays(d, -7))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const d = new Date();
              d.setHours(0, 0, 0, 0);
              setStartDate(d);
            }}
          >
            Hoy
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setStartDate((d) => addDays(d, 7))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-primary text-primary-foreground px-3 py-2 text-left text-xs font-semibold min-w-[80px] border-r border-primary-foreground/20">
                Hab.
              </th>
              {days.map((day) => {
                const isToday = fmt(day) === fmt(new Date());
                return (
                  <th
                    key={fmt(day)}
                    className={`px-2 py-2 text-xs font-medium text-center min-w-[110px] border-r border-border ${
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {formatDay(day)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-t border-border">
                <td className="sticky left-0 z-10 bg-card px-3 py-2 text-sm font-semibold text-foreground border-r border-border">
                  {room.number}
                </td>
                {days.map((day, dayIdx) => {
                  const dateStr = fmt(day);
                  const cellKey = `${room.id}-${dateStr}`;

                  if (coveredCells.has(cellKey)) return null;

                  const cellRes = getReservationsForCell(room.id, dateStr);
                  const activeRes = cellRes.find(
                    (r) => r.startDate === dateStr || dayIdx === 0
                  );

                  if (activeRes) {
                    const span = getSpan(activeRes, dayIdx);
                    return (
                      <td
                        key={cellKey}
                        colSpan={span}
                        className="px-1 py-1 border-r border-border"
                      >
                        <div className="bg-primary/20 border border-primary/40 rounded px-2 py-1 text-xs">
                          <div className="font-semibold text-foreground truncate">
                            {activeRes.guestName}
                          </div>
                          {activeRes.isHourly && (
                            <div className="text-muted-foreground text-[10px]">
                              {activeRes.startHour} - {activeRes.endHour}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td
                      key={cellKey}
                      className="px-1 py-1 border-r border-border bg-card"
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

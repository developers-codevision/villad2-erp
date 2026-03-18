import { useState, useRef, useEffect } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isToday,
    addMonths,
    subMonths,
    addDays,
    subDays,
    parseISO,
    isBefore,
    isAfter,
    isSameDay,
    startOfDay,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    ReservationWithDetails,
    RESERVATION_STATUS_LABELS,
    RESERVATION_STATUS_VARIANTS,
} from '../types/types';
import { ReservationStatus } from '../types/types';

interface ReservationCalendarProps {
    reservations: ReservationWithDetails[];
    onReservationClick?: (reservation: ReservationWithDetails) => void;
    occupiedDates?: string[];
}

type ViewMode = '7d' | '14d' | 'month';

const STATUS_BAR_COLORS: Record<ReservationStatus, string> = {
    [ReservationStatus.PENDING]: 'bg-yellow-400 border-yellow-500 text-yellow-900',
    [ReservationStatus.CONFIRMED]: 'bg-green-400 border-green-500 text-green-900',
    [ReservationStatus.FINISHED]: 'bg-blue-400 border-blue-500 text-blue-900',
    [ReservationStatus.CANCELLED]: 'bg-red-300 border-red-400 text-red-900 opacity-60',
};

const LANE_HEIGHT = 52;
const MIN_DAY_WIDTH = 40;
const LABEL_WIDTH = 160;

const VIEW_OPTIONS: { value: ViewMode; label: string }[] = [
    { value: '7d', label: '7 días' },
    { value: '14d', label: '14 días' },
    { value: 'month', label: 'Mes' },
];

type DayCellRole = 'checkin' | 'checkout' | 'middle' | 'single';

const CELL_RADIUS: Record<DayCellRole, string> = {
    checkin: 'rounded-l rounded-r-none',
    checkout: 'rounded-r rounded-l-none',
    middle: 'rounded-none',
    single: 'rounded',
};

function reservationsOverlap(
    a: ReservationWithDetails,
    b: ReservationWithDetails
): boolean {
    const aStart = startOfDay(parseISO(a.checkInDate));
    const aEnd = startOfDay(parseISO(a.checkOutDate));
    const bStart = startOfDay(parseISO(b.checkInDate));
    const bEnd = startOfDay(parseISO(b.checkOutDate));
    return !isAfter(aStart, bEnd) && !isAfter(bStart, aEnd);
}

function assignLanes(roomReservations: ReservationWithDetails[]): {
    laneMap: Map<number, number>;
    laneCount: number;
} {
    const sorted = [...roomReservations].sort((a, b) =>
        a.checkInDate.localeCompare(b.checkInDate)
    );
    const laneMap = new Map<number, number>();
    for (const r of sorted) {
        const usedLanes = new Set<number>();
        for (const other of sorted) {
            if (other.id === r.id) continue;
            if (!laneMap.has(other.id)) continue;
            if (reservationsOverlap(r, other)) {
                usedLanes.add(laneMap.get(other.id)!);
            }
        }
        let lane = 0;
        while (usedLanes.has(lane)) lane++;
        laneMap.set(r.id, lane);
    }
    const laneCount =
        laneMap.size === 0 ? 1 : Math.max(...Array.from(laneMap.values()), 0) + 1;
    return { laneMap, laneCount };
}

export function ReservationCalendar({
    reservations,
    onReservationClick,
}: ReservationCalendarProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [anchorDate, setAnchorDate] = useState<Date>(startOfMonth(new Date()));
    const scrollRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            setContainerWidth(entry.contentRect.width);
        });
        ro.observe(el);
        setContainerWidth(el.clientWidth);
        return () => ro.disconnect();
    }, []);

    const rangeStart =
        viewMode === 'month' ? startOfMonth(anchorDate) : startOfDay(anchorDate);
    const rangeEnd =
        viewMode === 'month'
            ? endOfMonth(anchorDate)
            : viewMode === '14d'
                ? addDays(anchorDate, 13)
                : addDays(anchorDate, 6);

    const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd });
    const dayWidth =
        containerWidth > 0 && days.length > 0
            ? Math.max(MIN_DAY_WIDTH, containerWidth / days.length)
            : MIN_DAY_WIDTH;

    const goNext = () => {
        if (viewMode === 'month') setAnchorDate((d) => startOfMonth(addMonths(d, 1)));
        else if (viewMode === '14d') setAnchorDate((d) => addDays(d, 14));
        else setAnchorDate((d) => addDays(d, 7));
    };

    const goPrev = () => {
        if (viewMode === 'month') setAnchorDate((d) => startOfMonth(subMonths(d, 1)));
        else if (viewMode === '14d') setAnchorDate((d) => subDays(d, 14));
        else setAnchorDate((d) => subDays(d, 7));
    };

    const goToToday = () => {
        const today = new Date();
        setAnchorDate(viewMode === 'month' ? startOfMonth(today) : startOfDay(today));
    };

    const rangeLabel =
        viewMode === 'month'
            ? format(rangeStart, 'MMMM yyyy', { locale: es })
            : `${format(rangeStart, 'd MMM', { locale: es })} – ${format(rangeEnd, 'd MMM yyyy', { locale: es })}`;

    const handleViewModeChange = (mode: ViewMode) => {
        const today = new Date();
        setAnchorDate(mode === 'month' ? startOfMonth(today) : startOfDay(today));
        setViewMode(mode);
    };

    const roomMap = new Map<number, { id: number; number: string; name: string }>();
    reservations.forEach((r) => {
        if (!roomMap.has(r.roomId)) {
            roomMap.set(r.roomId, {
                id: r.roomId,
                number: r.room?.number ?? `#${r.roomId}`,
                name: r.room?.name ?? '',
            });
        }
    });

    const rooms = Array.from(roomMap.values()).sort((a, b) =>
        a.number.localeCompare(b.number, undefined, { numeric: true })
    );

    useEffect(() => {
        if (!scrollRef.current) return;
        const todayIndex = days.findIndex((d) => isToday(d));
        if (todayIndex !== -1) {
            const offset =
                todayIndex * dayWidth - (scrollRef.current.clientWidth / 2 - dayWidth / 2);
            scrollRef.current.scrollLeft = Math.max(0, offset);
        } else {
            scrollRef.current.scrollLeft = 0;
        }
    }, [anchorDate, viewMode, dayWidth, days]);

    const getReservationsForRoom = (roomId: number) =>
        reservations
            .filter((r) => {
                if (r.roomId !== roomId) return false;
                if (r.status === ReservationStatus.CANCELLED) return false;
                const checkIn = parseISO(r.checkInDate);
                const checkOut = parseISO(r.checkOutDate);
                return !isAfter(checkIn, rangeEnd) && !isBefore(checkOut, rangeStart);
            })
            .sort((a, b) => a.checkInDate.localeCompare(b.checkInDate));

    const extractTime = (isoString: string, fallback: string): string => {
        const d = parseISO(isoString);
        const h = d.getHours();
        const m = d.getMinutes();
        if (h === 0 && m === 0) return fallback;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const getReservationDayCells = (
        r: ReservationWithDetails
    ): { day: Date; dayIndex: number; role: DayCellRole }[] => {
        const checkIn = parseISO(r.checkInDate);
        const checkOut = parseISO(r.checkOutDate);
        const realStart = startOfDay(checkIn);
        const realEnd = isSameDay(checkIn, checkOut)
            ? startOfDay(checkIn)
            : startOfDay(checkOut);

        const cells: { day: Date; dayIndex: number; role: DayCellRole }[] = [];
        days.forEach((day, idx) => {
            const d = startOfDay(day);
            if (isBefore(d, realStart) || isAfter(d, realEnd)) return;
            const isFirst = isSameDay(d, realStart);
            const isLast = isSameDay(d, realEnd);
            let role: DayCellRole;
            if (isFirst && isLast) role = 'single';
            else if (isFirst) role = 'checkin';
            else if (isLast) role = 'checkout';
            else role = 'middle';
            cells.push({ day, dayIndex: idx, role });
        });
        return cells;
    };

    const totalGridWidth = days.length * dayWidth;
    const CELL_GAP = 2;
    const CELL_HEIGHT = LANE_HEIGHT - 10;

    const roomData = new Map<
        number,
        {
            roomReservations: ReservationWithDetails[];
            laneMap: Map<number, number>;
            laneCount: number;
            rowHeight: number;
        }
    >();

    rooms.forEach((room) => {
        const roomReservations = getReservationsForRoom(room.id);
        const { laneMap, laneCount } = assignLanes(roomReservations);
        const rowHeight = laneCount * LANE_HEIGHT;
        roomData.set(room.id, { roomReservations, laneMap, laneCount, rowHeight });
    });

    const headerHeight = LANE_HEIGHT;

    return (
        <TooltipProvider>
            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={goPrev}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h3 className="text-lg font-semibold capitalize min-w-[200px] text-center">
                            {rangeLabel}
                        </h3>
                        <Button variant="outline" size="icon" onClick={goNext}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex rounded-md border overflow-hidden">
                            {VIEW_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleViewModeChange(opt.value)}
                                    className={`px-3 py-1.5 text-xs font-medium transition-colors border-r last:border-r-0 ${
                                        viewMode === opt.value
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-background text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        <Button variant="outline" size="sm" onClick={goToToday}>
                            Hoy
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    {([
                        ReservationStatus.PENDING,
                        ReservationStatus.CONFIRMED,
                        ReservationStatus.FINISHED,
                    ] as ReservationStatus[]).map((status) => (
                        <div key={status} className="flex items-center gap-1.5">
                            <div className={`w-3 h-3 rounded border ${STATUS_BAR_COLORS[status]}`} />
                            <span>{RESERVATION_STATUS_LABELS[status]}</span>
                        </div>
                    ))}
                </div>

                <div className="border rounded-lg overflow-hidden bg-background">
                    {rooms.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            No hay reservas activas en este período.
                        </div>
                    ) : (
                        <div className="flex">
                            <div className="flex-shrink-0 border-r bg-muted/50" style={{ width: LABEL_WIDTH }}>
                                <div className="border-b bg-muted flex items-center px-3" style={{ height: headerHeight }}>
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        Habitación
                                    </span>
                                </div>
                                {rooms.map((room, i) => {
                                    const { rowHeight } = roomData.get(room.id)!;
                                    return (
                                        <div
                                            key={room.id}
                                            className={`flex flex-col justify-center px-3 border-b ${i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                                            style={{ height: rowHeight }}
                                        >
                                            <span className="text-sm font-medium leading-tight truncate">
                                                Hab. {room.number}
                                            </span>
                                            {room.name && (
                                                <span className="text-[11px] text-muted-foreground truncate leading-tight">
                                                    {room.name}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div ref={scrollRef} className="overflow-x-auto flex-1" style={{ scrollbarWidth: 'thin' }}>
                                <div style={{ width: totalGridWidth, minWidth: totalGridWidth }}>
                                    <div className="flex border-b bg-muted" style={{ height: headerHeight }}>
                                        {days.map((day) => {
                                            const today = isToday(day);
                                            const isWeekend = [0, 6].includes(day.getDay());
                                            return (
                                                <div
                                                    key={day.toISOString()}
                                                    className={`flex-shrink-0 flex flex-col items-center justify-center border-r text-center select-none ${
                                                        today ? 'bg-primary/10 text-primary font-bold' : isWeekend ? 'bg-muted/60 text-muted-foreground' : 'text-muted-foreground'
                                                    }`}
                                                    style={{ width: dayWidth }}
                                                >
                                                    <span className="text-[10px] capitalize leading-none">
                                                        {format(day, 'EEE', { locale: es }).slice(0, 2)}
                                                    </span>
                                                    <span className="text-xs font-semibold leading-tight">
                                                        {format(day, 'd')}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {rooms.map((room, i) => {
                                        const { roomReservations, laneMap, laneCount, rowHeight } = roomData.get(room.id)!;
                                        return (
                                            <div
                                                key={room.id}
                                                className={`relative border-b ${i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                                                style={{ height: rowHeight }}
                                            >
                                                <div className="absolute inset-0 flex pointer-events-none">
                                                    {days.map((day) => {
                                                        const today = isToday(day);
                                                        const isWeekend = [0, 6].includes(day.getDay());
                                                        return (
                                                            <div
                                                                key={day.toISOString()}
                                                                className={`flex-shrink-0 h-full border-r ${today ? 'bg-primary/5' : isWeekend ? 'bg-muted/30' : ''}`}
                                                                style={{ width: dayWidth }}
                                                            />
                                                        );
                                                    })}
                                                </div>

                                                {laneCount > 1 && Array.from({ length: laneCount - 1 }, (_, li) => (
                                                    <div
                                                        key={li}
                                                        className="absolute left-0 right-0 border-t border-dashed border-muted-foreground/20 pointer-events-none"
                                                        style={{ top: (li + 1) * LANE_HEIGHT }}
                                                    />
                                                ))}

                                                {roomReservations.map((r) => {
                                                    const dayCells = getReservationDayCells(r);
                                                    const checkInTime = extractTime(r.checkInDate, '14:00');
                                                    const checkOutTime = extractTime(r.checkOutDate, '11:00');
                                                    const guestName = `${r.mainGuest.firstName} ${r.mainGuest.lastName}`;
                                                    const totalNights = dayCells.length;
                                                    const lane = laneMap.get(r.id) ?? 0;
                                                    const laneTopOffset = lane * LANE_HEIGHT + LANE_HEIGHT / 2;

                                                    return dayCells.map(({ day, dayIndex, role }) => {
                                                        const cellLeft = dayIndex * dayWidth + CELL_GAP;
                                                        const cellWidth = dayWidth - CELL_GAP * 2;
                                                        const isVisibleFirst = role === 'checkin' || role === 'single';
                                                        const isVisibleLast = role === 'checkout' || role === 'single';
                                                        const adjustedLeft = isVisibleFirst ? cellLeft : dayIndex * dayWidth;
                                                        const adjustedWidth = isVisibleFirst ? cellWidth : isVisibleLast ? dayWidth - CELL_GAP : dayWidth;
                                                        const cellColor = STATUS_BAR_COLORS[r.status];

                                                        return (
                                                            <Tooltip key={`${r.id}-${day.toISOString()}`}>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        className={`absolute border text-[10px] font-medium cursor-pointer overflow-hidden -translate-y-1/2 hover:brightness-90 transition-all flex flex-col items-center justify-center ${cellColor} ${CELL_RADIUS[role]}`}
                                                                        style={{
                                                                            left: adjustedLeft,
                                                                            width: adjustedWidth,
                                                                            height: CELL_HEIGHT,
                                                                            top: laneTopOffset,
                                                                        }}
                                                                        onClick={() => onReservationClick?.(r)}
                                                                    >
                                                                        {role === 'checkin' && (
                                                                            <div className="flex flex-col items-center leading-none gap-0.5 px-0.5 w-full">
                                                                                <span className="font-bold text-[9px] uppercase tracking-wide opacity-90">Entrada</span>
                                                                                <span className="truncate text-[9px]">{checkInTime}</span>
                                                                            </div>
                                                                        )}
                                                                        {role === 'checkout' && (
                                                                            <div className="flex flex-col items-center leading-none gap-0.5 px-0.5 w-full">
                                                                                <span className="font-bold text-[9px] uppercase tracking-wide opacity-90">Salida</span>
                                                                                <span className="truncate text-[9px]">{checkOutTime}</span>
                                                                            </div>
                                                                        )}
                                                                        {role === 'single' && (
                                                                            <div className="flex flex-col items-center leading-none gap-0.5 px-0.5 w-full">
                                                                                <span className="font-bold text-[9px] uppercase tracking-wide opacity-90">Horas</span>
                                                                                <span className="truncate text-[9px]">{checkInTime}-{checkOutTime}</span>
                                                                            </div>
                                                                        )}
                                                                        {role === 'middle' && <span className="truncate px-0.5 text-[9px] opacity-90">{cellWidth > 30 ? guestName : ''}</span>}
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top" className="max-w-[260px]">
                                                                    <div className="space-y-1 text-xs">
                                                                        <div className="font-semibold">{guestName}</div>
                                                                        <div>Hab. {room.number}{room.name && ` – ${room.name}`}</div>
                                                                        <div className="space-y-0.5">
                                                                            <div>📅 {format(parseISO(r.checkInDate), 'dd/MM/yyyy')} → {format(parseISO(r.checkOutDate), 'dd/MM/yyyy')}</div>
                                                                            <div className="text-muted-foreground">🕐 En: {checkInTime} · Sal: {checkOutTime}</div>
                                                                        </div>
                                                                        <Badge variant={RESERVATION_STATUS_VARIANTS[r.status]} className="text-[10px] px-1 py-0">
                                                                            {RESERVATION_STATUS_LABELS[r.status]}
                                                                        </Badge>
                                                                        <div className="font-medium text-primary">${(Number(r.totalPrice) || 0).toFixed(2)}</div>
                                                                    </div>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        );
                                                    });
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
}
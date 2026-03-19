import { useChecking } from "../hooks/useChecking";
import type { RoomStatus } from "../types/types";
import { statusLabels } from "../types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusColors: Record<RoomStatus, string> = {
  VL: "bg-[hsl(var(--status-vl))]",
  VC: "bg-[hsl(var(--status-vc))]",
  O: "bg-[hsl(var(--status-o))]",
  FO: "bg-[hsl(var(--status-fo))]",
};

const statusTextColors: Record<RoomStatus, string> = {
  VL: "text-white",
  VC: "text-white",
  O: "text-white",
  FO: "text-white",
};

export default function Checking() {
  const { rooms, changeStatus } = useChecking();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Checking — Estado de Habitaciones
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="rounded-lg border border-border bg-card overflow-hidden shadow-sm"
          >
            <div
              className={`${statusColors[room.status]} ${statusTextColors[room.status]} px-4 py-3 flex items-center justify-between`}
            >
              <span className="text-2xl font-bold">{room.number}</span>
              <span className="text-sm font-semibold px-2 py-0.5 rounded bg-black/20">
                {room.status}
              </span>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                {statusLabels[room.status]}
              </p>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Cambiar estado
                </label>
                <Select
                  value={room.status}
                  onValueChange={(v) => changeStatus(room.id, v as RoomStatus)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(statusLabels) as RoomStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s} — {statusLabels[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import type { Room, RoomStatus } from "../types/types";

// Mock data, in a real app this would come from API
const initialRooms: Room[] = [
  { id: "1", number: "101", status: "VL" },
  { id: "2", number: "102", status: "VC" },
  { id: "3", number: "103", status: "O" },
  { id: "4", number: "104", status: "FO" },
  { id: "5", number: "201", status: "VL" },
  { id: "6", number: "202", status: "VC" },
  { id: "7", number: "203", status: "O" },
  { id: "8", number: "204", status: "FO" },
];

export function useChecking() {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);

  const changeStatus = (roomId: string, newStatus: RoomStatus) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, status: newStatus } : r))
    );
  };

  return {
    rooms,
    changeStatus,
  };
}

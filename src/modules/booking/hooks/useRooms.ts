import { useQuery } from "@tanstack/react-query";
import { roomsService } from "../services/roomsService";
import type { ExampleRoom } from "../components/reservations/RoomSelectField";

export function useRooms() {
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: roomsService.getRooms,
  });

  const exampleRooms: ExampleRoom[] = rooms.map(room => ({
    id: room.id,
    number: room.number,
    name: room.name,
    roomType: room.roomType,
  }));

  return {
    rooms: exampleRooms,
    isLoading,
  };
}

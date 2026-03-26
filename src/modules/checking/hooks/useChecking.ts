import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roomsService } from "../services/roomsService";
import type { Room, RoomStatus } from "../types/types";

export function useChecking() {
  const queryClient = useQueryClient();

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: roomsService.getRooms,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: RoomStatus }) =>
      roomsService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  const changeStatus = (roomId: number, newStatus: RoomStatus) => {
    updateStatusMutation.mutate({ id: roomId, status: newStatus });
  };

  return {
    rooms,
    changeStatus,
    isLoading,
  };
}

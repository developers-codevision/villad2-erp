import * as api from "../api/roomsApi";
import type { RoomStatus } from "../types/types";

export const roomsService = {
  getRooms: () => api.getRooms(),
  updateStatus: (id: number, status: RoomStatus) => api.updateRoomStatus(id, status),
};

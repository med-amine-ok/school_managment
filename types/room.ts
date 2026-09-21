export type RoomType =
  | 'Classroom'
  | 'Laboratory'
  | 'Computer Lab'
  | 'Conference'
  | 'Other';

export type RoomStatus = 'Available' | 'Occupied' | 'Maintenance';

export interface Room {
  id: string;
  name: string; // e.g. "Room 204"
  number: string; // "204"
  capacity: number; // e.g. 25
  floor: number; // e.g. 2
  building: string; // "Building A"
  type: RoomType;
  equipment: string[]; // ["Projector", "Whiteboard", "AC"]
  status: RoomStatus;
}

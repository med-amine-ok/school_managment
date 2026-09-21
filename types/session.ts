export type SessionStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Session {
  id: string;
  subjectId: string;
  groupId: string;
  teacherId: string;
  roomId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (e.g. "16:00")
  endTime: string;   // HH:mm (e.g. "17:30")
  durationMinutes: number;
  status: SessionStatus;
  notes?: string;
}

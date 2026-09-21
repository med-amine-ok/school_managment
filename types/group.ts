export interface ScheduleSlot {
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // e.g. "16:00"
  endTime: string;   // e.g. "17:30"
}

export interface Group {
  id: string;
  name: string; // e.g. "Mathematics Group A"
  subjectId: string;
  teacherId: string;
  defaultRoomId: string;
  maxCapacity: number; // e.g. 25
  scheduleSlots: ScheduleSlot[];
  status: 'Active' | 'Archived';
}

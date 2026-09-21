export type AttendanceStatus = 'Present' | 'Absent';

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  notes?: string;
  recordedAt: string;
}

export interface StudentAttendanceSummary {
  studentId: string;
  totalSessions: number;
  present: number;
  absent: number;
  late?: number;
  excused?: number;
  attendancePercentage: number;
}

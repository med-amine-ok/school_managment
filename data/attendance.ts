import { AttendanceRecord, AttendanceStatus } from '@/types/attendance';
import { mockSessions } from './sessions';
import { mockEnrollments } from './enrollments';

const generateAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  let counter = 1;

  // Group enrollments by groupId for quick lookup
  const groupStudentMap = new Map<string, string[]>();
  mockEnrollments.forEach((e) => {
    if (!groupStudentMap.has(e.groupId)) {
      groupStudentMap.set(e.groupId, []);
    }
    groupStudentMap.get(e.groupId)!.push(e.studentId);
  });

  // Only completed sessions have historical attendance
  const completedSessions = mockSessions.filter((s) => s.status === 'Completed');

  completedSessions.forEach((session) => {
    const studentIds = groupStudentMap.get(session.groupId) || [];

    studentIds.forEach((studentId, idx) => {
      // Deterministic realistic attendance simulation
      const hash = (session.id.charCodeAt(4) + studentId.charCodeAt(4) + idx * 7) % 100;

      let status: AttendanceStatus = 'Present';
      let notes: string | undefined;

      if (studentId === 'stu-005' || studentId === 'stu-019') {
        // Lower attendance for alert simulation
        if (hash < 35) {
          status = 'Absent';
          notes = 'Unexcused absence';
        } else {
          status = 'Present';
        }
      } else if (hash < 8) {
        status = 'Absent';
        notes = 'Absence reported to office';
      } else {
        status = 'Present';
      }

      records.push({
        id: `att-${counter.toString().padStart(5, '0')}`,
        sessionId: session.id,
        studentId,
        status,
        notes,
        recordedAt: `${session.date}T${session.startTime}:00`,
      });

      counter++;
    });
  });

  return records;
};

export const mockAttendanceRecords: AttendanceRecord[] = generateAttendance();

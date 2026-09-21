import { mockAttendanceRecords } from '@/data/attendance';
import { mockEnrollments } from '@/data/enrollments';
import { mockSessions } from '@/data/sessions';
import { StudentAttendanceSummary } from '@/types/attendance';

/**
 * Calculates a student's attendance summary (total sessions, present, absent, percentage).
 */
export function getStudentAttendanceSummary(studentId: string): StudentAttendanceSummary {
  const records = mockAttendanceRecords.filter((a) => a.studentId === studentId);
  const totalSessions = records.length;

  if (totalSessions === 0) {
    return {
      studentId,
      totalSessions: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      attendancePercentage: 100,
    };
  }

  const present = records.filter((r) => r.status === 'Present').length;
  const absent = records.filter((r) => r.status === 'Absent').length;

  const percentage = Math.round((present / totalSessions) * 100);

  return {
    studentId,
    totalSessions,
    present,
    absent,
    late: 0,
    excused: 0,
    attendancePercentage: Math.min(100, percentage),
  };
}

/**
 * Returns overall school-wide attendance metrics.
 */
export function getSchoolAttendanceOverview() {
  const total = mockAttendanceRecords.length;
  if (total === 0) return { presentRate: 100, lateRate: 0, absentRate: 0, excusedRate: 0, totalRecords: 0, presentCount: 0, absentCount: 0 };

  const present = mockAttendanceRecords.filter((r) => r.status === 'Present').length;
  const absent = mockAttendanceRecords.filter((r) => r.status === 'Absent').length;

  return {
    totalRecords: total,
    presentCount: present,
    lateCount: 0,
    absentCount: absent,
    excusedCount: 0,
    presentRate: Math.round((present / total) * 100),
    lateRate: 0,
    absentRate: Math.round((absent / total) * 100),
    excusedRate: 0,
  };
}

/**
 * Gets student count enrolled in a given group.
 */
export function getGroupEnrollmentCount(groupId: string): number {
  return mockEnrollments.filter((e) => e.groupId === groupId && e.status === 'Active').length;
}

/**
 * Gets student IDs enrolled in a given group.
 */
export function getGroupStudentIds(groupId: string): string[] {
  return mockEnrollments
    .filter((e) => e.groupId === groupId && e.status === 'Active')
    .map((e) => e.studentId);
}

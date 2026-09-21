import { mockSessions } from '@/data/sessions';
import { mockRooms } from '@/data/rooms';
import { mockTeachers } from '@/data/teachers';
import { mockGroups } from '@/data/groups';
import { getGroupEnrollmentCount } from './academic';

export interface ConflictCheckParams {
  roomId: string;
  teacherId: string;
  groupId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  excludeSessionId?: string;
}

export interface ConflictResult {
  hasConflict: boolean;
  warnings: string[];
  roomConflict?: { sessionId: string; conflictMessage: string };
  teacherConflict?: { sessionId: string; conflictMessage: string };
  groupConflict?: { sessionId: string; conflictMessage: string };
  capacityConflict?: { conflictMessage: string };
}

/**
 * Checks if two time intervals overlap on the same day.
 * Format: "HH:mm"
 */
export function timeOverlaps(startA: string, endA: string, startB: string, endB: string): boolean {
  return startA < endB && endA > startB;
}

/**
 * Validates if a room is available at a given time slot.
 */
export function calculateRoomAvailability(
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeSessionId?: string
): { isAvailable: boolean; occupyingSession?: typeof mockSessions[0] } {
  const occupying = mockSessions.find((s) => {
    if (excludeSessionId && s.id === excludeSessionId) return false;
    if (s.roomId !== roomId) return false;
    if (s.date !== date) return false;
    if (s.status === 'Cancelled') return false;
    return timeOverlaps(startTime, endTime, s.startTime, s.endTime);
  });

  return {
    isAvailable: !occupying,
    occupyingSession: occupying,
  };
}

export const isRoomAvailable = calculateRoomAvailability;

/**
 * Comprehensive conflict detection engine checking room, teacher, group, and capacity.
 */
export function detectSessionConflicts(params: ConflictCheckParams): ConflictResult {
  const { roomId, teacherId, groupId, date, startTime, endTime, excludeSessionId } = params;
  const warnings: string[] = [];
  let roomConflict: ConflictResult['roomConflict'];
  let teacherConflict: ConflictResult['teacherConflict'];
  let groupConflict: ConflictResult['groupConflict'];
  let capacityConflict: ConflictResult['capacityConflict'];

  // 1. Room Conflict
  const room = mockRooms.find((r) => r.id === roomId);
  const roomCheck = calculateRoomAvailability(roomId, date, startTime, endTime, excludeSessionId);
  if (!roomCheck.isAvailable && roomCheck.occupyingSession) {
    const msg = `${room?.name || 'Selected Room'} is already occupied on ${date} from ${roomCheck.occupyingSession.startTime} to ${roomCheck.occupyingSession.endTime}.`;
    warnings.push(msg);
    roomConflict = { sessionId: roomCheck.occupyingSession.id, conflictMessage: msg };
  }

  // 2. Teacher Conflict
  const teacher = mockTeachers.find((t) => t.id === teacherId);
  const teacherOverlap = mockSessions.find((s) => {
    if (excludeSessionId && s.id === excludeSessionId) return false;
    if (s.teacherId !== teacherId) return false;
    if (s.date !== date) return false;
    if (s.status === 'Cancelled') return false;
    return timeOverlaps(startTime, endTime, s.startTime, s.endTime);
  });

  if (teacherOverlap) {
    const msg = `Teacher ${teacher?.name || 'Selected Teacher'} is already conducting another session on ${date} from ${teacherOverlap.startTime} to ${teacherOverlap.endTime}.`;
    warnings.push(msg);
    teacherConflict = { sessionId: teacherOverlap.id, conflictMessage: msg };
  }

  // 3. Group Conflict
  const group = mockGroups.find((g) => g.id === groupId);
  const groupOverlap = mockSessions.find((s) => {
    if (excludeSessionId && s.id === excludeSessionId) return false;
    if (s.groupId !== groupId) return false;
    if (s.date !== date) return false;
    if (s.status === 'Cancelled') return false;
    return timeOverlaps(startTime, endTime, s.startTime, s.endTime);
  });

  if (groupOverlap) {
    const msg = `Group "${group?.name || groupId}" has an overlapping class scheduled on ${date} from ${groupOverlap.startTime} to ${groupOverlap.endTime}.`;
    warnings.push(msg);
    groupConflict = { sessionId: groupOverlap.id, conflictMessage: msg };
  }

  // 4. Capacity Conflict
  const enrolledCount = getGroupEnrollmentCount(groupId);
  if (room && enrolledCount > room.capacity) {
    const msg = `Group size (${enrolledCount} students) exceeds ${room.name} maximum capacity of ${room.capacity} seats.`;
    warnings.push(msg);
    capacityConflict = { conflictMessage: msg };
  }

  return {
    hasConflict: warnings.length > 0,
    warnings,
    roomConflict,
    teacherConflict,
    groupConflict,
    capacityConflict,
  };
}

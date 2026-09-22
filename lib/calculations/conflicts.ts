import { mockSessions } from '@/data/sessions';
import { mockRooms } from '@/data/rooms';
import { mockTeachers } from '@/data/teachers';
import { mockGroups } from '@/data/groups';
import { Session, Room } from '@/types';
import { getGroupEnrollmentCount } from './academic';

export interface ConflictCheckParams {
  roomId: string;
  teacherId: string;
  groupId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  excludeSessionId?: string;
}

export interface ConflictResult {
  hasConflict: boolean;
  warnings: string[];
  reasons: string[]; // alias to warnings
  roomConflict?: { sessionId: string; conflictMessage: string };
  teacherConflict?: { sessionId: string; conflictMessage: string };
  groupConflict?: { sessionId: string; conflictMessage: string };
  capacityConflict?: { conflictMessage: string };
}

export interface RoomAvailabilityInfo {
  status: 'available' | 'occupied' | 'upcoming' | 'maintenance';
  isAvailable: boolean;
  occupyingSession?: Session;
  currentSession?: Session;
  nextSession?: Session;
}

/**
 * Checks if two time intervals overlap on the same day.
 * Format: "HH:mm"
 */
export function timeOverlaps(startA: string, endA: string, startB: string, endB: string): boolean {
  return startA < endB && endA > startB;
}

/**
 * Validates if a room is available at a given time slot or point in time.
 */
export function calculateRoomAvailability(
  roomId: string,
  date: string,
  startTime: string,
  endTime?: string,
  sessionsList: Session[] = mockSessions,
  excludeSessionId?: string
): RoomAvailabilityInfo {
  const room = mockRooms.find((r) => r.id === roomId);
  if (room && (room.status === 'maintenance' || (room.status as string) === 'Maintenance')) {
    return {
      status: 'maintenance',
      isAvailable: false,
      occupyingSession: undefined,
      currentSession: undefined,
      nextSession: undefined,
    };
  }

  // Active sessions on this date for this room
  const roomSessions = sessionsList.filter((s) => {
    if (excludeSessionId && s.id === excludeSessionId) return false;
    if (s.roomId !== roomId) return false;
    if (s.date !== date) return false;
    if (s.status === 'Cancelled') return false;
    return true;
  });

  // If endTime is provided and differs from startTime, check interval overlap
  if (endTime && endTime > startTime) {
    const occupying = roomSessions.find((s) =>
      timeOverlaps(startTime, endTime, s.startTime, s.endTime)
    );

    if (occupying) {
      return {
        status: 'occupied',
        isAvailable: false,
        occupyingSession: occupying,
        currentSession: occupying,
      };
    }
  } else {
    // Instantaneous point in time: is session active at startTime?
    const occupying = roomSessions.find(
      (s) => s.startTime <= startTime && s.endTime > startTime
    );

    if (occupying) {
      return {
        status: 'occupied',
        isAvailable: false,
        occupyingSession: occupying,
        currentSession: occupying,
      };
    }
  }

  // Check if upcoming session starts within 30 minutes
  const [h, m] = startTime.split(':').map(Number);
  const futureMinutes = h * 60 + m + 30;
  const futureTimeStr = `${String(Math.floor(futureMinutes / 60)).padStart(2, '0')}:${String(
    futureMinutes % 60
  ).padStart(2, '0')}`;

  const upcomingSoon = roomSessions.find(
    (s) => s.startTime > startTime && s.startTime <= futureTimeStr
  );

  // Find any later scheduled session today
  const nextSession =
    upcomingSoon ||
    roomSessions
      .filter((s) => s.startTime >= startTime)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];

  if (upcomingSoon) {
    return {
      status: 'upcoming',
      isAvailable: true,
      occupyingSession: undefined,
      currentSession: undefined,
      nextSession,
    };
  }

  return {
    status: 'available',
    isAvailable: true,
    occupyingSession: undefined,
    currentSession: undefined,
    nextSession,
  };
}

export const isRoomAvailable = (
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
  sessionsList?: Session[]
) => {
  const res = calculateRoomAvailability(roomId, date, startTime, endTime, sessionsList);
  return res.isAvailable;
};

/**
 * Comprehensive conflict detection engine checking room, teacher, group, and capacity.
 */
export function detectSessionConflicts(
  params: ConflictCheckParams,
  customSessions: Session[] = mockSessions
): ConflictResult {
  const { roomId, teacherId, groupId, date, startTime, endTime, excludeSessionId } = params;
  const warnings: string[] = [];
  let roomConflict: ConflictResult['roomConflict'];
  let teacherConflict: ConflictResult['teacherConflict'];
  let groupConflict: ConflictResult['groupConflict'];
  let capacityConflict: ConflictResult['capacityConflict'];

  // 1. Room Conflict
  if (roomId && roomId !== 'temp') {
    const room = mockRooms.find((r) => r.id === roomId);
    const roomCheck = calculateRoomAvailability(
      roomId,
      date,
      startTime,
      endTime,
      customSessions,
      excludeSessionId
    );
    if (!roomCheck.isAvailable && roomCheck.occupyingSession) {
      const msg = `Room "${room?.name || roomId}" is already occupied on ${date} from ${
        roomCheck.occupyingSession.startTime
      } to ${roomCheck.occupyingSession.endTime}. Choose another room or time.`;
      warnings.push(msg);
      roomConflict = { sessionId: roomCheck.occupyingSession.id, conflictMessage: msg };
    }
  }

  // 2. Teacher Conflict
  if (teacherId) {
    const teacher = mockTeachers.find((t) => t.id === teacherId);
    const teacherOverlap = customSessions.find((s) => {
      if (excludeSessionId && s.id === excludeSessionId) return false;
      if (s.teacherId !== teacherId) return false;
      if (s.date !== date) return false;
      if (s.status === 'Cancelled') return false;
      return timeOverlaps(startTime, endTime, s.startTime, s.endTime);
    });

    if (teacherOverlap) {
      const msg = `Teacher ${teacher?.name || teacherId} is already conducting a session from ${
        teacherOverlap.startTime
      } to ${teacherOverlap.endTime}. Choose another time.`;
      warnings.push(msg);
      teacherConflict = { sessionId: teacherOverlap.id, conflictMessage: msg };
    }
  }

  // 3. Group Conflict
  if (groupId) {
    const group = mockGroups.find((g) => g.id === groupId);
    const groupOverlap = customSessions.find((s) => {
      if (excludeSessionId && s.id === excludeSessionId) return false;
      if (s.groupId !== groupId) return false;
      if (s.date !== date) return false;
      if (s.status === 'Cancelled') return false;
      return timeOverlaps(startTime, endTime, s.startTime, s.endTime);
    });

    if (groupOverlap) {
      const msg = `Group "${group?.name || groupId}" already has another session from ${
        groupOverlap.startTime
      } to ${groupOverlap.endTime}.`;
      warnings.push(msg);
      groupConflict = { sessionId: groupOverlap.id, conflictMessage: msg };
    }
  }

  // 4. Capacity Conflict
  if (roomId && groupId && roomId !== 'temp') {
    const room = mockRooms.find((r) => r.id === roomId);
    const enrolledCount = getGroupEnrollmentCount(groupId);
    if (room && enrolledCount > room.capacity) {
      const msg = `Capacity conflict: This group has ${enrolledCount} students, but ${room.name} can hold only ${room.capacity}.`;
      warnings.push(msg);
      capacityConflict = { conflictMessage: msg };
    }
  }

  return {
    hasConflict: warnings.length > 0,
    warnings,
    reasons: warnings,
    roomConflict,
    teacherConflict,
    groupConflict,
    capacityConflict,
  };
}

/**
 * Returns all available rooms at a specific date and time interval.
 */
export function getAvailableRooms(
  date: string,
  startTime: string,
  endTime: string,
  arg4?: number | Session[],
  arg5?: Session[] | string
): Room[] {
  let minCapacity: number | undefined = undefined;
  let sessionsList: Session[] = mockSessions;

  if (typeof arg4 === 'number') {
    minCapacity = arg4;
    if (Array.isArray(arg5)) {
      sessionsList = arg5;
    }
  } else if (Array.isArray(arg4)) {
    sessionsList = arg4;
  }

  return mockRooms.filter((room) => {
    if (room.status === 'maintenance' || (room.status as string) === 'Maintenance') return false;
    if (minCapacity && room.capacity < minCapacity) return false;
    const availability = calculateRoomAvailability(
      room.id,
      date,
      startTime,
      endTime,
      sessionsList
    );
    return availability.isAvailable;
  });
}

/**
 * Returns all sessions scheduled for a given room, optionally filtered by a specific date.
 */
export function getRoomSchedule(roomId: string, date?: string, sessionsList: Session[] = mockSessions): Session[] {
  return sessionsList
    .filter((s) => {
      if (s.roomId !== roomId) return false;
      if (date && s.date !== date) return false;
      if (s.status === 'Cancelled') return false;
      return true;
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

/**
 * Clean wrapper conforming to hasSchedulingConflict specification.
 */
export function hasSchedulingConflict(
  teacherId: string,
  groupId: string,
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeSessionId?: string,
  sessionsList: Session[] = mockSessions
): ConflictResult {
  return detectSessionConflicts(
    {
      teacherId,
      groupId,
      roomId,
      date,
      startTime,
      endTime,
      excludeSessionId,
    },
    sessionsList
  );
}

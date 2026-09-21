import { Session } from '@/types/session';

// Helper to generate sessions over the academic calendar
const generateSessions = (): Session[] => {
  const sessions: Session[] = [];
  let sessionIdCounter = 1;

  // Schedule template for recurring weekly days
  const weeklyTemplates = [
    // Mondays
    { dayOfWeek: 1, subjectId: 'sub-math', groupId: 'grp-math-a', teacherId: 'tch-ahmed', roomId: 'room-204', startTime: '16:00', endTime: '17:30', duration: 90 },
    { dayOfWeek: 1, subjectId: 'sub-eng', groupId: 'grp-eng-a', teacherId: 'tch-sara', roomId: 'room-101', startTime: '16:00', endTime: '17:30', duration: 90 },
    { dayOfWeek: 1, subjectId: 'sub-ara', groupId: 'grp-ara-a', teacherId: 'tch-amina', roomId: 'room-104', startTime: '16:00', endTime: '17:30', duration: 90 },
    { dayOfWeek: 1, subjectId: 'sub-phys', groupId: 'grp-phys-a', teacherId: 'tch-karim', roomId: 'room-102', startTime: '17:45', endTime: '19:15', duration: 90 },
    { dayOfWeek: 1, subjectId: 'sub-chem', groupId: 'grp-chem-a', teacherId: 'tch-mourad', roomId: 'room-lab-1', startTime: '17:45', endTime: '19:15', duration: 90 },

    // Tuesdays
    { dayOfWeek: 2, subjectId: 'sub-math', groupId: 'grp-math-b', teacherId: 'tch-ahmed', roomId: 'room-204', startTime: '16:00', endTime: '17:30', duration: 90 },
    { dayOfWeek: 2, subjectId: 'sub-eng', groupId: 'grp-eng-b', teacherId: 'tch-sara', roomId: 'room-101', startTime: '16:00', endTime: '17:30', duration: 90 },
    { dayOfWeek: 2, subjectId: 'sub-sci', groupId: 'grp-sci-a', teacherId: 'tch-fatima', roomId: 'room-lab-1', startTime: '16:00', endTime: '17:30', duration: 90 },
    { dayOfWeek: 2, subjectId: 'sub-phys', groupId: 'grp-phys-b', teacherId: 'tch-karim', roomId: 'room-102', startTime: '17:45', endTime: '19:15', duration: 90 },
    { dayOfWeek: 2, subjectId: 'sub-fr', groupId: 'grp-fr-a', teacherId: 'tch-samia', roomId: 'room-104', startTime: '17:45', endTime: '19:15', duration: 90 },

    // Wednesdays
    { dayOfWeek: 3, subjectId: 'sub-math', groupId: 'grp-math-a', teacherId: 'tch-ahmed', roomId: 'room-204', startTime: '16:00', endTime: '17:30', duration: 90 },
    { dayOfWeek: 3, subjectId: 'sub-eng', groupId: 'grp-eng-a', teacherId: 'tch-sara', roomId: 'room-101', startTime: '16:00', endTime: '17:30', duration: 90 },
    { dayOfWeek: 3, subjectId: 'sub-ara', groupId: 'grp-ara-a', teacherId: 'tch-amina', roomId: 'room-104', startTime: '16:00', endTime: '17:30', duration: 90 },
    { dayOfWeek: 3, subjectId: 'sub-phys', groupId: 'grp-phys-a', teacherId: 'tch-karim', roomId: 'room-102', startTime: '17:45', endTime: '19:15', duration: 90 },
    { dayOfWeek: 3, subjectId: 'sub-chem', groupId: 'grp-chem-a', teacherId: 'tch-mourad', roomId: 'room-lab-1', startTime: '17:45', endTime: '19:15', duration: 90 },

    // Thursdays
    { dayOfWeek: 4, subjectId: 'sub-math', groupId: 'grp-math-b', teacherId: 'tch-ahmed', roomId: 'room-204', startTime: '16:00', endTime: '17:30', duration: 90 },
    { dayOfWeek: 4, subjectId: 'sub-eng', groupId: 'grp-eng-b', teacherId: 'tch-sara', roomId: 'room-101', startTime: '16:00', endTime: '17:30', duration: 90 },
    { dayOfWeek: 4, subjectId: 'sub-sci', groupId: 'grp-sci-a', teacherId: 'tch-fatima', roomId: 'room-lab-1', startTime: '16:00', endTime: '17:30', duration: 90 },
    { dayOfWeek: 4, subjectId: 'sub-phys', groupId: 'grp-phys-b', teacherId: 'tch-karim', roomId: 'room-102', startTime: '17:45', endTime: '19:15', duration: 90 },
    { dayOfWeek: 4, subjectId: 'sub-fr', groupId: 'grp-fr-a', teacherId: 'tch-samia', roomId: 'room-104', startTime: '17:45', endTime: '19:15', duration: 90 },

    // Fridays
    { dayOfWeek: 5, subjectId: 'sub-chem', groupId: 'grp-chem-b', teacherId: 'tch-mourad', roomId: 'room-103', startTime: '09:00', endTime: '12:00', duration: 180 },

    // Saturdays
    { dayOfWeek: 6, subjectId: 'sub-math', groupId: 'grp-math-c', teacherId: 'tch-redha', roomId: 'room-101', startTime: '09:00', endTime: '12:00', duration: 180 },
    { dayOfWeek: 6, subjectId: 'sub-sci', groupId: 'grp-sci-b', teacherId: 'tch-fatima', roomId: 'room-201', startTime: '10:00', endTime: '13:00', duration: 180 },
    { dayOfWeek: 6, subjectId: 'sub-phys', groupId: 'grp-phys-c', teacherId: 'tch-nora', roomId: 'room-103', startTime: '13:00', endTime: '16:00', duration: 180 },
    { dayOfWeek: 6, subjectId: 'sub-cs', groupId: 'grp-cs-a', teacherId: 'tch-yacine', roomId: 'room-comp-lab', startTime: '14:00', endTime: '17:00', duration: 180 },

    // Sundays
    { dayOfWeek: 0, subjectId: 'sub-cs', groupId: 'grp-cs-b', teacherId: 'tch-yacine', roomId: 'room-comp-lab', startTime: '14:00', endTime: '17:00', duration: 180 },
  ];

  // We generate dates from Sept 1, 2026 to Sept 30, 2026 (including today Sept 21, 2026)
  // Sept 1, 2026 was a Tuesday (dayOfWeek: 2)
  for (let day = 1; day <= 30; day++) {
    const dateStr = `2026-09-${day.toString().padStart(2, '0')}`;
    const dateObj = new Date(2026, 8, day); // Month 8 is September (0-indexed)
    const dayOfWeek = dateObj.getDay();

    const matchingTemplates = weeklyTemplates.filter((t) => t.dayOfWeek === dayOfWeek);

    for (const t of matchingTemplates) {
      let status: Session['status'] = 'Scheduled';
      if (day < 21) {
        status = 'Completed';
      } else if (day === 21) {
        // Today is Monday Sept 21!
        status = 'Scheduled';
      } else {
        status = 'Scheduled';
      }

      sessions.push({
        id: `ses-${sessionIdCounter.toString().padStart(4, '0')}`,
        subjectId: t.subjectId,
        groupId: t.groupId,
        teacherId: t.teacherId,
        roomId: t.roomId,
        date: dateStr,
        startTime: t.startTime,
        endTime: t.endTime,
        durationMinutes: t.duration,
        status,
        notes: day === 21 ? 'Today scheduled session' : undefined,
      });

      sessionIdCounter++;
    }
  }

  return sessions;
};

export const mockSessions: Session[] = generateSessions();

'use client';

import React from 'react';
import { Clock, MapPin, User, CheckCircle2, Calendar } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { mockSessions } from '@/data/sessions';
import { mockSubjects } from '@/data/subjects';
import { mockTeachers } from '@/data/teachers';
import { mockGroups } from '@/data/groups';
import { mockRooms } from '@/data/rooms';

interface TodayScheduleProps {
  onMarkAttendance?: (sessionId: string) => void;
}

export const TodaySchedule: React.FC<TodayScheduleProps> = ({ onMarkAttendance }) => {
  // Today's date: September 21, 2026
  const todayDate = '2026-09-21';
  const todaySessions = mockSessions.filter((s) => s.date === todayDate);

  const getSubject = (id: string) => mockSubjects.find((s) => s.id === id);
  const getTeacher = (id: string) => mockTeachers.find((t) => t.id === id);
  const getGroup = (id: string) => mockGroups.find((g) => g.id === id);
  const getRoom = (id: string) => mockRooms.find((r) => r.id === id);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            <span>Today&apos;s Class Schedule</span>
            <Badge variant="primary" size="sm">
              {todaySessions.length} Classes Scheduled
            </Badge>
          </div>
        }
        subtitle="Monday, 21 September 2026 — Daily classroom timeline"
        action={
          <a
            href="/schedule"
            className="text-xs font-semibold text-[#4F6EF7] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" /> Full Calendar
          </a>
        }
      />

      <CardContent className="flex-1 divide-y divide-[#F1F5F9] p-0 max-h-[460px] overflow-y-auto">
        {todaySessions.length === 0 ? (
          <div className="p-8 text-center text-[#94A3B8]">
            <Calendar className="w-10 h-10 mx-auto text-[#CBD5E1] mb-2" />
            <p className="text-sm font-medium">No sessions scheduled for today</p>
          </div>
        ) : (
          todaySessions.map((session, index) => {
            const subject = getSubject(session.subjectId);
            const teacher = getTeacher(session.teacherId);
            const group = getGroup(session.groupId);
            const room = getRoom(session.roomId);

            return (
              <div
                key={session.id}
                className="p-4 hover:bg-[#F8FAFC] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Time & Color Bar */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-1.5 self-stretch rounded-full shrink-0"
                    style={{ backgroundColor: subject?.color || '#4F6EF7' }}
                  />
                  <div className="flex flex-col min-w-[90px]">
                    <span className="text-xs font-bold text-[#1E293B] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                      {session.startTime}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      to {session.endTime} ({session.durationMinutes}m)
                    </span>
                  </div>

                  {/* Subject & Group Details */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#1E293B]">
                        {subject?.name}
                      </h4>
                      <Badge
                        variant="neutral"
                        size="sm"
                        className="text-[10px]"
                      >
                        {group?.name.split('(')[0] || 'Group'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B] mt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#94A3B8]" />
                        {teacher?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                        {room?.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & Action */}
                <div className="flex items-center gap-2 sm:self-center pl-4 sm:pl-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkAttendance && onMarkAttendance(session.id)}
                    icon={<CheckCircle2 className="w-3.5 h-3.5 text-[#14B8A6]" />}
                    className="text-xs"
                  >
                    Attendance
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

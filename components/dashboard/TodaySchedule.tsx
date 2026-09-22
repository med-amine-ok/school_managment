'use client';

import React from 'react';
import { Clock, MapPin, User, CheckCircle2, Calendar, Users } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { mockSessions } from '@/data/sessions';
import { mockSubjects } from '@/data/subjects';
import { mockTeachers } from '@/data/teachers';
import { mockGroups } from '@/data/groups';
import { mockRooms } from '@/data/rooms';
import { mockEnrollments } from '@/data/enrollments';

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
  const getEnrolledCount = (groupId: string) =>
    mockEnrollments.filter((e) => e.groupId === groupId && e.status === 'Active').length;

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            <span>Today&apos;s Class Schedule</span>
            <Badge variant="primary" size="sm">
              {todaySessions.length} Classes Today
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

      <CardContent className="divide-y divide-[#F1F5F9] p-0 max-h-[460px] overflow-y-auto">
        {todaySessions.length === 0 ? (
          <div className="p-8 text-center text-[#94A3B8]">
            <Calendar className="w-10 h-10 mx-auto text-[#CBD5E1] mb-2" />
            <p className="text-sm font-medium">No sessions scheduled for today</p>
          </div>
        ) : (
          todaySessions.map((session) => {
            const subject = getSubject(session.subjectId);
            const teacher = getTeacher(session.teacherId);
            const group = getGroup(session.groupId);
            const room = getRoom(session.roomId);
            const enrolledCount = group ? getEnrolledCount(group.id) : 0;
            const maxCapacity = group?.maxCapacity || 25;

            return (
              <div
                key={session.id}
                className="p-3.5 sm:p-4 hover:bg-[#F8FAFC] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4"
              >
                {/* Left: Time Pill & Color Tag */}
                <div className="flex items-center gap-3 shrink-0">
                  <div
                    className="w-1.5 h-11 rounded-full shrink-0"
                    style={{ backgroundColor: subject?.color || '#4F6EF7' }}
                  />
                  <div className="flex flex-col min-w-[85px]">
                    <span className="text-xs font-bold text-[#1E293B] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#4F6EF7]" />
                      {session.startTime}
                    </span>
                    <span className="text-[11px] text-[#64748B] font-medium">
                      until {session.endTime}
                    </span>
                  </div>
                </div>

                {/* Middle: Subject, Group & Cohort */}
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 items-center">
                  {/* Subject and Group */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#1E293B] truncate">
                        {subject?.name}
                      </h4>
                      <Badge variant="neutral" size="sm" className="text-[10px] shrink-0">
                        {group?.name.split('(')[0]?.trim() || 'Group'}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                      {group?.name.includes('(') ? group.name.split('(')[1]?.replace(')', '') : 'Secondary Cycle'}
                    </p>
                  </div>

                  {/* Teacher & Instructor */}
                  <div className="flex items-center gap-2 text-xs text-[#64748B] min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#EEF2FF] text-[#4F6EF7] flex items-center justify-center font-bold text-[11px] shrink-0">
                      {teacher?.name?.split(' ').map((n) => n[0]).join('') || 'TC'}
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-[#1E293B] truncate block text-xs">
                        {teacher?.name}
                      </span>
                      <span className="text-[10px] text-[#94A3B8] truncate block">
                        {teacher?.specialization?.split('&')[0]?.trim() || 'Faculty'}
                      </span>
                    </div>
                  </div>

                  {/* Facility & Capacity */}
                  <div className="flex flex-col sm:items-start md:items-end text-xs text-[#64748B]">
                    <span className="flex items-center gap-1 font-semibold text-[#1E293B] text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-[#14B8A6]" />
                      {room?.name}
                    </span>
                    <span className="text-[10px] text-[#64748B] flex items-center gap-1 mt-0.5">
                      <Users className="w-3 h-3 text-[#94A3B8]" />
                      {enrolledCount}/{maxCapacity} Enrolled
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkAttendance && onMarkAttendance(session.id)}
                    icon={<CheckCircle2 className="w-3.5 h-3.5 text-[#14B8A6]" />}
                    className="text-xs font-semibold hover:border-[#14B8A6] hover:text-[#14B8A6]"
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

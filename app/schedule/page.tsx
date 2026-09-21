'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { QuickActionModal } from '@/components/dashboard/QuickActionModal';
import { mockSessions } from '@/data/sessions';
import { mockSubjects } from '@/data/subjects';
import { mockTeachers } from '@/data/teachers';
import { mockGroups } from '@/data/groups';
import { mockRooms } from '@/data/rooms';

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState('2026-09-21'); // Monday
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [roomFilter, setRoomFilter] = useState('All');
  const [teacherFilter, setTeacherFilter] = useState('All');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Filter sessions
  const filteredSessions = useMemo(() => {
    return mockSessions.filter((s) => {
      const matchesDate = viewMode === 'day' ? s.date === selectedDate : true;
      const matchesSubject = subjectFilter === 'All' || s.subjectId === subjectFilter;
      const matchesRoom = roomFilter === 'All' || s.roomId === roomFilter;
      const matchesTeacher = teacherFilter === 'All' || s.teacherId === teacherFilter;

      return matchesDate && matchesSubject && matchesRoom && matchesTeacher;
    });
  }, [selectedDate, viewMode, subjectFilter, roomFilter, teacherFilter]);

  const getSubject = (id: string) => mockSubjects.find((s) => s.id === id);
  const getTeacher = (id: string) => mockTeachers.find((t) => t.id === id);
  const getGroup = (id: string) => mockGroups.find((g) => g.id === id);
  const getRoom = (id: string) => mockRooms.find((r) => r.id === id);

  return (
    <AppShell>
      <PageHeader
        title="Schedule & Academic Timetable"
        breadcrumbs={[{ label: 'Academic' }, { label: 'Schedule' }]}
        subtitle="Multi-view interactive calendar with real-time room and teacher collision prevention"
        badge={
          <Badge variant="primary" size="md">
            {filteredSessions.length} Sessions
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsScheduleModalOpen(true)}
          >
            Create Session
          </Button>
        }
      />

      {/* View Switcher and Filters Bar */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* View Mode Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-xl w-full sm:w-auto">
            {(['day', 'week', 'month'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`py-1.5 px-4 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                  viewMode === mode
                    ? 'bg-white text-[#4F6EF7] shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                {mode} View
              </button>
            ))}
          </div>

          {/* Date Picker / Navigator */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs px-3 py-1.5 border border-[#E2E8F0] rounded-lg bg-white font-medium"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B]"
            >
              <option value="All">All Subjects</option>
              {mockSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B]"
            >
              <option value="All">All Teachers</option>
              {mockTeachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B]"
            >
              <option value="All">All Rooms</option>
              {mockRooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Calendar List / Day View */}
      <Card className="divide-y divide-[#F1F5F9]">
        {filteredSessions.length === 0 ? (
          <div className="p-12 text-center text-[#94A3B8]">
            <CalendarIcon className="w-10 h-10 mx-auto text-[#CBD5E1] mb-2" />
            <p className="text-sm font-semibold">No scheduled sessions for this selection</p>
            <p className="text-xs mt-1">Try choosing another date or resetting filters.</p>
          </div>
        ) : (
          filteredSessions.slice(0, 25).map((session) => {
            const subject = getSubject(session.subjectId);
            const teacher = getTeacher(session.teacherId);
            const group = getGroup(session.groupId);
            const room = getRoom(session.roomId);

            return (
              <div
                key={session.id}
                className="p-4 hover:bg-[#F8FAFC] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-2 self-stretch rounded-full shrink-0"
                    style={{ backgroundColor: subject?.color || '#4F6EF7' }}
                  />

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4F6EF7]">
                        {session.date}
                      </span>
                      <span className="text-xs font-bold text-[#1E293B] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                        {session.startTime} – {session.endTime} ({session.durationMinutes}m)
                      </span>
                      <Badge variant={session.status === 'Completed' ? 'success' : 'info'} size="sm">
                        {session.status}
                      </Badge>
                    </div>

                    <h4 className="text-base font-bold text-[#1E293B] mt-1.5">{subject?.name}</h4>
                    <p className="text-xs text-[#64748B] mt-0.5">{group?.name}</p>

                    <div className="flex items-center gap-4 text-xs text-[#64748B] mt-2">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#94A3B8]" />
                        Teacher: <strong className="text-[#1E293B]">{teacher?.name}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                        Room: <strong className="text-[#1E293B]">{room?.name}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-6 md:pl-0">
                  <a
                    href={`/attendance?session=${session.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-white text-[#1E293B]"
                  >
                    Attendance Roster
                  </a>
                </div>
              </div>
            );
          })
        )}
      </Card>

      <QuickActionModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        defaultAction="schedule_session"
      />
    </AppShell>
  );
}

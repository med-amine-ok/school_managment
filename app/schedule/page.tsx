'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  Map as MapIcon,
  Clock,
  Compass,
  Building2,
  Plus,
  Layers,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

import { Session, Room } from '@/types';
import { mockSessions } from '@/data/sessions';
import { mockRooms } from '@/data/rooms';
import { mockTeachers } from '@/data/teachers';
import { mockSubjects } from '@/data/subjects';
import { mockGroups } from '@/data/groups';

// Components
import { CalendarHeader, CalendarViewType, QuickFilterType } from '@/components/schedule/CalendarHeader';
import { CalendarWeekView } from '@/components/schedule/CalendarWeekView';
import { CalendarDayView } from '@/components/schedule/CalendarDayView';
import { CalendarMonthView } from '@/components/schedule/CalendarMonthView';
import { SessionDetailsModal } from '@/components/schedule/SessionDetailsModal';
import { CreateSessionModal } from '@/components/schedule/CreateSessionModal';

function ScheduleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialRoomFilter = searchParams.get('room');
  const initialBookRoom = searchParams.get('bookRoom');
  const initialSessionId = searchParams.get('session');
  const initialDate = searchParams.get('date');
  const initialTime = searchParams.get('time');

  // Calendar View Type (default 'week')
  const [viewType, setViewType] = useState<CalendarViewType>('week');

  // Shared Date Focus
  const [currentDate, setCurrentDate] = useState(initialDate || '2026-09-21');
  const [selectedTime, setSelectedTime] = useState(initialTime || '16:00');

  // Sessions Store (stateful for adding / editing / cancelling)
  const [sessions, setSessions] = useState<Session[]>(mockSessions);

  // Calendar Filters
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>('all');
  const [teacherFilter, setTeacherFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [roomFilter, setRoomFilter] = useState(initialRoomFilter || 'All');
  const [groupFilter, setGroupFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isSessionDetailsOpen, setIsSessionDetailsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(Boolean(initialBookRoom));
  const [createModalInitialData, setCreateModalInitialData] = useState<{
    date?: string;
    startTime?: string;
    roomId?: string;
  }>({
    roomId: initialBookRoom || undefined,
    date: initialDate || '2026-09-21',
    startTime: initialTime || '16:00',
  });

  // Handle URL query parameters on mount or changes
  useEffect(() => {
    if (initialRoomFilter) {
      setRoomFilter(initialRoomFilter);
    }
    if (initialSessionId) {
      const s = sessions.find((x) => x.id === initialSessionId);
      if (s) {
        setSelectedSession(s);
        setIsSessionDetailsOpen(true);
        setCurrentDate(s.date);
      }
    }
    if (initialBookRoom) {
      setCreateModalInitialData({
        roomId: initialBookRoom,
        date: initialDate || currentDate,
        startTime: initialTime || selectedTime,
      });
      setIsCreateModalOpen(true);
    }
  }, [initialRoomFilter, initialSessionId, initialBookRoom, initialDate, initialTime]);

  // -------------------------------------------------------------
  // Filter sessions according to active filters
  // -------------------------------------------------------------
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const subject = mockSubjects.find((sub) => sub.id === s.subjectId);
        const teacher = mockTeachers.find((t) => t.id === s.teacherId);
        const room = mockRooms.find((r) => r.id === s.roomId);
        const group = mockGroups.find((g) => g.id === s.groupId);

        const match =
          subject?.name.toLowerCase().includes(q) ||
          teacher?.name.toLowerCase().includes(q) ||
          room?.name.toLowerCase().includes(q) ||
          room?.number.toLowerCase().includes(q) ||
          group?.name.toLowerCase().includes(q);

        if (!match) return false;
      }

      // Quick filter
      if (quickFilter === 'my_schedule') {
        if (s.teacherId !== 'teacher-1') return false;
      }

      // Dropdown filters
      if (teacherFilter !== 'All' && s.teacherId !== teacherFilter) return false;
      if (subjectFilter !== 'All' && s.subjectId !== subjectFilter) return false;
      if (roomFilter !== 'All' && s.roomId !== roomFilter) return false;
      if (groupFilter !== 'All' && s.groupId !== groupFilter) return false;
      if (statusFilter !== 'All' && s.status !== statusFilter) return false;

      return true;
    });
  }, [
    sessions,
    searchQuery,
    quickFilter,
    teacherFilter,
    subjectFilter,
    roomFilter,
    groupFilter,
    statusFilter,
  ]);

  const hasActiveFilters =
    searchQuery !== '' ||
    quickFilter !== 'all' ||
    teacherFilter !== 'All' ||
    subjectFilter !== 'All' ||
    roomFilter !== 'All' ||
    groupFilter !== 'All' ||
    statusFilter !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setQuickFilter('all');
    setTeacherFilter('All');
    setSubjectFilter('All');
    setRoomFilter('All');
    setGroupFilter('All');
    setStatusFilter('All');
  };

  // -------------------------------------------------------------
  // Calendar Date Navigation Handlers
  // -------------------------------------------------------------
  const handlePrevPeriod = () => {
    const [y, m, d] = currentDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);

    if (viewType === 'day') {
      date.setDate(date.getDate() - 1);
    } else if (viewType === 'week') {
      date.setDate(date.getDate() - 7);
    } else {
      date.setMonth(date.getMonth() - 1);
    }

    setCurrentDate(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate()
      ).padStart(2, '0')}`
    );
  };

  const handleNextPeriod = () => {
    const [y, m, d] = currentDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);

    if (viewType === 'day') {
      date.setDate(date.getDate() + 1);
    } else if (viewType === 'week') {
      date.setDate(date.getDate() + 7);
    } else {
      date.setMonth(date.getMonth() + 1);
    }

    setCurrentDate(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate()
      ).padStart(2, '0')}`
    );
  };

  const handleToday = () => {
    setCurrentDate('2026-09-21'); // Academic mock date
  };

  // -------------------------------------------------------------
  // Flow Handlers: Bidirectional Link TIME ↔ SESSION ↔ ROOM
  // -------------------------------------------------------------
  const handleOpenSessionDetails = (session: Session) => {
    setSelectedSession(session);
    setIsSessionDetailsOpen(true);
  };

  const handleLocateRoomOnMap = (roomId: string) => {
    const room = mockRooms.find((r) => r.id === roomId);
    const floor = room?.floor !== undefined ? room.floor : 1;
    // Navigate to Rooms page on the right floor with the room highlighted!
    router.push(`/rooms?floor=${floor}&room=${roomId}`);
  };

  const handleSelectTimeSlot = (date: string, time: string) => {
    setCreateModalInitialData({
      date,
      startTime: time,
      roomId: roomFilter !== 'All' ? roomFilter : undefined,
    });
    setIsCreateModalOpen(true);
  };

  const handleSelectDayFromMonth = (date: string) => {
    setCurrentDate(date);
    setViewType('day');
  };

  const handleSaveNewSession = (newSession: Session) => {
    setSessions((prev) => [newSession, ...prev]);
  };

  const handleCancelSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: 'Cancelled' as const } : s))
    );
  };

  return (
    <AppShell>
      {/* Page Header */}
      <PageHeader
        title="Schedule & Academic Timetable"
        breadcrumbs={[{ label: 'Academic' }, { label: 'Schedule' }]}
        subtitle="Professional multi-view calendar with real-time room collisions and side-by-side time slotting"
        badge={
          <Badge variant="primary" size="md">
            {filteredSessions.length} Scheduled Sessions
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Compass className="w-4 h-4 text-[#14B8A6]" />}
              onClick={() => router.push('/rooms')}
            >
              School Map & Rooms
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setCreateModalInitialData({
                  date: currentDate,
                  startTime: selectedTime,
                  roomId: roomFilter !== 'All' ? roomFilter : undefined,
                });
                setIsCreateModalOpen(true);
              }}
            >
              Create Session
            </Button>
          </div>
        }
      />

      {/* Active Room Filter Alert Banner (if opened from /rooms) */}
      {roomFilter !== 'All' && (
        <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2 text-blue-900 font-medium">
            <Building2 className="w-4 h-4 text-[#4F6EF7]" />
            <span>
              Showing calendar schedule specifically for{' '}
              <strong className="font-bold">
                {mockRooms.find((r) => r.id === roomFilter)?.name} ({mockRooms.find((r) => r.id === roomFilter)?.number})
              </strong>
            </span>
          </div>
          <button
            onClick={() => setRoomFilter('All')}
            className="text-xs font-bold text-[#4F6EF7] hover:underline cursor-pointer"
          >
            Show All Rooms
          </button>
        </div>
      )}

      {/* Calendar Experience Container */}
      <div className="space-y-4">
        <CalendarHeader
          currentDate={currentDate}
          viewType={viewType}
          onViewTypeChange={setViewType}
          onPrev={handlePrevPeriod}
          onNext={handleNextPeriod}
          onToday={handleToday}
          onDateChange={setCurrentDate}
          quickFilter={quickFilter}
          onQuickFilterChange={setQuickFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          teacherFilter={teacherFilter}
          onTeacherFilterChange={setTeacherFilter}
          subjectFilter={subjectFilter}
          onSubjectFilterChange={setSubjectFilter}
          roomFilter={roomFilter}
          onRoomFilterChange={setRoomFilter}
          groupFilter={groupFilter}
          onGroupFilterChange={setGroupFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onCreateSession={() => {
            setCreateModalInitialData({
              date: currentDate,
              startTime: selectedTime,
              roomId: roomFilter !== 'All' ? roomFilter : undefined,
            });
            setIsCreateModalOpen(true);
          }}
          onResetFilters={resetAllFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* View Selection: Week (Default) | Day | Month */}
        {viewType === 'week' && (
          <CalendarWeekView
            currentDate={currentDate}
            sessions={filteredSessions}
            onSelectSession={handleOpenSessionDetails}
            onSelectTimeSlot={handleSelectTimeSlot}
          />
        )}

        {viewType === 'day' && (
          <CalendarDayView
            currentDate={currentDate}
            sessions={filteredSessions}
            onSelectSession={handleOpenSessionDetails}
            onSelectTimeSlot={handleSelectTimeSlot}
          />
        )}

        {viewType === 'month' && (
          <CalendarMonthView
            currentDate={currentDate}
            sessions={filteredSessions}
            onSelectSession={handleOpenSessionDetails}
            onSelectDay={handleSelectDayFromMonth}
          />
        )}
      </div>

      {/* MODAL: SESSION DETAILS & SCHOOL MAP JUMP */}
      <SessionDetailsModal
        session={selectedSession}
        isOpen={isSessionDetailsOpen}
        onClose={() => setIsSessionDetailsOpen(false)}
        onLocateOnMap={handleLocateRoomOnMap}
        onCancelSession={handleCancelSession}
      />

      {/* MODAL: CREATE ACADEMIC SESSION WITH CONFLICT PREVENTION */}
      <CreateSessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSaveSession={handleSaveNewSession}
        initialDate={createModalInitialData.date}
        initialStartTime={createModalInitialData.startTime}
        initialRoomId={createModalInitialData.roomId}
        existingSessions={sessions}
      />
    </AppShell>
  );
}

export default function SchedulePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-sm font-semibold text-slate-500">
          Loading Academic Schedule...
        </div>
      }
    >
      <ScheduleContent />
    </Suspense>
  );
}

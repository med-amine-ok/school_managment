'use client';

import React, { useMemo } from 'react';
import { Session } from '@/types';
import { mockSubjects } from '@/data/subjects';
import { mockRooms } from '@/data/rooms';

interface CalendarMonthViewProps {
  currentDate: string; // YYYY-MM-DD
  sessions: Session[];
  onSelectSession: (session: Session) => void;
  onSelectDay: (date: string) => void;
}

export function CalendarMonthView({
  currentDate,
  sessions,
  onSelectSession,
  onSelectDay,
}: CalendarMonthViewProps) {
  const [y, m, d] = currentDate.split('-').map(Number);

  // Compute month calendar days grid (Monday-starting)
  const monthDays = useMemo(() => {
    const firstDayOfMonth = new Date(y, m - 1, 1);
    const lastDayOfMonth = new Date(y, m, 0);

    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sun, 1 is Mon...
    const diffToMon = (startingDayOfWeek + 6) % 7;

    const days = [];

    // Preceding days from previous month
    const prevMonthLastDay = new Date(y, m - 1, 0).getDate();
    for (let i = diffToMon - 1; i >= 0; i--) {
      const prevDate = prevMonthLastDay - i;
      const prevMonth = m - 1 === 0 ? 12 : m - 1;
      const prevYear = m - 1 === 0 ? y - 1 : y;
      const isoStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(prevDate).padStart(2, '0')}`;
      days.push({
        dateStr: isoStr,
        dayNumber: prevDate,
        isCurrentMonth: false,
      });
    }

    // Days in current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const isoStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        dateStr: isoStr,
        dayNumber: day,
        isCurrentMonth: true,
      });
    }

    // Trailing days to fill the final week
    const remainingDays = 42 - days.length; // 6 rows of 7 days = 42
    if (remainingDays > 0 && remainingDays < 7) {
      for (let day = 1; day <= remainingDays; day++) {
        const nextMonth = m + 1 > 12 ? 1 : m + 1;
        const nextYear = m + 1 > 12 ? y + 1 : y;
        const isoStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        days.push({
          dateStr: isoStr,
          dayNumber: day,
          isCurrentMonth: false,
        });
      }
    }

    return days;
  }, [y, m]);

  const todayStr = new Date().toLocaleDateString('en-CA');
  const getSubject = (id: string) => mockSubjects.find((s) => s.id === id);
  const getRoom = (id: string) => mockRooms.find((r) => r.id === id);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Month Days Header (Mon-Sun) */}
      <div className="grid grid-cols-7 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
          <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Grid of Days */}
      <div className="grid grid-cols-7 border-b border-[#E2E8F0] divide-x divide-y divide-[#E2E8F0] bg-[#E2E8F0]/30">
        {monthDays.map((day) => {
          const isToday = day.dateStr === todayStr;
          const isSelected = day.dateStr === currentDate;
          const daySessions = sessions.filter((s) => s.date === day.dateStr);
          const maxVisibleSessions = 3;
          const visibleSessions = daySessions.slice(0, maxVisibleSessions);
          const extraCount = daySessions.length - maxVisibleSessions;

          return (
            <div
              key={day.dateStr}
              onClick={() => onSelectDay(day.dateStr)}
              className={`min-h-[120px] p-2 bg-white flex flex-col justify-between transition-colors hover:bg-slate-50/80 cursor-pointer ${
                !day.isCurrentMonth ? 'bg-slate-50/40 text-slate-400' : 'text-slate-800'
              } ${isToday ? 'ring-1 ring-[#4F6EF7] inset-0' : ''}`}
            >
              {/* Day Header Number */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                    isToday
                      ? 'bg-[#4F6EF7] text-white shadow-xs'
                      : isSelected
                      ? 'bg-slate-200 text-slate-900 font-extrabold'
                      : day.isCurrentMonth
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {day.dayNumber}
                </span>

                {daySessions.length > 0 && (
                  <span className="text-[10px] font-bold text-slate-400">
                    {daySessions.length} {daySessions.length === 1 ? 'class' : 'classes'}
                  </span>
                )}
              </div>

              {/* Session Chips */}
              <div className="space-y-1 flex-1 overflow-hidden">
                {visibleSessions.map((session) => {
                  const subject = getSubject(session.subjectId);
                  const room = getRoom(session.roomId);

                  return (
                    <div
                      key={session.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSession(session);
                      }}
                      className="group p-1 rounded-md text-[10px] font-medium border border-slate-200/80 bg-white hover:border-[#4F6EF7] hover:shadow-xs transition truncate flex items-center gap-1.5"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: subject?.color || '#4F6EF7' }}
                      />
                      <span className="font-bold text-slate-800 truncate">
                        {subject?.name}
                      </span>
                      <span className="text-[9px] text-slate-400 ml-auto font-mono shrink-0">
                        {session.startTime}
                      </span>
                    </div>
                  );
                })}

                {/* More indicator */}
                {extraCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDay(day.dateStr);
                    }}
                    className="w-full text-left text-[10px] font-bold text-[#4F6EF7] hover:underline pt-0.5"
                  >
                    + {extraCount} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

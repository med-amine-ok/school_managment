'use client';

import React, { useMemo } from 'react';
import { Session } from '@/types';
import { SessionCard } from './SessionCard';
import { Clock, Plus } from 'lucide-react';

interface CalendarWeekViewProps {
  currentDate: string; // YYYY-MM-DD
  sessions: Session[];
  onSelectSession: (session: Session) => void;
  onSelectTimeSlot: (date: string, time: string) => void;
  timeInterval?: 30 | 60; // minutes
}

// 08:00 to 20:00
const START_HOUR = 8;
const END_HOUR = 20;
const TOTAL_HOURS = END_HOUR - START_HOUR; // 12 hours = 720 minutes
const START_MINUTES = START_HOUR * 60; // 480
const TOTAL_MINUTES = TOTAL_HOURS * 60; // 720

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

interface PositionedSession {
  session: Session;
  topPct: number;
  heightPct: number;
  colIndex: number;
  totalCols: number;
}

export function CalendarWeekView({
  currentDate,
  sessions,
  onSelectSession,
  onSelectTimeSlot,
  timeInterval = 60,
}: CalendarWeekViewProps) {
  // Compute the 7 days of the week containing currentDate (Monday to Sunday)
  const weekDays = useMemo(() => {
    const [y, m, d] = currentDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = dateObj.getDay(); // 0 is Sun, 1 is Mon...
    const diffToMon = (dayOfWeek + 6) % 7;

    const days = [];
    const mon = new Date(dateObj);
    mon.setDate(dateObj.getDate() - diffToMon);

    for (let i = 0; i < 7; i++) {
      const day = new Date(mon);
      day.setDate(mon.getDate() + i);
      const isoDate = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(
        day.getDate()
      ).padStart(2, '0')}`;

      days.push({
        dateStr: isoDate,
        dayName: day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        dayNumber: day.getDate(),
        isToday:
          isoDate ===
          new Date().toLocaleDateString('en-CA'), // system today
        isSelectedDate: isoDate === currentDate,
      });
    }
    return days;
  }, [currentDate]);

  // Hours array [8, 9, 10, ... 19, 20]
  const hours = useMemo(() => {
    return Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => START_HOUR + i);
  }, []);

  // Compute Current Time indicator position (simulated/real)
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentTimePct =
    currentMinutes >= START_MINUTES && currentMinutes <= START_MINUTES + TOTAL_MINUTES
      ? ((currentMinutes - START_MINUTES) / TOTAL_MINUTES) * 100
      : null;
  const todayStr = new Date().toLocaleDateString('en-CA');

  // Compute collision-free side-by-side positioning for sessions by day
  const sessionsByDay = useMemo(() => {
    const map = new Map<string, PositionedSession[]>();

    weekDays.forEach((day) => {
      const daySessions = sessions.filter((s) => s.date === day.dateStr);

      // Sort by start time, then duration descending
      const sorted = [...daySessions].sort((a, b) => {
        const diff = timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
        if (diff !== 0) return diff;
        return (b.durationMinutes || 60) - (a.durationMinutes || 60);
      });

      // Clustering & column assignment
      const positioned: PositionedSession[] = [];
      const clusters: { sessions: typeof sorted; maxCols: number }[] = [];

      sorted.forEach((session) => {
        const startMin = timeToMinutes(session.startTime);
        const endMin = timeToMinutes(session.endTime);

        // Find or create cluster
        let currentCluster = clusters.find((c) =>
          c.sessions.some((s) => {
            const sStart = timeToMinutes(s.startTime);
            const sEnd = timeToMinutes(s.endTime);
            return startMin < sEnd && endMin > sStart;
          })
        );

        if (!currentCluster) {
          currentCluster = { sessions: [], maxCols: 1 };
          clusters.push(currentCluster);
        }
        currentCluster.sessions.push(session);
      });

      // For each cluster, assign columns
      clusters.forEach((cluster) => {
        const colEndTimes: number[] = [];

        cluster.sessions.forEach((session) => {
          const startMin = timeToMinutes(session.startTime);
          const endMin = timeToMinutes(session.endTime);

          let assignedCol = 0;
          while (colEndTimes[assignedCol] !== undefined && colEndTimes[assignedCol] > startMin) {
            assignedCol++;
          }
          colEndTimes[assignedCol] = endMin;

          const clampedStart = Math.max(startMin, START_MINUTES);
          const clampedEnd = Math.min(endMin, START_MINUTES + TOTAL_MINUTES);
          const topPct = Math.max(0, ((clampedStart - START_MINUTES) / TOTAL_MINUTES) * 100);
          const heightPct = Math.max(
            3.5,
            Math.min(100 - topPct, ((clampedEnd - clampedStart) / TOTAL_MINUTES) * 100)
          );

          positioned.push({
            session,
            topPct,
            heightPct,
            colIndex: assignedCol,
            totalCols: 1, // Will update next
          });
        });

        // Update totalCols for all items in this cluster
        const totalCols = colEndTimes.length;
        positioned.forEach((p) => {
          if (cluster.sessions.some((cs) => cs.id === p.session.id)) {
            p.totalCols = totalCols;
          }
        });
      });

      map.set(day.dateStr, positioned);
    });

    return map;
  }, [sessions, weekDays]);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Week Header Row */}
      <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-[#E2E8F0] bg-[#F8FAFC] sticky top-0 z-20">
        {/* Time gutter corner */}
        <div className="p-3 text-center border-r border-[#E2E8F0] flex items-center justify-center">
          <Clock className="w-4 h-4 text-slate-400" />
        </div>

        {/* 7 Days Columns Headers */}
        {weekDays.map((day) => (
          <div
            key={day.dateStr}
            className={`p-3 text-center border-r border-[#E2E8F0] last:border-r-0 transition-colors ${
              day.isToday ? 'bg-blue-50/50' : ''
            }`}
          >
            <span
              className={`text-[11px] font-bold tracking-wider block ${
                day.isToday ? 'text-[#4F6EF7]' : 'text-slate-500'
              }`}
            >
              {day.dayName}
            </span>
            <div className="mt-1 flex items-center justify-center">
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                  day.isToday
                    ? 'bg-[#4F6EF7] text-white shadow-xs'
                    : day.isSelectedDate
                    ? 'bg-slate-200 text-slate-900 font-extrabold'
                    : 'text-slate-800'
                }`}
              >
                {day.dayNumber}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Timeline Grid Body */}
      <div className="relative overflow-y-auto max-h-[760px] select-none">
        <div className="grid grid-cols-[64px_repeat(7,1fr)] min-w-[780px] relative">
          {/* Time Gutter Column */}
          <div className="border-r border-[#E2E8F0] bg-[#F8FAFC]/50 select-none">
            {hours.slice(0, -1).map((hour) => (
              <div
                key={hour}
                className="h-16 border-b border-[#E2E8F0]/70 pr-2 pt-1 text-right text-[11px] font-mono font-medium text-slate-400"
              >
                {String(hour).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* 7 Day Schedule Columns */}
          {weekDays.map((day) => {
            const dayPositioned = sessionsByDay.get(day.dateStr) || [];
            const isToday = day.dateStr === todayStr;

            return (
              <div
                key={day.dateStr}
                className={`relative border-r border-[#E2E8F0] last:border-r-0 transition-colors ${
                  isToday ? 'bg-blue-50/20' : 'bg-white'
                }`}
              >
                {/* Horizontal Hour Lines & Empty Slot Click targets */}
                {hours.slice(0, -1).map((hour) => {
                  const timeFormatted = `${String(hour).padStart(2, '0')}:00`;
                  return (
                    <div
                      key={hour}
                      onClick={() => onSelectTimeSlot(day.dateStr, timeFormatted)}
                      title={`Click to book at ${day.dateStr} ${timeFormatted}`}
                      className="group/slot h-16 border-b border-[#E2E8F0]/70 cursor-pointer relative hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Subtle half-hour dashed line if timeInterval is 30 */}
                      {timeInterval === 30 && (
                        <div className="absolute top-1/2 left-0 right-0 border-b border-dashed border-slate-100 pointer-events-none" />
                      )}

                      {/* Hover create prompt */}
                      <div className="hidden group-hover/slot:flex items-center justify-center absolute inset-0 opacity-0 group-hover/slot:opacity-100 transition-opacity">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4F6EF7] bg-white/90 shadow-xs border border-blue-200 px-2 py-0.5 rounded-md pointer-events-none">
                          <Plus className="w-3 h-3" /> {timeFormatted}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Real-time Indicator Line if today */}
                {isToday && currentTimePct !== null && (
                  <div
                    style={{ top: `${currentTimePct}%` }}
                    className="absolute left-0 right-0 z-30 pointer-events-none flex items-center"
                  >
                    <div className="w-2 h-2 rounded-full bg-rose-500 shadow-xs -ml-1" />
                    <div className="h-[2px] w-full bg-rose-500 shadow-xs" />
                  </div>
                )}

                {/* Absolute Positioned Session Cards with side-by-side overlap resolution */}
                {dayPositioned.map(({ session, topPct, heightPct, colIndex, totalCols }) => {
                  const widthPercent = 100 / totalCols;
                  const leftPercent = colIndex * widthPercent;

                  return (
                    <div
                      key={session.id}
                      style={{
                        position: 'absolute',
                        top: `${topPct}%`,
                        height: `${heightPct}%`,
                        left: `calc(${leftPercent}% + 2px)`,
                        width: `calc(${widthPercent}% - 4px)`,
                        zIndex: 10 + colIndex,
                      }}
                    >
                      <SessionCard
                        session={session}
                        onClick={onSelectSession}
                        compact={totalCols > 1 || heightPct < 7}
                        style={{ height: '100%', width: '100%' }}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

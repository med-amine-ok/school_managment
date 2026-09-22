'use client';

import React, { useState, useMemo } from 'react';
import { Session } from '@/types';
import { SessionCard } from './SessionCard';
import { Clock, Plus, Sliders } from 'lucide-react';

interface CalendarDayViewProps {
  currentDate: string; // YYYY-MM-DD
  sessions: Session[];
  onSelectSession: (session: Session) => void;
  onSelectTimeSlot: (date: string, time: string) => void;
}

const START_HOUR = 8;
const END_HOUR = 20;
const TOTAL_HOURS = END_HOUR - START_HOUR; // 12 hours
const START_MINUTES = START_HOUR * 60; // 480
const TOTAL_MINUTES = TOTAL_HOURS * 60; // 720

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function CalendarDayView({
  currentDate,
  sessions,
  onSelectSession,
  onSelectTimeSlot,
}: CalendarDayViewProps) {
  const [intervalStep, setIntervalStep] = useState<30 | 60>(60);

  // Filter sessions for this day
  const daySessions = useMemo(() => {
    return sessions.filter((s) => s.date === currentDate);
  }, [sessions, currentDate]);

  // Compute collision-free side-by-side columns
  const positionedSessions = useMemo(() => {
    const sorted = [...daySessions].sort((a, b) => {
      const diff = timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
      if (diff !== 0) return diff;
      return (b.durationMinutes || 60) - (a.durationMinutes || 60);
    });

    const clusters: { sessions: typeof sorted; maxCols: number }[] = [];
    const positioned: {
      session: Session;
      topPct: number;
      heightPct: number;
      colIndex: number;
      totalCols: number;
    }[] = [];

    sorted.forEach((session) => {
      const startMin = timeToMinutes(session.startTime);
      const endMin = timeToMinutes(session.endTime);

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
          4,
          Math.min(100 - topPct, ((clampedEnd - clampedStart) / TOTAL_MINUTES) * 100)
        );

        positioned.push({
          session,
          topPct,
          heightPct,
          colIndex: assignedCol,
          totalCols: 1,
        });
      });

      const totalCols = colEndTimes.length;
      positioned.forEach((p) => {
        if (cluster.sessions.some((cs) => cs.id === p.session.id)) {
          p.totalCols = totalCols;
        }
      });
    });

    return positioned;
  }, [daySessions]);

  // Generate slots based on intervalStep
  const timeSlots = useMemo(() => {
    const slots = [];
    const step = intervalStep;
    const totalSteps = (TOTAL_HOURS * 60) / step;

    for (let i = 0; i < totalSteps; i++) {
      const mins = START_MINUTES + i * step;
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      slots.push({
        timeStr: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
        isHour: m === 0,
        minutes: mins,
      });
    }
    return slots;
  }, [intervalStep]);

  // Current time marker
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isToday = currentDate === now.toLocaleDateString('en-CA');
  const currentTimePct =
    isToday && currentMinutes >= START_MINUTES && currentMinutes <= START_MINUTES + TOTAL_MINUTES
      ? ((currentMinutes - START_MINUTES) / TOTAL_MINUTES) * 100
      : null;

  const [y, m, d] = currentDate.split('-').map(Number);
  const formattedDayTitle = new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).toUpperCase();

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Day View Subheader */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#4F6EF7]" />
          <h3 className="text-sm font-bold text-[#1E293B] tracking-wide">
            {formattedDayTitle}
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-[#4F6EF7]">
            {daySessions.length} session{daySessions.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Interval toggle: 30 min | 60 min */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" /> Interval:
          </span>
          <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg">
            <button
              onClick={() => setIntervalStep(30)}
              className={`px-2.5 py-1 font-bold rounded-md transition ${
                intervalStep === 30 ? 'bg-white text-[#4F6EF7] shadow-xs' : 'text-slate-600'
              }`}
            >
              30m
            </button>
            <button
              onClick={() => setIntervalStep(60)}
              className={`px-2.5 py-1 font-bold rounded-md transition ${
                intervalStep === 60 ? 'bg-white text-[#4F6EF7] shadow-xs' : 'text-slate-600'
              }`}
            >
              60m
            </button>
          </div>
        </div>
      </div>

      {/* Main Day Timeline */}
      <div className="relative overflow-y-auto max-h-[760px] select-none">
        <div className="grid grid-cols-[80px_1fr] relative min-h-[800px]">
          {/* Left Time Column */}
          <div className="border-r border-[#E2E8F0] bg-[#F8FAFC]/60">
            {timeSlots.map((slot) => (
              <div
                key={slot.timeStr}
                style={{ height: intervalStep === 30 ? '48px' : '72px' }}
                className={`border-b border-[#E2E8F0]/70 pr-3 pt-1 text-right text-xs font-mono font-medium ${
                  slot.isHour ? 'text-slate-700 font-bold' : 'text-slate-400 text-[11px]'
                }`}
              >
                {slot.timeStr}
              </div>
            ))}
          </div>

          {/* Right Schedule Canvas */}
          <div className="relative bg-white">
            {/* Slot Rows & Click targets */}
            {timeSlots.map((slot) => (
              <div
                key={slot.timeStr}
                style={{ height: intervalStep === 30 ? '48px' : '72px' }}
                onClick={() => onSelectTimeSlot(currentDate, slot.timeStr)}
                title={`Click to book at ${slot.timeStr}`}
                className={`group/slot border-b border-[#E2E8F0]/70 cursor-pointer relative hover:bg-slate-50/80 transition-colors ${
                  !slot.isHour ? 'border-dashed border-slate-100' : ''
                }`}
              >
                <div className="hidden group-hover/slot:flex items-center absolute left-4 top-1/2 -translate-y-1/2">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#4F6EF7] bg-white shadow-xs border border-blue-200 px-2.5 py-1 rounded-md pointer-events-none">
                    <Plus className="w-3.5 h-3.5" /> Book at {slot.timeStr}
                  </span>
                </div>
              </div>
            ))}

            {/* Current Time Indicator Line */}
            {currentTimePct !== null && (
              <div
                style={{ top: `${currentTimePct}%` }}
                className="absolute left-0 right-0 z-30 pointer-events-none flex items-center"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs -ml-1.5" />
                <div className="h-[2px] w-full bg-rose-500 shadow-xs" />
                <span className="ml-2 px-1.5 py-0.5 rounded bg-rose-500 text-white text-[10px] font-mono font-bold shadow-xs">
                  CURRENT TIME
                </span>
              </div>
            )}

            {/* Positioned Session Cards */}
            {positionedSessions.map(({ session, topPct, heightPct, colIndex, totalCols }) => {
              const widthPercent = 100 / totalCols;
              const leftPercent = colIndex * widthPercent;

              return (
                <div
                  key={session.id}
                  style={{
                    position: 'absolute',
                    top: `${topPct}%`,
                    height: `${heightPct}%`,
                    left: `calc(${leftPercent}% + 8px)`,
                    width: `calc(${widthPercent}% - 16px)`,
                    zIndex: 10 + colIndex,
                  }}
                >
                  <SessionCard
                    session={session}
                    onClick={onSelectSession}
                    compact={heightPct < 8}
                    style={{ height: '100%', width: '100%' }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

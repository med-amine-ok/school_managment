'use client';

import React from 'react';
import { Clock, MapPin, User, Users } from 'lucide-react';
import { Session } from '@/types';
import { mockSubjects } from '@/data/subjects';
import { mockTeachers } from '@/data/teachers';
import { mockGroups } from '@/data/groups';
import { mockRooms } from '@/data/rooms';

interface SessionCardProps {
  session: Session;
  onClick: (session: Session) => void;
  compact?: boolean;
  style?: React.CSSProperties;
}

export function SessionCard({ session, onClick, compact = false, style }: SessionCardProps) {
  const subject = mockSubjects.find((s) => s.id === session.subjectId);
  const teacher = mockTeachers.find((t) => t.id === session.teacherId);
  const group = mockGroups.find((g) => g.id === session.groupId);
  const room = mockRooms.find((r) => r.id === session.roomId);

  const subjectColor = subject?.color || '#4F6EF7';

  // Subtle status pill styling
  const getStatusBadge = () => {
    switch (session.status) {
      case 'In Progress':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200 line-through opacity-75';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick(session);
      }}
      style={style}
      className={`group relative rounded-xl border border-slate-200/90 bg-white hover:border-[#4F6EF7] hover:shadow-md transition-all duration-150 cursor-pointer overflow-hidden flex flex-col justify-between ${
        compact ? 'p-2' : 'p-2.5'
      }`}
    >
      {/* Left accent color bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2"
        style={{ backgroundColor: subjectColor }}
      />

      {/* Top Header: Subject & Time */}
      <div className="pl-1.5 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <h4 className="text-xs font-bold text-[#1E293B] truncate leading-tight group-hover:text-[#4F6EF7] transition-colors">
            {subject?.name || 'Class Session'}
          </h4>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider shrink-0 ${getStatusBadge()}`}
          >
            {session.status}
          </span>
        </div>

        {/* Group / Cohort */}
        <p className="text-[11px] font-semibold text-slate-600 truncate mt-0.5">
          {group?.name || 'Assigned Group'}
        </p>
      </div>

      {/* Footer Info: Room, Teacher & Time Slot */}
      <div className="pl-1.5 pt-1 mt-1 border-t border-slate-100 flex flex-col gap-0.5 text-[10px] text-slate-500 font-medium">
        <div className="flex items-center justify-between gap-1">
          <span className="flex items-center gap-1 font-bold text-slate-700 truncate">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            {room?.name || 'TBD'}
          </span>
          <span className="flex items-center gap-0.5 font-mono text-slate-600 font-bold shrink-0">
            <Clock className="w-3 h-3 text-slate-400" />
            {session.startTime}–{session.endTime}
          </span>
        </div>

        {!compact && teacher && (
          <div className="flex items-center gap-1 text-slate-500 truncate">
            <User className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{teacher.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

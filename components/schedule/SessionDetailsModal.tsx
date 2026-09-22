'use client';

import React from 'react';
import {
  X,
  Clock,
  MapPin,
  User,
  Users,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Edit,
  Trash2,
  Compass,
} from 'lucide-react';
import { Session } from '@/types';
import { mockSubjects } from '@/data/subjects';
import { mockTeachers } from '@/data/teachers';
import { mockGroups } from '@/data/groups';
import { mockRooms } from '@/data/rooms';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SessionDetailsModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onLocateOnMap: (roomId: string) => void;
  onCancelSession?: (sessionId: string) => void;
  onEditSession?: (session: Session) => void;
}

export function SessionDetailsModal({
  session,
  isOpen,
  onClose,
  onLocateOnMap,
  onCancelSession,
  onEditSession,
}: SessionDetailsModalProps) {
  if (!isOpen || !session) return null;

  const subject = mockSubjects.find((s) => s.id === session.subjectId);
  const teacher = mockTeachers.find((t) => t.id === session.teacherId);
  const group = mockGroups.find((g) => g.id === session.groupId);
  const room = mockRooms.find((r) => r.id === session.roomId);

  const [y, m, d] = session.date.split('-').map(Number);
  const formattedDate = new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate mock attendance metrics
  const groupStudents = group?.studentsCount || 22;
  const roomCapacity = room?.capacity || 25;
  const attendanceRate = session.status === 'Completed' ? '94%' : '92% projected';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header with Subject Brand color */}
        <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-start justify-between relative">
          <div
            className="absolute left-0 top-0 bottom-0 w-2"
            style={{ backgroundColor: subject?.color || '#4F6EF7' }}
          />

          <div className="pl-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-[#4F6EF7]">
                {group?.name || 'Class Group'}
              </span>
              <Badge
                variant={
                  session.status === 'Completed'
                    ? 'success'
                    : session.status === 'In progress'
                    ? 'info'
                    : session.status === 'Cancelled'
                    ? 'danger'
                    : 'primary'
                }
                size="sm"
              >
                {session.status}
              </Badge>
            </div>
            <h2 className="text-xl font-bold text-[#1E293B]">
              {subject?.name || 'Academic Session'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* Key Schedule Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date & Time */}
            <div className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Session Time
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-[#4F6EF7]" />
                <span className="text-sm font-bold text-[#1E293B]">
                  {session.startTime} – {session.endTime}
                </span>
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                {session.durationMinutes} minutes
              </span>
            </div>

            {/* Room with Interactive Map Link */}
            <div className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Assigned Location
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-[#1E293B]">
                    {room?.name || 'Unassigned'}
                  </span>
                </div>
                <span className="text-xs text-slate-500 mt-0.5 block">
                  {room?.number} • {room?.floor === 0 ? 'Ground' : room?.floor === 1 ? '1st Floor' : '2nd Floor'}
                </span>
              </div>

              {room && (
                <button
                  onClick={() => {
                    onClose();
                    onLocateOnMap(room.id);
                  }}
                  className="mt-2 text-xs font-bold text-[#4F6EF7] hover:text-[#3B4FD9] flex items-center gap-1 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  Locate on School Map
                </button>
              )}
            </div>
          </div>

          {/* Date full */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Scheduled for <strong className="text-slate-900">{formattedDate}</strong></span>
          </div>

          {/* Teacher and Cohort Details */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Instructor</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-[#4F6EF7] flex items-center justify-center font-bold text-xs">
                  {teacher?.name.charAt(0) || 'T'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E293B]">{teacher?.name}</h4>
                  <p className="text-[11px] text-slate-500">{teacher?.email}</p>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-semibold block">Group & Enrollment</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E293B]">{group?.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    {groupStudents} students enrolled (Room cap: {roomCapacity})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance metric pill */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Attendance Performance:</span>
              <strong className="text-emerald-900 font-bold">{attendanceRate}</strong>
            </div>
            <a
              href={`/attendance?session=${session.id}`}
              className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 hover:underline"
            >
              Open Roster <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-2">
          {session.status !== 'Cancelled' ? (
            <Button
              variant="outline"
              size="sm"
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
              icon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => {
                if (onCancelSession) {
                  onCancelSession(session.id);
                  onClose();
                }
              }}
            >
              Cancel Session
            </Button>
          ) : (
            <span className="text-xs text-rose-500 font-bold">Session Cancelled</span>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
            {onEditSession && (
              <Button
                variant="primary"
                size="sm"
                icon={<Edit className="w-3.5 h-3.5" />}
                onClick={() => {
                  onClose();
                  onEditSession(session);
                }}
              >
                Edit Session
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

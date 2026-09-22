'use client';

import React from 'react';
import {
  X,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  Tv,
  Wifi,
  Wind,
  Monitor,
  Video,
  Presentation,
  Check,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { mockRooms } from '@/data/rooms';
import { mockSessions } from '@/data/sessions';
import { mockSubjects } from '@/data/subjects';
import { mockTeachers } from '@/data/teachers';
import { mockGroups } from '@/data/groups';
import { calculateRoomAvailability, getRoomSchedule } from '@/lib/calculations/conflicts';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface RoomDetailsDrawerProps {
  roomId: string | null;
  selectedDate: string;
  selectedTime: string;
  isOpen: boolean;
  onClose: () => void;
  onViewRoomSchedule: (roomId: string) => void;
  onCreateSessionInRoom: (roomId: string) => void;
  onSelectSession?: (sessionId: string) => void;
}

export function RoomDetailsDrawer({
  roomId,
  selectedDate,
  selectedTime,
  isOpen,
  onClose,
  onViewRoomSchedule,
  onCreateSessionInRoom,
  onSelectSession,
}: RoomDetailsDrawerProps) {
  if (!isOpen || !roomId) return null;

  const room = mockRooms.find((r) => r.id === roomId);
  if (!room) return null;

  const availability = calculateRoomAvailability(roomId, selectedDate, selectedTime);
  const todaysSchedule = getRoomSchedule(roomId, selectedDate);

  const getSubject = (id: string) => mockSubjects.find((s) => s.id === id);
  const getTeacher = (id: string) => mockTeachers.find((t) => t.id === id);
  const getGroup = (id: string) => mockGroups.find((g) => g.id === id);

  const currentSession = availability.currentSession;
  const currentSubject = currentSession ? getSubject(currentSession.subjectId) : null;
  const currentTeacher = currentSession ? getTeacher(currentSession.teacherId) : null;
  const currentGroup = currentSession ? getGroup(currentSession.groupId) : null;

  // Equipment icon helper
  const getEquipmentIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('projector')) return <Presentation className="w-3.5 h-3.5" />;
    if (lower.includes('computer')) return <Monitor className="w-3.5 h-3.5" />;
    if (lower.includes('air') || lower.includes('ac')) return <Wind className="w-3.5 h-3.5" />;
    if (lower.includes('smart') || lower.includes('screen')) return <Tv className="w-3.5 h-3.5" />;
    if (lower.includes('camera') || lower.includes('audio')) return <Video className="w-3.5 h-3.5" />;
    return <Sparkles className="w-3.5 h-3.5" />;
  };

  const floorLabel = room.floor === 0 ? 'Ground Floor' : room.floor === 1 ? '1st Floor' : '2nd Floor';

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white shadow-2xl border-l border-[#E2E8F0] flex flex-col transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
              {room.number}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
              {floorLabel}
            </span>
            <span className="text-xs font-medium text-slate-500 capitalize">
              {room.type}
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#1E293B]">{room.name}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          title="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Status Card */}
        <div
          className={`p-4 rounded-xl border ${
            availability.status === 'available'
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : availability.status === 'occupied'
              ? 'bg-rose-50/70 border-rose-200 text-rose-950'
              : availability.status === 'upcoming'
              ? 'bg-amber-50/70 border-amber-200 text-amber-950'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {availability.status === 'available' ? (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              ) : availability.status === 'occupied' ? (
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              )}
              <span className="text-xs font-bold uppercase tracking-wider">
                {availability.status === 'available'
                  ? 'Currently Available'
                  : availability.status === 'occupied'
                  ? 'Currently Occupied'
                  : availability.status === 'upcoming'
                  ? 'Session Starting Soon'
                  : 'Maintenance'}
              </span>
            </div>
            <span className="text-xs font-medium opacity-80">
              At {selectedTime} ({selectedDate})
            </span>
          </div>

          {/* If occupied, show quick summary of what is happening right now */}
          {availability.status === 'occupied' && currentSession && (
            <div className="mt-3 pt-3 border-t border-rose-200/60 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-rose-900">{currentSubject?.name}</p>
                <p className="text-xs text-rose-700 mt-0.5">
                  {currentGroup?.name} • {currentTeacher?.name}
                </p>
                <p className="text-xs font-semibold text-rose-600 mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {currentSession.startTime} – {currentSession.endTime}
                </p>
              </div>
              {onSelectSession && (
                <button
                  onClick={() => onSelectSession(currentSession.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition shadow-xs"
                >
                  View Details
                </button>
              )}
            </div>
          )}

          {/* If available, show next upcoming session */}
          {availability.status === 'available' && availability.nextSession && (
            <div className="mt-3 pt-3 border-t border-emerald-200/60">
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
                Next Scheduled Session:
              </span>
              <p className="text-xs font-bold text-emerald-900 mt-0.5">
                {getSubject(availability.nextSession.subjectId)?.name} (
                {availability.nextSession.startTime} – {availability.nextSession.endTime})
              </p>
            </div>
          )}

          {availability.status === 'available' && !availability.nextSession && (
            <p className="text-xs text-emerald-700 mt-2">
              No further sessions scheduled in this room today.
            </p>
          )}
        </div>

        {/* Capacity & Basic Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Max Capacity
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Users className="w-4 h-4 text-[#4F6EF7]" />
              <span className="text-base font-bold text-[#1E293B]">
                {room.capacity} Students
              </span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Room Category
            </span>
            <div className="flex items-center gap-2 mt-1">
              <BookOpen className="w-4 h-4 text-[#14B8A6]" />
              <span className="text-base font-bold text-[#1E293B] capitalize">
                {room.type}
              </span>
            </div>
          </div>
        </div>

        {/* Equipment & Facilities */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Equipment & Technology
          </h3>
          <div className="flex flex-wrap gap-2">
            {room.equipment.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
              >
                {getEquipmentIcon(item)}
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Today's Complete Room Schedule */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Schedule for {selectedDate}
            </h3>
            <span className="text-xs font-bold text-[#4F6EF7]">
              {todaysSchedule.length} session{todaysSchedule.length !== 1 ? 's' : ''}
            </span>
          </div>

          {todaysSchedule.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
              <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-700">Room available all day</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                No classes or sessions booked on {selectedDate}.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {todaysSchedule.map((session) => {
                const subject = getSubject(session.subjectId);
                const teacher = getTeacher(session.teacherId);
                const group = getGroup(session.groupId);
                const isCurrent = currentSession?.id === session.id;

                return (
                  <div
                    key={session.id}
                    onClick={() => onSelectSession?.(session.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-[#4F6EF7] bg-blue-50/60 shadow-xs'
                        : 'border-[#E2E8F0] hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: subject?.color || '#4F6EF7' }}
                        />
                        <span className="text-xs font-bold text-[#1E293B]">
                          {subject?.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#4F6EF7] text-white">
                            NOW
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-600">
                        {session.startTime} – {session.endTime}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {group?.name} • {teacher?.name}
                      </span>
                      <span className="flex items-center gap-0.5 text-slate-400 group-hover:text-slate-600">
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
        <Button
          variant="primary"
          className="w-full justify-center"
          icon={<Calendar className="w-4 h-4" />}
          onClick={() => onViewRoomSchedule(room.id)}
        >
          View Room Schedule in Calendar
        </Button>
        <Button
          variant="outline"
          className="w-full justify-center"
          icon={<Clock className="w-4 h-4" />}
          onClick={() => onCreateSessionInRoom(room.id)}
        >
          Book Session in {room.name}
        </Button>
      </div>
    </div>
  );
}

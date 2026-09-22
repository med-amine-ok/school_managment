'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Sparkles,
  Info,
} from 'lucide-react';
import { Session } from '@/types';
import { mockSubjects } from '@/data/subjects';
import { mockTeachers } from '@/data/teachers';
import { mockGroups } from '@/data/groups';
import { mockRooms } from '@/data/rooms';
import {
  detectSessionConflicts,
  getAvailableRooms,
  hasSchedulingConflict,
} from '@/lib/calculations/conflicts';
import { getGroupEnrollmentCount } from '@/lib/calculations/academic';
import { Button } from '@/components/ui/Button';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSession: (session: Session) => void;
  initialDate?: string;
  initialStartTime?: string;
  initialRoomId?: string;
  existingSessions: Session[];
}

export function CreateSessionModal({
  isOpen,
  onClose,
  onSaveSession,
  initialDate,
  initialStartTime,
  initialRoomId,
  existingSessions,
}: CreateSessionModalProps) {
  const [subjectId, setSubjectId] = useState(mockSubjects[0]?.id || '');
  const [groupId, setGroupId] = useState(mockGroups[0]?.id || '');
  const [teacherId, setTeacherId] = useState(mockTeachers[0]?.id || '');
  const [date, setDate] = useState(initialDate || '2026-09-21');
  const [startTime, setStartTime] = useState(initialStartTime || '10:00');
  const [endTime, setEndTime] = useState('11:30');
  const [roomId, setRoomId] = useState(initialRoomId || '');

  // Reset or initialize values when modal opens or initial values change
  useEffect(() => {
    if (isOpen) {
      if (initialDate) setDate(initialDate);
      if (initialStartTime) {
        setStartTime(initialStartTime);
        // Default end time + 90 mins or + 60 mins
        const [h, m] = initialStartTime.split(':').map(Number);
        const endH = h + 1;
        const endM = m + 30;
        const normalizedH = endM >= 60 ? endH + 1 : endH;
        const normalizedM = endM >= 60 ? endM - 60 : endM;
        const formattedEndTime = `${String(Math.min(20, normalizedH)).padStart(2, '0')}:${String(
          normalizedM
        ).padStart(2, '0')}`;
        setEndTime(formattedEndTime);
      }
      if (initialRoomId) setRoomId(initialRoomId);
    }
  }, [isOpen, initialDate, initialStartTime, initialRoomId]);

  // Selected group students
  const selectedGroup = mockGroups.find((g) => g.id === groupId);
  const groupStudentsCount = selectedGroup ? getGroupEnrollmentCount(selectedGroup.id) : 20;

  // Real-time conflict evaluation
  const conflictReport = useMemo(() => {
    return detectSessionConflicts(
      {
        teacherId,
        groupId,
        roomId: roomId || 'temp',
        date,
        startTime,
        endTime,
      },
      existingSessions
    );
  }, [teacherId, groupId, roomId, date, startTime, endTime, existingSessions]);

  // Smart Room Categorization (Recommended, Other Available, Occupied)
  const roomRankings = useMemo(() => {
    const availableRooms = getAvailableRooms(date, startTime, endTime, existingSessions);
    const availableIds = new Set(availableRooms.map((r) => r.id));

    const recommended: typeof mockRooms = [];
    const otherAvailable: typeof mockRooms = [];
    const occupied: { room: (typeof mockRooms)[0]; conflictSession?: Session }[] = [];

    mockRooms.forEach((room) => {
      if (room.status === 'Maintenance') return;

      if (availableIds.has(room.id)) {
        // Check capacity requirement
        if (room.capacity >= groupStudentsCount) {
          recommended.push(room);
        } else {
          otherAvailable.push(room);
        }
      } else {
        // Find the conflicting session
        const conflict = existingSessions.find(
          (s) =>
            s.date === date &&
            s.roomId === room.id &&
            s.status !== 'Cancelled' &&
            s.startTime < endTime &&
            s.endTime > startTime
        );
        occupied.push({ room, conflictSession: conflict });
      }
    });

    return { recommended, otherAvailable, occupied };
  }, [date, startTime, endTime, existingSessions, groupStudentsCount]);

  // Automatically select first recommended room if currently selected room is empty or occupied
  useEffect(() => {
    if (!roomId && roomRankings.recommended.length > 0) {
      setRoomId(roomRankings.recommended[0].id);
    }
  }, [roomRankings, roomId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomId) {
      alert('Please select a room for this session.');
      return;
    }

    if (conflictReport.hasConflict) {
      alert(`Scheduling Conflict:\n${conflictReport.reasons.join('\n')}`);
      return;
    }

    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const duration = (eh * 60 + em) - (sh * 60 + sm);

    const newSession: Session = {
      id: `session-${Date.now()}`,
      subjectId,
      groupId,
      teacherId,
      roomId,
      date,
      startTime,
      endTime,
      durationMinutes: duration > 0 ? duration : 60,
      status: 'Scheduled',
    };

    onSaveSession(newSession);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1E293B]">Create Academic Session</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select time, cohort, and an available room with automatic conflict prevention
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Top Conflict Alert if any detected */}
          {conflictReport.hasConflict && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs text-rose-700">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Scheduling Collision Detected:</span>
              </div>
              <ul className="text-xs text-rose-700 pl-6 list-disc space-y-0.5">
                {conflictReport.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Academic Info Grid: Subject, Group, Teacher */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-xl bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#4F6EF7]/20 focus:outline-none"
              >
                {mockSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Group */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Class Group ({groupStudentsCount} students)
              </label>
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-xl bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#4F6EF7]/20 focus:outline-none"
              >
                {mockGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({getGroupEnrollmentCount(g.id)} students)
                  </option>
                ))}
              </select>
            </div>

            {/* Teacher */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teacher</label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-xl bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#4F6EF7]/20 focus:outline-none"
              >
                {mockTeachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time & Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-xl bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#4F6EF7]/20 focus:outline-none"
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-xl bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#4F6EF7]/20 focus:outline-none"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-xl bg-white text-slate-800 font-medium focus:ring-2 focus:ring-[#4F6EF7]/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Smart Room Selection Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700">
                Select Room for {date} ({startTime} – {endTime})
              </label>
              <span className="text-[11px] font-semibold text-slate-400">
                Live availability based on {mockRooms.length} school rooms
              </span>
            </div>

            {/* Recommended Rooms List */}
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Recommended Rooms (Available + Fits {groupStudentsCount} Students)
                </span>
                {roomRankings.recommended.length === 0 ? (
                  <p className="text-xs text-slate-400 italic p-2 bg-slate-50 rounded-lg">
                    No available rooms with capacity ≥ {groupStudentsCount} students at this time.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {roomRankings.recommended.map((r) => {
                      const isSelected = roomId === r.id;
                      return (
                        <div
                          key={r.id}
                          onClick={() => setRoomId(r.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-[#4F6EF7] bg-blue-50/70 ring-1 ring-[#4F6EF7]'
                              : 'border-emerald-200/80 bg-emerald-50/30 hover:border-emerald-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-xs font-bold text-slate-800">{r.name}</span>
                              <span className="text-[10px] font-mono text-slate-500">
                                ({r.number})
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 block mt-0.5 pl-5">
                              Cap: <strong>{r.capacity}</strong> • Floor {r.floor} • {r.type}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#4F6EF7] text-white">
                              Selected
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Other Available Rooms (e.g. Capacity Conflict) */}
              {roomRankings.otherAvailable.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-amber-600" />
                    Other Available Rooms (Capacity Under {groupStudentsCount})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {roomRankings.otherAvailable.map((r) => {
                      const isSelected = roomId === r.id;
                      return (
                        <div
                          key={r.id}
                          onClick={() => setRoomId(r.id)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-[#4F6EF7] bg-blue-50/70 ring-1 ring-[#4F6EF7]'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-800">{r.name}</span>
                              <span className="text-[10px] text-amber-600 font-semibold">
                                (Cap: {r.capacity})
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              Group requires {groupStudentsCount} seats
                            </span>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#4F6EF7] text-white">
                              Selected
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Occupied Rooms */}
              {roomRankings.occupied.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block mb-1.5">
                    Occupied Rooms (Unavailable)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 opacity-60">
                    {roomRankings.occupied.slice(0, 4).map(({ room: r, conflictSession }) => (
                      <div
                        key={r.id}
                        className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/40 text-xs flex items-center justify-between cursor-not-allowed"
                      >
                        <div>
                          <div className="flex items-center gap-1 text-rose-800 font-bold">
                            <X className="w-3.5 h-3.5 text-rose-500" />
                            <span>{r.name} ({r.number})</span>
                          </div>
                          <span className="text-[10px] text-rose-600 block pl-4">
                            Occupied ({conflictSession?.startTime}–{conflictSession?.endTime})
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-rose-500">Unavailable</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={conflictReport.hasConflict || !roomId}
            >
              Confirm & Schedule Session
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

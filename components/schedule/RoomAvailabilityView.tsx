'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  MapPin,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { mockRooms } from '@/data/rooms';
import { Session } from '@/types';
import { mockSubjects } from '@/data/subjects';
import { mockTeachers } from '@/data/teachers';
import { mockGroups } from '@/data/groups';
import { getAvailableRooms } from '@/lib/calculations/conflicts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface RoomAvailabilityViewProps {
  selectedDate: string;
  selectedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  sessions: Session[];
  onInspectRoom: (roomId: string) => void;
  onBookRoom: (roomId: string, date: string, time: string) => void;
}

export function RoomAvailabilityView({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  sessions,
  onInspectRoom,
  onBookRoom,
}: RoomAvailabilityViewProps) {
  const [endTime, setEndTime] = useState('17:30');
  const [floorFilter, setFloorFilter] = useState<'all' | '0' | '1' | '2'>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [minCapacity, setMinCapacity] = useState('0');

  // Compute available room IDs during the selected [selectedTime, endTime) interval
  const availableRoomsList = useMemo(() => {
    return getAvailableRooms(selectedDate, selectedTime, endTime, sessions);
  }, [selectedDate, selectedTime, endTime, sessions]);

  const availableIds = useMemo(() => {
    return new Set(availableRoomsList.map((r) => r.id));
  }, [availableRoomsList]);

  // Find active session occupying a room during this period
  const getOccupyingSession = (roomId: string) => {
    return sessions.find(
      (s) =>
        s.date === selectedDate &&
        s.roomId === roomId &&
        s.status !== 'Cancelled' &&
        s.startTime < endTime &&
        s.endTime > selectedTime
    );
  };

  const getSubject = (id: string) => mockSubjects.find((s) => s.id === id);
  const getTeacher = (id: string) => mockTeachers.find((t) => t.id === id);
  const getGroup = (id: string) => mockGroups.find((g) => g.id === id);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return mockRooms.filter((r) => {
      const matchFloor = floorFilter === 'all' || r.floor.toString() === floorFilter;
      const matchType = typeFilter === 'all' || r.type === typeFilter;
      const matchCapacity = r.capacity >= Number(minCapacity);
      return matchFloor && matchType && matchCapacity;
    });
  }, [floorFilter, typeFilter, minCapacity]);

  const availableCount = filteredRooms.filter((r) => availableIds.has(r.id) && r.status !== 'maintenance').length;
  const occupiedCount = filteredRooms.filter((r) => !availableIds.has(r.id) && r.status !== 'maintenance').length;
  const maintenanceCount = filteredRooms.filter((r) => r.status === 'maintenance').length;

  return (
    <div className="space-y-6">
      {/* Time & Criteria Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Date and Time Selector */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#4F6EF7]" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-xl bg-white font-medium text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#4F6EF7]" />
              <span className="text-xs font-semibold text-slate-500">From</span>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => onTimeChange(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-xl bg-white font-medium text-slate-800"
              />
              <span className="text-xs font-semibold text-slate-500">To</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-xl bg-white font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Floor filter */}
            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value as any)}
              className="px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white text-slate-700 font-medium"
            >
              <option value="all">All Floors</option>
              <option value="0">Ground Floor</option>
              <option value="1">1st Floor</option>
              <option value="2">2nd Floor</option>
            </select>

            {/* Room type filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white text-slate-700 font-medium capitalize"
            >
              <option value="all">All Room Types</option>
              <option value="classroom">Classroom</option>
              <option value="lab">Lab / Computer</option>
              <option value="lecture">Lecture / Hall</option>
            </select>

            {/* Capacity filter */}
            <select
              value={minCapacity}
              onChange={(e) => setMinCapacity(e.target.value)}
              className="px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white text-slate-700 font-medium"
            >
              <option value="0">Any Capacity</option>
              <option value="20">Min 20 seats</option>
              <option value="25">Min 25 seats</option>
              <option value="30">Min 30 seats</option>
            </select>
          </div>
        </div>

        {/* Status Counter Chips */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-400">Total Rooms: {filteredRooms.length}</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {availableCount} Available
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            {occupiedCount} Occupied
          </span>
          {maintenanceCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
              {maintenanceCount} Maintenance
            </span>
          )}
        </div>
      </Card>

      {/* Grid of Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => {
          const isMaintenance = room.status === 'maintenance';
          const isAvailable = availableIds.has(room.id) && !isMaintenance;
          const occupyingSession = !isAvailable && !isMaintenance ? getOccupyingSession(room.id) : null;
          const subject = occupyingSession ? getSubject(occupyingSession.subjectId) : null;
          const teacher = occupyingSession ? getTeacher(occupyingSession.teacherId) : null;
          const group = occupyingSession ? getGroup(occupyingSession.groupId) : null;

          return (
            <div
              key={room.id}
              onClick={() => onInspectRoom(room.id)}
              className={`rounded-2xl border transition-all duration-200 bg-white p-5 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between ${
                isAvailable
                  ? 'border-emerald-200 hover:border-emerald-400'
                  : isMaintenance
                  ? 'border-slate-200 bg-slate-50 opacity-70'
                  : 'border-rose-200 hover:border-rose-400'
              }`}
            >
              <div>
                {/* Room Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {room.number}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Floor {room.floor}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">
                        • {room.type}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#1E293B]">{room.name}</h3>
                  </div>

                  {/* Status Indicator Pill */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      isAvailable
                        ? 'bg-emerald-100 text-emerald-800'
                        : isMaintenance
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isAvailable ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        AVAILABLE
                      </>
                    ) : isMaintenance ? (
                      'MAINTENANCE'
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        OCCUPIED
                      </>
                    )}
                  </span>
                </div>

                {/* Session or Capacity Body */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  {isAvailable && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Users className="w-4 h-4 text-emerald-600" />
                        <span>Capacity: <strong className="text-slate-800">{room.capacity} students</strong></span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {room.equipment.map((eq, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                          >
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {!isAvailable && occupyingSession && (
                    <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-900">{subject?.name}</span>
                        <span className="text-[10px] font-mono font-bold text-rose-700">
                          {occupyingSession.startTime} – {occupyingSession.endTime}
                        </span>
                      </div>
                      <p className="text-xs text-rose-700">
                        {group?.name} • Teacher: {teacher?.name}
                      </p>
                    </div>
                  )}

                  {isMaintenance && (
                    <p className="text-xs text-slate-500 italic">
                      Scheduled maintenance & equipment upgrade in progress.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onInspectRoom(room.id);
                  }}
                  className="font-bold text-[#4F6EF7] hover:text-[#3B4FD9] flex items-center gap-1 cursor-pointer"
                >
                  Inspect Room <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {isAvailable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookRoom(room.id, selectedDate, selectedTime);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#4F6EF7] text-white font-bold hover:bg-[#3B4FD9] shadow-xs cursor-pointer"
                  >
                    Book Room
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

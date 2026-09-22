'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Building2,
  Search,
  Filter,
  Plus,
  Users,
  CheckCircle2,
  XCircle,
  Monitor,
  FlaskConical,
  BookOpen,
  Presentation,
  Map as MapIcon,
  Layers,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { mockRooms } from '@/data/rooms';
import { mockSessions } from '@/data/sessions';
import { mockSubjects } from '@/data/subjects';
import { mockGroups } from '@/data/groups';
import { FloorNumber } from '@/data/floorPlans';
import { calculateRoomAvailability } from '@/lib/calculations/conflicts';
import { schoolService } from '@/lib/services/schoolService';
import { Room, RoomType } from '@/types/room';

// Map & Availability Components
import { SchoolMapToolbar } from '@/components/schedule/map/SchoolMapToolbar';
import { SchoolFloorPlan } from '@/components/schedule/map/SchoolFloorPlan';
import { RoomDetailsDrawer } from '@/components/schedule/map/RoomDetailsDrawer';
import { RoomAvailabilityView } from '@/components/schedule/RoomAvailabilityView';

function RoomsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL query params initialization (e.g. from calendar "Locate on School Map")
  const initialFloorParam = searchParams.get('floor');
  const initialRoomParam = searchParams.get('room');

  // Sub-view: Map | Availability Matrix | Directory Cards
  const [activeView, setActiveView] = useState<'map' | 'availability' | 'directory'>('map');

  // Interactive Map & Availability Shared State
  const [currentFloor, setCurrentFloor] = useState<FloorNumber>(
    initialFloorParam !== null ? (Number(initialFloorParam) as FloorNumber) : 1
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(initialRoomParam || null);
  const [selectedDate, setSelectedDate] = useState('2026-09-21');
  const [selectedTime, setSelectedTime] = useState('16:00');
  const [isRoomDrawerOpen, setIsRoomDrawerOpen] = useState(Boolean(initialRoomParam));

  // Map Controls State
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [mapZoomLevel, setMapZoomLevel] = useState(1.0);

  // Directory View State
  const [rooms, setRooms] = useState<Room[]>([...mockRooms]);
  const [directorySearchQuery, setDirectorySearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    number: '',
    type: 'Classroom' as RoomType,
    building: 'Main Building — 1st Floor',
    capacity: '25',
  });

  // Sync if URL search params change
  useEffect(() => {
    if (initialFloorParam !== null) {
      setCurrentFloor(Number(initialFloorParam) as FloorNumber);
    }
    if (initialRoomParam) {
      setSelectedRoomId(initialRoomParam);
      setIsRoomDrawerOpen(true);
      setActiveView('map');
    }
  }, [initialFloorParam, initialRoomParam]);

  const types = Array.from(new Set(mockRooms.map((r) => r.type)));

  // Enrich rooms for directory view
  const enrichedRooms = useMemo(() => {
    return rooms.map((room) => {
      const availability = calculateRoomAvailability(room.id, selectedDate, selectedTime);
      const todayRoomSessions = mockSessions.filter(
        (s) => s.roomId === room.id && s.date === selectedDate
      );

      return {
        ...room,
        isAvailableSlot: availability.isAvailable,
        occupyingSession: availability.currentSession,
        todayRoomSessions,
      };
    });
  }, [rooms, selectedDate, selectedTime]);

  const filteredDirectoryRooms = useMemo(() => {
    return enrichedRooms.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(directorySearchQuery.toLowerCase()) ||
        r.number.toLowerCase().includes(directorySearchQuery.toLowerCase()) ||
        r.building.toLowerCase().includes(directorySearchQuery.toLowerCase());

      const matchesType = typeFilter === 'All' || r.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [enrichedRooms, directorySearchQuery, typeFilter]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.number) return;

    const newRoom = await schoolService.createRoom({
      name: formData.name,
      number: formData.number,
      type: formData.type,
      building: formData.building,
      floor: 1,
      capacity: parseInt(formData.capacity) || 25,
      equipment: ['Smart Board', 'Air Conditioning', 'WiFi'],
      status: 'Available',
    });

    setRooms((prev) => [...prev, newRoom]);
    setIsAddModalOpen(false);
    setSuccessToast(`Facility "${newRoom.name}" (${newRoom.number}) added successfully.`);
    setTimeout(() => setSuccessToast(null), 3000);
    setFormData({
      name: '',
      number: '',
      type: 'Classroom',
      building: 'Main Building — 1st Floor',
      capacity: '25',
    });
  };

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'Computer Lab':
      case 'lab':
        return <Monitor className="w-4 h-4 text-[#4F6EF7]" />;
      case 'Laboratory':
        return <FlaskConical className="w-4 h-4 text-[#14B8A6]" />;
      case 'Conference':
      case 'lecture':
        return <Presentation className="w-4 h-4 text-[#F59E0B]" />;
      default:
        return <Building2 className="w-4 h-4 text-[#64748B]" />;
    }
  };

  // Navigations to Calendar with room focus
  const handleViewRoomScheduleInCalendar = (roomId: string) => {
    router.push(`/schedule?room=${roomId}&date=${selectedDate}`);
  };

  const handleBookRoomInCalendar = (roomId: string, date?: string, time?: string) => {
    const bookDate = date || selectedDate;
    const bookTime = time || selectedTime;
    router.push(`/schedule?bookRoom=${roomId}&date=${bookDate}&time=${bookTime}`);
  };

  return (
    <AppShell>
      {/* Page Header */}
      <PageHeader
        title="Rooms & Interactive School Map"
        subtitle={`Managing ${rooms.length} facilities across 3 architectural floors with real-time occupancy radars`}
        breadcrumbs={[{ label: 'Academic' }, { label: 'Rooms & Facilities' }]}
        badge={
          <Badge variant="primary" size="md">
            {rooms.length} Total Facilities
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Calendar className="w-4 h-4 text-[#4F6EF7]" />}
              onClick={() => router.push('/schedule')}
            >
              Academic Calendar
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Facility
            </Button>
          </div>
        }
      />

      {successToast && (
        <div className="mb-6 p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-[#15803D]">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successToast}</span>
          </div>
        </div>
      )}

      {/* Experience Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] mb-6 pb-2">
        <div className="flex items-center gap-2 bg-[#F1F5F9] p-1 rounded-xl">
          <button
            onClick={() => setActiveView('map')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeView === 'map'
                ? 'bg-white text-[#4F6EF7] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-4 h-4 text-[#14B8A6]" />
            <span>Interactive Floor Plan</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
              3 Floors
            </span>
          </button>

          <button
            onClick={() => setActiveView('availability')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeView === 'availability'
                ? 'bg-white text-[#4F6EF7] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Availability Matrix</span>
          </button>

          <button
            onClick={() => setActiveView('directory')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeView === 'directory'
                ? 'bg-white text-[#4F6EF7] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-[#64748B]" />
            <span>Facilities Directory</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time Blueprint Radar</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. INTERACTIVE SCHOOL MAP VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeView === 'map' && (
        <div className="space-y-4">
          <SchoolMapToolbar
            currentFloor={currentFloor}
            onFloorChange={setCurrentFloor}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            selectedTime={selectedTime}
            onTimeChange={setSelectedTime}
            searchQuery={mapSearchQuery}
            onSearchChange={setMapSearchQuery}
            zoomLevel={mapZoomLevel}
            onZoomIn={() => setMapZoomLevel((z) => Math.min(1.6, z + 0.15))}
            onZoomOut={() => setMapZoomLevel((z) => Math.max(0.8, z - 0.15))}
            onResetZoom={() => setMapZoomLevel(1.0)}
          />

          <SchoolFloorPlan
            currentFloor={currentFloor}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedRoomId={selectedRoomId}
            onSelectRoom={(rId) => {
              setSelectedRoomId(rId);
              setIsRoomDrawerOpen(true);
            }}
            searchQuery={mapSearchQuery}
            zoomLevel={mapZoomLevel}
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. ROOM AVAILABILITY MATRIX VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeView === 'availability' && (
        <RoomAvailabilityView
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onDateChange={setSelectedDate}
          onTimeChange={setSelectedTime}
          sessions={mockSessions}
          onInspectRoom={(rId) => {
            const room = mockRooms.find((r) => r.id === rId);
            if (room) {
              setCurrentFloor(room.floor as FloorNumber);
              setSelectedRoomId(room.id);
              setIsRoomDrawerOpen(true);
              setActiveView('map');
            }
          }}
          onBookRoom={handleBookRoomInCalendar}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. FACILITIES DIRECTORY VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeView === 'directory' && (
        <div className="space-y-6">
          {/* Search and Filters Bar */}
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="text"
                  value={directorySearchQuery}
                  onChange={(e) => setDirectorySearchQuery(e.target.value)}
                  placeholder="Search by room name, number, or building wing..."
                  className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 focus:border-[#4F6EF7]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-[#64748B]" />
                <span className="text-xs text-[#64748B]">Type:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white font-medium text-[#1E293B]"
                >
                  <option value="All">All Types</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDirectoryRooms.map((room) => {
              const isOccupied = !room.isAvailableSlot;
              const occupyingSession = room.occupyingSession;
              const occSubject = occupyingSession
                ? mockSubjects.find((s) => s.id === occupyingSession.subjectId)
                : null;
              const occGroup = occupyingSession
                ? mockGroups.find((g) => g.id === occupyingSession.groupId)
                : null;

              return (
                <Card
                  key={room.id}
                  onClick={() => {
                    setSelectedRoomId(room.id);
                    setIsRoomDrawerOpen(true);
                  }}
                  className="p-5 flex flex-col justify-between hover:shadow-md hover:border-[#4F6EF7] transition-all cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getRoomIcon(room.type)}
                        <span className="text-xs font-bold text-[#1E293B]">{room.type}</span>
                      </div>

                      <Badge variant={isOccupied ? 'danger' : 'success'} size="sm">
                        {isOccupied ? 'Occupied' : 'Available'}
                      </Badge>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <h3 className="text-base font-bold text-[#1E293B]">{room.name}</h3>
                      <span className="text-xs font-mono text-[#64748B]">({room.number})</span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5">{room.building}</p>

                    {/* Live Occupancy Status Card */}
                    <div className="mt-4 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      {isOccupied ? (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[#EF4444] uppercase tracking-wider block">
                            Active Session at {selectedTime}
                          </span>
                          <p className="text-xs font-bold text-[#1E293B]">
                            {occSubject?.name} • {occGroup?.name.split('(')[0]}
                          </p>
                          <p className="text-[11px] text-[#64748B]">
                            Slot: {occupyingSession?.startTime}–{occupyingSession?.endTime}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-[#15803D] font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Ready for scheduling at {selectedTime}</span>
                        </div>
                      )}
                    </div>

                    {/* Equipment Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {room.equipment.map((eq, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569]"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Seating and Schedule Count */}
                  <div className="mt-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#94A3B8]" />
                      Capacity: <strong className="text-[#1E293B]">{room.capacity} seats</strong>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRoomId(room.id);
                        setIsRoomDrawerOpen(true);
                      }}
                      className="font-bold text-[#4F6EF7] hover:underline flex items-center gap-1"
                    >
                      Inspect <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ROOM DETAILS DRAWER (ARCHITECTURAL INSPECTOR) */}
      {/* ------------------------------------------------------------- */}
      <RoomDetailsDrawer
        roomId={selectedRoomId}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        isOpen={isRoomDrawerOpen}
        onClose={() => setIsRoomDrawerOpen(false)}
        onViewRoomSchedule={handleViewRoomScheduleInCalendar}
        onCreateSessionInRoom={handleBookRoomInCalendar}
        onSelectSession={(sessionId) => {
          router.push(`/schedule?session=${sessionId}`);
        }}
      />

      {/* ------------------------------------------------------------- */}
      {/* ADD ROOM MODAL */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Facility / Classroom"
        subtitle="Register classrooms, specialized science labs, or auditoriums"
        size="md"
      >
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Facility Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Science Amphitheater"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Room Number / Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AMP-01"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Room Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as RoomType })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none bg-white"
              >
                <option value="Classroom">Classroom</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Computer Lab">Computer Lab</option>
                <option value="Conference">Conference Hall</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Seating Capacity *
              </label>
              <input
                type="number"
                required
                min="10"
                max="120"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Building Wing / Floor *
            </label>
            <input
              type="text"
              required
              value={formData.building}
              onChange={(e) => setFormData({ ...formData, building: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F1F5F9]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
            >
              Add Facility
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}

export default function RoomsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-sm font-semibold text-slate-500">
          Loading Facilities & Floor Plans...
        </div>
      }
    >
      <RoomsContent />
    </Suspense>
  );
}

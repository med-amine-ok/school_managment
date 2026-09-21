'use client';

import React, { useState, useMemo } from 'react';
import { Layers, Plus, Search, Filter, Clock, MapPin, User, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { mockGroups } from '@/data/groups';
import { mockSubjects } from '@/data/subjects';
import { mockTeachers } from '@/data/teachers';
import { mockRooms } from '@/data/rooms';
import { mockEnrollments } from '@/data/enrollments';
import { schoolService } from '@/lib/services/schoolService';
import { Group } from '@/types/group';

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([...mockGroups]);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    subjectId: mockSubjects[0]?.id || '',
    teacherId: mockTeachers[0]?.id || '',
    defaultRoomId: mockRooms[0]?.id || '',
    maxCapacity: '25',
  });

  const enrichedGroups = useMemo(() => {
    return groups.map((group) => {
      const subject = mockSubjects.find((s) => s.id === group.subjectId);
      const teacher = mockTeachers.find((t) => t.id === group.teacherId);
      const room = mockRooms.find((r) => r.id === group.defaultRoomId);

      const studentCount = mockEnrollments.filter(
        (e) => e.groupId === group.id && e.status === 'Active'
      ).length;

      const occupancyPercent = Math.round((studentCount / group.maxCapacity) * 100);

      return {
        ...group,
        subject,
        teacher,
        room,
        studentCount,
        occupancyPercent,
      };
    });
  }, [groups]);

  const filteredGroups = useMemo(() => {
    return enrichedGroups.filter((g) => {
      const matchesSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.subject?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.teacher?.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubject = subjectFilter === 'All' || g.subjectId === subjectFilter;

      return matchesSearch && matchesSubject;
    });
  }, [enrichedGroups, searchQuery, subjectFilter]);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newGroup = await schoolService.createGroup({
      name: formData.name,
      subjectId: formData.subjectId,
      teacherId: formData.teacherId,
      defaultRoomId: formData.defaultRoomId,
      maxCapacity: parseInt(formData.maxCapacity) || 25,
      status: 'Active',
      scheduleSlots: [
        { dayOfWeek: 'Sunday', startTime: '16:00', endTime: '17:30' },
        { dayOfWeek: 'Tuesday', startTime: '16:00', endTime: '17:30' },
      ],
    });

    setGroups((prev) => [newGroup, ...prev]);
    setIsAddModalOpen(false);
    setSuccessToast(`Group "${newGroup.name}" created successfully with capacity of ${newGroup.maxCapacity} seats.`);
    setTimeout(() => setSuccessToast(null), 3000);
    setFormData({
      name: '',
      subjectId: mockSubjects[0]?.id || '',
      teacherId: mockTeachers[0]?.id || '',
      defaultRoomId: mockRooms[0]?.id || '',
      maxCapacity: '25',
    });
  };

  return (
    <AppShell>
      <PageHeader
        title="Class Groups & Cohorts"
        subtitle={`Managing ${groups.length} active learning groups with assigned rooms and weekly schedules`}
        breadcrumbs={[{ label: 'Academic' }, { label: 'Groups' }]}
        badge={
          <Badge variant="primary" size="md">
            {filteredGroups.length} Groups
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Create Group
          </Button>
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

      {/* Search and Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by group name, subject, or assigned instructor..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 focus:border-[#4F6EF7]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="text-xs text-[#64748B]">Subject:</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white font-medium text-[#1E293B]"
            >
              <option value="All">All Subjects</option>
              {mockSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => {
          const isNearCapacity = group.occupancyPercent >= 90;
          return (
            <Card key={group.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="primary" size="sm">
                    {group.subject?.name}
                  </Badge>
                  {isNearCapacity && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#F59E0B]">
                      <AlertTriangle className="w-3 h-3" /> Near Capacity
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#1E293B]">{group.name}</h3>

                <div className="mt-4 space-y-2 text-xs text-[#64748B]">
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#94A3B8]" />
                    <span>Teacher: <strong className="text-[#1E293B]">{group.teacher?.name}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#94A3B8]" />
                    <span>Room: <strong className="text-[#1E293B]">{group.room?.name}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#94A3B8]" />
                    <span>
                      {group.scheduleSlots.map((s) => `${s.dayOfWeek} ${s.startTime}–${s.endTime}`).join(' & ')}
                    </span>
                  </p>
                </div>
              </div>

              {/* Seating Capacity Meter */}
              <div className="mt-5 pt-4 border-t border-[#F1F5F9]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#64748B]">Room Seating Capacity</span>
                  <span className="font-bold text-[#1E293B]">
                    {group.studentCount} / {group.maxCapacity} Seats ({group.occupancyPercent}%)
                  </span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      group.occupancyPercent >= 90
                        ? 'bg-[#EF4444]'
                        : group.occupancyPercent >= 75
                        ? 'bg-[#F59E0B]'
                        : 'bg-[#14B8A6]'
                    }`}
                    style={{ width: `${Math.min(100, group.occupancyPercent)}%` }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Group Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Class Group Cohort"
        subtitle="Organize students into study groups with assigned teachers and classrooms"
        size="md"
      >
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Group Cohort Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mathematics 3AS - Group C"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Academic Subject *
              </label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none bg-white"
              >
                {mockSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Faculty Instructor *
              </label>
              <select
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none bg-white"
              >
                {mockTeachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.specialization.split('&')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Default Classroom / Lab *
              </label>
              <select
                value={formData.defaultRoomId}
                onChange={(e) => setFormData({ ...formData, defaultRoomId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none bg-white"
              >
                {mockRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.capacity} seats)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Max Seating Limit *
              </label>
              <input
                type="number"
                required
                min="10"
                max="40"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none font-mono"
              />
            </div>
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
              Create Group
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}

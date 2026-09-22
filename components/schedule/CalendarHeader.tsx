'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Search,
  Plus,
  Filter,
  X,
  User,
  BookOpen,
  MapPin,
  Users,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { mockTeachers } from '@/data/teachers';
import { mockSubjects } from '@/data/subjects';
import { mockRooms } from '@/data/rooms';
import { mockGroups } from '@/data/groups';

export type CalendarViewType = 'day' | 'week' | 'month';
export type QuickFilterType = 'all' | 'my_schedule' | 'teachers' | 'rooms' | 'subjects';

interface CalendarHeaderProps {
  currentDate: string; // YYYY-MM-DD
  viewType: CalendarViewType;
  onViewTypeChange: (view: CalendarViewType) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onDateChange: (date: string) => void;
  quickFilter: QuickFilterType;
  onQuickFilterChange: (qf: QuickFilterType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  teacherFilter: string;
  onTeacherFilterChange: (id: string) => void;
  subjectFilter: string;
  onSubjectFilterChange: (id: string) => void;
  roomFilter: string;
  onRoomFilterChange: (id: string) => void;
  groupFilter: string;
  onGroupFilterChange: (id: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onCreateSession: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export function CalendarHeader({
  currentDate,
  viewType,
  onViewTypeChange,
  onPrev,
  onNext,
  onToday,
  onDateChange,
  quickFilter,
  onQuickFilterChange,
  searchQuery,
  onSearchChange,
  teacherFilter,
  onTeacherFilterChange,
  subjectFilter,
  onSubjectFilterChange,
  roomFilter,
  onRoomFilterChange,
  groupFilter,
  onGroupFilterChange,
  statusFilter,
  onStatusFilterChange,
  onCreateSession,
  onResetFilters,
  hasActiveFilters,
}: CalendarHeaderProps) {
  // Format formatted date range label based on viewType
  const formatHeaderTitle = () => {
    const [y, m, d] = currentDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);

    if (viewType === 'day') {
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }

    if (viewType === 'month') {
      return dateObj.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    }

    // Week View: compute Monday to Sunday of the current date
    const dayOfWeek = dateObj.getDay(); // 0 is Sun, 1 is Mon...
    const diffToMon = (dayOfWeek + 6) % 7;
    const mon = new Date(dateObj);
    mon.setDate(dateObj.getDate() - diffToMon);

    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);

    const monMonth = mon.toLocaleDateString('en-US', { month: 'short' });
    const sunMonth = sun.toLocaleDateString('en-US', { month: 'short' });
    const year = sun.getFullYear();

    if (monMonth === sunMonth) {
      return `${monMonth} ${mon.getDate()} – ${sun.getDate()}, ${year}`;
    }
    return `${monMonth} ${mon.getDate()} – ${sunMonth} ${sun.getDate()}, ${year}`;
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs space-y-4">
      {/* Top Bar: Navigation + Title + View Selector + Create Action */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Date Navigator and Range Title */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-1 shadow-xs">
            <button
              onClick={onPrev}
              title="Previous period"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onToday}
              className="px-3 py-1 text-xs font-bold text-slate-700 hover:text-[#4F6EF7] hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={onNext}
              title="Next period"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={currentDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20"
            />
          </div>

          <h2 className="text-base sm:text-lg font-bold text-[#1E293B] tracking-tight">
            {formatHeaderTitle()}
          </h2>
        </div>

        {/* View Switcher and Primary Action */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Day / Week / Month Switcher */}
          <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-xl border border-slate-200/60">
            {(['day', 'week', 'month'] as const).map((view) => (
              <button
                key={view}
                onClick={() => onViewTypeChange(view)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${
                  viewType === view
                    ? 'bg-white text-[#4F6EF7] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          {/* Create Session Button */}
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={onCreateSession}
            className="shadow-xs"
          >
            Create Session
          </Button>
        </div>
      </div>

      {/* Quick Filter Perspective Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-[#F1F5F9]">
        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Focus:
          </span>
          {[
            { id: 'all', label: 'All' },
            { id: 'my_schedule', label: 'My Schedule' },
            { id: 'teachers', label: 'Teachers' },
            { id: 'rooms', label: 'Rooms' },
            { id: 'subjects', label: 'Subjects' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onQuickFilterChange(tab.id as QuickFilterType)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                quickFilter === tab.id
                  ? 'bg-[#EEF2FF] text-[#4F6EF7] border border-[#C7D2FE]'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search sessions, rooms, teachers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Dropdown Filters Row */}
      <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium mr-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filters:</span>
        </div>

        {/* Teacher Filter */}
        <select
          value={teacherFilter}
          onChange={(e) => onTeacherFilterChange(e.target.value)}
          className="px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20"
        >
          <option value="All">All Teachers</option>
          {mockTeachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* Subject Filter */}
        <select
          value={subjectFilter}
          onChange={(e) => onSubjectFilterChange(e.target.value)}
          className="px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20"
        >
          <option value="All">All Subjects</option>
          {mockSubjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Room Filter */}
        <select
          value={roomFilter}
          onChange={(e) => onRoomFilterChange(e.target.value)}
          className="px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20"
        >
          <option value="All">All Rooms</option>
          {mockRooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.number})
            </option>
          ))}
        </select>

        {/* Group Filter */}
        <select
          value={groupFilter}
          onChange={(e) => onGroupFilterChange(e.target.value)}
          className="px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20"
        >
          <option value="All">All Groups</option>
          {mockGroups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20"
        >
          <option value="All">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In progress">In progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Reset Filters button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-bold transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

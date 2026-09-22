'use client';

import React from 'react';
import {
  Layers,
  Calendar,
  Clock,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { FloorNumber } from '@/data/floorPlans';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface SchoolMapToolbarProps {
  currentFloor: FloorNumber;
  onFloorChange: (floor: FloorNumber) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedTime: string;
  onTimeChange: (time: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export const SchoolMapToolbar: React.FC<SchoolMapToolbarProps> = ({
  currentFloor,
  onFloorChange,
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  searchQuery,
  onSearchChange,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  const floors: { number: FloorNumber; label: string; badge: string }[] = [
    { number: 0, label: 'Ground Floor', badge: 'L0 • Admin & Hall' },
    { number: 1, label: '1st Floor', badge: 'L1 • Classrooms 101-104 & Lab' },
    { number: 2, label: '2nd Floor', badge: 'L2 • Math Studio & IT Lab' },
  ];

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-2xs space-y-4">
      {/* Top Row: Floor Selector + Live Availability Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Floor Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-xl overflow-x-auto">
          {floors.map((f) => (
            <button
              key={f.number}
              onClick={() => onFloorChange(f.number)}
              className={`py-2 px-3.5 sm:px-4 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                currentFloor === f.number
                  ? 'bg-white text-[#4F6EF7] shadow-xs ring-1 ring-[#E2E8F0]'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{f.label}</span>
              <span
                className={`text-[10px] hidden sm:inline px-1.5 py-0.5 rounded ${
                  currentFloor === f.number
                    ? 'bg-[#EEF2FF] text-[#4F6EF7]'
                    : 'bg-[#E2E8F0] text-[#64748B]'
                }`}
              >
                {f.badge.split('•')[0].trim()}
              </span>
            </button>
          ))}
        </div>

        {/* Live Availability Status Indicator */}
        <div className="flex items-center gap-2.5">
          <Badge variant="success" size="md" icon={<Sparkles className="w-3.5 h-3.5 text-[#15803D]" />}>
            Interactive Spatial Radar
          </Badge>
          <span className="text-xs text-[#64748B] hidden xl:inline">
            Colors update dynamically by time slot
          </span>
        </div>
      </div>

      {/* Bottom Controls Row: Date + Time Scrubber + Search + Zoom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center pt-3 border-t border-[#F1F5F9]">
        {/* Date Selector */}
        <div className="lg:col-span-3 flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-1.5">
          <Calendar className="w-4 h-4 text-[#64748B] shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8]">Inspection Date</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="text-xs font-bold text-[#1E293B] bg-transparent focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Time Scrubber */}
        <div className="lg:col-span-3 flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-1.5">
          <Clock className="w-4 h-4 text-[#4F6EF7] shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8]">Timeline Hour</span>
            <input
              type="time"
              step="900"
              value={selectedTime}
              onChange={(e) => onTimeChange(e.target.value)}
              className="text-xs font-mono font-bold text-[#1E293B] bg-transparent focus:outline-none cursor-pointer"
            />
          </div>
          <span className="text-[10px] text-[#64748B] font-medium hidden sm:inline">24h Radar</span>
        </div>

        {/* Room Search Bar */}
        <div className="lg:col-span-4 relative">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search room (e.g. 204, Lab, Screen)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 border border-[#E2E8F0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 focus:border-[#4F6EF7]"
          />
        </div>

        {/* Map Zoom Controls */}
        <div className="lg:col-span-2 flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={onZoomOut}
            disabled={zoomLevel <= 0.8}
            title="Zoom Out"
            className="p-2 border border-[#E2E8F0] rounded-lg bg-white text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] disabled:opacity-40 cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-[#64748B] px-1.5 min-w-[42px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={onZoomIn}
            disabled={zoomLevel >= 1.6}
            title="Zoom In"
            className="p-2 border border-[#E2E8F0] rounded-lg bg-white text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] disabled:opacity-40 cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onResetZoom}
            title="Reset View (100%)"
            className="p-2 border border-[#E2E8F0] rounded-lg bg-white text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

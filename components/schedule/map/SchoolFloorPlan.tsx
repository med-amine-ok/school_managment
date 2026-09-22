'use client';

import React from 'react';
import {
  FloorNumber,
  floorPlans,
  ArchitecturalZone,
} from '@/data/floorPlans';
import { mockRooms } from '@/data/rooms';
import { mockSessions } from '@/data/sessions';
import { mockSubjects } from '@/data/subjects';
import { mockTeachers } from '@/data/teachers';
import { calculateRoomAvailability, timeOverlaps } from '@/lib/calculations/conflicts';

interface SchoolFloorPlanProps {
  currentFloor: FloorNumber;
  selectedDate: string;
  selectedTime: string;
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  searchQuery: string;
  zoomLevel: number;
}

export const SchoolFloorPlan: React.FC<SchoolFloorPlanProps> = ({
  currentFloor,
  selectedDate,
  selectedTime,
  selectedRoomId,
  onSelectRoom,
  searchQuery,
  zoomLevel,
}) => {
  const plan = floorPlans[currentFloor] || floorPlans[1];

  // Helper to determine status for actionable rooms
  const getRoomVisualState = (zone: ArchitecturalZone) => {
    if (!zone.roomId) return null;
    const room = mockRooms.find((r) => r.id === zone.roomId);
    if (!room) return null;

    if (room.status === 'Maintenance') {
      return { status: 'Maintenance', label: 'Under Maintenance', session: undefined };
    }

    // Check occupying session at selectedDate & selectedTime
    const availability = calculateRoomAvailability(
      zone.roomId,
      selectedDate,
      selectedTime,
      selectedTime
    );

    if (!availability.isAvailable && availability.occupyingSession) {
      const subject = mockSubjects.find((s) => s.id === availability.occupyingSession?.subjectId);
      const teacher = mockTeachers.find((t) => t.id === availability.occupyingSession?.teacherId);
      return {
        status: 'Occupied' as const,
        label: subject?.name || 'Class in Progress',
        teacher: teacher?.name,
        session: availability.occupyingSession,
      };
    }

    // Check if session is starting soon (within 30 mins)
    const [h, m] = selectedTime.split(':').map(Number);
    const futureTimeMinutes = h * 60 + m + 30;
    const futureH = String(Math.floor(futureTimeMinutes / 60)).padStart(2, '0');
    const futureM = String(futureTimeMinutes % 60).padStart(2, '0');
    const futureTimeStr = `${futureH}:${futureM}`;

    const upcoming = mockSessions.find((s) => {
      if (s.roomId !== zone.roomId || s.date !== selectedDate || s.status === 'Cancelled') return false;
      return s.startTime > selectedTime && s.startTime <= futureTimeStr;
    });

    if (upcoming) {
      const subject = mockSubjects.find((s) => s.id === upcoming.subjectId);
      return {
        status: 'Upcoming' as const,
        label: `Starts ${upcoming.startTime} (${subject?.name || 'Class'})`,
        session: upcoming,
      };
    }

    return {
      status: 'Available' as const,
      label: 'Available for Booking',
      session: undefined,
    };
  };

  // Search match check
  const isMatchSearch = (zone: ArchitecturalZone) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase().trim();
    if (zone.name.toLowerCase().includes(q)) return true;
    if (zone.number?.toLowerCase().includes(q)) return true;
    if (zone.label.toLowerCase().includes(q)) return true;

    if (zone.roomId) {
      const room = mockRooms.find((r) => r.id === zone.roomId);
      if (room?.equipment.some((eq) => eq.toLowerCase().includes(q))) return true;
      if (room?.type.toLowerCase().includes(q)) return true;
    }
    return false;
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xs flex flex-col">
      {/* Floor Plan Header Details */}
      <div className="px-5 py-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1E293B]">{plan.name}</span>
          <span className="text-[#94A3B8]">•</span>
          <span className="text-[#64748B] font-medium">{plan.subtitle}</span>
        </div>
        <div className="text-[11px] font-mono text-[#4F6EF7] bg-white px-2.5 py-1 rounded-md border border-[#E2E8F0] self-start sm:self-auto">
          {plan.building}
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-auto bg-[#F8FAFC]/50 flex items-center justify-center p-4 min-h-[460px] max-h-[620px]">
        <div
          className="transition-transform duration-200 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox={plan.viewBox}
            className="w-full max-w-[880px] h-auto drop-shadow-sm select-none"
            style={{ width: '880px', height: '560px' }}
          >
            {/* Blueprint Grid Pattern */}
            <defs>
              <pattern id="grid-blueprint" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth="0.75" />
              </pattern>
              <pattern id="diagonal-stripe" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2" stroke="#CBD5E1" strokeWidth="1.5" />
              </pattern>
            </defs>

            {/* Base Campus Foundation & Outer Wall */}
            <rect
              x="20"
              y="20"
              width="880"
              height="530"
              rx="16"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="2.5"
            />
            <rect
              x="20"
              y="20"
              width="880"
              height="530"
              rx="16"
              fill="url(#grid-blueprint)"
              opacity="0.35"
            />

            {/* Main Central Corridors & Walkway Indications */}
            {currentFloor === 0 && (
              <g id="corridors-ground">
                <rect x="40" y="290" width="840" height="30" fill="#F1F5F9" opacity="0.6" rx="4" />
                <rect x="320" y="40" width="30" height="400" fill="#F1F5F9" opacity="0.6" rx="4" />
                <text x="460" y="270" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="600" letterSpacing="2">
                  MAIN CIRCULATION CONCOURSE
                </text>
              </g>
            )}

            {currentFloor === 1 && (
              <g id="corridors-l1">
                <rect x="40" y="230" width="840" height="90" fill="#F8FAFC" stroke="#E2E8F0" strokeDasharray="4 4" rx="8" />
                <text x="460" y="280" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="700" letterSpacing="3">
                  PRIMARY ACADEMIC CORRIDOR • LEVEL 1
                </text>
              </g>
            )}

            {currentFloor === 2 && (
              <g id="corridors-l2">
                <rect x="40" y="230" width="840" height="90" fill="#F8FAFC" stroke="#E2E8F0" strokeDasharray="4 4" rx="8" />
                <text x="460" y="280" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="700" letterSpacing="3">
                  TECHNOLOGY & ADVANCED SCIENCES HALL • LEVEL 2
                </text>
              </g>
            )}

            {/* Render Architectural Zones & Rooms */}
            {plan.zones.map((zone) => {
              const visual = getRoomVisualState(zone);
              const isSelected = selectedRoomId === zone.roomId;
              const isHighlighted = isMatchSearch(zone);

              // Determine color styles based on live state
              let fillColor = '#F8FAFC';
              let strokeColor = '#CBD5E1';
              let textColor = '#1E293B';
              let badgeBg = '#E2E8F0';
              let badgeText = '#64748B';

              if (zone.isClickable && visual) {
                switch (visual.status) {
                  case 'Occupied':
                    fillColor = '#FEF2F2';
                    strokeColor = '#EF4444';
                    textColor = '#991B1B';
                    badgeBg = '#FEE2E2';
                    badgeText = '#DC2626';
                    break;
                  case 'Available':
                    fillColor = '#F0FDF4';
                    strokeColor = '#22C55E';
                    textColor = '#166534';
                    badgeBg = '#DCFCE7';
                    badgeText = '#15803D';
                    break;
                  case 'Upcoming':
                    fillColor = '#FFFBEB';
                    strokeColor = '#F59E0B';
                    textColor = '#92400E';
                    badgeBg = '#FEF3C7';
                    badgeText = '#D97706';
                    break;
                  case 'Maintenance':
                    fillColor = 'url(#diagonal-stripe)';
                    strokeColor = '#94A3B8';
                    textColor = '#64748B';
                    break;
                }
              } else if (zone.type === 'entrance') {
                fillColor = '#EEF2FF';
                strokeColor = '#4F6EF7';
                textColor = '#3B4FD9';
              } else if (zone.type === 'stair') {
                fillColor = '#F1F5F9';
                strokeColor = '#94A3B8';
                textColor = '#475569';
              } else if (zone.type === 'facility') {
                fillColor = '#FAF5FF';
                strokeColor = '#A855F7';
                textColor = '#6B21A8';
              }

              if (isSelected) {
                fillColor = '#EEF2FF';
                strokeColor = '#4F6EF7';
                textColor = '#1E293B';
              }

              return (
                <g
                  key={zone.id}
                  onClick={() => {
                    if (zone.isClickable && zone.roomId) {
                      onSelectRoom(zone.roomId);
                    }
                  }}
                  className={`transition-all duration-200 ${
                    zone.isClickable
                      ? 'cursor-pointer hover:opacity-95 group'
                      : 'pointer-events-none'
                  }`}
                >
                  {/* Outer selection ring if active */}
                  {isSelected && (
                    <rect
                      x={zone.x - 4}
                      y={zone.y - 4}
                      width={zone.width + 8}
                      height={zone.height + 8}
                      rx="14"
                      fill="none"
                      stroke="#4F6EF7"
                      strokeWidth="3"
                      strokeDasharray="6 3"
                    />
                  )}

                  {/* Pulsing Highlight if matched search */}
                  {isHighlighted && (
                    <rect
                      x={zone.x - 3}
                      y={zone.y - 3}
                      width={zone.width + 6}
                      height={zone.height + 6}
                      rx="13"
                      fill="none"
                      stroke="#14B8A6"
                      strokeWidth="3.5"
                    />
                  )}

                  {/* Room Body Box */}
                  <rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.width}
                    height={zone.height}
                    rx="10"
                    fill={fillColor}
                    stroke={isSelected ? '#4F6EF7' : strokeColor}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    className="transition-colors"
                  />

                  {/* Room Number & Tag */}
                  {zone.number && (
                    <g>
                      <rect
                        x={zone.x + 12}
                        y={zone.y + 12}
                        width="60"
                        height="22"
                        rx="5"
                        fill={badgeBg}
                      />
                      <text
                        x={zone.x + 42}
                        y={zone.y + 27}
                        textAnchor="middle"
                        fill={badgeText}
                        fontSize="11"
                        fontWeight="700"
                        fontFamily="monospace"
                      >
                        {zone.number}
                      </text>
                    </g>
                  )}

                  {/* Capacity Pill (if applicable) */}
                  {zone.capacity && (
                    <text
                      x={zone.x + zone.width - 12}
                      y={zone.y + 26}
                      textAnchor="end"
                      fill="#64748B"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {zone.capacity} seats
                    </text>
                  )}

                  {/* Room Title */}
                  <text
                    x={zone.x + 14}
                    y={zone.y + (zone.number ? 56 : 38)}
                    fill={textColor}
                    fontSize="13"
                    fontWeight="700"
                  >
                    {zone.label}
                  </text>

                  {/* Subtitle / Equipment info */}
                  <text
                    x={zone.x + 14}
                    y={zone.y + (zone.number ? 74 : 56)}
                    fill="#64748B"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {zone.sublabel || ''}
                  </text>

                  {/* Live Status Pill at selected time */}
                  {zone.isClickable && visual && (
                    <g transform={`translate(${zone.x + 14}, ${zone.y + zone.height - 38})`}>
                      <rect
                        x="0"
                        y="0"
                        width={zone.width - 28}
                        height="26"
                        rx="6"
                        fill="#FFFFFF"
                        stroke={strokeColor}
                        strokeWidth="1"
                      />
                      {/* Status indicator dot */}
                      <circle
                        cx="10"
                        cy="13"
                        r="4"
                        fill={
                          visual.status === 'Occupied'
                            ? '#EF4444'
                            : visual.status === 'Available'
                            ? '#22C55E'
                            : '#F59E0B'
                        }
                      />
                      <text
                        x="20"
                        y="17"
                        fill="#1E293B"
                        fontSize="10"
                        fontWeight="600"
                      >
                        {visual.status.toUpperCase()}
                        {visual.status === 'Occupied' && visual.label
                          ? ` • ${visual.label.slice(0, 18)}`
                          : ''}
                      </text>
                    </g>
                  )}

                  {/* Non-classroom zones details */}
                  {!zone.isClickable && (
                    <text
                      x={zone.x + 14}
                      y={zone.y + zone.height - 16}
                      fill="#94A3B8"
                      fontSize="10"
                      fontStyle="italic"
                    >
                      Institutional Facility
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Visual State Legend Footer */}
      <div className="px-5 py-3 bg-white border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[#64748B] font-semibold text-[11px] uppercase tracking-wider">
            Live Legend:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
            <span className="text-[#1E293B] font-medium">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <span className="text-[#1E293B] font-medium">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <span className="text-[#1E293B] font-medium">Starting Soon</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4F6EF7]" />
            <span className="text-[#1E293B] font-medium">Selected Room</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" />
            <span className="text-[#64748B] font-medium">Services / Circulation</span>
          </div>
        </div>

        <div className="text-[11px] text-[#64748B]">
          Click any classroom or lab to inspect equipment and scheduled cohort
        </div>
      </div>
    </div>
  );
};

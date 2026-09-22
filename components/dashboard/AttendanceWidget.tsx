'use client';

import React from 'react';
import { ClipboardCheck, CheckCircle2, Clock, AlertCircle, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { getSchoolAttendanceOverview } from '@/lib/calculations/academic';

export const AttendanceWidget: React.FC = () => {
  const stats = getSchoolAttendanceOverview();

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Attendance Performance"
        subtitle="Cumulative academic attendance across all enrolled groups"
        action={
          <a
            href="/attendance"
            className="text-xs font-semibold text-[#4F6EF7] hover:underline cursor-pointer"
          >
            Detailed Ledger
          </a>
        }
      />

      <CardContent className="space-y-5">
        {/* Main Attendance Rate Display */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7]">
          <div>
            <p className="text-xs font-semibold text-[#15803D] uppercase tracking-wide">
              Global Attendance Rate
            </p>
            <h4 className="text-3xl font-extrabold text-[#14532D] mt-1">
              {stats.presentRate}%
            </h4>
            <p className="text-xs text-[#166534] mt-0.5">
              Based on {stats.totalRecords.toLocaleString()} session records this term
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#15803D]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="space-y-3">
          {/* Present */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium mb-1">
              <span className="flex items-center gap-1.5 text-[#1E293B]">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                Present On Time
              </span>
              <span className="font-semibold text-[#1E293B]">
                {stats.presentCount} ({stats.presentRate}%)
              </span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#22C55E] h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.presentRate}%` }}
              />
            </div>
          </div>

          {/* Late */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium mb-1">
              <span className="flex items-center gap-1.5 text-[#1E293B]">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                Late Arrivals
              </span>
              <span className="font-semibold text-[#1E293B]">
                {stats.lateCount} ({stats.lateRate}%)
              </span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#F59E0B] h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.lateRate}%` }}
              />
            </div>
          </div>

          {/* Excused */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium mb-1">
              <span className="flex items-center gap-1.5 text-[#1E293B]">
                <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                Excused (Authorized Leave)
              </span>
              <span className="font-semibold text-[#1E293B]">
                {stats.excusedCount} ({stats.excusedRate}%)
              </span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#3B82F6] h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.excusedRate}%` }}
              />
            </div>
          </div>

          {/* Unexcused Absences */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium mb-1">
              <span className="flex items-center gap-1.5 text-[#1E293B]">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                Unexcused Absences
              </span>
              <span className="font-semibold text-[#1E293B]">
                {stats.absentCount} ({stats.absentRate}%)
              </span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#EF4444] h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.absentRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Administrative Note */}
        <div className="pt-2 text-[11px] text-[#64748B] flex items-center gap-1.5 bg-[#F8FAFC] p-2.5 rounded-lg border border-[#F1F5F9]">
          <ShieldAlert className="w-4 h-4 text-[#4F6EF7] shrink-0" />
          <span>Automated SMS dispatched to parents for unexcused absences.</span>
        </div>
      </CardContent>
    </Card>
  );
};

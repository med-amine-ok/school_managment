'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Briefcase,
  BookOpen,
  Calendar,
  DollarSign,
  Plus,
  UserPlus,
  CreditCard,
  ClipboardCheck,
  Building2,
  CalendarPlus,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/dashboard/StatCard';
import { TodaySchedule } from '@/components/dashboard/TodaySchedule';
import { AttendanceWidget } from '@/components/dashboard/AttendanceWidget';
import { FinanceOverviewWidget } from '@/components/dashboard/FinanceOverviewWidget';
import { AlertsWidget } from '@/components/dashboard/AlertsWidget';
import { QuickActionModal } from '@/components/dashboard/QuickActionModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockStudents } from '@/data/students';
import { mockTeachers } from '@/data/teachers';
import { mockEmployees } from '@/data/employees';
import { mockSubjects } from '@/data/subjects';
import { mockSessions } from '@/data/sessions';
import { getFinancialKPIs, formatCurrency } from '@/lib/calculations/financial';

export default function DashboardPage() {
  const [quickActionModal, setQuickActionModal] = useState<{
    isOpen: boolean;
    tab: 'menu' | 'add_student' | 'schedule_session' | 'record_payment';
  }>({
    isOpen: false,
    tab: 'menu',
  });

  const kpis = getFinancialKPIs();
  const todaySessions = mockSessions.filter((s) => s.date === '2026-09-21');

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Welcome Banner & Top Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" size="sm" icon={<Sparkles className="w-3 h-3 text-[#4F6EF7]" />}>
                Academic Operations Hub
              </Badge>
              <span className="text-xs text-[#94A3B8]">•</span>
              <span className="text-xs font-medium text-[#64748B]">Monday, 21 September 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
              Good morning, Admin
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Here is your daily operational briefing for <span className="font-semibold text-[#1E293B]">El-Nadjah Academy</span>. All modules are synchronized.
            </p>
          </div>

          {/* Quick Action Ribbon */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickActionModal({ isOpen: true, tab: 'add_student' })}
              icon={<UserPlus className="w-4 h-4 text-[#4F6EF7]" />}
            >
              Add Student
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuickActionModal({ isOpen: true, tab: 'schedule_session' })}
              icon={<CalendarPlus className="w-4 h-4 text-[#14B8A6]" />}
            >
              Book Class
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setQuickActionModal({ isOpen: true, tab: 'record_payment' })}
              icon={<CreditCard className="w-4 h-4" />}
            >
              Record Payment
            </Button>
          </div>
        </div>

        {/* Top KPI Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          <StatCard
            title="Total Students"
            value={mockStudents.length}
            subtitle="Active enrollments"
            trend={{ value: '+4.8%', isPositive: true }}
            icon={<GraduationCap className="w-5 h-5 text-[#4F6EF7]" />}
            iconBgColor="bg-[#EEF2FF]"
          />

          <StatCard
            title="Faculty Staff"
            value={mockTeachers.length}
            subtitle="10 Teachers active"
            trend={{ value: '100% active', isNeutral: true }}
            icon={<Users className="w-5 h-5 text-[#0EA5E9]" />}
            iconBgColor="bg-[#F0F9FF]"
          />

          <StatCard
            title="School Staff"
            value={mockEmployees.length}
            subtitle="Admin & support"
            trend={{ value: 'All active', isNeutral: true }}
            icon={<Briefcase className="w-5 h-5 text-[#64748B]" />}
            iconBgColor="bg-[#F8FAFC]"
          />

          <StatCard
            title="Subjects Taught"
            value={mockSubjects.length}
            subtitle="16 Study groups"
            trend={{ value: '8 categories', isNeutral: true }}
            icon={<BookOpen className="w-5 h-5 text-[#7C3AED]" />}
            iconBgColor="bg-[#F5F3FF]"
          />

          <StatCard
            title="Today's Classes"
            value={todaySessions.length}
            subtitle="5 Classrooms booked"
            trend={{ value: 'Schedule set', isPositive: true }}
            icon={<Calendar className="w-5 h-5 text-[#14B8A6]" />}
            iconBgColor="bg-[#F0FDFA]"
          />

          <StatCard
            title="Monthly Revenue"
            value={formatCurrency(kpis.monthlyRevenue).replace(' DZD', '')}
            subtitle="DZD collected this mo."
            trend={{ value: '+12.5%', isPositive: true }}
            icon={<DollarSign className="w-5 h-5 text-[#15803D]" />}
            iconBgColor="bg-[#DCFCE7]"
          />
        </div>

        {/* Main Content Layout: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols wide on desktop): Today Schedule & Alerts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today Schedule Timeline */}
            <TodaySchedule
              onMarkAttendance={(sessionId) => {
                window.location.href = `/attendance?session=${sessionId}`;
              }}
            />

            {/* Operational Alerts & Action Items */}
            <AlertsWidget />
          </div>

          {/* Right Column (1 Col wide on desktop): Attendance & Finance */}
          <div className="space-y-6">
            {/* Live Financial Summary */}
            <FinanceOverviewWidget />

            {/* School Attendance Overview */}
            <AttendanceWidget />
          </div>
        </div>
      </div>

      {/* Interactive Quick Action Modal */}
      <QuickActionModal
        isOpen={quickActionModal.isOpen}
        onClose={() => setQuickActionModal({ isOpen: false, tab: 'menu' })}
        defaultAction={quickActionModal.tab}
      />
    </AppShell>
  );
}

'use client';

import React, { useState, use } from 'react';
import { notFound } from 'next/navigation';
import {
  User,
  BookOpen,
  Calendar,
  ClipboardCheck,
  CreditCard,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
  Building2,
  DollarSign,
  ArrowLeft,
  Users,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Tabs } from '@/components/ui/Tabs';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { mockTeachers } from '@/data/teachers';
import { mockGroups } from '@/data/groups';
import { mockSubjects } from '@/data/subjects';
import { mockRooms } from '@/data/rooms';
import { mockSessions } from '@/data/sessions';
import { mockEnrollments } from '@/data/enrollments';
import { calculateTeacherEarnings, formatCurrency } from '@/lib/calculations/financial';

interface TeacherProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function TeacherProfilePage({ params }: TeacherProfilePageProps) {
  const resolvedParams = use(params);
  const teacherId = resolvedParams.id;
  const [activeTab, setActiveTab] = useState('overview');

  const teacher = mockTeachers.find((t) => t.id === teacherId);
  if (!teacher) return notFound();

  const groups = mockGroups.filter((g) => g.teacherId === teacher.id && g.status === 'Active');
  const groupIds = groups.map((g) => g.id);
  const totalStudents = mockEnrollments.filter((e) => groupIds.includes(e.groupId) && e.status === 'Active').length;
  const earnings = calculateTeacherEarnings(teacher.id, '2026-09');
  const teacherSessions = mockSessions.filter((s) => s.teacherId === teacher.id);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'teaching', label: 'Groups & Teaching', icon: <BookOpen className="w-4 h-4" />, badge: groups.length },
    { id: 'schedule', label: 'Teaching Schedule', icon: <Calendar className="w-4 h-4" /> },
    { id: 'financial', label: 'Compensation & Payroll', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <AppShell>
      <div className="mb-4">
        <a
          href="/teachers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#4F6EF7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Teachers Directory
        </a>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <Avatar name={teacher.name} role="Teacher" size="xl" />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-[#1E293B]">{teacher.name}</h1>
                <Badge variant={teacher.status === 'Active' ? 'success' : 'neutral'} size="md">
                  {teacher.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B] mt-1.5">
                <span className="font-mono text-[#0EA5E9] font-bold">{teacher.teacherIdNumber}</span>
                <span>•</span>
                <span className="font-semibold text-[#1E293B]">{teacher.specialization}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#94A3B8]" /> {teacher.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              icon={<Calendar className="w-4 h-4 text-[#4F6EF7]" />}
              onClick={() => setActiveTab('schedule')}
            >
              View Schedule
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader title="Professional Profile" />
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#94A3B8] block">Date of Birth</span>
                    <span className="font-semibold text-[#1E293B] mt-0.5 block">{teacher.dateOfBirth}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block">Date of Hire</span>
                    <span className="font-semibold text-[#1E293B] mt-0.5 block">{teacher.hireDate}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block">Email</span>
                    <span className="font-semibold text-[#1E293B] mt-0.5 block">{teacher.email}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block">Address</span>
                    <span className="font-semibold text-[#1E293B] mt-0.5 block">{teacher.address}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-5 space-y-4">
                <h3 className="text-sm font-bold text-[#1E293B]">Faculty Summary</h3>
                <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7]">
                  <span className="text-xs text-[#15803D] font-medium block">Monthly Salary</span>
                  <span className="text-xl font-extrabold text-[#14532D] mt-0.5 block">
                    {formatCurrency(teacher.salary || earnings.total)}
                  </span>
                  <span className="text-[11px] text-[#166534]">
                    Fixed monthly academic compensation
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-xs text-[#64748B] font-medium block">Total Students Taught</span>
                  <span className="text-xl font-extrabold text-[#1E293B] mt-0.5 block">
                    {totalStudents} students
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">
                    Across {groups.length} active classes
                  </span>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Teaching Tab */}
        {activeTab === 'teaching' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => {
              const subject = mockSubjects.find((s) => s.id === group.subjectId);
              const room = mockRooms.find((r) => r.id === group.defaultRoomId);
              const studentCount = mockEnrollments.filter((e) => e.groupId === group.id && e.status === 'Active').length;

              return (
                <Card key={group.id} className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-[#1E293B]">{group.name}</h4>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: subject?.color || '#4F6EF7' }}
                    >
                      {subject?.name}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-[#64748B] mt-3">
                    <p>Classroom: <strong className="text-[#1E293B]">{room?.name}</strong></p>
                    <p>Enrolled: <strong className="text-[#1E293B]">{studentCount} students</strong></p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <Card>
            <CardHeader title="Teaching Calendar Sessions" subtitle="Upcoming and past teaching slots" />
            <CardContent className="divide-y divide-[#F1F5F9] p-0">
              {teacherSessions.slice(0, 10).map((session) => {
                const group = mockGroups.find((g) => g.id === session.groupId);
                const room = mockRooms.find((r) => r.id === session.roomId);
                return (
                  <div key={session.id} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#1E293B]">{group?.name}</span>
                      <p className="text-[#64748B] mt-0.5">
                        {session.date} • {session.startTime} to {session.endTime} ({session.durationMinutes}m)
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#64748B]">{room?.name}</span>
                      <Badge variant={session.status === 'Completed' ? 'success' : 'info'} size="sm">
                        {session.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Financial Tab */}
        {activeTab === 'financial' && (
          <Card>
            <CardHeader title="Faculty Salary & Compensation Ledger" subtitle="Fixed monthly salary and payroll records" />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs">
                  <span className="text-[#64748B] block">Monthly Base Salary</span>
                  <span className="text-base font-bold text-[#1E293B] mt-1 block">
                    {formatCurrency(teacher.salary || earnings.total)}
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">Fixed monthly contract</span>
                </div>
                <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs">
                  <span className="text-[#64748B] block">Delivered Sessions</span>
                  <span className="text-base font-bold text-[#1E293B] mt-1 block">
                    {earnings.sessionCount} sessions
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">Delivered this month</span>
                </div>
                <div className="p-4 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl text-xs">
                  <span className="text-[#15803D] block">Net Payable (Sept 2026)</span>
                  <span className="text-base font-extrabold text-[#14532D] mt-1 block">
                    {formatCurrency(teacher.salary || earnings.total)}
                  </span>
                  <span className="text-[11px] text-[#166534]">Status: Approved for payout</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <Card>
            <CardHeader title="Administrative & Performance Notes" />
            <CardContent>
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#64748B] leading-relaxed">
                {teacher.notes || 'High standard of curriculum delivery and student engagement.'}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

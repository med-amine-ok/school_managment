'use client';

import React, { useState, use } from 'react';
import { notFound } from 'next/navigation';
import {
  User,
  GraduationCap,
  Calendar,
  ClipboardCheck,
  CreditCard,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
  Building2,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  DollarSign,
  ArrowLeft,
  Plus,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Tabs } from '@/components/ui/Tabs';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { QuickActionModal } from '@/components/dashboard/QuickActionModal';
import { mockStudents } from '@/data/students';
import { mockEnrollments } from '@/data/enrollments';
import { mockSubjects } from '@/data/subjects';
import { mockGroups } from '@/data/groups';
import { mockTeachers } from '@/data/teachers';
import { mockRooms } from '@/data/rooms';
import { mockStudentPayments } from '@/data/payments';
import { mockAttendanceRecords } from '@/data/attendance';
import { mockSessions } from '@/data/sessions';
import { calculateStudentMonthlyFee, calculateOutstandingBalance, formatCurrency } from '@/lib/calculations/financial';
import { getStudentAttendanceSummary } from '@/lib/calculations/academic';

interface StudentProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function StudentProfilePage({ params }: StudentProfilePageProps) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;
  const [activeTab, setActiveTab] = useState('overview');
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);

  const student = mockStudents.find((s) => s.id === studentId);
  if (!student) {
    return notFound();
  }

  const enrollments = mockEnrollments.filter((e) => e.studentId === student.id && e.status === 'Active');
  const monthlyFee = calculateStudentMonthlyFee(student.id);
  const outstandingBalance = calculateOutstandingBalance(student.id);
  const attendance = getStudentAttendanceSummary(student.id);
  const payments = mockStudentPayments.filter((p) => p.studentId === student.id);
  const studentAttendanceRecords = mockAttendanceRecords.filter((a) => a.studentId === student.id);

  // Weekly schedule items for student
  const studentGroupIds = enrollments.map((e) => e.groupId);
  const studentGroups = mockGroups.filter((g) => studentGroupIds.includes(g.id));

  const scheduleEntries = studentGroups.flatMap((group) => {
    const subject = mockSubjects.find((s) => s.id === group.subjectId);
    const teacher = mockTeachers.find((t) => t.id === group.teacherId);
    const room = mockRooms.find((r) => r.id === group.defaultRoomId);

    return group.scheduleSlots.map((slot) => ({
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      subjectName: subject?.name || 'Subject',
      subjectColor: subject?.color || '#4F6EF7',
      groupName: group.name,
      teacherName: teacher?.name || 'Teacher',
      roomName: room?.name || 'Room',
    }));
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'academic', label: 'Academic & Courses', icon: <GraduationCap className="w-4 h-4" />, badge: enrollments.length },
    { id: 'schedule', label: 'Class Schedule', icon: <Calendar className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance History', icon: <ClipboardCheck className="w-4 h-4" />, badge: `${attendance.attendancePercentage}%` },
    { id: 'payments', label: 'Financial Ledger', icon: <CreditCard className="w-4 h-4" /> },
  
  ];

  return (
    <AppShell>
      {/* Back button */}
      <div className="mb-4">
        <a
          href="/students"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#4F6EF7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Students Directory
        </a>
      </div>

      {/* Student Hero Header */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <Avatar name={student.fullName} role="Student" size="xl" />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-[#1E293B]">{student.fullName}</h1>
                <Badge variant={student.status === 'Active' ? 'success' : 'neutral'} size="md">
                  {student.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B] mt-1.5">
                <span className="font-mono text-[#4F6EF7] font-bold">{student.studentIdNumber}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#94A3B8]" /> {student.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#94A3B8]" /> {student.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <Button
              variant="primary"
              size="sm"
              icon={<CreditCard className="w-4 h-4" />}
              onClick={() => setIsRecordPaymentOpen(true)}
            >
              Record Payment
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Personal & Guardian Info */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader title="Personal Information" />
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#94A3B8] block">Date of Birth</span>
                    <span className="font-semibold text-[#1E293B] mt-0.5 block">{student.dateOfBirth}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block">Gender</span>
                    <span className="font-semibold text-[#1E293B] mt-0.5 block">{student.gender}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block">Residential Address</span>
                    <span className="font-semibold text-[#1E293B] mt-0.5 block">{student.address}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block">Registration Date</span>
                    <span className="font-semibold text-[#1E293B] mt-0.5 block">{student.registrationDate}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Parent & Guardian Contacts" />
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#94A3B8] block">Primary Guardian</span>
                    <span className="font-semibold text-[#1E293B] mt-0.5 block">{student.parentName}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block">Parent Contact Phone</span>
                    <span className="font-semibold text-[#1E293B] mt-0.5 block">{student.parentPhone}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block">Parent Email</span>
                    <span className="font-semibold text-[#1E293B] mt-0.5 block">{student.parentEmail}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block">Emergency Line</span>
                    <span className="font-semibold text-[#EF4444] mt-0.5 block">{student.emergencyContact}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Col: Quick Metrics Card */}
            <div className="space-y-6">
              <Card className="p-5 space-y-4">
                <h3 className="text-sm font-bold text-[#1E293B]">Academic & Financial Status</h3>

                <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7]">
                  <span className="text-xs text-[#15803D] font-medium block">Monthly Subscription</span>
                  <span className="text-xl font-extrabold text-[#14532D] mt-0.5 block">
                    {formatCurrency(monthlyFee)}
                  </span>
                  <span className="text-[11px] text-[#166534]">
                    {enrollments.length} active subject enrollments
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-xs text-[#64748B] font-medium block">Attendance Performance</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xl font-extrabold text-[#1E293B]">
                      {attendance.attendancePercentage}%
                    </span>
                    <Badge variant="success" size="sm">
                      {attendance.present} Present / {attendance.totalSessions} Total
                    </Badge>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2]">
                  <span className="text-xs text-[#B91C1C] font-medium block">Outstanding Balance</span>
                  <span className="text-xl font-extrabold text-[#7F1D1D] mt-0.5 block">
                    {formatCurrency(outstandingBalance)}
                  </span>
                  <span className="text-[11px] text-[#991B1B]">
                    {outstandingBalance > 0 ? 'Payment reminder pending' : 'All subscriptions settled'}
                  </span>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Academic & Courses */}
        {activeTab === 'academic' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1E293B]">
              Active Subject Enrollments ({enrollments.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrollments.map((enr) => {
                const subject = mockSubjects.find((s) => s.id === enr.subjectId);
                const group = mockGroups.find((g) => g.id === enr.groupId);
                const teacher = mockTeachers.find((t) => t.id === group?.teacherId);
                const room = mockRooms.find((r) => r.id === group?.defaultRoomId);

                return (
                  <Card key={enr.id} className="p-5 border-l-4" style={{ borderLeftColor: subject?.color || '#4F6EF7' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                        {subject?.category}
                      </span>
                      <Badge variant="primary" size="sm">
                        {formatCurrency(enr.finalPrice)}/mo
                      </Badge>
                    </div>

                    <h4 className="text-base font-bold text-[#1E293B]">{subject?.name}</h4>
                    <p className="text-xs text-[#64748B] mt-0.5">{group?.name}</p>

                    <div className="mt-4 pt-3 border-t border-[#F1F5F9] space-y-1.5 text-xs text-[#64748B]">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span>Teacher: <strong className="text-[#1E293B]">{teacher?.name}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span>Facility: <strong className="text-[#1E293B]">{room?.name}</strong></span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Class Schedule */}
        {activeTab === 'schedule' && (
          <Card>
            <CardHeader
              title="Weekly Class Timetable"
              subtitle="All scheduled classes for enrolled subjects"
            />
            <CardContent className="divide-y divide-[#F1F5F9] p-0">
              {scheduleEntries.length === 0 ? (
                <div className="p-8 text-center text-[#94A3B8]">
                  <Calendar className="w-8 h-8 mx-auto text-[#CBD5E1] mb-2" />
                  <p className="text-sm">No scheduled classes found.</p>
                </div>
              ) : (
                scheduleEntries.map((entry, idx) => (
                  <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 self-stretch rounded-full" style={{ backgroundColor: entry.subjectColor }} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4F6EF7]">
                            {entry.dayOfWeek}
                          </span>
                          <span className="text-xs font-semibold text-[#1E293B] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                            {entry.startTime} – {entry.endTime}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#1E293B] mt-1">{entry.subjectName}</h4>
                        <p className="text-xs text-[#64748B]">{entry.groupName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#64748B] pl-4 sm:pl-0">
                      <span>Teacher: <strong className="text-[#1E293B]">{entry.teacherName}</strong></span>
                      <span>Room: <strong className="text-[#1E293B]">{entry.roomName}</strong></span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 4: Attendance */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* KPI Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl text-center">
                <span className="text-[11px] text-[#64748B] block">Total Sessions</span>
                <span className="text-lg font-bold text-[#1E293B]">{attendance.totalSessions}</span>
              </div>
              <div className="p-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl text-center">
                <span className="text-[11px] text-[#15803D] block">Present</span>
                <span className="text-lg font-bold text-[#166534]">{attendance.present}</span>
              </div>
              <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl text-center">
                <span className="text-[11px] text-[#B45309] block">Late</span>
                <span className="text-lg font-bold text-[#92400E]">{attendance.late}</span>
              </div>
              <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-center">
                <span className="text-[11px] text-[#B91C1C] block">Absent</span>
                <span className="text-lg font-bold text-[#991B1B]">{attendance.absent}</span>
              </div>
              <div className="p-3 bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl text-center">
                <span className="text-[11px] text-[#4338CA] block">Rate</span>
                <span className="text-lg font-bold text-[#3730A3]">{attendance.attendancePercentage}%</span>
              </div>
            </div>

            {/* Attendance Log Table */}
            <Card>
              <CardHeader title="Session Attendance Log" />
              <CardContent className="p-0">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase">
                    <tr>
                      <th className="p-3.5">Session ID</th>
                      <th className="p-3.5">Date & Time</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {studentAttendanceRecords.slice(0, 15).map((att) => (
                      <tr key={att.id} className="hover:bg-[#F8FAFC]">
                        <td className="p-3.5 font-mono text-[#64748B]">{att.sessionId}</td>
                        <td className="p-3.5 text-[#1E293B]">
                          {att.recordedAt.replace('T', ' ')}
                        </td>
                        <td className="p-3.5">
                          <Badge
                            variant={att.status === 'Present' ? 'success' : 'danger'}
                            size="sm"
                          >
                            {att.status}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-[#64748B]">{att.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 5: Payments */}
        {activeTab === 'payments' && (
          <Card>
            <CardHeader
              title="Tuition Billing & Receipts Ledger"
              subtitle={`Total outstanding balance: ${formatCurrency(outstandingBalance)}`}
              action={
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setIsRecordPaymentOpen(true)}
                >
                  Record Payment
                </Button>
              }
            />
            <CardContent className="p-0">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase">
                  <tr>
                    <th className="p-3.5">Receipt #</th>
                    <th className="p-3.5">Month</th>
                    <th className="p-3.5">Amount Due</th>
                    <th className="p-3.5">Amount Paid</th>
                    <th className="p-3.5">Remaining</th>
                    <th className="p-3.5">Method</th>
                    <th className="p-3.5">Payment Date</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F8FAFC]">
                      <td className="p-3.5 font-mono text-[#4F6EF7] font-semibold">{p.receiptNumber}</td>
                      <td className="p-3.5 font-semibold text-[#1E293B]">{p.month}</td>
                      <td className="p-3.5 font-medium text-[#1E293B]">{formatCurrency(p.amountDue)}</td>
                      <td className="p-3.5 font-bold text-[#15803D]">{formatCurrency(p.amountPaid)}</td>
                      <td className="p-3.5 font-bold text-[#DC2626]">
                        {p.remaining > 0 ? formatCurrency(p.remaining) : '0 DZD'}
                      </td>
                      <td className="p-3.5 text-[#64748B]">{p.paymentMethod}</td>
                      <td className="p-3.5 text-[#64748B]">{p.paymentDate || 'Pending'}</td>
                      <td className="p-3.5">
                        <Badge
                          variant={
                            p.status === 'Paid'
                              ? 'success'
                              : p.status === 'Partially Paid'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* Tab 6: Notes */}
        {activeTab === 'notes' && (
          <Card>
            <CardHeader title="Pedagogical & Administrative Observations" />
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <p className="text-xs font-semibold text-[#1E293B]">Academic Advisor Note</p>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  {student.notes || 'Student maintains good academic focus and active classroom participation.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1]">
                <p className="text-xs font-semibold text-[#0F766E]">Enrollment Note</p>
                <p className="text-xs text-[#115E59] mt-1">
                  Enrolled under standard secondary track with multi-course discount applied across Mathematics and Physics groups.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <QuickActionModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        defaultAction="record_payment"
      />
    </AppShell>
  );
}

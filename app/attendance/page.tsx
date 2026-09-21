'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  User,
  MapPin,
  Save,
  AlertTriangle,
  UserCheck,
  UserX,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { mockSessions } from '@/data/sessions';
import { mockStudents } from '@/data/students';
import { mockEnrollments } from '@/data/enrollments';
import { mockSubjects } from '@/data/subjects';
import { mockGroups } from '@/data/groups';
import { mockTeachers } from '@/data/teachers';
import { mockRooms } from '@/data/rooms';
import { mockAttendanceRecords } from '@/data/attendance';
import { AttendanceStatus } from '@/types/attendance';

function AttendanceContent() {
  const searchParams = useSearchParams();
  const initialSessionId = searchParams.get('session') || mockSessions[0]?.id || '';

  const [selectedSessionId, setSelectedSessionId] = useState<string>(initialSessionId);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active session details
  const session = useMemo(() => {
    return mockSessions.find((s) => s.id === selectedSessionId) || mockSessions[0];
  }, [selectedSessionId]);

  const subject = useMemo(() => mockSubjects.find((s) => s.id === session?.subjectId), [session]);
  const group = useMemo(() => mockGroups.find((g) => g.id === session?.groupId), [session]);
  const teacher = useMemo(() => mockTeachers.find((t) => t.id === session?.teacherId), [session]);
  const room = useMemo(() => mockRooms.find((r) => r.id === session?.roomId), [session]);

  // Students enrolled in this group
  const enrolledStudentIds = useMemo(() => {
    if (!group) return [];
    return mockEnrollments
      .filter((e) => e.groupId === group.id && e.status === 'Active')
      .map((e) => e.studentId);
  }, [group]);

  const students = useMemo(() => {
    return mockStudents.filter((s) => enrolledStudentIds.includes(s.id));
  }, [enrolledStudentIds]);

  // Attendance states for this session (strictly Present or Absent)
  const [studentStatuses, setStudentStatuses] = useState<Record<string, AttendanceStatus>>(() => {
    const map: Record<string, AttendanceStatus> = {};
    students.forEach((stu) => {
      const existing = mockAttendanceRecords.find(
        (a) => a.sessionId === session?.id && a.studentId === stu.id
      );
      map[stu.id] = existing?.status === 'Absent' ? 'Absent' : 'Present';
    });
    return map;
  });

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const markAllPresent = () => {
    const updated: Record<string, AttendanceStatus> = {};
    students.forEach((stu) => {
      updated[stu.id] = 'Present';
    });
    setStudentStatuses(updated);
  };

  const markAllAbsent = () => {
    const updated: Record<string, AttendanceStatus> = {};
    students.forEach((stu) => {
      updated[stu.id] = 'Absent';
    });
    setStudentStatuses(updated);
  };

  const handleSaveAttendance = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Live count summary
  const presentCount = students.filter((s) => (studentStatuses[s.id] || 'Present') === 'Present').length;
  const absentCount = students.filter((s) => studentStatuses[s.id] === 'Absent').length;
  const attendanceRate = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 100;

  return (
    <>
      <PageHeader
        title="Session Attendance Recording"
        subtitle="Record individual classroom attendance with binary Present / Absent status controls"
        breadcrumbs={[{ label: 'Academic' }, { label: 'Attendance' }]}
        badge={
          <Badge variant="primary" size="md">
            {students.length} Enrolled Students
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<CheckCircle2 className="w-4 h-4 text-[#15803D]" />}
              onClick={markAllPresent}
            >
              Mark All Present
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<XCircle className="w-4 h-4 text-[#EF4444]" />}
              onClick={markAllAbsent}
            >
              Mark All Absent
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Save className="w-4 h-4" />}
              onClick={handleSaveAttendance}
            >
              Save Attendance
            </Button>
          </div>
        }
      />

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-[#15803D]">
            <CheckCircle2 className="w-5 h-5" />
            <span>Attendance records saved successfully! Parent notification queue updated.</span>
          </div>
        </div>
      )}

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card className="p-3.5 bg-white border border-[#E2E8F0]">
          <span className="text-[11px] font-semibold text-[#64748B] block">Total Enrolled</span>
          <span className="text-xl font-extrabold text-[#1E293B] mt-0.5 block">{students.length}</span>
          <span className="text-[10px] text-[#94A3B8]">Class capacity</span>
        </Card>

        <Card className="p-3.5 bg-[#F0FDF4] border border-[#BBF7D0]">
          <span className="text-[11px] font-semibold text-[#15803D] block flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" /> Present
          </span>
          <span className="text-xl font-extrabold text-[#15803D] mt-0.5 block">{presentCount}</span>
          <span className="text-[10px] text-[#166534]">In attendance</span>
        </Card>

        <Card className="p-3.5 bg-[#FEF2F2] border border-[#FECACA]">
          <span className="text-[11px] font-semibold text-[#EF4444] block flex items-center gap-1">
            <UserX className="w-3.5 h-3.5" /> Absent
          </span>
          <span className="text-xl font-extrabold text-[#EF4444] mt-0.5 block">{absentCount}</span>
          <span className="text-[10px] text-[#991B1B]">Absent students</span>
        </Card>

        <Card className="p-3.5 bg-[#EEF2FF] border border-[#C7D2FE]">
          <span className="text-[11px] font-semibold text-[#4F6EF7] block">Attendance Rate</span>
          <span className="text-xl font-extrabold text-[#4F6EF7] mt-0.5 block">{attendanceRate}%</span>
          <span className="text-[10px] text-[#4338CA]">Present ratio</span>
        </Card>
      </div>

      {/* Session Selection Header Card */}
      <Card className="p-5 mb-6 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Active Session
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: subject?.color || '#4F6EF7' }}
              />
              <h2 className="text-lg font-bold text-[#1E293B]">
                {subject?.name} — {group?.name}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B] mt-2">
              <span className="flex items-center gap-1 font-semibold text-[#1E293B]">
                <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                {session?.date} ({session?.startTime} – {session?.endTime})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#94A3B8]" />
                {teacher?.name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                {room?.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-[#64748B] shrink-0 font-medium">Switch Session:</span>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white font-medium text-[#1E293B] max-w-xs"
            >
              {mockSessions.slice(0, 15).map((s) => {
                const sub = mockSubjects.find((sub) => sub.id === s.subjectId);
                const grp = mockGroups.find((g) => g.id === s.groupId);
                return (
                  <option key={s.id} value={s.id}>
                    {s.date} {s.startTime} — {sub?.name} ({grp?.name.split('(')[0]})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </Card>

      {/* Attendance Roster Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Marking Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {students.map((stu) => {
                const currentStatus = studentStatuses[stu.id] || 'Present';
                const isPresent = currentStatus === 'Present';

                return (
                  <tr key={stu.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={stu.fullName} role="Student" size="md" />
                        <div>
                          <a
                            href={`/students/${stu.id}`}
                            className="font-bold text-[#1E293B] hover:text-[#4F6EF7] transition-colors"
                          >
                            {stu.fullName}
                          </a>
                          <span className="text-[10px] font-mono text-[#94A3B8] block">
                            {stu.studentIdNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="text-xs font-medium text-[#1E293B]">{stu.phone}</p>
                      <p className="text-[11px] text-[#64748B]">{stu.parentName}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={isPresent ? 'success' : 'danger'}
                        size="md"
                      >
                        {currentStatus}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'Present')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isPresent
                              ? 'bg-[#15803D] text-white shadow-xs'
                              : 'bg-[#F1F5F9] text-[#15803D] hover:bg-[#DCFCE7]'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Present
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'Absent')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            !isPresent
                              ? 'bg-[#EF4444] text-white shadow-xs'
                              : 'bg-[#F1F5F9] text-[#EF4444] hover:bg-[#FEE2E2]'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

export default function AttendancePage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-sm text-[#64748B]">Loading attendance session...</div>}>
        <AttendanceContent />
      </Suspense>
    </AppShell>
  );
}

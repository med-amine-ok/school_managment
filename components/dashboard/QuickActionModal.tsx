'use client';

import React, { useState } from 'react';
import {
  UserPlus,
  CalendarPlus,
  CreditCard,
  ClipboardCheck,
  GraduationCap,
  Users,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { mockSubjects } from '@/data/subjects';
import { mockGroups } from '@/data/groups';
import { mockTeachers } from '@/data/teachers';
import { mockRooms } from '@/data/rooms';
import { mockStudents } from '@/data/students';
import { detectSessionConflicts, ConflictResult } from '@/lib/calculations/conflicts';
import { schoolService } from '@/lib/services/schoolService';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAction?: 'menu' | 'add_student' | 'schedule_session' | 'record_payment';
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  defaultAction = 'menu',
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'add_student' | 'schedule_session' | 'record_payment'>(defaultAction);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states for Add Student
  const [studentForm, setStudentForm] = useState({
    firstName: '',
    lastName: '',
    phone: '+213 55',
    parentName: '',
    parentPhone: '+213 66',
    email: '',
    gender: 'Male' as 'Male' | 'Female',
  });

  // Form states for Schedule Session
  const [sessionForm, setSessionForm] = useState({
    subjectId: mockSubjects[0]?.id || '',
    groupId: mockGroups[0]?.id || '',
    teacherId: mockTeachers[0]?.id || '',
    roomId: mockRooms[0]?.id || '',
    date: '2026-09-21',
    startTime: '16:00',
    endTime: '17:30',
  });

  // Form states for Record Payment
  const [paymentForm, setPaymentForm] = useState({
    studentId: mockStudents[0]?.id || '',
    amount: '3000',
    month: 'September 2026',
    method: 'Cash' as 'Cash' | 'Bank Transfer' | 'Card',
  });

  // Check conflicts live
  const conflictResult: ConflictResult = detectSessionConflicts({
    roomId: sessionForm.roomId,
    teacherId: sessionForm.teacherId,
    groupId: sessionForm.groupId,
    date: sessionForm.date,
    startTime: sessionForm.startTime,
    endTime: sessionForm.endTime,
  });

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.firstName || !studentForm.lastName) return;

    await schoolService.createStudent({
      firstName: studentForm.firstName,
      lastName: studentForm.lastName,
      fullName: `${studentForm.firstName} ${studentForm.lastName}`,
      dateOfBirth: '2008-01-01',
      gender: studentForm.gender,
      phone: studentForm.phone,
      email: studentForm.email || `${studentForm.firstName.toLowerCase()}.${studentForm.lastName.toLowerCase()}@gmail.com`,
      address: 'Alger, Algerie',
      parentName: studentForm.parentName || 'Parent Guardian',
      parentPhone: studentForm.parentPhone,
      parentEmail: 'parent@gmail.com',
      emergencyContact: studentForm.parentPhone,
      status: 'Active',
    });

    setSuccessMessage(`Student ${studentForm.firstName} ${studentForm.lastName} created successfully!`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
      setActiveTab('menu');
    }, 1500);
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (conflictResult.hasConflict) return;

    await schoolService.createSession({
      subjectId: sessionForm.subjectId,
      groupId: sessionForm.groupId,
      teacherId: sessionForm.teacherId,
      roomId: sessionForm.roomId,
      date: sessionForm.date,
      startTime: sessionForm.startTime,
      endTime: sessionForm.endTime,
      durationMinutes: 90,
      status: 'Scheduled',
    });

    setSuccessMessage('New class session booked and calendar updated!');
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
      setActiveTab('menu');
    }, 1500);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const student = mockStudents.find((s) => s.id === paymentForm.studentId);
    setSuccessMessage(`Payment of ${paymentForm.amount} DZD recorded for ${student?.fullName || 'student'}!`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
      setActiveTab('menu');
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        activeTab === 'menu'
          ? 'Fast Operational Actions'
          : activeTab === 'add_student'
          ? 'Register New Student'
          : activeTab === 'schedule_session'
          ? 'Schedule Classroom Session'
          : 'Record Tuition Payment'
      }
      subtitle={
        activeTab === 'menu'
          ? 'Select a routine administrative workflow to initiate'
          : undefined
      }
      maxWidth="lg"
    >
      {successMessage ? (
        <div className="p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#15803D] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-[#1E293B]">{successMessage}</h4>
          <p className="text-xs text-[#64748B]">All changes synchronized with local ledger.</p>
        </div>
      ) : activeTab === 'menu' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setActiveTab('add_student')}
            className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#4F6EF7] hover:bg-[#EEF2FF]/30 transition-all text-left flex items-start gap-3.5 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] text-[#4F6EF7] flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1E293B] group-hover:text-[#4F6EF7]">
                Add Student
              </h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Register profile, parents, and subject subscriptions.
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('schedule_session')}
            className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#4F6EF7] hover:bg-[#EEF2FF]/30 transition-all text-left flex items-start gap-3.5 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-[#F0FDFA] text-[#14B8A6] flex items-center justify-center shrink-0">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1E293B] group-hover:text-[#4F6EF7]">
                Schedule Session
              </h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Book a room, group & teacher with live conflict checks.
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('record_payment')}
            className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#4F6EF7] hover:bg-[#EEF2FF]/30 transition-all text-left flex items-start gap-3.5 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1E293B] group-hover:text-[#4F6EF7]">
                Record Payment
              </h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Issue student tuition receipt and update balance.
              </p>
            </div>
          </button>

          <a
            href="/attendance"
            onClick={onClose}
            className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#4F6EF7] hover:bg-[#EEF2FF]/30 transition-all text-left flex items-start gap-3.5 group cursor-pointer block"
          >
            <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1E293B] group-hover:text-[#4F6EF7]">
                Mark Attendance
              </h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Record present, late, or absent marks for today&apos;s classes.
              </p>
            </div>
          </a>
        </div>
      ) : activeTab === 'add_student' ? (
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">First Name *</label>
              <input
                type="text"
                required
                value={studentForm.firstName}
                onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
                placeholder="e.g. Walid"
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={studentForm.lastName}
                onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })}
                placeholder="e.g. Belkacem"
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Gender</label>
              <select
                value={studentForm.gender}
                onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value as 'Male' | 'Female' })}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Student Phone</label>
              <input
                type="text"
                value={studentForm.phone}
                onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Parent / Guardian Name</label>
              <input
                type="text"
                value={studentForm.parentName}
                onChange={(e) => setStudentForm({ ...studentForm, parentName: e.target.value })}
                placeholder="e.g. Djamel Belkacem"
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Parent Emergency Phone</label>
              <input
                type="text"
                value={studentForm.parentPhone}
                onChange={(e) => setStudentForm({ ...studentForm, parentPhone: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setActiveTab('menu')}>
              Back
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Complete Registration
            </Button>
          </div>
        </form>
      ) : activeTab === 'schedule_session' ? (
        <form onSubmit={handleCreateSession} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Subject</label>
              <select
                value={sessionForm.subjectId}
                onChange={(e) => setSessionForm({ ...sessionForm, subjectId: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 bg-white"
              >
                {mockSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Group / Class</label>
              <select
                value={sessionForm.groupId}
                onChange={(e) => setSessionForm({ ...sessionForm, groupId: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 bg-white"
              >
                {mockGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Assigned Teacher</label>
              <select
                value={sessionForm.teacherId}
                onChange={(e) => setSessionForm({ ...sessionForm, teacherId: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 bg-white"
              >
                {mockTeachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.specialization})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Facility / Room</label>
              <select
                value={sessionForm.roomId}
                onChange={(e) => setSessionForm({ ...sessionForm, roomId: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 bg-white"
              >
                {mockRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.capacity} seats)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Date</label>
              <input
                type="date"
                value={sessionForm.date}
                onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Start Time</label>
              <input
                type="time"
                value={sessionForm.startTime}
                onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">End Time</label>
              <input
                type="time"
                value={sessionForm.endTime}
                onChange={(e) => setSessionForm({ ...sessionForm, endTime: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20"
              />
            </div>
          </div>

          {/* Conflict Detection Banner */}
          {conflictResult.hasConflict ? (
            <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#DC2626]">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Scheduling Collision Detected!</span>
              </div>
              <ul className="list-disc pl-5 text-[#991B1B] text-[11px] space-y-0.5">
                {conflictResult.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs flex items-center gap-2 text-[#15803D]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Room and teacher are available! No scheduling conflict.</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setActiveTab('menu')}>
              Back
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={conflictResult.hasConflict}
            >
              Confirm Session Booking
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Select Student</label>
            <select
              value={paymentForm.studentId}
              onChange={(e) => setPaymentForm({ ...paymentForm, studentId: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 bg-white"
            >
              {mockStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.studentIdNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Amount (DZD)</label>
              <input
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">Month Covered</label>
              <input
                type="text"
                value={paymentForm.month}
                onChange={(e) => setPaymentForm({ ...paymentForm, month: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Cash', 'Bank Transfer', 'Card'] as const).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setPaymentForm({ ...paymentForm, method: m })}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-center cursor-pointer transition-all ${
                    paymentForm.method === m
                      ? 'border-[#4F6EF7] bg-[#EEF2FF] text-[#4F6EF7] font-bold'
                      : 'border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setActiveTab('menu')}>
              Back
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Issue Receipt & Save
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

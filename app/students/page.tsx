'use client';

import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  ExternalLink,
  Download,
  CreditCard,
  GraduationCap,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { CheckCircle2 } from 'lucide-react';
import { mockStudents } from '@/data/students';
import { mockEnrollments } from '@/data/enrollments';
import { mockSubjects } from '@/data/subjects';
import { calculateStudentMonthlyFee, formatCurrency } from '@/lib/calculations/financial';
import { getStudentAttendanceSummary } from '@/lib/calculations/academic';
import { schoolService } from '@/lib/services/schoolService';
import { Student } from '@/types/student';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([...mockStudents]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'name' | 'fee' | 'attendance'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '+213 55',
    parentName: '',
    parentPhone: '+213 66',
    email: '',
    gender: 'Male' as 'Male' | 'Female',
  });

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) return;

    const newStudent = await schoolService.createStudent({
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`,
      dateOfBirth: '2008-01-01',
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email || `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@gmail.com`,
      address: 'Alger, Algérie',
      parentName: formData.parentName || 'Parent Guardian',
      parentPhone: formData.parentPhone,
      parentEmail: 'parent@gmail.com',
      emergencyContact: formData.parentPhone,
      status: 'Active',
    });

    setStudents((prev) => [newStudent, ...prev]);
    setIsAddStudentOpen(false);
    setSuccessToast(`Student ${newStudent.fullName} (${newStudent.studentIdNumber}) registered successfully.`);
    setTimeout(() => setSuccessToast(null), 3000);
    setFormData({
      firstName: '',
      lastName: '',
      phone: '+213 55',
      parentName: '',
      parentPhone: '+213 66',
      email: '',
      gender: 'Male',
    });
  };

  // Enrich students with relational calculations
  const enrichedStudents = useMemo(() => {
    return students.map((student) => {
      const enrollments = mockEnrollments.filter((e) => e.studentId === student.id && e.status === 'Active');
      const monthlyFee = calculateStudentMonthlyFee(student.id);
      const attendance = getStudentAttendanceSummary(student.id);

      // Determine overall payment status
      const hasOverdue = enrollments.some((e) => e.paymentStatus === 'Overdue');
      const hasUnpaid = enrollments.some((e) => e.paymentStatus === 'Unpaid');
      const hasPartiallyPaid = enrollments.some((e) => e.paymentStatus === 'Partially Paid');
      const paymentStatus = hasOverdue
        ? 'Overdue'
        : hasUnpaid
        ? 'Unpaid'
        : hasPartiallyPaid
        ? 'Partially Paid'
        : 'Paid';

      const subjectDetails = enrollments.map((enr) => {
        const sub = mockSubjects.find((s) => s.id === enr.subjectId);
        return {
          name: sub?.name || 'Subject',
          color: sub?.color || '#4F6EF7',
        };
      });

      return {
        ...student,
        enrollments,
        monthlyFee,
        attendanceRate: attendance.attendancePercentage,
        paymentStatus,
        subjectDetails,
      };
    });
  }, []);

  // Filter & Search
  const filteredStudents = useMemo(() => {
    return enrichedStudents.filter((student) => {
      const matchesSearch =
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentIdNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.phone.includes(searchQuery);

      const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
      const matchesPayment = paymentFilter === 'All' || student.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [enrichedStudents, searchQuery, statusFilter, paymentFilter]);

  // Sort
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      if (sortField === 'name') {
        return sortOrder === 'asc'
          ? a.fullName.localeCompare(b.fullName)
          : b.fullName.localeCompare(a.fullName);
      }
      if (sortField === 'fee') {
        return sortOrder === 'asc' ? a.monthlyFee - b.monthlyFee : b.monthlyFee - a.monthlyFee;
      }
      if (sortField === 'attendance') {
        return sortOrder === 'asc'
          ? a.attendanceRate - b.attendanceRate
          : b.attendanceRate - a.attendanceRate;
      }
      return 0;
    });
  }, [filteredStudents, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (field: 'name' | 'fee' | 'attendance') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getPaymentBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Partially Paid':
        return 'warning';
      case 'Overdue':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Students Directory"
        subtitle={`Managing ${mockStudents.length} registered students across secondary study tracks`}
        breadcrumbs={[{ label: 'People' }, { label: 'Students' }]}
        badge={
          <Badge variant="primary" size="md">
            {filteredStudents.length} Students
          </Badge>
        }
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => alert('Student roster exported as CSV successfully.')}
            >
              Export
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={() => setIsAddStudentOpen(true)}
            >
              Add Student
            </Button>
          </>
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

      {/* Filter and Search Bar */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name, ID number, or phone..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 focus:border-[#4F6EF7]"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 font-medium text-[#1E293B]"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <span>Payment:</span>
              <select
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 font-medium text-[#1E293B]"
              >
                <option value="All">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-[#1E293B]">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <tr>
                <th
                  onClick={() => toggleSort('name')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#1E293B]"
                >
                  <div className="flex items-center gap-1">
                    <span>Student</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Enrolled Subjects</th>
                <th
                  onClick={() => toggleSort('attendance')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#1E293B]"
                >
                  <div className="flex items-center gap-1">
                    <span>Attendance</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('fee')}
                  className="py-3.5 px-4 cursor-pointer hover:text-[#1E293B]"
                >
                  <div className="flex items-center gap-1">
                    <span>Monthly Fee</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#94A3B8]">
                    <GraduationCap className="w-10 h-10 mx-auto text-[#CBD5E1] mb-2" />
                    <p className="text-sm font-semibold">No students match your search criteria</p>
                    <p className="text-xs mt-1">Try adjusting your keyword or filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-[#F8FAFC] transition-colors group cursor-pointer"
                    onClick={() => (window.location.href = `/students/${student.id}`)}
                  >
                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={student.fullName} role="Student" size="md" />
                        <div>
                          <p className="font-bold text-[#1E293B] group-hover:text-[#4F6EF7] transition-colors">
                            {student.fullName}
                          </p>
                          <span className="text-[11px] font-mono text-[#94A3B8]">
                            {student.studentIdNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <p className="text-xs font-medium text-[#1E293B]">{student.phone}</p>
                      <p className="text-[11px] text-[#64748B] truncate max-w-[140px]">
                        {student.parentName}
                      </p>
                    </td>

                    {/* Enrolled Subjects */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {student.subjectDetails.map((sub, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md text-white shrink-0"
                            style={{ backgroundColor: sub.color }}
                          >
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Attendance */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold ${
                            student.attendanceRate >= 90
                              ? 'text-[#15803D]'
                              : student.attendanceRate >= 80
                              ? 'text-[#B45309]'
                              : 'text-[#DC2626]'
                          }`}
                        >
                          {student.attendanceRate}%
                        </span>
                        <div className="w-16 bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              student.attendanceRate >= 90
                                ? 'bg-[#22C55E]'
                                : student.attendanceRate >= 80
                                ? 'bg-[#F59E0B]'
                                : 'bg-[#EF4444]'
                            }`}
                            style={{ width: `${student.attendanceRate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Monthly Fee */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-bold text-[#1E293B]">
                        {formatCurrency(student.monthlyFee)}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-4">
                      <Badge variant={getPaymentBadgeVariant(student.paymentStatus)} size="sm">
                        {student.paymentStatus}
                      </Badge>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={student.status === 'Active' ? 'success' : 'neutral'}
                        size="sm"
                      >
                        {student.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a
                        href={`/students/${student.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#4F6EF7] hover:underline"
                      >
                        <span>Profile</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, sortedStudents.length)} of{' '}
              {sortedStudents.length} students
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="px-3 font-semibold text-[#1E293B]">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        title="Register New Student"
        subtitle="Enroll a new student profile into the academy database"
        size="md"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                First Name (Prénom) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Yasmine"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Last Name (Nom) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Boumedienne"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Student Phone *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none bg-white"
              >
                <option value="Male">Male (Garçon)</option>
                <option value="Female">Female (Fille)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Parent / Guardian Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mohamed Boumedienne"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Parent Phone *
              </label>
              <input
                type="text"
                required
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F1F5F9]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddStudentOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<UserPlus className="w-4 h-4" />}
            >
              Register Student
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}

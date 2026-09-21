'use client';

import React, { useState, useMemo } from 'react';
import { UserCheck, Plus, Search, Filter, Percent, CheckCircle2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { mockEnrollments } from '@/data/enrollments';
import { mockStudents } from '@/data/students';
import { mockSubjects } from '@/data/subjects';
import { mockGroups } from '@/data/groups';
import { formatCurrency } from '@/lib/calculations/financial';
import { schoolService } from '@/lib/services/schoolService';
import { Enrollment, DiscountType } from '@/types/enrollment';

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([...mockEnrollments]);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    studentId: mockStudents[0]?.id || '',
    groupId: mockGroups[0]?.id || '',
    discountType: 'None' as DiscountType,
    discountValue: '0',
  });

  const enrichedEnrollments = useMemo(() => {
    return enrollments.map((enr) => {
      const student = mockStudents.find((s) => s.id === enr.studentId);
      const subject = mockSubjects.find((s) => s.id === enr.subjectId);
      const group = mockGroups.find((g) => g.id === enr.groupId);

      return {
        ...enr,
        student,
        subject,
        group,
      };
    });
  }, [enrollments]);

  const filteredEnrollments = useMemo(() => {
    return enrichedEnrollments.filter((e) => {
      const matchesSearch =
        e.student?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.student?.studentIdNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.subject?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.group?.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubject = subjectFilter === 'All' || e.subjectId === subjectFilter;

      return matchesSearch && matchesSubject;
    });
  }, [enrichedEnrollments, searchQuery, subjectFilter]);

  const getPaymentBadge = (status: string): BadgeVariant => {
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

  const handleCreateEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedGroup = mockGroups.find((g) => g.id === formData.groupId);
    const selectedSubject = mockSubjects.find((s) => s.id === selectedGroup?.subjectId);
    const basePrice = selectedSubject?.monthlyPrice || 3000;
    const discountVal = parseFloat(formData.discountValue) || 0;
    const finalPrice = Math.max(0, basePrice - discountVal);

    const newEnr = await schoolService.createEnrollment({
      studentId: formData.studentId,
      groupId: formData.groupId,
      subjectId: selectedGroup?.subjectId || mockSubjects[0].id,
      monthlyPrice: basePrice,
      discount: discountVal,
      discountType: formData.discountType,
      finalPrice,
      status: 'Active',
      paymentStatus: 'Unpaid',
    });

    setEnrollments((prev) => [newEnr, ...prev]);
    setIsAddModalOpen(false);
    setSuccessToast(`Student successfully enrolled with monthly fee ${formatCurrency(newEnr.finalPrice)}.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <AppShell>
      <PageHeader
        title="Student Subject Enrollments"
        subtitle={`Managing ${enrollments.length} active subject registrations with multi-course discounts`}
        breadcrumbs={[{ label: 'Academic' }, { label: 'Enrollments' }]}
        badge={
          <Badge variant="primary" size="md">
            {filteredEnrollments.length} Subscriptions
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            New Enrollment
          </Button>
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

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, ID, or subject..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 focus:border-[#4F6EF7]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="text-xs text-[#64748B]">Subject:</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white font-medium text-[#1E293B]"
            >
              <option value="All">All Subjects</option>
              {mockSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Enrollments Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Assigned Cohort Group</th>
                <th className="py-3.5 px-4">Start Date</th>
                <th className="py-3.5 px-4">Base Fee</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Final Fee (DZD)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredEnrollments.map((enr) => (
                <tr key={enr.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={enr.student?.fullName || 'Student'} role="Student" size="sm" />
                      <div>
                        <a
                          href={`/students/${enr.studentId}`}
                          className="font-bold text-[#1E293B] hover:text-[#4F6EF7] transition-colors"
                        >
                          {enr.student?.fullName}
                        </a>
                        <span className="text-[10px] font-mono text-[#94A3B8] block">
                          {enr.student?.studentIdNumber}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: enr.subject?.color || '#4F6EF7' }}
                    >
                      {enr.subject?.name}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-[#1E293B]">
                    {enr.group?.name}
                  </td>

                  <td className="py-3.5 px-4 text-[#64748B]">{enr.startDate}</td>

                  <td className="py-3.5 px-4 text-[#64748B]">{formatCurrency(enr.monthlyPrice)}</td>

                  <td className="py-3.5 px-4">
                    {enr.discountType && enr.discountType !== 'None' ? (
                      <span className="text-xs font-semibold text-[#15803D]">
                        -{formatCurrency(enr.discount)} ({enr.discountType})
                      </span>
                    ) : (
                      <span className="text-xs text-[#94A3B8]">None</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-extrabold text-[#1E293B]">
                    {formatCurrency(enr.finalPrice)}
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant={enr.status === 'Active' ? 'success' : 'neutral'} size="sm">
                      {enr.status}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant={getPaymentBadge(enr.paymentStatus)} size="sm">
                      {enr.paymentStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Enrollment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Student Subject Enrollment"
        subtitle="Subscribe a student to a course group with optional sibling discounts"
        size="md"
      >
        <form onSubmit={handleCreateEnrollment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Select Student *
            </label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none bg-white"
            >
              {mockStudents.map((stu) => (
                <option key={stu.id} value={stu.id}>
                  {stu.fullName} ({stu.studentIdNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Target Study Group *
            </label>
            <select
              value={formData.groupId}
              onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none bg-white"
            >
              {mockGroups.map((g) => {
                const sub = mockSubjects.find((s) => s.id === g.subjectId);
                return (
                  <option key={g.id} value={g.id}>
                    {g.name} — {sub?.name} ({formatCurrency(sub?.monthlyPrice || 3000)}/mo)
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Discount Category
              </label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as DiscountType })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none bg-white"
              >
                <option value="None">None (Full Tuition)</option>
                <option value="Sibling">Sibling Discount</option>
                <option value="Multi-subject">Multi-Subject Package</option>
                <option value="Scholarship">Merit Scholarship</option>
                <option value="Need-based">Social Aid Discount</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Discount Amount (DZD)
              </label>
              <input
                type="number"
                min="0"
                step="250"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F1F5F9]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
            >
              Enroll Student
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}

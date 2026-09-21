'use client';

import React, { useState, useMemo } from 'react';
import { CreditCard, Plus, Search, Filter, Download, ArrowUpDown, CheckCircle2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge, BadgeVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { mockStudentPayments } from '@/data/payments';
import { mockStudents } from '@/data/students';
import { formatCurrency } from '@/lib/calculations/financial';
import { schoolService } from '@/lib/services/schoolService';
import { StudentPayment, PaymentMethod } from '@/types/payment';

export default function StudentPaymentsPage() {
  const [payments, setPayments] = useState<StudentPayment[]>([...mockStudentPayments]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('All');
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    studentId: mockStudents[0]?.id || '',
    month: 'September 2026',
    amountDue: '3500',
    amountPaid: '3500',
    paymentMethod: 'BaridiMob' as PaymentMethod,
  });

  const enrichedPayments = useMemo(() => {
    return payments.map((payment) => {
      const student = mockStudents.find((s) => s.id === payment.studentId);
      return {
        ...payment,
        student,
      };
    });
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return enrichedPayments.filter((p) => {
      const matchesSearch =
        p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.student?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.student?.studentIdNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchesMonth = monthFilter === 'All' || p.month === monthFilter;

      return matchesSearch && matchesStatus && matchesMonth;
    });
  }, [enrichedPayments, searchQuery, statusFilter, monthFilter]);

  const getStatusBadge = (status: string): BadgeVariant => {
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

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const due = parseFloat(formData.amountDue) || 3500;
    const paid = parseFloat(formData.amountPaid) || 3500;
    const remaining = Math.max(0, due - paid);
    const status = remaining === 0 ? 'Paid' : paid > 0 ? 'Partially Paid' : 'Unpaid';

    const newPayment = await schoolService.recordStudentPayment({
      studentId: formData.studentId,
      enrollmentId: 'enr-custom',
      amountDue: due,
      amountPaid: paid,
      remaining,
      month: formData.month,
      paymentMethod: formData.paymentMethod,
      status,
    });

    setPayments((prev) => [newPayment, ...prev]);
    setIsRecordPaymentOpen(false);
    setSuccessToast(`Tuition receipt ${newPayment.receiptNumber} recorded successfully for ${formatCurrency(newPayment.amountPaid)}.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <AppShell>
      <PageHeader
        title="Student Tuition & Payments Ledger"
        subtitle={`Audit of all monthly subscription fees, receipts, and outstanding tuition balances in DZD`}
        breadcrumbs={[{ label: 'Finance' }, { label: 'Student Payments' }]}
        badge={
          <Badge variant="primary" size="md">
            {filteredPayments.length} Receipts
          </Badge>
        }
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => alert('Receipts statement exported.')}
            >
              Export Ledger
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsRecordPaymentOpen(true)}
            >
              Record Payment
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

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by receipt number, student name, or student ID..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 focus:border-[#4F6EF7]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-[#64748B]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white font-medium text-[#1E293B]"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Receipt #</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Month</th>
                <th className="py-3.5 px-4">Due (DZD)</th>
                <th className="py-3.5 px-4">Paid (DZD)</th>
                <th className="py-3.5 px-4">Remaining</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredPayments.slice(0, 30).map((payment) => (
                <tr key={payment.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#4F6EF7]">
                    {payment.receiptNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <a
                      href={`/students/${payment.studentId}`}
                      className="font-bold text-[#1E293B] hover:text-[#4F6EF7] transition-colors"
                    >
                      {payment.student?.fullName}
                    </a>
                    <span className="text-[10px] font-mono text-[#94A3B8] block">
                      {payment.student?.studentIdNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#1E293B]">{payment.month}</td>
                  <td className="py-3.5 px-4 text-[#1E293B]">{formatCurrency(payment.amountDue)}</td>
                  <td className="py-3.5 px-4 font-bold text-[#15803D]">
                    {formatCurrency(payment.amountPaid)}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#DC2626]">
                    {payment.remaining > 0 ? formatCurrency(payment.remaining) : '0 DZD'}
                  </td>
                  <td className="py-3.5 px-4 text-[#64748B]">{payment.paymentMethod}</td>
                  <td className="py-3.5 px-4 text-[#64748B]">{payment.paymentDate || '—'}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={getStatusBadge(payment.status)} size="sm">
                      {payment.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        title="Record Student Tuition Payment"
        subtitle="Issue official receipt for tuition collection via cash, BaridiMob, or bank deposit"
        size="md"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Subscription Month *
              </label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none bg-white"
              >
                <option value="September 2026">September 2026</option>
                <option value="October 2026">October 2026</option>
                <option value="November 2026">November 2026</option>
                <option value="December 2026">December 2026</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Payment Channel *
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none bg-white"
              >
                <option value="Cash">Cash at Counter</option>
                <option value="BaridiMob">BaridiMob (Algerie Poste)</option>
                <option value="CCP">CCP Transfer</option>
                <option value="Bank Transfer">Bank Transfer (BNA/BEA)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Total Due (DZD) *
              </label>
              <input
                type="number"
                required
                min="500"
                step="500"
                value={formData.amountDue}
                onChange={(e) => setFormData({ ...formData, amountDue: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Amount Paid (DZD) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="500"
                value={formData.amountPaid}
                onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F1F5F9]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRecordPaymentOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
            >
              Issue Receipt
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}

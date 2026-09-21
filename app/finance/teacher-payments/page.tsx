'use client';

import React, { useState } from 'react';
import { Banknote, Download, CheckCircle2, Search, DollarSign } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { mockTeachers } from '@/data/teachers';
import { calculateTeacherEarnings, formatCurrency } from '@/lib/calculations/financial';

export default function TeacherPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [payoutSuccess, setPayoutSuccess] = useState<string | null>(null);

  const teacherLedger = mockTeachers.map((teacher) => {
    const earnings = calculateTeacherEarnings(teacher.id, '2026-09');
    return {
      teacher,
      earnings,
    };
  });

  const filteredLedger = teacherLedger.filter(
    ({ teacher }) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPayroll = teacherLedger.reduce((sum, item) => sum + item.earnings.total, 0);

  const handleDisbursePayout = (teacherName: string) => {
    setPayoutSuccess(`Monthly salary disbursement for ${teacherName} transferred successfully.`);
    setTimeout(() => setPayoutSuccess(null), 3500);
  };

  return (
    <AppShell>
      <PageHeader
        title="Faculty Salaries & Compensation"
        subtitle="Monthly fixed payroll processing and disbursement records for academic staff"
        breadcrumbs={[
          { label: 'Finance' },
          { label: 'Teacher Payments' },
        ]}
        badge={
          <Badge variant="primary" size="md">
            Total Monthly Faculty Payroll: {formatCurrency(totalPayroll)}
          </Badge>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => alert('Faculty payroll sheet exported as PDF.')}
          >
            Export Sheet
          </Button>
        }
      />

      {payoutSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-2 text-xs font-bold text-[#15803D]">
          <CheckCircle2 className="w-5 h-5" />
          <span>{payoutSuccess}</span>
        </div>
      )}

      {/* Search Filter */}
      <Card className="p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search faculty instructor by name or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]"
          />
        </div>
      </Card>

      {/* Faculty Payroll Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Instructor</th>
                <th className="py-3.5 px-4">Specialization</th>
                <th className="py-3.5 px-4">Monthly Salary (DZD)</th>
                <th className="py-3.5 px-4">Classes Delivered</th>
                <th className="py-3.5 px-4">Payroll Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredLedger.map(({ teacher, earnings }) => (
                <tr key={teacher.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={teacher.name} role="Teacher" size="sm" />
                      <div>
                        <span className="font-bold text-[#1E293B] block">{teacher.name}</span>
                        <span className="text-[10px] font-mono text-[#94A3B8]">
                          {teacher.teacherIdNumber}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#1E293B]">{teacher.specialization}</td>

                  <td className="py-3.5 px-4 font-extrabold text-[#15803D]">
                    {formatCurrency(earnings.total)}
                  </td>

                  <td className="py-3.5 px-4 text-[#64748B]">
                    {earnings.sessionCount} sessions completed
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant="success" size="sm">
                      Approved
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisbursePayout(teacher.name)}
                    >
                      Disburse Salary
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}

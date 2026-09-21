'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  Search,
  CheckCircle2,
  Download,
  Briefcase,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { mockEmployees } from '@/data/employees';
import { formatCurrency } from '@/lib/calculations/financial';

export default function EmployeeSalariesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [payoutSuccess, setPayoutSuccess] = useState<string | null>(null);

  const totalStaffPayroll = mockEmployees
    .filter((e) => e.status === 'Active')
    .reduce((acc, e) => acc + e.salary, 0);

  const filteredEmployees = mockEmployees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDisburse = (name: string) => {
    setPayoutSuccess(`Salary bank transfer initiated for ${name} via BNA.`);
    setTimeout(() => setPayoutSuccess(null), 2500);
  };

  return (
    <AppShell>
      <PageHeader
        title="Staff Payroll & Salary Disbursements"
        subtitle={`September 2026 payroll summary for 7 staff members: ${formatCurrency(totalStaffPayroll)}`}
        breadcrumbs={[{ label: 'Finance' }, { label: 'Employee Salaries' }]}
        badge={
          <Badge variant="primary" size="md">
            7 Disbursed
          </Badge>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => alert('Staff salary statements exported.')}
          >
            Export Payroll
          </Button>
        }
      />

      {payoutSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-2 text-xs font-bold text-[#15803D]">
          <CheckCircle2 className="w-5 h-5" />
          <span>{payoutSuccess}</span>
        </div>
      )}

      {/* Staff Payroll Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Base Monthly Salary</th>
                <th className="py-3.5 px-4">Deductions / Tax</th>
                <th className="py-3.5 px-4">Net Disbursed (DZD)</th>
                <th className="py-3.5 px-4">Disbursement Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Transfer Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={emp.name} role="Staff" size="sm" />
                      <div>
                        <span className="font-bold text-[#1E293B] block">{emp.name}</span>
                        <span className="text-[10px] font-mono text-[#94A3B8]">
                          {emp.employeeIdNumber}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant="neutral" size="sm">
                      {emp.role}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-[#1E293B]">
                    {formatCurrency(emp.salary)}
                  </td>

                  <td className="py-3.5 px-4 text-[#64748B]">0 DZD</td>

                  <td className="py-3.5 px-4 font-extrabold text-[#15803D]">
                    {formatCurrency(emp.salary)}
                  </td>

                  <td className="py-3.5 px-4 text-[#64748B]">2026-09-20</td>

                  <td className="py-3.5 px-4">
                    <Badge variant="success" size="sm">
                      Disbursed
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisburse(emp.name)}
                    >
                      Receipt
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

'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  AlertCircle,
  Receipt,
  Download,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/dashboard/StatCard';
import { MonthlyComparisonChart, RevenueBySubjectChart } from '@/components/charts/FinanceCharts';
import { getFinancialKPIs, calculateMonthlyRevenue, calculateMonthlyExpenses, formatCurrency } from '@/lib/calculations/financial';
import { mockSubjects } from '@/data/subjects';
import { mockEnrollments } from '@/data/enrollments';
import { mockExpenses } from '@/data/expenses';

export default function FinanceDashboardPage() {
  const [selectedRange, setSelectedRange] = useState<'month' | 'quarter' | 'year'>('month');
  const kpis = getFinancialKPIs();

  // Multi-month comparison data
  const monthlyData = [
    {
      month: 'July 2026',
      revenue: calculateMonthlyRevenue('July 2026'),
      expenses: calculateMonthlyExpenses('2026-07'),
    },
    {
      month: 'August 2026',
      revenue: calculateMonthlyRevenue('August 2026'),
      expenses: calculateMonthlyExpenses('2026-08'),
    },
    {
      month: 'September 2026',
      revenue: calculateMonthlyRevenue('September 2026'),
      expenses: calculateMonthlyExpenses('2026-09'),
    },
  ];

  // Subject yield data
  const subjectYields = mockSubjects.map((sub) => {
    const enrollments = mockEnrollments.filter(
      (e) => e.subjectId === sub.id && e.status === 'Active'
    );
    const rev = enrollments.reduce((acc, e) => acc + e.finalPrice, 0);
    return {
      name: sub.name,
      revenue: rev,
      color: sub.color,
      count: enrollments.length,
    };
  });

  // Expense categories breakdown
  const expenseCategories = ['Rent', 'Salaries', 'Teacher Payments', 'Electricity', 'Supplies', 'Maintenance'];
  const expensesByCategory = expenseCategories.map((cat) => {
    const total = mockExpenses
      .filter((e) => e.category === cat && e.date.startsWith('2026-09'))
      .reduce((acc, e) => acc + e.amount, 0);
    return { category: cat, total };
  });

  return (
    <AppShell>
      <PageHeader
        title="Financial Intelligence & Ledger"
        subtitle="Executive cash flow analytics, tuition yields, payroll disbursements, and operating expenses (DZD)"
        breadcrumbs={[{ label: 'Finance' }, { label: 'Analytics' }]}
        badge={
          <Badge variant="primary" size="md">
            Academic Year 2025/2026
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => alert('Exporting complete financial statement as PDF.')}
            >
              Export Statement
            </Button>
            <a
              href="/finance/student-payments"
              className="inline-flex items-center justify-center font-medium rounded-lg text-xs px-3.5 py-2 gap-2 bg-[#4F6EF7] hover:bg-[#3B4FD9] text-white transition-colors cursor-pointer"
            >
              <CreditCard className="w-4 h-4" /> Collect Tuition
            </a>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Monthly Collections"
          value={formatCurrency(kpis.monthlyRevenue).replace(' DZD', '')}
          subtitle="DZD received in Sept"
          trend={{ value: '+12.4%', isPositive: true }}
          icon={<DollarSign className="w-5 h-5 text-[#15803D]" />}
          iconBgColor="bg-[#DCFCE7]"
        />

        <StatCard
          title="Operating Expenses"
          value={formatCurrency(kpis.monthlyExpenses).replace(' DZD', '')}
          subtitle="DZD paid in Sept"
          trend={{ value: 'Within budget', isNeutral: true }}
          icon={<Receipt className="w-5 h-5 text-[#B91C1C]" />}
          iconBgColor="bg-[#FEE2E2]"
        />

        <StatCard
          title="Net Cash Flow"
          value={formatCurrency(kpis.netRevenue).replace(' DZD', '')}
          subtitle="DZD net balance"
          trend={{ value: 'Healthy reserves', isPositive: true }}
          icon={<Wallet className="w-5 h-5 text-[#4F6EF7]" />}
          iconBgColor="bg-[#EEF2FF]"
        />

        <StatCard
          title="Outstanding Receivable"
          value={formatCurrency(kpis.outstandingPayments).replace(' DZD', '')}
          subtitle="Uncollected tuition balance"
          trend={{ value: `${kpis.collectionRate}% collected`, isPositive: false }}
          icon={<AlertCircle className="w-5 h-5 text-[#B45309]" />}
          iconBgColor="bg-[#FEF3C7]"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue vs Expenses Trend (2 cols) */}
        <Card className="lg:col-span-2 p-6">
          <CardHeader
            title="Revenue vs Operating Expenses"
            subtitle="Quarterly cash flow comparison across July, August, and September 2026"
            className="p-0 border-b-0 mb-4"
          />
          <MonthlyComparisonChart data={monthlyData} />
        </Card>

        {/* Revenue by Subject (1 col) */}
        <Card className="p-6">
          <CardHeader
            title="Revenue by Subject Track"
            subtitle="Tuition distribution across academic disciplines"
            className="p-0 border-b-0 mb-4"
          />
          <RevenueBySubjectChart subjects={subjectYields} />
        </Card>
      </div>

      {/* Expenses Breakdown & Payroll Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Operating Expenses */}
        <Card>
          <CardHeader
            title="September Operating Expenses by Category"
            subtitle="Facility lease, Sonelgaz utilities, laboratory supplies, and upkeep"
          />
          <CardContent className="space-y-3">
            {expensesByCategory.map((exp) => (
              <div key={exp.category} className="flex items-center justify-between text-xs py-1 border-b border-[#F1F5F9]">
                <span className="font-semibold text-[#1E293B]">{exp.category}</span>
                <span className="font-mono font-bold text-[#64748B]">{formatCurrency(exp.total)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payroll Summary */}
        <Card>
          <CardHeader
            title="Institutional Payroll Breakdown"
            subtitle="Compensation for faculty instructors and administrative staff"
          />
          <CardContent className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Staff Salaries (7 Employees):</span>
                <strong className="text-[#1E293B] font-mono">{formatCurrency(kpis.employeePayroll)}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Faculty Payroll (10 Instructors):</span>
                <strong className="text-[#1E293B] font-mono">{formatCurrency(kpis.teacherPayroll)}</strong>
              </div>
              <div className="pt-2 border-t border-[#CBD5E1] flex items-center justify-between font-bold">
                <span className="text-[#1E293B]">Total Institutional Payroll:</span>
                <span className="text-[#15803D] font-mono">
                  {formatCurrency(kpis.employeePayroll + kpis.teacherPayroll)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              * Faculty compensation incorporates fixed monthly base rates combined with delivered session hours.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

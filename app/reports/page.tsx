'use client';

import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  GraduationCap,
  Users,
  DollarSign,
  ClipboardCheck,
  FileSpreadsheet,
  Printer,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { mockStudents } from '@/data/students';
import { mockTeachers } from '@/data/teachers';
import { getFinancialKPIs, formatCurrency } from '@/lib/calculations/financial';
import { getSchoolAttendanceOverview } from '@/lib/calculations/academic';

export default function ReportsPage() {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const kpis = getFinancialKPIs();
  const attStats = getSchoolAttendanceOverview();

  const handleExport = (reportType: string) => {
    setDownloadNotice(`${reportType} compiled and downloaded successfully.`);
    setTimeout(() => setDownloadNotice(null), 2500);
  };

  const reportCards = [
    {
      id: 'financial',
      title: 'Institutional Financial Statement',
      category: 'Finance & Accounting',
      description: 'Comprehensive cash flow statement, tuition collections, staff/faculty payroll, and overhead expenses in DZD.',
      metrics: [
        { label: 'Monthly Revenue', value: formatCurrency(kpis.monthlyRevenue) },
        { label: 'Operating Expenses', value: formatCurrency(kpis.monthlyExpenses) },
        { label: 'Net Cash Flow', value: formatCurrency(kpis.netRevenue) },
      ],
      icon: <DollarSign className="w-5 h-5 text-[#15803D]" />,
      iconBg: 'bg-[#DCFCE7]',
    },
    {
      id: 'attendance',
      title: 'Term Attendance & Punctuality Audit',
      category: 'Academic Compliance',
      description: 'Classroom attendance analytics across cohorts, identifying presence rates, late arrivals, and unexcused absences.',
      metrics: [
        { label: 'Global Attendance', value: `${attStats.presentRate}%` },
        { label: 'Late Arrivals', value: `${attStats.lateCount} (${attStats.lateRate}%)` },
        { label: 'Unexcused Absences', value: `${attStats.absentCount}` },
      ],
      icon: <ClipboardCheck className="w-5 h-5 text-[#4F6EF7]" />,
      iconBg: 'bg-[#EEF2FF]',
    },
    {
      id: 'student_roster',
      title: 'Student Enrollment & Tuition Roster',
      category: 'Registrar Office',
      description: 'Roster of 36 students, guardian contact phone directory, active course subscriptions, and payment statuses.',
      metrics: [
        { label: 'Active Students', value: `${mockStudents.length}` },
        { label: 'Tuition Rate', value: '100% Registered' },
        { label: 'Outstanding Balance', value: formatCurrency(kpis.outstandingPayments) },
      ],
      icon: <GraduationCap className="w-5 h-5 text-[#0EA5E9]" />,
      iconBg: 'bg-[#F0F9FF]',
    },
    {
      id: 'faculty_hours',
      title: 'Faculty Teaching Hours & Payroll Audit',
      category: 'Human Resources',
      description: 'Detailed log of curriculum hours delivered, session counts, and monthly compensation disbursements.',
      metrics: [
        { label: 'Faculty Members', value: `${mockTeachers.length}` },
        { label: 'Faculty Payroll', value: formatCurrency(kpis.teacherPayroll) },
        { label: 'Staff Payroll', value: formatCurrency(kpis.employeePayroll) },
      ],
      icon: <Users className="w-5 h-5 text-[#7C3AED]" />,
      iconBg: 'bg-[#F5F3FF]',
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Official Reports & Institutional Audits"
        subtitle="Export official administrative statements, pedagogical compliance audits, and financial dossiers"
        breadcrumbs={[{ label: 'Reports' }]}
        badge={
          <Badge variant="primary" size="md">
            4 Audit Dossiers
          </Badge>
        }
      />

      {downloadNotice && (
        <div className="mb-6 p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-between text-xs font-bold text-[#15803D]">
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCards.map((report) => (
          <Card key={report.id} className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${report.iconBg}`}>
                  {report.icon}
                </div>
                <Badge variant="neutral" size="sm">
                  {report.category}
                </Badge>
              </div>

              <h3 className="text-base font-bold text-[#1E293B]">{report.title}</h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                {report.description}
              </p>

              {/* Key Metrics Pill Grid */}
              <div className="grid grid-cols-3 gap-2 mt-5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                {report.metrics.map((m, idx) => (
                  <div key={idx}>
                    <span className="text-[10px] text-[#94A3B8] uppercase block">{m.label}</span>
                    <span className="text-xs font-bold text-[#1E293B] mt-0.5 block truncate">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                icon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => handleExport(`${report.title} (Print Format)`)}
              >
                Print Preview
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Download className="w-3.5 h-3.5" />}
                onClick={() => handleExport(`${report.title} (CSV & PDF)`)}
              >
                Download CSV/PDF
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

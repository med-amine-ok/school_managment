import { mockEnrollments } from '@/data/enrollments';
import { mockStudentPayments } from '@/data/payments';
import { mockExpenses } from '@/data/expenses';
import { mockTeachers } from '@/data/teachers';
import { mockEmployees } from '@/data/employees';
import { mockSessions } from '@/data/sessions';
import { FinancialKPIs } from '@/types/finance';

/**
 * Format number into Algerian Dinar format (e.g., "120,000 DZD")
 */
export function formatCurrency(amount: number): string {
  return `${new Intl.NumberFormat('fr-DZ', {
    maximumFractionDigits: 0,
  }).format(amount)} DZD`;
}

/**
 * Calculates a student's total monthly tuition based on active enrollments minus discounts.
 */
export function calculateStudentMonthlyFee(studentId: string): number {
  return mockEnrollments
    .filter((e) => e.studentId === studentId && e.status === 'Active')
    .reduce((total, e) => total + e.finalPrice, 0);
}

/**
 * Calculates a student's total unpaid / overdue balance across all payment records.
 */
export function calculateOutstandingBalance(studentId: string): number {
  return mockStudentPayments
    .filter((p) => p.studentId === studentId)
    .reduce((total, p) => total + p.remaining, 0);
}

/**
 * Calculates monthly revenue received from student payments for a given month code (e.g. "September 2026").
 */
export function calculateMonthlyRevenue(monthName: string): number {
  return mockStudentPayments
    .filter((p) => p.month.toLowerCase().includes(monthName.toLowerCase()))
    .reduce((total, p) => total + p.amountPaid, 0);
}

/**
 * Calculates total operating expenses for a given month (e.g. "2026-09").
 */
export function calculateMonthlyExpenses(monthPrefix: string): number {
  return mockExpenses
    .filter((e) => e.date.startsWith(monthPrefix) && e.status === 'Paid')
    .reduce((total, e) => total + e.amount, 0);
}

/**
 * Calculates net revenue (Revenue - Expenses) for a month.
 */
export function calculateNetRevenue(monthName: string, monthPrefix: string): number {
  const rev = calculateMonthlyRevenue(monthName);
  const exp = calculateMonthlyExpenses(monthPrefix);
  return rev - exp;
}

/**
 * Computes teacher compensation for a month: monthly fixed salary in DZD.
 */
export function calculateTeacherEarnings(teacherId: string, monthPrefix: string = '2026-09'): {
  base: number;
  sessionCount: number;
  sessionPay: number;
  total: number;
} {
  const teacher = mockTeachers.find((t) => t.id === teacherId);
  if (!teacher) return { base: 0, sessionCount: 0, sessionPay: 0, total: 0 };

  const completedSessions = mockSessions.filter(
    (s) => s.teacherId === teacherId && s.date.startsWith(monthPrefix) && (s.status === 'Completed' || s.status === 'Scheduled')
  ).length;

  const salary = teacher.salary || teacher.baseSalary || 75000;

  return {
    base: salary,
    sessionCount: completedSessions,
    sessionPay: 0,
    total: salary,
  };
}

/**
 * Aggregates high-level financial KPIs calculated strictly from underlying records.
 */
export function getFinancialKPIs(): FinancialKPIs {
  const currentMonth = 'September 2026';
  const currentPrefix = '2026-09';

  const monthlyPayments = mockStudentPayments.filter((p) => p.month === currentMonth);
  const totalDueThisMonth = monthlyPayments.reduce((acc, p) => acc + p.amountDue, 0);
  const monthlyRevenue = monthlyPayments.reduce((acc, p) => acc + p.amountPaid, 0);

  const totalRevenue = mockStudentPayments.reduce((acc, p) => acc + p.amountPaid, 0);
  const monthlyExpenses = calculateMonthlyExpenses(currentPrefix);

  const outstandingPayments = mockStudentPayments.reduce((acc, p) => acc + p.remaining, 0);

  // Teacher payroll
  const teacherPayroll = mockTeachers.reduce((acc, t) => {
    return acc + calculateTeacherEarnings(t.id, currentPrefix).total;
  }, 0);

  // Employee payroll
  const employeePayroll = mockEmployees
    .filter((e) => e.status === 'Active')
    .reduce((acc, e) => acc + e.salary, 0);

  // Monthly Recurring Revenue (sum of all active enrollments)
  const mrr = mockEnrollments
    .filter((e) => e.status === 'Active')
    .reduce((acc, e) => acc + e.finalPrice, 0);

  const collectionRate = totalDueThisMonth > 0 ? Math.round((monthlyRevenue / totalDueThisMonth) * 100) : 100;

  return {
    totalRevenue,
    monthlyRevenue,
    monthlyExpenses,
    netRevenue: monthlyRevenue - monthlyExpenses,
    outstandingPayments,
    teacherPayroll,
    employeePayroll,
    mrr,
    collectionRate,
  };
}

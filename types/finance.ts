export type ExpenseCategory =
  | 'Teacher Payments'
  | 'Salaries'
  | 'Rent'
  | 'Electricity'
  | 'Equipment'
  | 'Maintenance'
  | 'Supplies'
  | 'Other';

export interface Expense {
  id: string;
  referenceNumber: string; // e.g. EXP-2026-012
  title: string;
  category: ExpenseCategory;
  amount: number; // in DZD
  date: string; // YYYY-MM-DD
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Card' | 'Cheque';
  status: 'Paid' | 'Pending';
  notes?: string;
}

export interface TeacherPaymentRecord {
  id: string;
  teacherId: string;
  month: string; // e.g. "2026-02"
  baseAmount: number;
  sessionCount: number;
  sessionAmount: number;
  bonuses: number;
  deductions: number;
  totalEarned: number;
  amountPaid: number;
  remainingAmount: number;
  paymentDate?: string;
  status: 'Paid' | 'Partially Paid' | 'Pending';
  notes?: string;
}

export interface EmployeeSalaryRecord {
  id: string;
  employeeId: string;
  month: string; // e.g. "2026-02"
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netPayable: number;
  paidAmount: number;
  remainingAmount: number;
  paymentDate?: string;
  status: 'Paid' | 'Partially Paid' | 'Pending';
  notes?: string;
}

export interface FinancialKPIs {
  totalRevenue: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  netRevenue: number;
  outstandingPayments: number;
  teacherPayroll: number;
  employeePayroll: number;
  mrr: number;
  collectionRate: number; // percentage
}

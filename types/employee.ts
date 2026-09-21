export type EmployeeRole =
  | 'Administration'
  | 'Reception'
  | 'Accountant'
  | 'Cleaner'
  | 'Security'
  | 'Manager'
  | 'IT Support'
  | 'Other';

export type EmployeeStatus = 'Active' | 'Inactive' | 'On Leave';

export interface Employee {
  id: string;
  employeeIdNumber: string; // e.g. EMP-2026-001
  name: string;
  role: EmployeeRole;
  phone: string;
  email: string;
  hireDate: string;
  status: EmployeeStatus;
  salary: number; // monthly salary in DZD
  paymentSchedule: 'Monthly' | 'Bi-Weekly';
  notes?: string;
}

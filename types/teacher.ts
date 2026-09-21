export type TeacherStatus = 'Active' | 'Inactive' | 'On Leave';
export type SalaryType = 'fixed' | 'per_session' | 'hybrid';

export interface Teacher {
  id: string;
  teacherIdNumber: string; // e.g. TCH-2026-001
  name: string;
  profilePhoto?: string;
  phone: string;
  email: string;
  address: string;
  dateOfBirth: string;
  hireDate: string;
  specialization: string;
  status: TeacherStatus;
  notes?: string;
  salary: number; // monthly fixed salary in DZD
  salaryType?: SalaryType;
  baseSalary?: number; // legacy fallback
  perSessionRate?: number; // legacy fallback
}


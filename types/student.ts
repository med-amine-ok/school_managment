export type StudentStatus = 'Active' | 'Inactive' | 'Suspended' | 'Graduated';

export interface Student {
  id: string;
  studentIdNumber: string; // e.g. STU-2026-001
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  phone: string;
  email: string;
  address: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  emergencyContact: string;
  registrationDate: string;
  status: StudentStatus;
  profilePhoto?: string;
  notes?: string;
}

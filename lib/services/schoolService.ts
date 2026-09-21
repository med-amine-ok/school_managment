import { Student } from '@/types/student';
import { Teacher } from '@/types/teacher';
import { Employee } from '@/types/employee';
import { Subject } from '@/types/subject';
import { Group } from '@/types/group';
import { Room } from '@/types/room';
import { Session } from '@/types/session';
import { Enrollment } from '@/types/enrollment';
import { AttendanceRecord } from '@/types/attendance';
import { StudentPayment } from '@/types/payment';
import { Expense } from '@/types/finance';

import { mockStudents } from '@/data/students';
import { mockTeachers } from '@/data/teachers';
import { mockEmployees } from '@/data/employees';
import { mockSubjects } from '@/data/subjects';
import { mockGroups } from '@/data/groups';
import { mockRooms } from '@/data/rooms';
import { mockSessions } from '@/data/sessions';
import { mockEnrollments } from '@/data/enrollments';
import { mockAttendanceRecords } from '@/data/attendance';
import { mockStudentPayments } from '@/data/payments';
import { mockExpenses } from '@/data/expenses';

/**
 * SchoolService provides an asynchronous interface for querying and mutating entities.
 * In Phase 1 & 2, it maintains the local in-memory relational dataset.
 * In Phase 3+, internal calls are swapped for Supabase client queries.
 */
export const schoolService = {
  // Students
  async getStudents(): Promise<Student[]> {
    return [...mockStudents];
  },

  async getStudentById(id: string): Promise<Student | undefined> {
    return mockStudents.find((s) => s.id === id);
  },

  async createStudent(studentData: Omit<Student, 'id' | 'studentIdNumber' | 'registrationDate'>): Promise<Student> {
    const newStudent: Student = {
      ...studentData,
      id: `stu-${(mockStudents.length + 1).toString().padStart(3, '0')}`,
      studentIdNumber: `STU-2026-${(mockStudents.length + 1).toString().padStart(3, '0')}`,
      registrationDate: new Date().toISOString().split('T')[0],
    };
    mockStudents.unshift(newStudent);
    return newStudent;
  },

  // Teachers
  async getTeachers(): Promise<Teacher[]> {
    return [...mockTeachers];
  },

  async getTeacherById(id: string): Promise<Teacher | undefined> {
    return mockTeachers.find((t) => t.id === id);
  },

  async createTeacher(teacherData: Omit<Teacher, 'id' | 'teacherIdNumber' | 'hireDate'>): Promise<Teacher> {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `tch-${(mockTeachers.length + 1).toString().padStart(3, '0')}`,
      teacherIdNumber: `TCH-2026-${(mockTeachers.length + 1).toString().padStart(3, '0')}`,
      hireDate: new Date().toISOString().split('T')[0],
      salaryType: 'fixed',
      baseSalary: teacherData.salary,
      perSessionRate: 0,
    };
    mockTeachers.unshift(newTeacher);
    return newTeacher;
  },

  // Employees
  async getEmployees(): Promise<Employee[]> {
    return [...mockEmployees];
  },

  async createEmployee(employeeData: Omit<Employee, 'id' | 'employeeIdNumber' | 'hireDate'>): Promise<Employee> {
    const newEmployee: Employee = {
      ...employeeData,
      id: `emp-${(mockEmployees.length + 1).toString().padStart(3, '0')}`,
      employeeIdNumber: `EMP-2026-${(mockEmployees.length + 1).toString().padStart(3, '0')}`,
      hireDate: new Date().toISOString().split('T')[0],
    };
    mockEmployees.unshift(newEmployee);
    return newEmployee;
  },

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    return [...mockSubjects];
  },

  async getSubjectById(id: string): Promise<Subject | undefined> {
    return mockSubjects.find((s) => s.id === id);
  },

  async createSubject(subjectData: Omit<Subject, 'id'>): Promise<Subject> {
    const newSubject: Subject = {
      ...subjectData,
      id: `sub-${(mockSubjects.length + 1).toString().padStart(3, '0')}`,
    };
    mockSubjects.push(newSubject);
    return newSubject;
  },

  // Groups
  async getGroups(): Promise<Group[]> {
    return [...mockGroups];
  },

  async getGroupById(id: string): Promise<Group | undefined> {
    return mockGroups.find((g) => g.id === id);
  },

  async createGroup(groupData: Omit<Group, 'id'>): Promise<Group> {
    const newGroup: Group = {
      ...groupData,
      id: `grp-${(mockGroups.length + 1).toString().padStart(3, '0')}`,
    };
    mockGroups.push(newGroup);
    return newGroup;
  },

  // Rooms
  async getRooms(): Promise<Room[]> {
    return [...mockRooms];
  },

  async getRoomById(id: string): Promise<Room | undefined> {
    return mockRooms.find((r) => r.id === id);
  },

  async createRoom(roomData: Omit<Room, 'id'>): Promise<Room> {
    const newRoom: Room = {
      ...roomData,
      id: `room-${(mockRooms.length + 1).toString().padStart(3, '0')}`,
    };
    mockRooms.push(newRoom);
    return newRoom;
  },

  // Enrollments
  async getEnrollments(): Promise<Enrollment[]> {
    return [...mockEnrollments];
  },

  async getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
    return mockEnrollments.filter((e) => e.studentId === studentId);
  },

  async createEnrollment(enrollmentData: Omit<Enrollment, 'id' | 'startDate'>): Promise<Enrollment> {
    const newEnrollment: Enrollment = {
      ...enrollmentData,
      id: `enr-${(mockEnrollments.length + 1).toString().padStart(4, '0')}`,
      startDate: new Date().toISOString().split('T')[0],
    };
    mockEnrollments.unshift(newEnrollment);
    return newEnrollment;
  },

  // Sessions
  async getSessions(): Promise<Session[]> {
    return [...mockSessions];
  },

  async getSessionsByDate(date: string): Promise<Session[]> {
    return mockSessions.filter((s) => s.date === date);
  },

  async createSession(sessionData: Omit<Session, 'id'>): Promise<Session> {
    const newSession: Session = {
      ...sessionData,
      id: `ses-${(mockSessions.length + 1).toString().padStart(4, '0')}`,
    };
    mockSessions.push(newSession);
    return newSession;
  },

  // Attendance
  async getAttendance(): Promise<AttendanceRecord[]> {
    return [...mockAttendanceRecords];
  },

  async getAttendanceBySession(sessionId: string): Promise<AttendanceRecord[]> {
    return mockAttendanceRecords.filter((a) => a.sessionId === sessionId);
  },

  async recordAttendance(records: AttendanceRecord[]): Promise<void> {
    records.forEach((record) => {
      const idx = mockAttendanceRecords.findIndex(
        (a) => a.sessionId === record.sessionId && a.studentId === record.studentId
      );
      if (idx >= 0) {
        mockAttendanceRecords[idx] = record;
      } else {
        mockAttendanceRecords.push(record);
      }
    });
  },

  // Payments & Expenses
  async getStudentPayments(): Promise<StudentPayment[]> {
    return [...mockStudentPayments];
  },

  async recordStudentPayment(paymentData: Omit<StudentPayment, 'id' | 'receiptNumber' | 'paymentDate'>): Promise<StudentPayment> {
    const newPayment: StudentPayment = {
      ...paymentData,
      id: `pay-${(mockStudentPayments.length + 1).toString().padStart(4, '0')}`,
      receiptNumber: `REC-2026-${(mockStudentPayments.length + 101).toString().padStart(4, '0')}`,
      paymentDate: new Date().toISOString().split('T')[0],
    };
    mockStudentPayments.unshift(newPayment);
    return newPayment;
  },

  async getExpenses(): Promise<Expense[]> {
    return [...mockExpenses];
  },

  async recordExpense(expenseData: Omit<Expense, 'id'>): Promise<Expense> {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${(mockExpenses.length + 1).toString().padStart(4, '0')}`,
    };
    mockExpenses.unshift(newExpense);
    return newExpense;
  },
};

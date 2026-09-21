# Application Flow & Navigation (AppFlow) — School Management System

## 1. Primary Navigation Structure
The left sidebar contains 5 organized sections:
- **Overview**:
  - `/` (Dashboard): Central administrative overview, KPIs, today's schedule, attendance summary, cash flow, critical alerts.
- **People**:
  - `/students`: Student directory, enrollment stats, fee status, profiles.
  - `/teachers`: Faculty roster, teaching hours, earnings, profiles.
  - `/employees`: Staff directory, roles, monthly payroll status.
- **Academic**:
  - `/subjects`: Course catalog, groups, teachers, monthly pricing.
  - `/groups`: Group rosters, capacity meters, weekly class times.
  - `/enrollments`: Student registration matrix and pricing discounts.
  - `/schedule`: Multi-view calendar (Day/Week/Month) with conflict detection.
  - `/rooms`: Room directory, seating capacity, real-time availability status.
  - `/attendance`: Session-by-session attendance marking roster and student analytics.
- **Finance**:
  - `/finance/student-payments`: Tuition collections, receipts, overdue accounts.
  - `/finance/teacher-payments`: Teaching hours compensation ledger.
  - `/finance/employee-salaries`: Monthly staff payroll disbursements.
  - `/finance/expenses`: Operational expenses by category.
  - `/finance`: High-level financial analytics and cash flow dashboard.
- **Reports & Settings**:
  - `/reports`: Academic, attendance, and financial exportable reports.
  - `/settings`: Institution profile, user management, and system preferences.

## 2. Core Operational Workflows
### Flow 1: Student Enrollment to Financial Settlement
1. Admin registers new student (`/students` or Quick Action modal).
2. Admin enrolls student in one or more subjects (`Mathematics Group A`, `Physics Group B`).
3. Student fee is computed from active group monthly fees (minus discounts).
4. Group capacity increments; student appears on group roster and teacher schedule.
5. Tuition payment is recorded; student status shifts from `Unpaid`/`Overdue` to `Paid`.
6. Cash flow KPI and dashboard revenue card automatically update.

### Flow 2: Session Scheduling & Conflict Detection
1. Admin initiates session creation.
2. Selects Subject → Group → Teacher → Date & Time → Room.
3. Availability engine checks in real time:
   - Does Room have an overlapping booking?
   - Is Teacher teaching another group at that time?
   - Is Group scheduled for another class?
   - Does group student count exceed room capacity?
4. If valid, session is confirmed and appears on Day/Week/Month calendars and Teacher schedule.

# Product Requirements Document (PRD) — School Management System

## 1. Product Vision & Overview
The School Management System (School ERP) is a modern, unified administration platform designed for educational institutions and learning centers (such as Algerian private high schools, academies, and supplementary education institutes).
The platform empowers administrators, directors, academic coordinators, and finance managers to manage students, teachers, employees, subjects, groups, rooms, schedules, sessions, attendance, subscriptions, revenue, and payroll within a coherent, connected relational architecture.

## 2. Target Users & Personas
- **School Director / Super Admin**: Needs complete high-level operational visibility (revenue, student enrollment counts, teacher performance, operational alerts).
- **Academic Coordinator / Registrar**: Manages subjects, groups, student enrollments, room availability, and conflict-free schedules.
- **Finance Officer / Accountant**: Manages student subscription fees, tuition payment records, teacher hourly/session pay, staff salaries, and operating expenses.
- **Teachers / Instructors**: Views daily/weekly schedules, assigned rooms, enrolled student rosters, records attendance, and reviews session payout histories.

## 3. Core Functional Requirements
1. **Student Management**: Full biographical profile, multi-subject enrollments, parent/emergency contacts, payment status, attendance tracking.
2. **Teacher Management**: Specializations, salary schemes (fixed, per-session, hybrid), weekly schedules, teaching sessions, compensation ledger.
3. **Staff & Employee Management**: Administrative, reception, accounting, facility staff directory, payroll tracking, payment status.
4. **Academic Structure**:
   - Subjects as first-class entities with color coding and custom pricing.
   - Groups/Classes (e.g. Mathematics A, B, C) linked to a specific teacher, room, capacity, and student roster.
   - Many-to-many Student Enrollments with pricing, discount, and status.
5. **Rooms & Facility Management**: Capacity, equipment, building, floor, real-time availability calculation, and collision prevention.
6. **Smart Scheduling & Calendar**:
   - Day, Week, and Month views.
   - Real-time conflict detection: Room double-booking, Teacher double-booking, Group double-booking, and Room capacity overflows.
7. **Session-based Attendance System**: Fast marking (Present, Absent, Late, Excused), bulk "Mark All Present", session notes, and visual attendance analytics.
8. **Financial Management & Accounting**:
   - Student monthly subscriptions with status (Paid, Partially Paid, Unpaid, Overdue).
   - Teacher payroll and session earnings calculation.
   - Staff monthly salaries.
   - Operating expenses across categories (Rent, Utilities, Supplies, Equipment).
   - Dynamic Financial KPIs: Total Revenue, Monthly Expenses, Net Cash Flow, Collection Rate, Outstanding Balance.
9. **Global Search & Quick Actions**: Search across students, teachers, employees, groups, rooms; fast modals for common daily workflows.

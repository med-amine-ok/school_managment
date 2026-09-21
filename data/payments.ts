import { StudentPayment, PaymentMethod } from '@/types/payment';
import { mockEnrollments } from './enrollments';

const generatePayments = (): StudentPayment[] => {
  const payments: StudentPayment[] = [];
  let counter = 1;

  const paymentMethods: PaymentMethod[] = ['Cash', 'Bank Transfer', 'Card', 'Cash'];

  // Months to simulate: July 2026, August 2026, September 2026
  const months = [
    { label: 'July 2026', code: '2026-07', isCurrent: false },
    { label: 'August 2026', code: '2026-08', isCurrent: false },
    { label: 'September 2026', code: '2026-09', isCurrent: true },
  ];

  months.forEach((m) => {
    mockEnrollments.forEach((enr, idx) => {
      const amountDue = enr.finalPrice;
      const method = paymentMethods[(idx + m.code.charCodeAt(6)) % paymentMethods.length];

      let amountPaid = amountDue;
      let status: StudentPayment['status'] = 'Paid';
      let paymentDate: string | undefined = `${m.code}-05`;

      if (m.isCurrent) {
        // Current month: reflects enrollment status
        if (enr.paymentStatus === 'Paid') {
          amountPaid = amountDue;
          status = 'Paid';
          paymentDate = `${m.code}-04`;
        } else if (enr.paymentStatus === 'Partially Paid') {
          amountPaid = Math.floor(amountDue / 2);
          status = 'Partially Paid';
          paymentDate = `${m.code}-08`;
        } else if (enr.paymentStatus === 'Overdue') {
          amountPaid = 0;
          status = 'Overdue';
          paymentDate = undefined;
        } else {
          amountPaid = 0;
          status = 'Unpaid';
          paymentDate = undefined;
        }
      } else {
        // Past months: most are paid, 2 are overdue/unpaid
        if (enr.studentId === 'stu-005' || enr.studentId === 'stu-019') {
          amountPaid = 0;
          status = 'Overdue';
          paymentDate = undefined;
        } else {
          amountPaid = amountDue;
          status = 'Paid';
          paymentDate = `${m.code}-06`;
        }
      }

      payments.push({
        id: `pay-${counter.toString().padStart(5, '0')}`,
        receiptNumber: `RCP-${m.code.replace('-', '')}-${counter.toString().padStart(4, '0')}`,
        studentId: enr.studentId,
        enrollmentId: enr.id,
        month: m.label,
        amountDue,
        amountPaid,
        remaining: amountDue - amountPaid,
        paymentDate,
        paymentMethod: method,
        status,
        notes: status === 'Overdue' ? 'Payment reminder SMS dispatched to parent' : undefined,
      });

      counter++;
    });
  });

  return payments;
};

export const mockStudentPayments: StudentPayment[] = generatePayments();

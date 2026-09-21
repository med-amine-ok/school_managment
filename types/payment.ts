export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Card' | 'Other';
export type PaymentStatus = 'Paid' | 'Partially Paid' | 'Unpaid' | 'Overdue';

export interface StudentPayment {
  id: string;
  receiptNumber: string; // e.g. RCP-2026-0042
  studentId: string;
  enrollmentId: string;
  month: string; // e.g. "2026-02" or "February 2026"
  amountDue: number; // in DZD
  amountPaid: number; // in DZD
  remaining: number; // amountDue - amountPaid
  paymentDate?: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  notes?: string;
}

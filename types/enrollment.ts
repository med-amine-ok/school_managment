export type EnrollmentStatus = 'Active' | 'Pending' | 'Cancelled' | 'Completed';
export type EnrollmentPaymentStatus = 'Paid' | 'Partially Paid' | 'Unpaid' | 'Overdue';
export type DiscountType = 'None' | 'Sibling' | 'Multi-subject' | 'Scholarship' | 'Need-based';

export interface Enrollment {
  id: string;
  studentId: string;
  subjectId: string;
  groupId: string;
  startDate: string;
  endDate?: string;
  monthlyPrice: number; // base price in DZD
  discount: number;     // discount in DZD (e.g. 500 DZD for multi-subject)
  discountType?: DiscountType;
  finalPrice: number;   // monthlyPrice - discount
  status: EnrollmentStatus;
  paymentStatus: EnrollmentPaymentStatus;
}

export interface Subject {
  id: string;
  code: string; // e.g. MATH-01
  name: string;
  description: string;
  category: 'Scientific' | 'Literary' | 'Languages' | 'Technical';
  color: string; // Hex color for calendar/tags
  monthlyPrice: number; // e.g. 3000 DZD
  durationMinutes: number; // typical session duration (e.g. 90 mins)
  status: 'Active' | 'Archived';
}

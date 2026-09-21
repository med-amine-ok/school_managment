import { Subject } from '@/types/subject';

export const mockSubjects: Subject[] = [
  {
    id: 'sub-math',
    code: 'MATH-101',
    name: 'Mathematics',
    description: 'Advanced algebra, calculus, analysis, and analytic geometry for secondary education.',
    category: 'Scientific',
    color: '#4F6EF7', // Indigo
    monthlyPrice: 3000, // 3000 DZD
    durationMinutes: 90,
    status: 'Active',
  },
  {
    id: 'sub-phys',
    code: 'PHYS-101',
    name: 'Physics',
    description: 'Mechanics, electrical circuits, nuclear physics, and optics laboratory simulations.',
    category: 'Scientific',
    color: '#14B8A6', // Teal
    monthlyPrice: 3000,
    durationMinutes: 90,
    status: 'Active',
  },
  {
    id: 'sub-eng',
    code: 'ENG-101',
    name: 'English Language',
    description: 'Advanced grammar, communicative proficiency, reading comprehension, and writing.',
    category: 'Languages',
    color: '#8B5CF6', // Purple
    monthlyPrice: 2500,
    durationMinutes: 90,
    status: 'Active',
  },
  {
    id: 'sub-sci',
    code: 'SCI-101',
    name: 'Natural Sciences & Biology',
    description: 'Cellular biology, immunology, genetics, and environmental systems.',
    category: 'Scientific',
    color: '#10B981', // Emerald
    monthlyPrice: 2800,
    durationMinutes: 90,
    status: 'Active',
  },
  {
    id: 'sub-chem',
    code: 'CHEM-101',
    name: 'Chemistry',
    description: 'Chemical kinetics, organic reactions, equilibrium solutions, and stoichiometry.',
    category: 'Scientific',
    color: '#F59E0B', // Amber
    monthlyPrice: 2800,
    durationMinutes: 90,
    status: 'Active',
  },
  {
    id: 'sub-ara',
    code: 'ARA-101',
    name: 'Arabic Literature & Philosophy',
    description: 'Classical and modern Arabic literary rhetoric, philosophical argumentation, and poetry.',
    category: 'Literary',
    color: '#F43F5E', // Rose
    monthlyPrice: 2200,
    durationMinutes: 90,
    status: 'Active',
  },
  {
    id: 'sub-fr',
    code: 'FR-101',
    name: 'French Language',
    description: 'Text analysis, essay methodology, syntactic structures, and oral communication.',
    category: 'Languages',
    color: '#06B6D4', // Cyan
    monthlyPrice: 2500,
    durationMinutes: 90,
    status: 'Active',
  },
  {
    id: 'sub-cs',
    code: 'CS-101',
    name: 'Computer Science & Algorithms',
    description: 'Introduction to algorithmic problem solving, Python programming, and data structures.',
    category: 'Technical',
    color: '#7C3AED', // Violet
    monthlyPrice: 3500,
    durationMinutes: 90,
    status: 'Active',
  },
];

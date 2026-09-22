export type FloorNumber = 0 | 1 | 2; // 0 = Ground, 1 = 1st Floor, 2 = 2nd Floor

export interface ArchitecturalZone {
  id: string;
  name: string;
  type: 'classroom' | 'facility' | 'office' | 'circulation' | 'amenity' | 'stair' | 'entrance';
  roomId?: string; // Links directly to mockRooms if actionable
  number?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  sublabel?: string;
  capacity?: number;
  iconName?: string;
  isClickable: boolean;
}

export interface FloorPlanDefinition {
  floor: FloorNumber;
  name: string;
  subtitle: string;
  building: string;
  viewBox: string; // e.g. "0 0 900 580"
  zones: ArchitecturalZone[];
}

export const floorPlans: Record<FloorNumber, FloorPlanDefinition> = {
  0: {
    floor: 0,
    name: 'Ground Floor',
    subtitle: 'Administration, Conference Hall, Reception & Main Entrance',
    building: 'Main Academic Campus — Level 0',
    viewBox: '0 0 920 580',
    zones: [
      // Grand Conference Hall
      {
        id: 'zone-conf-01',
        roomId: 'room-conf',
        number: 'CONF-01',
        name: 'Grand Conference Hall',
        label: 'Grand Conference Hall',
        sublabel: 'CONF-01 • Auditorium & Keynotes',
        type: 'classroom',
        capacity: 60,
        x: 40,
        y: 40,
        width: 280,
        height: 250,
        isClickable: true,
      },
      // Administration Suite
      {
        id: 'zone-admin-suite',
        name: 'Administration & Principal Suite',
        label: 'Administration Suite',
        sublabel: 'Registrar & Direction',
        type: 'office',
        x: 350,
        y: 40,
        width: 220,
        height: 160,
        isClickable: false,
      },
      // Restrooms Ground
      {
        id: 'zone-restrooms-0',
        name: 'Restrooms & Facilities',
        label: 'Restrooms',
        sublabel: 'Accessible M / F',
        type: 'amenity',
        x: 600,
        y: 40,
        width: 120,
        height: 160,
        isClickable: false,
      },
      // Faculty Lounge
      {
        id: 'zone-faculty-lounge',
        name: "Teachers' Common Room",
        label: 'Faculty Lounge',
        sublabel: 'Staff Room & Briefing',
        type: 'office',
        x: 740,
        y: 40,
        width: 140,
        height: 160,
        isClickable: false,
      },
      // West Stairs & Elevator
      {
        id: 'zone-stairs-west-0',
        name: 'West Staircase & Elevator',
        label: 'Stairs & Lift',
        sublabel: 'Tower A',
        type: 'stair',
        x: 40,
        y: 330,
        width: 110,
        height: 110,
        isClickable: false,
      },
      // Central Reception & Admissions Desk
      {
        id: 'zone-reception',
        name: 'Main Admissions & Welcome Desk',
        label: 'Reception & Info Desk',
        sublabel: 'Admissions & Inquiries',
        type: 'office',
        x: 350,
        y: 280,
        width: 220,
        height: 120,
        isClickable: false,
      },
      // Main Entrance Lobby
      {
        id: 'zone-entrance',
        name: 'Campus Main Entrance & Turnstiles',
        label: 'Main Gate & Turnstiles',
        sublabel: 'Campus Security & Access Control',
        type: 'entrance',
        x: 350,
        y: 450,
        width: 220,
        height: 90,
        isClickable: false,
      },
      // Cafeteria & Garden Patio
      {
        id: 'zone-cafeteria',
        name: 'Student Cafeteria & Courtyard',
        label: 'Student Cafeteria & Patio',
        sublabel: 'Dining, Refreshments & Garden',
        type: 'amenity',
        x: 600,
        y: 280,
        width: 280,
        height: 250,
        isClickable: false,
      },
      // Security Post
      {
        id: 'zone-security-post',
        name: 'Security & Surveillance Station',
        label: 'Security Station',
        sublabel: 'CCTV Monitoring',
        type: 'office',
        x: 180,
        y: 450,
        width: 140,
        height: 90,
        isClickable: false,
      },
    ],
  },
  1: {
    floor: 1,
    name: '1st Floor',
    subtitle: 'Classrooms 101–104 & Science Laboratory Annex',
    building: 'Main Academic Wing — Level 1',
    viewBox: '0 0 920 580',
    zones: [
      // Classroom 101
      {
        id: 'zone-room-101',
        roomId: 'room-101',
        number: '101',
        name: 'Classroom 101',
        label: 'Classroom 101',
        sublabel: 'Smart Screen • 25 Seats',
        type: 'classroom',
        capacity: 25,
        x: 40,
        y: 40,
        width: 190,
        height: 180,
        isClickable: true,
      },
      // Classroom 102
      {
        id: 'zone-room-102',
        roomId: 'room-102',
        number: '102',
        name: 'Classroom 102',
        label: 'Classroom 102',
        sublabel: 'Audio System • 30 Seats',
        type: 'classroom',
        capacity: 30,
        x: 260,
        y: 40,
        width: 190,
        height: 180,
        isClickable: true,
      },
      // Classroom 103
      {
        id: 'zone-room-103',
        roomId: 'room-103',
        number: '103',
        name: 'Classroom 103',
        label: 'Classroom 103',
        sublabel: 'Whiteboard • 20 Seats',
        type: 'classroom',
        capacity: 20,
        x: 480,
        y: 40,
        width: 190,
        height: 180,
        isClickable: true,
      },
      // Classroom 104
      {
        id: 'zone-room-104',
        roomId: 'room-104',
        number: '104',
        name: 'Classroom 104',
        label: 'Classroom 104',
        sublabel: 'Projector • 22 Seats',
        type: 'classroom',
        capacity: 22,
        x: 700,
        y: 40,
        width: 180,
        height: 180,
        isClickable: true,
      },
      // Science Lab 1
      {
        id: 'zone-room-lab-1',
        roomId: 'room-lab-1',
        number: 'LAB-01',
        name: 'Science Laboratory 1',
        label: 'Science Laboratory 1',
        sublabel: 'LAB-01 • Chemistry & Biology',
        type: 'classroom',
        capacity: 20,
        x: 40,
        y: 330,
        width: 280,
        height: 200,
        isClickable: true,
      },
      // Student Study Nook & Lockers
      {
        id: 'zone-lockers-1',
        name: 'Student Study Hub & Lockers',
        label: 'Student Study Hub',
        sublabel: 'Locker Bays & Collaborative Zone',
        type: 'amenity',
        x: 350,
        y: 330,
        width: 180,
        height: 200,
        isClickable: false,
      },
      // Restrooms Level 1
      {
        id: 'zone-restrooms-1',
        name: 'Level 1 Restrooms',
        label: 'Restrooms',
        sublabel: 'M / F Facilities',
        type: 'amenity',
        x: 560,
        y: 330,
        width: 120,
        height: 200,
        isClickable: false,
      },
      // Pedagogical Resource Room
      {
        id: 'zone-prep-room',
        name: 'Pedagogical Resource Room',
        label: 'Faculty Prep Room',
        sublabel: 'Print & Teaching Materials',
        type: 'office',
        x: 710,
        y: 330,
        width: 170,
        height: 200,
        isClickable: false,
      },
      // West Stairs
      {
        id: 'zone-stairs-west-1',
        name: 'West Staircase',
        label: 'Stairs',
        sublabel: 'To L0 / L2',
        type: 'stair',
        x: 40,
        y: 245,
        width: 70,
        height: 65,
        isClickable: false,
      },
      // East Stairs
      {
        id: 'zone-stairs-east-1',
        name: 'East Staircase',
        label: 'Stairs',
        sublabel: 'To L0 / L2',
        type: 'stair',
        x: 810,
        y: 245,
        width: 70,
        height: 65,
        isClickable: false,
      },
    ],
  },
  2: {
    floor: 2,
    name: '2nd Floor',
    subtitle: 'Classroom 201, Math Studio 204 & IT Computer Center',
    building: 'Upper Academic & Technology Wing — Level 2',
    viewBox: '0 0 920 580',
    zones: [
      // Classroom 201
      {
        id: 'zone-room-201',
        roomId: 'room-201',
        number: '201',
        name: 'Classroom 201',
        label: 'Classroom 201',
        sublabel: 'Interactive Screen • 28 Seats',
        type: 'classroom',
        capacity: 28,
        x: 40,
        y: 40,
        width: 250,
        height: 180,
        isClickable: true,
      },
      // Room 204 (Math Studio)
      {
        id: 'zone-room-204',
        roomId: 'room-204',
        number: '204',
        name: 'Room 204 (Math Studio)',
        label: 'Room 204 (Math Studio)',
        sublabel: 'Dual Whiteboard • 25 Seats',
        type: 'classroom',
        capacity: 25,
        x: 320,
        y: 40,
        width: 250,
        height: 180,
        isClickable: true,
      },
      // Computer Lab COMP-02
      {
        id: 'zone-room-comp-lab',
        roomId: 'room-comp-lab',
        number: 'COMP-02',
        name: 'Computer Lab (IT Center)',
        label: 'Computer Lab (IT Center)',
        sublabel: 'COMP-02 • 24 Core i7 Workstations',
        type: 'classroom',
        capacity: 24,
        x: 600,
        y: 40,
        width: 280,
        height: 180,
        isClickable: true,
      },
      // Library & Study Sanctuary
      {
        id: 'zone-library',
        name: 'Academy Central Library',
        label: 'Academy Central Library',
        sublabel: 'Quiet Study • Scientific Periodicals',
        type: 'facility',
        x: 40,
        y: 330,
        width: 380,
        height: 200,
        isClickable: false,
      },
      // Robotics & STEM Hub
      {
        id: 'zone-stem-hub',
        name: 'Robotics & STEM Maker Hub',
        label: 'Robotics & Maker Lab',
        sublabel: '3D Printers & Arduino Kits',
        type: 'facility',
        x: 450,
        y: 330,
        width: 220,
        height: 200,
        isClickable: false,
      },
      // Terrace & Open Sky Study Garden
      {
        id: 'zone-terrace',
        name: 'Upper Sky Study Terrace',
        label: 'Sky Study Terrace',
        sublabel: 'Outdoor Reading & Solar Lounge',
        type: 'amenity',
        x: 700,
        y: 330,
        width: 180,
        height: 200,
        isClickable: false,
      },
      // West Stairs Level 2
      {
        id: 'zone-stairs-west-2',
        name: 'West Staircase',
        label: 'Stairs',
        sublabel: 'Down to L1',
        type: 'stair',
        x: 40,
        y: 245,
        width: 70,
        height: 65,
        isClickable: false,
      },
      // East Stairs Level 2
      {
        id: 'zone-stairs-east-2',
        name: 'East Staircase',
        label: 'Stairs',
        sublabel: 'Down to L1',
        type: 'stair',
        x: 810,
        y: 245,
        width: 70,
        height: 65,
        isClickable: false,
      },
    ],
  },
};

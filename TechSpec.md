# Technical Specification (TechSpec) — School Management System

## 1. Technology Stack
- **Framework**: Next.js 16.3.5 (App Router)
- **UI Runtime**: React 19.2.8
- **Language**: TypeScript 5 (strict type checking enabled)
- **Styling**: Tailwind CSS v4 with custom CSS variable design tokens in `@theme`
- **Iconography**: Lucide React (standardized SVG icon set, zero emojis)
- **Data Layer (Phase 1)**: In-memory relational mock repository with decoupled service abstractions (`/lib/services/schoolService.ts`) and pure calculation engines (`/lib/calculations/`).
- **Target Backend (Phase 2+)**: Supabase (PostgreSQL with Row Level Security, Supabase Auth, Realtime, Storage).

## 2. Directory Architecture
```
school_managment/
├── app/
│   ├── globals.css          # Design system variables & base styling
│   ├── layout.tsx           # Root HTML layout with Geist font
│   ├── page.tsx             # Main dashboard view
│   └── ...                  # Future sub-routes (students, teachers, etc.)
├── components/
│   ├── ui/                  # Reusable primitives (Button, Card, Badge, Modal, Avatar, SearchInput)
│   ├── layout/              # Shell components (Sidebar, TopHeader, AppShell)
│   └── dashboard/           # Dashboard widgets (StatCard, TodaySchedule, AttendanceWidget, FinanceOverviewWidget, AlertsWidget, QuickActionModal)
├── data/                    # Realistic relational mock data records
├── lib/
│   ├── calculations/        # Pure derived calculation helpers (financial, academic, conflicts)
│   ├── services/            # Service abstraction layer ready for Supabase replacement
│   └── utils/               # Formatters (currency in DZD, dates, phone numbers)
└── types/                   # Domain TypeScript definitions
```

## 3. Server vs Client Component Boundary (`nextjs-best-practices`)
- **Server Components**: Shell layouts, static metadata, initial data loaders.
- **Client Components** (`'use client'`): Interactive components requiring React state/effects (Sidebar collapse, quick action modals, search filters, tab switchers, attendance check-off).

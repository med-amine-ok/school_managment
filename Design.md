# Design System Specification (Design.md)

## 1. Aesthetic Identity & Principles
- **Philosophy**: Clean, minimal, professional, high information density without visual clutter (inspired by Linear, Vercel, Stripe).
- **Anti-Patterns**: Strictly avoid excessive gradients, heavy glassmorphism, huge colorful cards, random animations, and emoji icons in UI elements.

## 2. Color Palette & Tokens
| Token | Hex Code | Role & Usage |
|---|---|---|
| **Background (Surface)** | `#FFFFFF` | Main cards, tables, modal containers |
| **Background (Panel/Body)** | `#F7F9FC` | Page background, sidebars, subtle panels |
| **Primary (Indigo)** | `#4F6EF7` | Primary buttons, active navigation, links, key metrics |
| **Primary Hover** | `#3B4FD9` | Hover state for primary actions |
| **Secondary (Teal)** | `#14B8A6` | Positive highlights, secondary progress indicators |
| **Border** | `#E2E8F0` | Subtle clean card borders, table dividers |
| **Text Primary** | `#1E293B` | Main headings, table data, bold values |
| **Text Secondary** | `#64748B` | Subtext, labels, helper descriptions |
| **Text Muted** | `#94A3B8` | Placeholders, inactive state icons |

### Semantic Status Colors
- **Success**: `#22C55E` (Present, Paid, Active, Available)
- **Warning**: `#F59E0B` (Late, Partially Paid, Pending)
- **Error / Danger**: `#EF4444` (Absent, Overdue, Cancelled, Conflict)
- **Info**: `#3B82F6` (Scheduled, Notes, In Progress)

### Role Distinction Colors
- **Admin**: `#7C3AED`
- **Teacher**: `#0EA5E9`
- **Student**: `#14B8A6`
- **Parent**: `#F97316`

## 3. Typography & Spacing
- **Font Family**: Geist Sans, system fallbacks (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`)
- **Base Font Size**: 14px for body and table data; 12px for badges/metadata; 18–24px for page and section titles.
- **Card Styling**: `bg-white border border-[#E2E8F0] rounded-xl shadow-xs`
- **Transitions**: `transition-all duration-200 ease-in-out` on all interactive states.

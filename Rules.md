# Engineering & Design Rules (Rules.md)

## 1. Core Architecture Principles
1. **User Command > Files > Assumptions**: User commands take final priority.
2. **Relational Integrity**: Every student, session, group, room, payment, and teacher record must connect logically. Never display random hardcoded counts or metrics.
3. **Decoupled Architecture**: All UI components consume data via `/lib/services/schoolService.ts` and `/lib/calculations/`, ensuring immediate swap-in of Supabase queries later without touching UI code.
4. **Zero Emoji in UI**: Use standard Lucide React icons with consistent 16-20px dimensions (`w-4 h-4` or `w-5 h-5`).
5. **Color & Design Tokens**: Strictly follow the specified palette:
   - Primary: `#4F6EF7` (Hover: `#3B4FD9`)
   - Secondary: `#14B8A6`
   - Backgrounds: `#FFFFFF` (Surface) and `#F7F9FC` (Panel/Body)
   - Borders: `#E2E8F0`
   - Text: Primary `#1E293B`, Secondary `#64748B`, Muted `#94A3B8`
   - Role badges: Admin `#7C3AED`, Teacher `#0EA5E9`, Student `#14B8A6`, Parent `#F97316`
6. **Interaction Standard**:
   - Every clickable element must have `cursor-pointer`.
   - Transitions must be smooth (`150ms-250ms`).
   - Skeletons and realistic empty states provided for all views.
7. **Algerian Localization**: Currency in Algerian Dinar (`DZD`), realistic national names and phone formats (`+213`).

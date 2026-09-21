'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Briefcase,
  BookOpen,
  Layers,
  UserCheck,
  Calendar,
  Building2,
  ClipboardCheck,
  CreditCard,
  Banknote,
  DollarSign,
  Receipt,
  PieChart,
  FileBarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  School,
  LogOut,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '@/lib/context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Role-aware navigation definitions
  const getNavGroups = (): NavGroup[] => {
    if (user.role === 'TEACHER') {
      return [
        {
          groupName: 'OVERVIEW',
          items: [
            {
              label: 'Dashboard',
              href: '/',
              icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
            },
          ],
        },
        {
          groupName: 'MY TEACHING',
          items: [
            {
              label: 'Schedule Calendar',
              href: '/schedule',
              icon: <Calendar className="w-4 h-4 shrink-0" />,
            },
            {
              label: 'My Groups & Classes',
              href: '/groups',
              icon: <Layers className="w-4 h-4 shrink-0" />,
              badge: '16',
            },
            {
              label: 'Mark Attendance',
              href: '/attendance',
              icon: <ClipboardCheck className="w-4 h-4 shrink-0" />,
            },
            {
              label: 'Student Roster',
              href: '/students',
              icon: <GraduationCap className="w-4 h-4 shrink-0" />,
              badge: '36',
            },
            {
              label: 'Rooms & Labs',
              href: '/rooms',
              icon: <Building2 className="w-4 h-4 shrink-0" />,
              badge: '9',
            },
          ],
        },
        {
          groupName: 'COMPENSATION',
          items: [
            {
              label: 'My Salary & Pay',
              href: '/finance/teacher-payments',
              icon: <Banknote className="w-4 h-4 shrink-0" />,
            },
            {
              label: 'Faculty Profile',
              href: `/teachers/${user.teacherId || 'tch-ahmed'}`,
              icon: <UserCheck className="w-4 h-4 shrink-0" />,
            },
          ],
        },
      ];
    }

    if (user.role === 'EMPLOYEE') {
      return [
        {
          groupName: 'OVERVIEW',
          items: [
            {
              label: 'Dashboard',
              href: '/',
              icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
            },
          ],
        },
        {
          groupName: 'DAILY OPERATIONS',
          items: [
            {
              label: 'Students Directory',
              href: '/students',
              icon: <GraduationCap className="w-4 h-4 shrink-0" />,
              badge: '36',
            },
            {
              label: 'Attendance Tracking',
              href: '/attendance',
              icon: <ClipboardCheck className="w-4 h-4 shrink-0" />,
            },
            {
              label: 'Schedule Calendar',
              href: '/schedule',
              icon: <Calendar className="w-4 h-4 shrink-0" />,
            },
            {
              label: 'Rooms & Facilities',
              href: '/rooms',
              icon: <Building2 className="w-4 h-4 shrink-0" />,
              badge: '9',
            },
            {
              label: 'Enrollments',
              href: '/enrollments',
              icon: <UserCheck className="w-4 h-4 shrink-0" />,
            },
          ],
        },
        {
          groupName: 'STAFF INFO',
          items: [
            {
              label: 'Staff Directory',
              href: '/employees',
              icon: <Briefcase className="w-4 h-4 shrink-0" />,
              badge: '7',
            },
            {
              label: 'Salary Ledger',
              href: '/finance/employee-salaries',
              icon: <DollarSign className="w-4 h-4 shrink-0" />,
            },
          ],
        },
      ];
    }

    // Default: ADMIN (all sections)
    return [
      {
        groupName: 'OVERVIEW',
        items: [
          {
            label: 'Dashboard',
            href: '/',
            icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
          },
        ],
      },
      {
        groupName: 'PEOPLE',
        items: [
          {
            label: 'Students',
            href: '/students',
            icon: <GraduationCap className="w-4 h-4 shrink-0" />,
            badge: '36',
          },
          {
            label: 'Teachers',
            href: '/teachers',
            icon: <Users className="w-4 h-4 shrink-0" />,
            badge: '10',
          },
          {
            label: 'Employees',
            href: '/employees',
            icon: <Briefcase className="w-4 h-4 shrink-0" />,
            badge: '7',
          },
        ],
      },
      {
        groupName: 'ACADEMIC',
        items: [
          {
            label: 'Subjects',
            href: '/subjects',
            icon: <BookOpen className="w-4 h-4 shrink-0" />,
            badge: '8',
          },
          {
            label: 'Groups & Classes',
            href: '/groups',
            icon: <Layers className="w-4 h-4 shrink-0" />,
            badge: '16',
          },
          {
            label: 'Enrollments',
            href: '/enrollments',
            icon: <UserCheck className="w-4 h-4 shrink-0" />,
          },
          {
            label: 'Schedule Calendar',
            href: '/schedule',
            icon: <Calendar className="w-4 h-4 shrink-0" />,
          },
          {
            label: 'Rooms & Facilities',
            href: '/rooms',
            icon: <Building2 className="w-4 h-4 shrink-0" />,
            badge: '9',
          },
          {
            label: 'Attendance',
            href: '/attendance',
            icon: <ClipboardCheck className="w-4 h-4 shrink-0" />,
          },
        ],
      },
      {
        groupName: 'FINANCE',
        items: [
          {
            label: 'Student Payments',
            href: '/finance/student-payments',
            icon: <CreditCard className="w-4 h-4 shrink-0" />,
          },
          {
            label: 'Teacher Payments',
            href: '/finance/teacher-payments',
            icon: <Banknote className="w-4 h-4 shrink-0" />,
          },
          {
            label: 'Staff Salaries',
            href: '/finance/employee-salaries',
            icon: <DollarSign className="w-4 h-4 shrink-0" />,
          },
          {
            label: 'School Expenses',
            href: '/finance/expenses',
            icon: <Receipt className="w-4 h-4 shrink-0" />,
          },
          {
            label: 'Finance Analytics',
            href: '/finance',
            icon: <PieChart className="w-4 h-4 shrink-0" />,
          },
        ],
      },
      {
        groupName: 'REPORTS & SETTINGS',
        items: [
          {
            label: 'Reports & Audits',
            href: '/reports',
            icon: <FileBarChart className="w-4 h-4 shrink-0" />,
          },
          {
            label: 'School Settings',
            href: '/settings',
            icon: <Settings className="w-4 h-4 shrink-0" />,
          },
        ],
      },
    ];
  };

  const navGroups = getNavGroups();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#FFFFFF] border-r border-[#E2E8F0] select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#E2E8F0]">
        <a href="/" className="flex items-center gap-3 overflow-hidden cursor-pointer">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#4F6EF7] text-white shrink-0 shadow-xs">
            <School className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-sm tracking-tight text-[#1E293B]">
                El-Nadjah Academy
              </span>
              <span className="text-[11px] text-[#64748B] font-medium">
                مدرسة النجاح الخاصة
              </span>
            </div>
          )}
        </a>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex items-center justify-center w-7 h-7 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Links Scroll Container */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.groupName} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-3 text-[10px] font-bold tracking-wider text-[#94A3B8] uppercase">
                {group.groupName}
              </h4>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname?.startsWith(item.href));

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      if (isMobileOpen) onCloseMobile();
                    }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-[#EEF2FF] text-[#4F6EF7]'
                        : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div
                      className={`shrink-0 transition-colors ${
                        isActive
                          ? 'text-[#4F6EF7]'
                          : 'text-[#64748B] group-hover:text-[#1E293B]'
                      }`}
                    >
                      {item.icon}
                    </div>

                    {!isCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                          isActive
                            ? 'bg-[#4F6EF7] text-white'
                            : 'bg-[#F1F5F9] text-[#64748B] group-hover:bg-[#E2E8F0]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile & Sign Out Widget */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        {!isCollapsed && (
          <div className="flex items-center justify-between px-2 py-1 mb-2">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
              Academic Year 2026/27
            </span>
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" title="Term Active" />
          </div>
        )}
        <div
          className={`flex items-center gap-2.5 p-1.5 rounded-lg ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar
              name={user.name}
              role={user.role === 'ADMIN' ? 'Admin' : user.role === 'TEACHER' ? 'Teacher' : 'Student'}
              size="sm"
            />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 leading-none">
                <span className="text-xs font-semibold text-[#1E293B] truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-[#4F6EF7] font-semibold truncate mt-1">
                  {user.title}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-300 ease-in-out z-30 ${
          isCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        <div className="fixed top-0 bottom-0 left-0 h-full w-[inherit] z-30">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-white z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

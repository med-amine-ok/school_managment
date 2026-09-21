'use client';

import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronDown,
  LogOut,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  UserCheck,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { SearchInput } from '../ui/SearchInput';
import { Badge } from '../ui/Badge';
import { useAuth, UserRole } from '@/lib/context/AuthContext';

interface TopHeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenQuickActions: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenMobileSidebar,
  onOpenQuickActions,
}) => {
  const { user, switchRole, logout } = useAuth();
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Overdue Subscription Payment',
      message: 'Student Karim Zerrouki has 2 months unpaid tuition (5,500 DZD).',
      time: '15m ago',
    },
    {
      id: 2,
      type: 'info',
      title: 'Upcoming Session Today',
      message: 'Mathematics Group A starts at 16:00 in Room 204.',
      time: '1h ago',
    },
    {
      id: 3,
      type: 'danger',
      title: 'Teacher Payment Pending',
      message: 'Monthly salary disbursement prepared for Teacher Ahmed Benali.',
      time: '3h ago',
    },
    {
      id: 4,
      type: 'warning',
      title: 'High Attendance Rate Alert',
      message: 'English Group A reached 98% attendance this month.',
      time: '5h ago',
    },
  ];

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left Area: Mobile menu & Quick search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-full">
          <SearchInput
            value={searchValue}
            onValueChange={setSearchValue}
            placeholder="Search students, teachers, groups, rooms, payments..."
            shortcut="⌘K"
          />
        </div>
      </div>

      {/* Right Area: Actions, Notification Center, Date, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenQuickActions}
          icon={<Plus className="w-4 h-4" />}
          className="hidden sm:inline-flex"
        >
          Quick Action
        </Button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-xl transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
          </button>

          {showNotifications && (
            <>
              <div
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 z-30"
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-[#E2E8F0] z-40 overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-4 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#1E293B]">Notifications</span>
                    <Badge variant="danger" size="sm">4 New</Badge>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-[#4F6EF7] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-[#F1F5F9]">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                            n.type === 'danger'
                              ? 'bg-[#EF4444]'
                              : n.type === 'warning'
                              ? 'bg-[#F59E0B]'
                              : 'bg-[#3B82F6]'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#1E293B] truncate">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-[#94A3B8] mt-1 block">
                            {n.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 text-center border-t border-[#F1F5F9] bg-[#F8FAFC]">
                  <a
                    href="/settings"
                    className="text-xs font-medium text-[#4F6EF7] hover:underline"
                  >
                    Notification Preferences
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-[#E2E8F0] mx-0.5" />

        {/* Active User profile chip with interactive menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-1 p-1 rounded-xl hover:bg-[#F8FAFC] transition-all cursor-pointer select-none"
          >
            <Avatar
              name={user.name}
              role={user.role === 'ADMIN' ? 'Admin' : user.role === 'TEACHER' ? 'Teacher' : 'Student'}
              size="sm"
            />
            <div className="hidden lg:flex flex-col text-left leading-none">
              <span className="text-xs font-bold text-[#1E293B]">{user.name}</span>
              <span className="text-[10px] text-[#4F6EF7] font-semibold mt-0.5">
                {user.role === 'ADMIN' ? 'Super Admin' : user.role === 'TEACHER' ? 'Faculty Member' : 'Staff / Employee'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] hidden sm:block" />
          </button>

          {showProfileMenu && (
            <>
              <div
                onClick={() => setShowProfileMenu(false)}
                className="fixed inset-0 z-30"
              />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E2E8F0] z-40 overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <p className="text-xs font-bold text-[#1E293B]">{user.name}</p>
                  <p className="text-[11px] text-[#64748B] truncate">{user.email}</p>
                  <div className="mt-2">
                    <Badge
                      variant={user.role === 'ADMIN' ? 'primary' : user.role === 'TEACHER' ? 'info' : 'neutral'}
                      size="sm"
                    >
                      Role: {user.role}
                    </Badge>
                  </div>
                </div>

                {/* Role Switcher */}
                <div className="p-2 border-b border-[#F1F5F9]">
                  <span className="px-2 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-1.5">
                    Switch Active Role
                  </span>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        switchRole('ADMIN');
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        user.role === 'ADMIN' ? 'bg-[#EEF2FF] text-[#4F6EF7] font-bold' : 'hover:bg-[#F8FAFC] text-[#1E293B]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5" /> Super Admin
                      </span>
                      {user.role === 'ADMIN' && <span className="w-1.5 h-1.5 rounded-full bg-[#4F6EF7]" />}
                    </button>

                    <button
                      onClick={() => {
                        switchRole('TEACHER');
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        user.role === 'TEACHER' ? 'bg-[#EEF2FF] text-[#4F6EF7] font-bold' : 'hover:bg-[#F8FAFC] text-[#1E293B]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5" /> Teacher (Ahmed B.)
                      </span>
                      {user.role === 'TEACHER' && <span className="w-1.5 h-1.5 rounded-full bg-[#4F6EF7]" />}
                    </button>

                    <button
                      onClick={() => {
                        switchRole('EMPLOYEE');
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        user.role === 'EMPLOYEE' ? 'bg-[#EEF2FF] text-[#4F6EF7] font-bold' : 'hover:bg-[#F8FAFC] text-[#1E293B]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5" /> Staff (Fatima Z.)
                      </span>
                      {user.role === 'EMPLOYEE' && <span className="w-1.5 h-1.5 rounded-full bg-[#4F6EF7]" />}
                    </button>
                  </div>
                </div>

                {/* Profile Links & Sign Out */}
                <div className="p-2 space-y-1">
                  {user.role === 'TEACHER' && (
                    <a
                      href={`/teachers/${user.teacherId || 'tch-ahmed'}`}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[#1E293B] hover:bg-[#F8FAFC] transition-colors block"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#64748B]" /> My Teacher Profile & Salary
                    </a>
                  )}

                  {user.role === 'EMPLOYEE' && (
                    <a
                      href="/employees"
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[#1E293B] hover:bg-[#F8FAFC] transition-colors block"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#64748B]" /> Staff Registry & Profile
                    </a>
                  )}

                  <a
                    href="/settings"
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-[#1E293B] hover:bg-[#F8FAFC] transition-colors block"
                  >
                    System Preferences
                  </a>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#EF4444] hover:bg-red-50 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

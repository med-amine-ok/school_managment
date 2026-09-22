'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  School,
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  UserCheck,
  GraduationCap,
  Briefcase,
  Sparkles,
  Key,
} from 'lucide-react';
import { useAuth, UserRole, PRESET_USERS } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function LoginPage() {
  const router = useRouter();
  const { login, registeredAccounts } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [identifier, setIdentifier] = useState<string>(PRESET_USERS.ADMIN.username || 'admin');
  const [password, setPassword] = useState<string>('admin');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter custom added accounts (created by admin for teachers/employees)
  const customAccounts = registeredAccounts.filter(
    (a) => !['usr-admin', 'usr-teacher', 'usr-employee'].includes(a.id)
  );

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setIdentifier(PRESET_USERS[role].username || PRESET_USERS[role].email);
    setPassword(PRESET_USERS[role].password || 'admin');
    setErrorMessage(null);
  };

  const handleSelectCustomAccount = (account: any) => {
    setSelectedRole(account.role);
    setIdentifier(account.username || account.email);
    setPassword(account.password || 'password123');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await login(selectedRole, identifier, password);
      setTimeout(() => {
        router.push('/');
      }, 400);
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Invalid authentication credentials. Please check your username and password.'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#EEF2FF] to-transparent pointer-events-none -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#4F6EF7]/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#14B8A6]/5 blur-3xl pointer-events-none" />

      {/* Header / Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#4F6EF7] text-white shadow-lg shadow-[#4F6EF7]/20 mb-4 transition-transform hover:scale-105">
          <School className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E293B]">
          El-Nadjah Academy
        </h2>
        <p className="text-sm font-medium text-[#64748B] mt-1">
          مدرسة النجاح الخاصة — Enterprise Management System
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-2xl border border-[#E2E8F0]">
          {/* Role Selection Header */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2.5">
              Select Your Access Role
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => handleRoleSelect('ADMIN')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedRole === 'ADMIN'
                    ? 'bg-white text-[#4F6EF7] shadow-xs ring-1 ring-[#E2E8F0]'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mb-1" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('TEACHER')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedRole === 'TEACHER'
                    ? 'bg-white text-[#4F6EF7] shadow-xs ring-1 ring-[#E2E8F0]'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                <GraduationCap className="w-4 h-4 mb-1" />
                <span>Teacher</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('EMPLOYEE')}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedRole === 'EMPLOYEE'
                    ? 'bg-white text-[#4F6EF7] shadow-xs ring-1 ring-[#E2E8F0]'
                    : 'text-[#64748B] hover:text-[#1E293B]'
                }`}
              >
                <Briefcase className="w-4 h-4 mb-1" />
                <span>Staff</span>
              </button>
            </div>
          </div>

          {/* Active Preset User Summary Pill */}
          <div className="mb-6 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#4F6EF7]/10 text-[#4F6EF7] flex items-center justify-center font-bold text-sm shrink-0">
                {selectedRole === 'ADMIN' ? 'AK' : selectedRole === 'TEACHER' ? 'AB' : 'FZ'}
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E293B]">
                  {PRESET_USERS[selectedRole].name}
                </p>
                <p className="text-[11px] text-[#64748B]">
                  {PRESET_USERS[selectedRole].title}
                </p>
              </div>
            </div>
            <Badge
              variant={
                selectedRole === 'ADMIN'
                  ? 'primary'
                  : selectedRole === 'TEACHER'
                  ? 'info'
                  : 'neutral'
              }
              size="sm"
            >
              {selectedRole}
            </Badge>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                Username or Institutional Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#4F6EF7] focus:border-transparent transition-all font-mono"
                  placeholder="username or name@elnadjah.dz"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#1E293B]">
                  Password
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link has been dispatched to your institutional inbox.');
                  }}
                  className="text-xs font-semibold text-[#4F6EF7] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#4F6EF7] focus:border-transparent transition-all font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center text-xs text-[#64748B] cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-[#4F6EF7] rounded border-[#CBD5E1] focus:ring-[#4F6EF7]"
                />
                <span className="ml-2">Keep me signed in</span>
              </label>

              <span className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#14B8A6]" /> Portal Auth Active
              </span>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center text-sm font-bold shadow-md shadow-[#4F6EF7]/20"
                disabled={isLoading}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {isLoading ? 'Authenticating...' : `Sign In with Credentials`}
              </Button>
            </div>
          </form>

          {/* Newly Added Accounts (Created by Admin) */}
          {customAccounts.length > 0 && (
            <div className="mt-6 pt-5 border-t border-[#F1F5F9]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-[#1E293B] uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#4F6EF7]" /> Newly Added Staff & Teachers
                </p>
                <Badge variant="success" size="sm">
                  {customAccounts.length} Custom Account{customAccounts.length > 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="space-y-2">
                {customAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectCustomAccount(acc)}
                    className="w-full p-2.5 rounded-xl border border-[#E2E8F0] hover:border-[#4F6EF7] hover:bg-[#EEF2FF]/40 transition-all text-left flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#1E293B] group-hover:text-[#4F6EF7]">
                        {acc.name}
                      </div>
                      <div className="text-[11px] text-[#64748B] font-mono">
                        user: <span className="font-semibold text-[#1E293B]">{acc.username}</span> | pass: <span className="font-semibold text-[#1E293B]">{acc.password}</span>
                      </div>
                    </div>
                    <Badge
                      variant={acc.role === 'TEACHER' ? 'info' : 'neutral'}
                      size="sm"
                    >
                      {acc.role}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Demo Login Cards */}
          <div className="mt-6 pt-6 border-t border-[#F1F5F9]">
            <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2.5 text-center">
              1-Click Role Demonstrations
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleRoleSelect('ADMIN');
                  login('ADMIN', 'admin', 'admin');
                  setTimeout(() => router.push('/'), 200);
                }}
                className="p-2.5 rounded-xl border border-[#E2E8F0] hover:border-[#4F6EF7] hover:bg-[#EEF2FF]/50 transition-all text-left cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-[#1E293B] group-hover:text-[#4F6EF7]">
                  Super Admin
                </div>
                <div className="text-[10px] text-[#64748B]">All 20 Pages</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleRoleSelect('TEACHER');
                  login('TEACHER', 'ahmed.benali', 'teacher123');
                  setTimeout(() => router.push('/'), 200);
                }}
                className="p-2.5 rounded-xl border border-[#E2E8F0] hover:border-[#4F6EF7] hover:bg-[#EEF2FF]/50 transition-all text-left cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-[#1E293B] group-hover:text-[#4F6EF7]">
                  Teacher Role
                </div>
                <div className="text-[10px] text-[#64748B]">Classes & Salary</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleRoleSelect('EMPLOYEE');
                  login('EMPLOYEE', 'fatima.zohra', 'staff123');
                  setTimeout(() => router.push('/'), 200);
                }}
                className="p-2.5 rounded-xl border border-[#E2E8F0] hover:border-[#4F6EF7] hover:bg-[#EEF2FF]/50 transition-all text-left cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-[#1E293B] group-hover:text-[#4F6EF7]">
                  Staff Role
                </div>
                <div className="text-[10px] text-[#64748B]">Daily Operations</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security & System Info Footer */}
        <div className="mt-6 text-center text-xs text-[#94A3B8] flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
          <span>Encrypted 256-Bit SSL • Ministry of National Education Standard</span>
        </div>
      </div>
    </div>
  );
}

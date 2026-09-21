'use client';

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  ShieldCheck,
  Bell,
  Save,
  CheckCircle2,
  Globe,
  Key,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

export default function SettingsPage() {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState({
    nameEn: 'El-Nadjah Academy',
    nameAr: 'مدرسة النجاح الخاصة',
    address: '14 Rue Didouche Mourad, Alger Centre, Algérie',
    phone: '+213 21 73 45 67',
    email: 'direction@elnadjah-school.dz',
    currency: 'DZD (Algerian Dinar)',
    academicYear: '2025/2026',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const rolePermissions = [
    {
      role: 'Super Administrator',
      badge: 'Admin' as const,
      color: 'bg-[#7C3AED]',
      permissions: 'Full access to academic, financial, faculty payroll, and system preferences.',
    },
    {
      role: 'Faculty Instructor',
      badge: 'Teacher' as const,
      color: 'bg-[#0EA5E9]',
      permissions: 'Access to assigned classroom rosters, daily schedule, and session attendance recording.',
    },
    {
      role: 'Accountant & Bursar',
      badge: 'Staff' as const,
      color: 'bg-[#15803D]',
      permissions: 'Access to student tuition receipts, payroll ledger, and operating expense entries.',
    },
    {
      role: 'Front-Desk Receptionist',
      badge: 'Staff' as const,
      color: 'bg-[#64748B]',
      permissions: 'Student directory search, parent phone inquiries, and new applicant registration.',
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Institution Configuration & Security"
        subtitle="Manage academy profile, currency standards, and role-based access control permissions"
        breadcrumbs={[{ label: 'Settings' }]}
      />

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-2 text-xs font-bold text-[#15803D]">
          <CheckCircle2 className="w-5 h-5" />
          <span>Institutional configurations successfully updated!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): School Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Academy Identity & Regional Localization"
              subtitle="Institutional credentials displayed on official statements and tuition receipts"
            />
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                      School Name (Latin / French)
                    </label>
                    <input
                      type="text"
                      value={schoolInfo.nameEn}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, nameEn: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                      School Name (Arabic)
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={schoolInfo.nameAr}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, nameAr: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                      Primary Contact Email
                    </label>
                    <input
                      type="email"
                      value={schoolInfo.email}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, email: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                      Landline / Phone
                    </label>
                    <input
                      type="text"
                      value={schoolInfo.phone}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, phone: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                    Campus Address
                  </label>
                  <input
                    type="text"
                    value={schoolInfo.address}
                    onChange={(e) => setSchoolInfo({ ...schoolInfo, address: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                      Financial Currency
                    </label>
                    <input
                      type="text"
                      disabled
                      value={schoolInfo.currency}
                      className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#64748B] font-mono cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                      Academic Term
                    </label>
                    <input
                      type="text"
                      value={schoolInfo.academicYear}
                      onChange={(e) => setSchoolInfo({ ...schoolInfo, academicYear: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F1F5F9] flex justify-end">
                  <Button variant="primary" size="sm" type="submit" icon={<Save className="w-4 h-4" />}>
                    Save Preferences
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Security & Role-Based Access Control Architecture */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Role-Based Access (RBAC)"
              subtitle="Configured permissions structure ready for Supabase Row-Level Security"
            />
            <CardContent className="space-y-3 p-0 divide-y divide-[#F1F5F9]">
              {rolePermissions.map((rp, idx) => (
                <div key={idx} className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1E293B]">{rp.role}</span>
                    <span className={`w-2 h-2 rounded-full ${rp.color}`} />
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    {rp.permissions}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="p-4 bg-[#F8FAFC]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E293B]">
              <Key className="w-4 h-4 text-[#4F6EF7]" />
              <span>Supabase Ready</span>
            </div>
            <p className="text-[11px] text-[#64748B] mt-1.5 leading-relaxed">
              When transitioning to production Supabase, the user tables will map directly to these security roles via PostgreSQL RLS policies.
            </p>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

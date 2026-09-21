'use client';

import React from 'react';
import { AlertTriangle, Clock, CreditCard, UserX, Building2, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const AlertsWidget: React.FC = () => {
  const operationalAlerts = [
    {
      id: 'alt-1',
      title: 'Tuition Payment Overdue',
      description: '6 students have unpaid subscriptions for September 2026.',
      badgeText: 'Finance Alert',
      badgeVariant: 'danger' as const,
      icon: <CreditCard className="w-4 h-4 text-[#EF4444]" />,
      actionHref: '/finance/student-payments',
    },
    {
      id: 'alt-2',
      title: 'Low Attendance Notice',
      description: '2 students recorded attendance below 80% threshold.',
      badgeText: 'Academic Alert',
      badgeVariant: 'warning' as const,
      icon: <UserX className="w-4 h-4 text-[#F59E0B]" />,
      actionHref: '/attendance',
    },
    {
      id: 'alt-3',
      title: 'Teacher Payout Review',
      description: 'Monthly faculty salary payroll sheet pending administrative sign-off.',
      badgeText: 'Payroll',
      badgeVariant: 'info' as const,
      icon: <Clock className="w-4 h-4 text-[#3B82F6]" />,
      actionHref: '/finance/teacher-payments',
    },
    {
      id: 'alt-4',
      title: 'Room Capacity Advisory',
      description: 'Mathematics Group A reached 25/25 seating capacity in Room 204.',
      badgeText: 'Facilities',
      badgeVariant: 'neutral' as const,
      icon: <Building2 className="w-4 h-4 text-[#64748B]" />,
      actionHref: '/rooms',
    },
    {
      id: 'alt-5',
      title: 'Lab Maintenance Scheduled',
      description: 'Physics Lab 1 calibration and chemical replenishment due on Friday.',
      badgeText: 'Maintenance',
      badgeVariant: 'warning' as const,
      icon: <ShieldAlert className="w-4 h-4 text-[#F59E0B]" />,
      actionHref: '/rooms',
    },
    {
      id: 'alt-6',
      title: 'Baccalaureate Mock Exam Prep',
      description: 'Schedules for Grade 3AS terminal cohorts need final room allocation.',
      badgeText: 'Exam Board',
      badgeVariant: 'primary' as const,
      icon: <Sparkles className="w-4 h-4 text-[#4F6EF7]" />,
      actionHref: '/schedule',
    },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            <span>Operational Alerts</span>
            <Badge variant="danger" size="sm">
              {operationalAlerts.length} Action Items
            </Badge>
          </div>
        }
        subtitle="Priority tasks requiring administrative attention"
      />

      <CardContent className="divide-y divide-[#F1F5F9] p-0 max-h-[380px] overflow-y-auto">
        {operationalAlerts.map((alert) => (
          <a
            key={alert.id}
            href={alert.actionHref}
            className="p-4 hover:bg-[#F8FAFC] transition-colors flex items-start gap-3.5 group cursor-pointer block"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0 mt-0.5">
              {alert.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-[#1E293B] group-hover:text-[#4F6EF7] transition-colors truncate">
                  {alert.title}
                </h4>
                <Badge variant={alert.badgeVariant} size="sm">
                  {alert.badgeText}
                </Badge>
              </div>

              <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                {alert.description}
              </p>
            </div>

            <ArrowRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#4F6EF7] group-hover:translate-x-0.5 transition-all self-center shrink-0" />
          </a>
        ))}
      </CardContent>
    </Card>
  );
};

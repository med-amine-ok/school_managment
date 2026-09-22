'use client';

import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Wallet, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { getFinancialKPIs, formatCurrency } from '@/lib/calculations/financial';

export const FinanceOverviewWidget: React.FC = () => {
  const kpis = getFinancialKPIs();

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Financial Cash Flow Summary"
        subtitle="September 2026 — Real-time ledger accounting (DZD)"
        action={
          <a
            href="/finance"
            className="text-xs font-semibold text-[#4F6EF7] hover:underline cursor-pointer"
          >
            Finance Dashboard
          </a>
        }
      />

      <CardContent className="space-y-4">
        {/* Revenue vs Expenses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Monthly Revenue */}
          <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7]">
            <div className="flex items-center justify-between text-xs text-[#15803D]">
              <span className="font-semibold">Tuition Collections</span>
              <span className="flex items-center font-bold">
                <ArrowUpRight className="w-3.5 h-3.5" /> +12.4%
              </span>
            </div>
            <h4 className="text-xl font-extrabold text-[#14532D] mt-1">
              {formatCurrency(kpis.monthlyRevenue)}
            </h4>
            <p className="text-[11px] text-[#166534] mt-0.5">
              MRR target: {formatCurrency(kpis.mrr)}
            </p>
          </div>

          {/* Monthly Expenses */}
          <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2]">
            <div className="flex items-center justify-between text-xs text-[#B91C1C]">
              <span className="font-semibold">Operating Expenses</span>
              <span className="flex items-center font-bold">
                <ArrowDownRight className="w-3.5 h-3.5" /> Rent & Payroll
              </span>
            </div>
            <h4 className="text-xl font-extrabold text-[#7F1D1D] mt-1">
              {formatCurrency(kpis.monthlyExpenses)}
            </h4>
            <p className="text-[11px] text-[#991B1B] mt-0.5">
              Net balance: {formatCurrency(kpis.netRevenue)}
            </p>
          </div>
        </div>

        {/* Collection Rate & Outstanding Balance */}
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="text-[#64748B]">Tuition Collection Rate</span>
              <span className="font-bold text-[#1E293B]">{kpis.collectionRate}% Collected</span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#4F6EF7] h-full rounded-full transition-all duration-500"
                style={{ width: `${kpis.collectionRate}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-xs">
            <div className="flex items-center gap-1.5 text-[#64748B]">
              <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Outstanding Receivable:</span>
            </div>
            <span className="font-bold text-[#DC2626]">
              {formatCurrency(kpis.outstandingPayments)}
            </span>
          </div>
        </div>

        {/* Payroll Disbursements Summary */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-2.5 rounded-lg border border-[#E2E8F0] bg-white">
            <span className="text-[11px] text-[#64748B] block">Staff Payroll</span>
            <span className="text-xs font-bold text-[#1E293B] mt-0.5 block">
              {formatCurrency(kpis.employeePayroll)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg border border-[#E2E8F0] bg-white">
            <span className="text-[11px] text-[#64748B] block">Teacher Payroll</span>
            <span className="text-xs font-bold text-[#1E293B] mt-0.5 block">
              {formatCurrency(kpis.teacherPayroll)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

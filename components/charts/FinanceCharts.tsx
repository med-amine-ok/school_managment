'use client';

import React from 'react';
import { formatCurrency } from '@/lib/calculations/financial';

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

export const MonthlyComparisonChart: React.FC<{ data: MonthlyData[] }> = ({ data }) => {
  const maxVal = Math.max(...data.flatMap((d) => [d.revenue, d.expenses]), 1000000);

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-end gap-5 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#4F6EF7]" />
          <span className="text-[#1E293B] font-medium">Revenue (DZD)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#EF4444]" />
          <span className="text-[#1E293B] font-medium">Expenses (DZD)</span>
        </div>
      </div>

      {/* Bars */}
      <div className="grid grid-cols-3 gap-4 h-56 pt-6 pb-2 items-end border-b border-[#E2E8F0]">
        {data.map((item) => {
          const revHeight = Math.max(10, Math.round((item.revenue / maxVal) * 100));
          const expHeight = Math.max(10, Math.round((item.expenses / maxVal) * 100));

          return (
            <div key={item.month} className="flex flex-col items-center h-full justify-end group">
              <div className="w-full flex items-end justify-center gap-2 sm:gap-3 h-full">
                {/* Revenue Bar */}
                <div
                  className="w-5 sm:w-8 bg-[#4F6EF7] rounded-t-md transition-all duration-300 relative group-hover:brightness-95 flex flex-col justify-start items-center"
                  style={{ height: `${revHeight}%` }}
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 text-[10px] font-bold bg-[#1E293B] text-white px-1.5 py-0.5 rounded shadow whitespace-nowrap z-10 pointer-events-none">
                    {formatCurrency(item.revenue)}
                  </span>
                </div>

                {/* Expense Bar */}
                <div
                  className="w-5 sm:w-8 bg-[#EF4444] rounded-t-md transition-all duration-300 relative group-hover:brightness-95 flex flex-col justify-start items-center"
                  style={{ height: `${expHeight}%` }}
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 text-[10px] font-bold bg-[#1E293B] text-white px-1.5 py-0.5 rounded shadow whitespace-nowrap z-10 pointer-events-none">
                    {formatCurrency(item.expenses)}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#64748B] mt-2 truncate max-w-full">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const RevenueBySubjectChart: React.FC<{
  subjects: { name: string; revenue: number; color: string; count: number }[];
}> = ({ subjects }) => {
  const total = subjects.reduce((acc, s) => acc + s.revenue, 0) || 1;

  return (
    <div className="space-y-3">
      {subjects.map((sub) => {
        const percentage = Math.round((sub.revenue / total) * 100);
        return (
          <div key={sub.name} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1E293B] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
                {sub.name}
              </span>
              <span className="text-[#64748B] font-medium">
                {formatCurrency(sub.revenue)} <span className="text-[11px] text-[#94A3B8]">({percentage}%)</span>
              </span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%`, backgroundColor: sub.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

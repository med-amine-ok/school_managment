import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  icon: React.ReactNode;
  iconBgColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconBgColor = 'bg-[#EEF2FF] text-[#4F6EF7]',
}) => {
  return (
    <Card hoverable className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#64748B] tracking-wide uppercase">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-[#1E293B] mt-1.5 tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-[#94A3B8] mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor}`}
        >
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center font-semibold gap-0.5 ${
              trend.isNeutral
                ? 'text-[#64748B]'
                : trend.isPositive
                ? 'text-[#16A34A]'
                : 'text-[#DC2626]'
            }`}
          >
            {trend.isNeutral ? (
              <Minus className="w-3.5 h-3.5" />
            ) : trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {trend.value}
          </span>
          <span className="text-[#94A3B8]">vs last month</span>
        </div>
      )}
    </Card>
  );
};

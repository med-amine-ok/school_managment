import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  style,
}) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`bg-white border border-[#E2E8F0] rounded-xl shadow-xs ${
        hoverable ? 'hover:border-[#CBD5E1] hover:shadow-sm transition-all duration-200 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, className = '' }) => {
  return (
    <div className={`p-5 border-b border-[#F1F5F9] flex items-center justify-between gap-4 ${className}`}>
      <div>
        <h3 className="text-base font-semibold text-[#1E293B]">{title}</h3>
        {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`p-4 bg-[#F8FAFC] border-t border-[#F1F5F9] rounded-b-xl text-xs text-[#64748B] ${className}`}>
      {children}
    </div>
  );
};

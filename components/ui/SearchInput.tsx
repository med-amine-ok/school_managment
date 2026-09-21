'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onValueChange: (val: string) => void;
  placeholder?: string;
  shortcut?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onValueChange,
  placeholder = 'Search anything...',
  shortcut = '⌘K',
  className = '',
  ...props
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-[#94A3B8] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#F1F5F9]/80 focus:bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] pl-10 pr-16 py-2 rounded-xl border border-transparent focus:border-[#4F6EF7] focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 transition-all duration-200"
        {...props}
      />
      <div className="absolute right-3 flex items-center gap-1.5">
        {value ? (
          <button
            type="button"
            onClick={() => onValueChange('')}
            className="p-0.5 text-[#94A3B8] hover:text-[#1E293B] rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : shortcut ? (
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-[#64748B] bg-white border border-[#CBD5E1] rounded shadow-2xs select-none">
            {shortcut}
          </kbd>
        ) : null}
      </div>
    </div>
  );
};

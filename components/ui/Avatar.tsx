import React from 'react';

interface AvatarProps {
  name: string;
  photoUrl?: string;
  role?: 'Admin' | 'Teacher' | 'Student' | 'Parent' | 'Staff';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  photoUrl,
  role,
  size = 'md',
  className = '',
}) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-14 h-14 text-lg font-bold',
  };

  const roleRings = {
    Admin: 'ring-2 ring-[#7C3AED]/20 bg-[#F5F3FF] text-[#7C3AED]',
    Teacher: 'ring-2 ring-[#0EA5E9]/20 bg-[#F0F9FF] text-[#0284C7]',
    Student: 'ring-2 ring-[#14B8A6]/20 bg-[#F0FDFA] text-[#0D9488]',
    Parent: 'ring-2 ring-[#F97316]/20 bg-[#FFF7ED] text-[#EA580C]',
    Staff: 'ring-2 ring-[#64748B]/20 bg-[#F8FAFC] text-[#475569]',
  };

  const fallbackColor = role ? roleRings[role] : 'bg-[#EEF2FF] text-[#4F6EF7] ring-1 ring-[#CBD5E1]';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full font-semibold shrink-0 select-none overflow-hidden ${sizeClasses[size]} ${fallbackColor} ${className}`}
    >
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt={name}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  );
};

import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light' | 'auto';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  theme = 'auto'
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 shrink-0 select-none ${className}`}>
      {/* LendLoop Circular Infinite Loop Icon */}
      <div className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-tr from-[#28231F] via-[#342D28] to-[#28231F] p-1.5 flex items-center justify-center shadow-sm border border-[#3E3630]/40`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-[#9E6E4F]"
        >
          {/* Interlocking loop representing lending and sharing */}
          <path d="M7 17a5 5 0 0 1-1.5-3.5 5 5 0 0 1 5-5c1.5 0 2.8.7 3.7 1.8" />
          <path d="M17 7a5 5 0 0 1 1.5 3.5 5 5 0 0 1-5 5c-1.5 0-2.8-.7-3.7-1.8" />
          <circle cx="7" cy="17" r="1.5" fill="#9E6E4F" stroke="none" />
          <circle cx="17" cy="7" r="1.5" fill="#F7F3EC" stroke="none" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`font-bold tracking-tight text-[#28231F] ${textSizes[size]}`}>
          Lend<span className="text-[#9E6E4F]">Loop</span>
        </span>
      </div>
    </div>
  );
};

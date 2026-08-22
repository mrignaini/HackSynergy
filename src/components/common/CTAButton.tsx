import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface CTAButtonProps {
  to?: string;
  onClick?: () => void;
  variant?: 'primary-amber' | 'secondary-white' | 'dark-navy' | 'outline';
  icon?: React.ReactNode;
  title: string;
  subtext?: string;
  showArrow?: boolean;
  className?: string;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  to,
  onClick,
  variant = 'primary-amber',
  icon,
  title,
  subtext,
  showArrow = true,
  className = '',
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'primary-amber':
        return 'bg-[#EAA228] hover:bg-[#DE9419] text-slate-900 border border-amber-500/20 shadow-md hover:shadow-lg shadow-amber-500/15';
      case 'secondary-white':
        return 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/90 shadow-md hover:shadow-lg shadow-slate-900/5';
      case 'dark-navy':
        return 'bg-[#0B132B] hover:bg-[#15224D] text-white border border-slate-700 shadow-md hover:shadow-lg';
      case 'outline':
        return 'bg-transparent hover:bg-slate-100 text-slate-700 border border-slate-300';
      default:
        return 'bg-[#EAA228] text-slate-900';
    }
  };

  const content = (
    <div className="flex items-center justify-between w-full gap-3 py-3.5 px-4.5">
      <div className="flex items-center gap-3.5 text-left">
        {icon && (
          <div className={`p-2.5 rounded-xl flex items-center justify-center ${
            variant === 'primary-amber'
              ? 'bg-amber-600/15 text-slate-950'
              : variant === 'secondary-white'
              ? 'bg-slate-100 text-slate-800'
              : 'bg-white/10 text-white'
          }`}>
            {icon}
          </div>
        )}
        <div>
          <div className="text-[16px] font-bold tracking-tight leading-tight">
            {title}
          </div>
          {subtext && (
            <div className={`text-xs mt-0.5 font-normal ${
              variant === 'primary-amber' ? 'text-amber-950/80' : 'text-slate-500'
            }`}>
              {subtext}
            </div>
          )}
        </div>
      </div>
      {showArrow && (
        <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-transform group-hover:translate-x-0.5 ${
          variant === 'primary-amber'
            ? 'bg-amber-600/20 text-slate-950'
            : variant === 'secondary-white'
            ? 'bg-slate-100 text-slate-700'
            : 'bg-white/20 text-white'
        }`}>
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </div>
      )}
    </div>
  );

  const baseClasses = `group inline-flex items-center rounded-2xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${getStyles()} ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
};

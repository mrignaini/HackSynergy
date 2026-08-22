import React from 'react';
import { TrendingUp, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const EarningsCard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="relative rounded-[28px] bg-gradient-to-b from-[#0B132B] to-[#080E1F] border border-slate-800 shadow-2xl p-6 sm:p-8 text-white flex flex-col justify-between h-full overflow-hidden group hover:border-slate-700 transition-all duration-200">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
              {t('earningsBadge')}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-sans tracking-tight leading-snug">
              {t('earningsTitle')}
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/90 text-slate-300 border border-slate-700">
            {t('earningsFilterMonth')}
          </span>
        </div>

        {/* Amount & Trend */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <div className="text-3xl sm:text-4xl lg:text-[40px] font-black text-white font-sans tracking-tight">
              ₹18,500
            </div>
            <div className="text-xs font-semibold text-slate-400 mt-0.5">
              {t('totalIncomeLabel')}
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/80 text-emerald-400 text-xs font-bold w-fit">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t('growthIndicator')}</span>
          </div>
        </div>

        {/* Luminous Glowing Area Wave Chart SVG */}
        <div className="relative mt-6 mb-8 h-28 sm:h-32 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* Area Fill */}
            <path
              d="M 0,95 Q 60,90 120,70 T 240,65 T 320,35 T 390,15 L 390,120 L 0,120 Z"
              fill="url(#earningsGradient)"
            />

            {/* Glowing Neon Stroke */}
            <path
              d="M 0,95 Q 60,90 120,70 T 240,65 T 320,35 T 390,15"
              fill="none"
              stroke="#10B981"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#glow)"
            />

            {/* Active End Dot */}
            <circle cx="390" cy="15" r="5" fill="#10B981" className="animate-pulse" />
            <circle cx="390" cy="15" r="9" fill="#10B981" fillOpacity="0.3" />
          </svg>
        </div>
      </div>

      {/* 3-Column Footer Stats */}
      <div className="grid grid-cols-3 gap-2 pt-5 border-t border-slate-800/90 text-center">
        <div>
          <div className="text-xl sm:text-2xl font-black text-white font-sans">
            47
          </div>
          <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">
            {t('statJobsDone')}
          </div>
        </div>

        <div className="border-x border-slate-800/80">
          <div className="text-xl sm:text-2xl font-black text-white font-sans">
            286
          </div>
          <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">
            {t('statWorkDays')}
          </div>
        </div>

        <div>
          <div className="text-xl sm:text-2xl font-black text-white font-sans flex items-center justify-center gap-1">
            <span>4.7</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 inline -mt-0.5" />
          </div>
          <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">
            {t('statRatingLabel')}
          </div>
        </div>
      </div>

    </div>
  );
};

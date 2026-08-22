import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const DigitalIdentityCard: React.FC = () => {
  const { t } = useLanguage();

  const checklist = [
    t('check1'),
    t('check2'),
    t('check3'),
  ];

  return (
    <div className="relative rounded-[28px] bg-gradient-to-b from-[#FFFDF8] to-[#FAF6EE] border border-amber-200/90 shadow-card p-6 sm:p-8 overflow-hidden flex flex-col justify-between h-full group hover:shadow-card-hover transition-all duration-200">
      
      {/* Background Skyline Silhouette Graphic */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-20 text-amber-900">
        <svg width="220" height="90" viewBox="0 0 220 90" fill="currentColor">
          <rect x="10" y="45" width="20" height="45" />
          <rect x="35" y="30" width="25" height="60" />
          <rect x="65" y="55" width="18" height="35" />
          <rect x="88" y="20" width="30" height="70" />
          <rect x="123" y="40" width="22" height="50" />
          <rect x="150" y="15" width="28" height="75" />
          <rect x="183" y="50" width="25" height="40" />
        </svg>
      </div>

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wider bg-amber-100/90 text-amber-900 border border-amber-300/80">
            {t('digitalIdBadge')}
          </span>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        {/* Title & Subheading */}
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] font-sans tracking-tight mb-1">
          {t('digitalIdTitle')}
        </h3>
        <p className="text-sm text-slate-500 font-medium whitespace-pre-line mb-6">
          {t('digitalIdSub')}
        </p>

        {/* Verification Checklist */}
        <div className="space-y-3 mb-8">
          {checklist.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="relative z-10 pt-4 flex items-center justify-between">
        <Link
          to="/worker/digital-identity"
          className="text-sm font-bold text-amber-900 hover:text-amber-700 transition-colors flex items-center gap-2"
        >
          <span>{t('openDigitalProfile')}</span>
        </Link>
        <Link
          to="/worker/digital-identity"
          className="w-10 h-10 rounded-full bg-[#EAA228] hover:bg-[#DE9419] text-slate-950 flex items-center justify-center shadow-md hover:scale-105 transition-all"
        >
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Link>
      </div>

    </div>
  );
};

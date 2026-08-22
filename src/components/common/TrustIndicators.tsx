import React from 'react';
import { ShieldCheck, CheckCircle, Lock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const TrustIndicators: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-2 text-xs sm:text-sm font-medium text-slate-700">
      {/* 1. Trusted Platform */}
      <div className="inline-flex items-center gap-2">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600">
          <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>
        <span>{t('trustedPlatform')}</span>
      </div>

      {/* 2. Verified Profiles */}
      <div className="inline-flex items-center gap-2">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>
        <span>{t('verifiedProfiles')}</span>
      </div>

      {/* 3. Safe & Secure */}
      <div className="inline-flex items-center gap-2">
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600">
          <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
        </div>
        <span>{t('secureSafe')}</span>
      </div>
    </div>
  );
};

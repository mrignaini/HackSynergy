import React from 'react';
import { CheckCircle, Layers } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const WorkerGreeting: React.FC = () => {
  const { t, language } = useLanguage();
  const { auth } = useAuth();

  const worker = auth.workerProfile;
  const displayName = worker?.fullName
    ? (language === 'hi' ? `नमस्ते, ${worker.fullName.split(' ')[0]}!` : `Namaste, ${worker.fullName.split(' ')[0]}!`)
    : t('workerGreetingName');

  const avatarDisplay = worker?.avatar || 'RK';
  const tradeDisplay = worker?.skills?.length
    ? `${language === 'hi' ? 'शुभ प्रभात' : 'Good Morning'} • ${worker.skills[0]} • Grade A`
    : t('workerStatusSubtitle');

  return (
    <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-4 sm:p-5 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Left: Worker Profile Greeting */}
        <div className="flex items-center gap-3.5">
          {/* Avatar with initials or emoji and checkmark badge */}
          <div className="relative">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 flex items-center justify-center text-slate-900 font-extrabold text-lg sm:text-2xl shadow-2xs">
              {avatarDisplay}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-2xs">
              <CheckCircle className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          {/* Worker Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B132B] font-sans tracking-tight">
                {displayName}
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {t('workerVerifiedBadge')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              {tradeDisplay}
            </p>
          </div>
        </div>

        {/* Right: Quick Services Info Pill Box */}
        <div className="rounded-2xl bg-slate-50 border border-slate-100/90 p-3 sm:px-4 sm:py-2.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
              {t('workerServicesBadge')}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-normal leading-tight">
              {t('workerServicesSubtext')}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

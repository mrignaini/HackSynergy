import React from 'react';
import { HardHat, MapPin, IndianRupee, Clock, ArrowRight, X } from 'lucide-react';
import type { Job } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ApplicationConfirmModalProps {
  job: Job | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ApplicationConfirmModal: React.FC<ApplicationConfirmModalProps> = ({
  job,
  onClose,
  onConfirm,
}) => {
  const { t, language } = useLanguage();

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-[28px] border border-slate-200 p-6 shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-lg font-black text-[#0B132B]">
            {t('applyModalTitle')}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mini Job Summary */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2 text-xs sm:text-sm">
          <div className="font-extrabold text-slate-900 text-base">
            {language === 'hi' ? job.titleHi : job.title}
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.location.locality}, {job.location.city}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 font-bold">
            <span className="text-slate-700">दैनिक वेतन: ₹{job.wagePerDay}/दिन</span>
            <span className="text-slate-700">अवधि: {job.durationDays} दिन</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          {t('btnApplySubtext')} आपका सत्यापित प्रोफ़ाइल व संपर्क ठेकेदार को साझा किया जाएगा।
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
          >
            {t('applyModalCancelBtn')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3.5 rounded-2xl bg-[#EAA228] hover:bg-[#DE9419] text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>{t('applyModalConfirmBtn')}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};

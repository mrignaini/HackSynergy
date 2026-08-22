import React from 'react';
import { CheckCircle2, ArrowRight, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Job } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ApplicationSuccessModalProps {
  job: Job | null;
  onClose: () => void;
}

export const ApplicationSuccessModal: React.FC<ApplicationSuccessModalProps> = ({
  job,
  onClose,
}) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-md bg-white rounded-[32px] border border-slate-200 p-6 sm:p-8 shadow-2xl text-center space-y-5">
        
        {/* Animated Green Circle */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            {t('appStatusPending')}
          </span>
          <h3 className="text-2xl font-black text-[#0B132B] mt-2">
            {t('appSuccessTitle')}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {t('appSuccessSub')}
          </p>
        </div>

        {/* Job Summary Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1 text-xs">
          <div className="font-extrabold text-slate-900 text-sm">
            {language === 'hi' ? job.titleHi : job.title}
          </div>
          <div className="text-slate-600">
            📍 {job.location.locality}, {job.location.city} • ₹{job.wagePerDay}/दिन
          </div>
          <div className="text-emerald-700 font-bold pt-1">
            स्थिति: आवेदन प्राप्त (Pending Review)
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/worker/applications');
            }}
            className="w-full py-3.5 rounded-2xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{t('btnViewMyApplications')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
          >
            {t('btnBackToMarket')}
          </button>
        </div>

      </div>
    </div>
  );
};

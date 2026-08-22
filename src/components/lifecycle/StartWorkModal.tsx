import React from 'react';
import { Play, X, MapPin, IndianRupee, Clock, ArrowRight } from 'lucide-react';
import type { Job } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface StartWorkModalProps {
  job: Job | null;
  onClose: () => void;
  onConfirmStart: () => void;
}

export const StartWorkModal: React.FC<StartWorkModalProps> = ({
  job,
  onClose,
  onConfirmStart,
}) => {
  const { t, language } = useLanguage();

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-[28px] border border-slate-200 p-6 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-base font-black text-[#0B132B]">
            काम शुरू करें? (Start this job?)
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2 text-xs">
          <div className="font-extrabold text-slate-900 text-sm">
            {language === 'hi' ? job.titleHi : job.title}
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{job.location.locality}, {job.location.city}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 font-bold">
            <span>दर: ₹{job.wagePerDay} / दिन</span>
            <span>अवधि: {job.durationDays} दिन</span>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          काम शुरू करने के बाद कार्य की स्थिति <strong>In Progress (प्रगति पर)</strong> हो जाएगी एवं उपस्थिति दर्ज होना शुरू होगी।
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
          >
            रद्द करें
          </button>
          <button
            type="button"
            onClick={onConfirmStart}
            className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{t('btnStartWork')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

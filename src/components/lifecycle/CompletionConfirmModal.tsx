import React from 'react';
import { CheckCircle2, X, MapPin, IndianRupee } from 'lucide-react';
import type { Job } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface CompletionConfirmModalProps {
  job: Job | null;
  onClose: () => void;
  onConfirmComplete: () => void;
}

export const CompletionConfirmModal: React.FC<CompletionConfirmModalProps> = ({
  job,
  onClose,
  onConfirmComplete,
}) => {
  const { t, language } = useLanguage();

  if (!job) return null;

  const totalCalculated = job.wagePerDay * (job.durationDays || 1);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-[28px] border border-slate-200 p-6 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-base font-black text-[#0B132B]">
            काम पूरा घोषित करें? (Complete this job?)
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
          <div className="font-extrabold text-slate-900 text-sm">
            {language === 'hi' ? job.titleHi : job.title}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-emerald-200 font-bold text-slate-800">
            <span>कुल पारिश्रमिक राशि:</span>
            <span className="text-emerald-800 font-sans text-base">₹{totalCalculated.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          पुष्टि करने पर इस कार्य की प्रमाणित पर्ची (Payment Record) बन जाएगी और दोनों पक्षों के लिए रेटिंग विकल्प खुल जाएगा।
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
            onClick={onConfirmComplete}
            className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>काम पूरा हुआ (Confirm)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

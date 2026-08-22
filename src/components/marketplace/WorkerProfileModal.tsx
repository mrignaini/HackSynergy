import React from 'react';
import {
  X,
  Star,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Briefcase,
  Award,
  Calendar,
  IndianRupee,
  Check,
} from 'lucide-react';
import type { Worker } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface WorkerProfileModalProps {
  worker: Worker | null;
  onClose: () => void;
  onHireClick: (worker: Worker) => void;
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({
  worker,
  onClose,
  onHireClick,
}) => {
  const { t } = useLanguage();

  if (!worker) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-sm">
                {worker.avatar || '👷🏽‍♂️'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-[#0B132B]">
                  {worker.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  सत्यापित पहचान
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-amber-900 mt-0.5">
                🧱 {worker.primarySkill}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{worker.locality}, {worker.city}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white hover:bg-slate-200 text-slate-500 shadow-2xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Key 4-Metrics Bar */}
          <div className="grid grid-cols-4 gap-2 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-center">
            <div className="p-1">
              <div className="flex items-center justify-center gap-0.5 text-base sm:text-lg font-black text-slate-900">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>{worker.rating}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">रेटिंग</span>
            </div>

            <div className="p-1 border-l border-amber-200">
              <div className="text-base sm:text-lg font-black text-slate-900">
                {worker.completedJobsCount}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">काम पूरे किए</span>
            </div>

            <div className="p-1 border-l border-amber-200">
              <div className="text-base sm:text-lg font-black text-slate-900">
                {worker.experienceYears} वर्ष
              </div>
              <span className="text-[10px] text-slate-500 font-medium">अनुभव</span>
            </div>

            <div className="p-1 border-l border-amber-200">
              <div className="text-base sm:text-lg font-black text-emerald-700">
                उपलब्ध
              </div>
              <span className="text-[10px] text-slate-500 font-medium">स्थिति</span>
            </div>
          </div>

          {/* Bio / Description */}
          {worker.bio && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                कार्य विवरण व विशेषज्ञता
              </h4>
              <p className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed">
                {worker.bio}
              </p>
            </div>
          )}

          {/* Trust Indicators Checklist */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              प्रमाणित पहचान व सरकारी रिकॉर्ड
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>सत्यापित मोबाइल नंबर</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>e-Shram / BOCW लिंक्ड</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>डिजिटल वर्क रिकॉर्ड उपलब्ध</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>बैंक खाता सत्यापित</span>
              </div>
            </div>
          </div>

          {/* Work History Preview */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              हालिया कार्य इतिहास (Work History)
            </h4>
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">विला निर्माण एवं ईंट चिनाई कार्य</div>
                  <div className="text-[11px] text-slate-500">राज नगर, गाजियाबाद • जुलाई 2026</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    पूर्ण (5.0 ★)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">बाउंड्री वॉल एवं प्लास्टर कार्य</div>
                  <div className="text-[11px] text-slate-500">लाजपत नगर, दिल्ली • जून 2026</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    पूर्ण (4.8 ★)
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
              ₹{worker.dailyWageRate}
              <span className="text-xs text-slate-500 font-normal ml-1">/ दिन</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-bold">तुरंत काम पर उपलब्ध</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`/worker/${worker.id}/identity`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>कार्य पहचान (Work Identity)</span>
            </a>

            <button
              type="button"
              onClick={() => onHireClick(worker)}
              className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl bg-[#EAA228] hover:bg-[#DE9419] text-slate-950 font-black text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{t('btnHireThisWorker')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

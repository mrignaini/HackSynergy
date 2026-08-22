import React from 'react';
import {
  X,
  HardHat,
  MapPin,
  Clock,
  IndianRupee,
  ShieldCheck,
  Star,
  CheckCircle2,
  Calendar,
  Phone,
  Briefcase,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import type { Job } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
  onApplyClick: (job: Job) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  onClose,
  onApplyClick,
}) => {
  const { t, language } = useLanguage();
  const { calculateMatchScore, hasApplied } = useJobs();
  const { auth } = useAuth();

  if (!job) return null;

  const match = calculateMatchScore(job);
  const isApplied = hasApplied(job.id);
  const isClosed = job.status === 'completed' || job.status === 'cancelled';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                {job.category}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>{match.score}% {t('matchScoreLabel')}</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0B132B]">
              {language === 'hi' ? job.titleHi : job.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors shadow-2xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Wage & Key Shift Metrics */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50/60 to-orange-50/40 border border-amber-200 text-center">
            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">दैनिक पारिश्रमिक</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans mt-0.5">
                ₹{job.wagePerDay}
              </div>
              <span className="text-[10px] text-slate-500">/ दिन</span>
            </div>

            <div className="border-x border-amber-200">
              <span className="text-[11px] text-slate-500 font-semibold block">कार्य अवधि</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans mt-0.5">
                {job.durationDays} दिन
              </div>
              <span className="text-[10px] text-slate-500">कुल कार्य दिवस</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 font-semibold block">कामगार आवश्यकता</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans mt-0.5">
                {job.requiredWorkersCount}
              </div>
              <span className="text-[10px] text-slate-500">कारीगर</span>
            </div>
          </div>

          {/* Hirer Trust Profile Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-lg">
                  {job.hirerName.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 text-base">{job.hirerName}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{job.hirerType}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-sm font-black text-slate-900">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>4.7</span>
                </div>
                <span className="text-[10px] text-slate-400">12 काम पोस्ट किए</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-extrabold text-[#0B132B] mb-1.5">
              कार्य विवरण (Work Description)
            </h4>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl">
              {language === 'hi' ? job.descriptionHi : job.description}
            </p>
          </div>

          {/* Timing & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-500 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block">{t('workHoursLabel')}</span>
                <span className="font-bold text-slate-800">{job.shiftTiming}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-500 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block">{t('startDateLabel')}</span>
                <span className="font-bold text-slate-800">{job.startDate}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 sm:col-span-2">
              <MapPin className="w-5 h-5 text-slate-500 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block">कार्यस्थल का पता</span>
                <span className="font-bold text-slate-800">
                  {job.location.address}, {job.location.locality}, {job.location.city}
                </span>
              </div>
            </div>
          </div>

          {/* Perks */}
          {job.perksProvided && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                उपलब्ध सुविधाएं • Perks
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.perksProvided.map((perk, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200"
                  >
                    ✓ {perk}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-white flex items-center justify-between gap-4">
          <div className="text-left">
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
              ₹{job.wagePerDay}
              <span className="text-xs text-slate-500 font-normal ml-1">/ दिन</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-bold">100% पक्का भुगतान</span>
          </div>

          {isApplied ? (
            <button
              disabled
              className="px-6 py-3.5 rounded-2xl bg-emerald-100 text-emerald-900 font-bold text-sm flex items-center gap-2 cursor-not-allowed border border-emerald-300"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>{t('btnApplicationSent')}</span>
            </button>
          ) : isClosed ? (
            <button
              disabled
              className="px-6 py-3.5 rounded-2xl bg-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed"
            >
              {t('statusJobClosed')}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onApplyClick(job)}
              className="px-8 py-3.5 rounded-2xl bg-[#EAA228] hover:bg-[#DE9419] text-slate-950 font-black text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>{t('btnApplyForJob')}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import {
  HardHat,
  MapPin,
  Clock,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Users,
  Sparkles,
} from 'lucide-react';
import type { Job } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useJobs } from '../../context/JobContext';

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => {
  const { t, language } = useLanguage();
  const { calculateMatchScore, hasApplied, getApplicationForJob } = useJobs();

  const match = calculateMatchScore(job);
  const isApplied = hasApplied(job.id);
  const isClosed = job.status === 'completed' || job.status === 'cancelled';

  return (
    <div
      className={`rounded-[26px] bg-white border transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between hover:shadow-card-hover ${
        isApplied
          ? 'border-emerald-300 bg-emerald-50/20'
          : isClosed
          ? 'border-slate-200 opacity-75'
          : match.score >= 85
          ? 'border-amber-300 shadow-card ring-1 ring-amber-400/20'
          : 'border-slate-200/90 shadow-card'
      }`}
    >
      <div>
        {/* Top Match Badge & Status Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category Tag */}
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-black">
              {job.category}
            </span>

            {/* Match Score Badge */}
            {!isClosed && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  match.score >= 85
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{match.score}% {t('matchScoreLabel')}</span>
                <span className="text-[10px] text-slate-500 font-normal">({match.reason})</span>
              </span>
            )}
          </div>

          {/* Time Posted */}
          <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
            {job.createdAt}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-extrabold text-[#0B132B] mb-2 leading-snug">
          {language === 'hi' ? job.titleHi : job.title}
        </h3>

        {/* Hirer & Location */}
        <div className="space-y-1 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{job.hirerName}</span>
              <span className="text-[10px] text-slate-400 font-normal">({job.hirerType})</span>
            </div>
            <span className="text-[11px] text-amber-700 font-semibold">4.7 ★</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 pt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.location.locality}, {job.location.city}</span>
          </div>
        </div>

        {/* Wage & Duration Pill Box */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/50 border border-amber-200/70 mb-4">
          <div>
            <div className="text-xl font-black text-slate-900 font-sans flex items-center">
              <IndianRupee className="w-4 h-4" />
              <span>{job.wagePerDay}</span>
              <span className="text-xs font-semibold text-slate-500 ml-1">/ दिन</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">दैनिक पक्का वेतन</span>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-slate-900 flex items-center justify-end gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{job.durationDays} दिन</span>
            </div>
            <span className="text-[10px] text-slate-500 font-normal">
              {job.requiredWorkersCount} कामगारों की जरूरत
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
        {isApplied ? (
          <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-100/80 text-emerald-900 text-xs font-bold flex items-center justify-between border border-emerald-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{t('btnApplicationSent')}</span>
            </span>
            <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded-full font-bold">
              {t('appStatusPending')}
            </span>
          </div>
        ) : isClosed ? (
          <div className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center gap-1">
            <AlertCircle className="w-4 h-4" />
            <span>{t('statusJobClosed')}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onViewDetails(job)}
            className="w-full py-3 rounded-2xl bg-[#0B132B] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{t('btnViewJob')}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2]" />
          </button>
        )}
      </div>
    </div>
  );
};

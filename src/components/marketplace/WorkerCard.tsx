import React from 'react';
import {
  Star,
  MapPin,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
} from 'lucide-react';
import type { Worker } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useJobs } from '../../context/JobContext';

interface WorkerCardProps {
  worker: Worker;
  onViewProfile: (worker: Worker) => void;
  targetSkill?: string;
  targetCity?: string;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  onViewProfile,
  targetSkill = 'Mason',
  targetCity = 'Ghaziabad',
}) => {
  const { t } = useLanguage();
  const { calculateWorkerMatchScore } = useJobs();

  const match = calculateWorkerMatchScore(worker, targetSkill, targetCity);

  return (
    <div className="rounded-[26px] bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between">
      <div>
        {/* Top Header: Avatar, Name, Match Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-2xs">
                {worker.avatar || '👷🏽‍♂️'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
                <CheckCircle2 className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base sm:text-lg font-extrabold text-[#0B132B]">
                  {worker.name}
                </h3>
              </div>
              <p className="text-xs font-bold text-amber-900 mt-0.5">
                🧱 {worker.primarySkill}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-0.5 text-slate-800 font-extrabold">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  {worker.rating}
                </span>
                <span>• {worker.experienceYears} वर्ष अनुभव</span>
              </div>
            </div>
          </div>

          {/* Match Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shrink-0">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>{match.score}% {t('matchScoreLabel')}</span>
          </span>
        </div>

        {/* Location and Jobs Stat Strip */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{worker.locality}, {worker.city}</span>
          </div>
          <span className="font-bold text-slate-900">{worker.completedJobsCount} काम पूरे किए</span>
        </div>

        {/* Availability Badge */}
        <div className="flex items-center justify-between text-xs mb-3 px-1">
          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>🟢 {t('statusAvailable')}</span>
          </span>
          <span className="font-sans font-black text-slate-900 text-sm">
            ₹{worker.dailyWageRate} <span className="text-[11px] text-slate-500 font-normal">/ दिन</span>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onViewProfile(worker)}
          className="flex-1 py-2.5 rounded-2xl bg-[#0B132B] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center justify-center gap-1.5"
        >
          <span>{t('btnViewWorkerProfile')}</span>
        </button>

        <a
          href={`/worker/${worker.id}/identity`}
          target="_blank"
          rel="noreferrer"
          className="p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold transition-all flex items-center gap-1 shrink-0"
          title="कार्य पहचान (Digital Work Identity)"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span className="hidden sm:inline">पहचान</span>
        </a>
      </div>
    </div>
  );
};

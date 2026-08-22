import React, { useState } from 'react';
import { HardHat, MapPin, IndianRupee, Clock, ArrowRight, X, Calendar } from 'lucide-react';
import type { Worker, Job } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useJobs } from '../../context/JobContext';

interface HireConfirmModalProps {
  worker: Worker | null;
  onClose: () => void;
  onConfirmHire: (jobId: string) => void;
}

export const HireConfirmModal: React.FC<HireConfirmModalProps> = ({
  worker,
  onClose,
  onConfirmHire,
}) => {
  const { t } = useLanguage();
  const { jobs } = useJobs();

  // Pick open job or create a default job selection
  const openJobs = jobs.filter((j) => j.status === 'open');
  const [selectedJobId, setSelectedJobId] = useState<string>(
    openJobs[0]?.id || 'job-1'
  );

  if (!worker) return null;

  const chosenJob = jobs.find((j) => j.id === selectedJobId) || openJobs[0] || jobs[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-[28px] border border-slate-200 p-6 shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-lg font-black text-[#0B132B]">
            {t('confirmHireTitle')}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Worker Summary Banner */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center text-2xl shrink-0 font-bold">
            {worker.avatar || '👷🏽‍♂️'}
          </div>
          <div>
            <div className="font-extrabold text-slate-900 text-sm">{worker.name}</div>
            <div className="text-xs text-amber-900 font-semibold">{worker.primarySkill}</div>
            <div className="text-[11px] text-slate-500">📍 {worker.locality}, {worker.city} • {worker.rating} ★</div>
          </div>
        </div>

        {/* Select Job to Assign */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            किस कार्य के लिए नियुक्त कर रहे हैं? (Select Job)
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.titleHi || j.title} (₹{j.wagePerDay}/दिन)
              </option>
            ))}
          </select>
        </div>

        {/* Contract Specifics */}
        {chosenJob && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">वेतन दर:</span>
              <strong className="text-slate-900 font-sans">₹{chosenJob.wagePerDay} / दिन</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">कार्य स्थल:</span>
              <strong className="text-slate-900">{chosenJob.location.locality}, {chosenJob.location.city}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">शुरुआत तिथि:</span>
              <strong className="text-slate-900">{chosenJob.startDate}</strong>
            </div>
          </div>
        )}

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
            onClick={() => onConfirmHire(selectedJobId)}
            className="flex-1 py-3.5 rounded-2xl bg-[#EAA228] hover:bg-[#DE9419] text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>{t('confirmHireBtn')}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};

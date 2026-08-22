import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Clock,
  MapPin,
  IndianRupee,
  Search,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useJobs } from '../../context/JobContext';
import { WorkerBottomNav } from '../../components/navigation/WorkerBottomNav';
import { JobDetailsModal } from '../../components/marketplace/JobDetailsModal';
import type { Job } from '../../types';

export const WorkerApplicationsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { applications, jobs } = useJobs();
  const [activeFilter, setActiveFilter] = useState<'all' | 'applied' | 'accepted' | 'rejected'>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filterTabs = [
    { id: 'all', label: t('filterAll') },
    { id: 'applied', label: t('appStatusPending') },
    { id: 'accepted', label: t('appStatusAccepted') },
    { id: 'rejected', label: t('appStatusRejected') },
  ];

  const filteredApps = applications.filter((app) => {
    if (activeFilter === 'all') return true;
    return app.status === activeFilter;
  });

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header */}
        <div className="rounded-[28px] bg-[#0B132B] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <FileText className="w-3.5 h-3.5" />
              Application Tracker
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {t('myApplicationsTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {t('myApplicationsSub')}
            </p>
          </div>
          <div className="absolute right-0 bottom-0 w-28 h-7 hazard-stripe-pattern transform rotate-6 translate-x-3 translate-y-2 opacity-70" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => {
              const matchedJob = jobs.find((j) => j.id === app.jobId);
              const jobTitle = matchedJob
                ? (language === 'hi' ? matchedJob.titleHi : matchedJob.title)
                : 'Need a Mason for Construction Work';
              const locality = matchedJob?.location.locality || 'Raj Nagar';
              const city = matchedJob?.location.city || 'Ghaziabad';
              const wage = matchedJob?.wagePerDay || app.wageAgreed || 1000;
              const duration = matchedJob?.durationDays || 3;

              return (
                <div
                  key={app.id}
                  className="p-5 sm:p-6 rounded-[24px] bg-white border border-slate-200/90 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-card-hover transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                        {app.workerSkill}
                      </span>

                      {/* Status Badge */}
                      {app.status === 'applied' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold">
                          <Clock className="w-3 h-3" />
                          <span>{t('appStatusPending')}</span>
                        </span>
                      )}
                      {app.status === 'accepted' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{t('appStatusAccepted')}</span>
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-800 border border-red-300 text-xs font-bold">
                          <AlertCircle className="w-3 h-3" />
                          <span>{t('appStatusRejected')}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                      {jobTitle}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {locality}, {city}
                      </span>
                      <span>• {duration} दिन (Days)</span>
                      <span className="text-slate-400">आवेदन: {app.appliedDate}</span>
                    </div>
                  </div>

                  {/* Wage & Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="text-right">
                      <div className="text-xl font-black text-slate-900 font-sans">
                        ₹{wage}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">प्रतिदिन</div>
                    </div>

                    {matchedJob && (
                      <button
                        type="button"
                        onClick={() => setSelectedJob(matchedJob)}
                        className="px-4 py-2.5 rounded-xl bg-[#0B132B] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                      >
                        <span>विवरण देखें</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 px-4 rounded-[28px] bg-white border border-slate-200 p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                कोई कार्य आवेदन नहीं मिला
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                मार्केटप्लेस में नए काम खोजें और सीधे ठेकेदारों को आवेदन भेजें।
              </p>
              <Link
                to="/find-work"
                className="inline-block px-5 py-2.5 rounded-xl bg-[#EAA228] text-slate-950 text-xs font-bold shadow-sm mt-2"
              >
                काम खोजें →
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApplyClick={() => {}}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <WorkerBottomNav />
    </div>
  );
};

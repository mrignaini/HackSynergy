import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Play,
  CheckCircle2,
  Clock,
  MapPin,
  IndianRupee,
  Star,
  FileText,
  ShieldCheck,
  Calendar,
  Phone,
  ArrowRight,
} from 'lucide-react';
import type { Job } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { WorkerBottomNav } from '../../components/navigation/WorkerBottomNav';
import { RatingModal } from '../../components/lifecycle/RatingModal';
import { PaymentRecordModal } from '../../components/lifecycle/PaymentRecordModal';
import { StartWorkModal } from '../../components/lifecycle/StartWorkModal';
import { CompletionConfirmModal } from '../../components/lifecycle/CompletionConfirmModal';
import type { PaymentRecordItem } from '../../context/JobContext';

export const MyWorkPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { jobs, startWork, completeWork, paymentRecords, hasRated, getRatingForJobAndUser } = useJobs();
  const { auth } = useAuth();

  const [activeTab, setActiveTab] = useState<'current' | 'completed'>('current');

  // Modals state
  const [jobToStart, setJobToStart] = useState<Job | null>(null);
  const [jobToComplete, setJobToComplete] = useState<Job | null>(null);
  const [ratingJob, setRatingJob] = useState<Job | null>(null);
  const [viewingPaymentRecord, setViewingPaymentRecord] = useState<PaymentRecordItem | null>(null);

  // Active / In-progress jobs (either open/in_progress or seeded active work)
  const currentJobs = jobs.filter((j) => j.status === 'in_progress' || j.status === 'open');
  const completedJobs = jobs.filter((j) => j.status === 'completed');

  const handleStartWorkConfirm = () => {
    if (!jobToStart) return;
    startWork(jobToStart.id);
    setJobToStart(null);
  };

  const handleCompleteWorkConfirm = () => {
    if (!jobToComplete) return;
    completeWork(jobToComplete.id);
    setJobToComplete(null);
    setActiveTab('completed');
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header */}
        <div className="rounded-[28px] bg-[#0B132B] text-white p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-2 inline-block">
              Worker Shifts & Attendance
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-sans">
              {t('myWorkTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {t('myWorkSub')}
            </p>
          </div>

          <Link
            to="/worker/financial-hub"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>आय बहीखाता (Wage Ledger) →</span>
          </Link>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl max-w-sm">
          <button
            type="button"
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'current'
                ? 'bg-white text-[#0B132B] shadow-2xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{t('tabActiveWork')} ({currentJobs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'completed'
                ? 'bg-white text-[#0B132B] shadow-2xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('tabCompletedWork')} ({completedJobs.length})</span>
          </button>
        </div>

        {/* TAB 1: ACTIVE / CURRENT WORK */}
        {activeTab === 'current' && (
          <div className="space-y-4">
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => {
                const isInProgress = job.status === 'in_progress';

                return (
                  <div
                    key={job.id}
                    className={`p-5 sm:p-6 rounded-[26px] bg-white border transition-all space-y-4 shadow-card ${
                      isInProgress ? 'border-emerald-300 ring-1 ring-emerald-400/20' : 'border-slate-200/90'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                          {job.category}
                        </span>

                        {isInProgress ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>🟢 कार्य प्रगति पर (In Progress)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                            <span>नियुक्ति पक्की (Confirmed)</span>
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-slate-500 font-bold">
                        दर: ₹{job.wagePerDay} / दिन
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                        {language === 'hi' ? job.titleHi : job.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location.locality}, {job.location.city}
                        </span>
                        <span>• ठेकेदार: <strong>{job.hirerName}</strong></span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>कार्य प्रगति:</span>
                        <span className="text-emerald-700">{isInProgress ? 'Day 2 of 3' : 'Day 1 (Ready)'}</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: isInProgress ? '66%' : '15%' }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>शुरुआत: {job.startDate}</span>
                        <span>समय: {job.shiftTiming}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                      <a
                        href={`tel:${job.hirerPhone}`}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>ठेकेदार को कॉल करें</span>
                      </a>

                      {!isInProgress ? (
                        <button
                          type="button"
                          onClick={() => setJobToStart(job)}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>{t('btnStartWork')}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setJobToComplete(job)}
                          className="px-5 py-2.5 rounded-xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t('btnMarkCompleted')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 px-4 rounded-[28px] bg-white border border-slate-200 p-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  वर्तमान में कोई सक्रिय काम नहीं है
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  मार्केटप्लेस से नया काम खोजें और अपनी दैनिक शिफ्ट शुरू करें।
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
        )}

        {/* TAB 2: COMPLETED WORK */}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            {completedJobs.length > 0 ? (
              completedJobs.map((job) => {
                const totalEarned = job.wagePerDay * (job.durationDays || 1);
                const reviewerId = auth.userId || 'w-101';
                const rated = hasRated(job.id, reviewerId);
                const existingRating = getRatingForJobAndUser(job.id, reviewerId);

                // Find matching payment record
                const matchingPayment = paymentRecords.find((p) => p.jobId === job.id) || {
                  id: `pay-${job.id}`,
                  jobId: job.id,
                  jobTitle: job.titleHi || job.title,
                  workerId: 'w-101',
                  workerName: 'रमेश कुमार (Ramesh Kumar)',
                  hirerId: job.hirerId,
                  hirerName: job.hirerName,
                  amount: totalEarned,
                  wagePerDay: job.wagePerDay,
                  durationDays: job.durationDays || 1,
                  date: 'August 2026',
                  status: 'recorded' as const,
                  slipNumber: 'SLIP-2026-08-1182',
                  location: `${job.location.locality}, ${job.location.city}`,
                };

                return (
                  <div
                    key={job.id}
                    className="p-5 sm:p-6 rounded-[26px] bg-white border border-slate-200/90 shadow-card space-y-4"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                          {job.category}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>✓ कार्य पूर्ण (Completed)</span>
                        </span>
                      </div>

                      <span className="text-xs text-slate-400 font-medium">
                        पूर्ण तिथि: {job.startDate}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                        {language === 'hi' ? job.titleHi : job.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        📍 {job.location.locality}, {job.location.city} • ठेकेदार: {job.hirerName}
                      </p>
                    </div>

                    {/* Payment Recorded Badge Box */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-emerald-900 font-bold block">
                          प्रमाणित कुल पारिश्रमिक
                        </span>
                        <div className="text-xl font-black text-slate-900 font-sans mt-0.5">
                          ₹{totalEarned.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setViewingPaymentRecord(matchingPayment)}
                        className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-900 text-xs font-black shadow-2xs hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-700" />
                        <span>वेतन पर्ची (Slip) →</span>
                      </button>
                    </div>

                    {/* Rating Action Row */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="text-xs text-slate-500">
                        {rated ? (
                          <span className="inline-flex items-center gap-1 font-bold text-amber-700">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                            <span>आपकी रेटिंग: {existingRating?.score || 5}.0 ★ ({t('alreadyRatedBadge')})</span>
                          </span>
                        ) : (
                          <span>ठेकेदार के साथ अपने अनुभव को रेट करें</span>
                        )}
                      </div>

                      {!rated && (
                        <button
                          type="button"
                          onClick={() => setRatingJob(job)}
                          className="px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 font-black text-xs shadow-2xs flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{t('rateHirerTitle')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs bg-white rounded-[28px] border border-slate-200 p-8">
                कोई पूर्ण कार्य इतिहास नहीं मिला।
              </div>
            )}
          </div>
        )}

      </div>

      {/* Start Work Modal */}
      {jobToStart && (
        <StartWorkModal
          job={jobToStart}
          onClose={() => setJobToStart(null)}
          onConfirmStart={handleStartWorkConfirm}
        />
      )}

      {/* Completion Modal */}
      {jobToComplete && (
        <CompletionConfirmModal
          job={jobToComplete}
          onClose={() => setJobToComplete(null)}
          onConfirmComplete={handleCompleteWorkConfirm}
        />
      )}

      {/* Rating Modal */}
      {ratingJob && (
        <RatingModal
          jobId={ratingJob.id}
          targetUserName={ratingJob.hirerName}
          targetUserId={ratingJob.hirerId}
          isWorkerRatingHirer={true}
          onClose={() => setRatingJob(null)}
          onSuccess={() => {}}
        />
      )}

      {/* Payment Record Slip Modal */}
      {viewingPaymentRecord && (
        <PaymentRecordModal
          record={viewingPaymentRecord}
          onClose={() => setViewingPaymentRecord(null)}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <WorkerBottomNav />
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  HardHat,
  MapPin,
  IndianRupee,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  Plus,
  Minus,
  X,
  FileText,
} from 'lucide-react';
import type { SkillCategory, Job } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { HirerBottomNav } from '../../components/navigation/HirerBottomNav';

export const PostJobPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { postNewJob } = useJobs();
  const { auth } = useAuth();
  const navigate = useNavigate();

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SkillCategory>('Mason / राजमिस्त्री');
  const [workersRequired, setWorkersRequired] = useState(2);
  const [wagePerDay, setWagePerDay] = useState(1000);
  const [paymentType, setPaymentType] = useState<'per_day' | 'per_job' | 'per_hour'>('per_day');
  const [durationDays, setDurationDays] = useState(3);
  const [city, setCity] = useState(auth.hirerProfile?.city || 'Ghaziabad');
  const [locality, setLocality] = useState(auth.hirerProfile?.locality || 'Raj Nagar Extension');
  const [address, setAddress] = useState('Plot 42, Sector 14');
  const [startDate, setStartDate] = useState('18 August 2026');
  const [shiftTiming, setShiftTiming] = useState('9:00 AM - 6:00 PM');
  const [description, setDescription] = useState('');

  // Modals State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [publishedJob, setPublishedJob] = useState<Job | null>(null);

  // Quick Suggestion Chips for Title
  const titleSuggestions = [
    'Need a Mason (राजमिस्त्री)',
    'House Painting (पेंटिंग कार्य)',
    'Plumbing Work (प्लंबर)',
    'Carpenter Required (बढ़ई)',
    'Construction Helper (हेल्पर)',
  ];

  const skillOptions: { id: SkillCategory; label: string; icon: string }[] = [
    { id: 'Mason / राजमिस्त्री', label: 'राजमिस्त्री (Mason)', icon: '🧱' },
    { id: 'Helper / हेल्पर', label: 'हेल्पर (Helper)', icon: '👷🏽' },
    { id: 'Painter / पेंटर', label: 'पेंटर (Painter)', icon: '🎨' },
    { id: 'Plumber / प्लंबर', label: 'प्लंबर (Plumber)', icon: '🔧' },
    { id: 'Carpenter / बढ़ई', label: 'बढ़ई (Carpenter)', icon: '🪚' },
    { id: 'Tile Worker / टाइल मिस्त्री', label: 'टाइल मिस्त्री (Tile)', icon: '📐' },
    { id: 'Electrician / इलेक्ट्रीशियन', label: 'इलेक्ट्रीशियन', icon: '⚡' },
  ];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewModalOpen(true);
  };

  const handlePublishJob = () => {
    const jobData: Omit<Job, 'id' | 'createdAt'> = {
      title: title || `${category.split('/')[0].trim()} Required`,
      titleHi: title || `${category.split('/')[1]?.trim() || category} की आवश्यकता`,
      category,
      hirerId: auth.userId || 'h-201',
      hirerName: auth.hirerProfile?.fullName || 'राजेश शर्मा (Rajesh Sharma)',
      hirerPhone: auth.mobile || '+91 98111 22334',
      hirerType: auth.hirerProfile?.hirerType || 'सिविल ठेकेदार (Civil Contractor)',
      location: {
        address,
        locality,
        city,
      },
      requiredWorkersCount: workersRequired,
      filledWorkersCount: 0,
      wagePerDay,
      durationDays,
      startDate,
      shiftTiming,
      status: 'open',
      urgency: 'scheduled',
      description: description || 'Construction and renovation work. Daily attendance and instant wage records enabled.',
      descriptionHi: description || 'निर्माण एवं फिनिशिंग कार्य। दैनिक उपस्थिति एवं प्रमाणित पर्ची उपलब्ध।',
      perksProvided: ['चाय-नाश्ता', 'सुरक्षा हेलमेट', 'दैनिक भुगतान'],
    };

    const res = postNewJob(jobData);
    if (res.success) {
      setReviewModalOpen(false);
      setPublishedJob(res.job);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-[#FAF9F6]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header */}
        <div className="rounded-[28px] bg-[#0B132B] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              1-Minute Quick Job Posting
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-sans">
              {t('postJobTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {t('postJobSub')}
            </p>
          </div>
          <div className="absolute right-0 bottom-0 w-28 h-7 hazard-stripe-pattern transform rotate-6 translate-x-3 translate-y-2 opacity-70" />
        </div>

        {/* Post Job Form */}
        <form onSubmit={handleReviewSubmit} className="space-y-5">
          
          {/* 1. Job Title & Suggestions */}
          <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-3">
            <label className="block text-sm font-extrabold text-[#0B132B]">
              {t('postJobTitleLabel')} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('postJobTitlePlaceholder')}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
              required
            />
            {/* Suggestion Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">सुझाव:</span>
              {titleSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTitle(s)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 text-[11px] font-bold text-slate-700 hover:text-slate-950 transition-colors whitespace-nowrap"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Required Skill Category Selection */}
          <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-3">
            <label className="block text-sm font-extrabold text-[#0B132B]">
              {t('postSkillLabel')} *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {skillOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCategory(opt.id)}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    category === opt.id
                      ? 'bg-amber-100 border-amber-500 shadow-2xs ring-1 ring-amber-500 text-slate-950 font-black'
                      : 'bg-slate-50 border-slate-200 text-slate-700 font-semibold hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-xs">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Workers Needed Stepper */}
          <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 flex items-center justify-between gap-4">
            <div>
              <label className="text-sm font-extrabold text-[#0B132B] block">
                {t('postWorkersCountLabel')} *
              </label>
              <span className="text-xs text-slate-500">आवश्यक कारीगरों की संख्या</span>
            </div>

            <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setWorkersRequired(Math.max(1, workersRequired - 1))}
                className="w-9 h-9 rounded-xl bg-white text-slate-800 flex items-center justify-center font-bold shadow-2xs hover:bg-slate-200 active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-lg font-black font-sans text-slate-900">
                {workersRequired}
              </span>
              <button
                type="button"
                onClick={() => setWorkersRequired(workersRequired + 1)}
                className="w-9 h-9 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-bold shadow-2xs hover:bg-slate-800 active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4. Pay & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pay Amount */}
            <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-2">
              <label className="block text-sm font-extrabold text-[#0B132B]">
                {t('postWageLabel')} *
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  value={wagePerDay}
                  onChange={(e) => setWagePerDay(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-base font-black text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <span className="text-[11px] text-emerald-700 font-bold block">
                प्रति कामगार / दिन (Per Day Wage)
              </span>
            </div>

            {/* Duration */}
            <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-2">
              <label className="block text-sm font-extrabold text-[#0B132B]">
                {t('postDurationLabel')} *
              </label>
              <div className="flex items-center gap-2">
                {[
                  { label: '1 दिन', days: 1 },
                  { label: '2-3 दिन', days: 3 },
                  { label: '1 सप्ताह', days: 7 },
                  { label: '15+ दिन', days: 15 },
                ].map((d) => (
                  <button
                    key={d.days}
                    type="button"
                    onClick={() => setDurationDays(d.days)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                      durationDays === d.days
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Location */}
          <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-3">
            <label className="block text-sm font-extrabold text-[#0B132B]">
              {t('postLocationLabel')} *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-slate-500 font-semibold block mb-1">शहर / जिला</span>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="उदा. Ghaziabad, Noida"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block mb-1">इलाका / सेक्टर</span>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="उदा. Raj Nagar Extension"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* 6. Start Date & Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 block">
                {t('postStartDateLabel')}
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="18 August 2026 / Tomorrow"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 block">
                {t('postShiftTimeLabel')}
              </label>
              <input
                type="text"
                value={shiftTiming}
                onChange={(e) => setShiftTiming(e.target.value)}
                placeholder="9:00 AM - 6:00 PM"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* 7. Description */}
          <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-2">
            <label className="block text-sm font-extrabold text-[#0B132B]">
              {t('postDescLabel')}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('postDescPlaceholder')}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
            />
          </div>

          {/* Action CTA */}
          <button
            type="submit"
            className="w-full py-4 rounded-[22px] bg-[#EAA228] hover:bg-[#DE9419] text-slate-950 font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{t('btnReviewJob')}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

        </form>

      </div>

      {/* ========================================================================= */}
      {/* REVIEW JOB MODAL */}
      {/* ========================================================================= */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-[32px] border border-slate-200 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#0B132B]">
                {t('reviewModalTitle')}
              </h3>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                <div className="font-extrabold text-slate-900 text-base">{title || category}</div>
                <div className="text-slate-600">📍 {locality}, {city}</div>
                <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 font-bold">
                  <span className="text-slate-900 font-sans text-sm">₹{wagePerDay} / दिन</span>
                  <span>{durationDays} दिन • {workersRequired} कामगार</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">शुरुआत तिथि:</span>
                  <strong className="text-slate-800">{startDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">कार्य समय:</span>
                  <strong className="text-slate-800">{shiftTiming}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                सुधारें (Edit)
              </button>
              <button
                type="button"
                onClick={handlePublishJob}
                className="flex-1 py-3.5 rounded-2xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 font-black text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <span>{t('btnPublishJob')}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* JOB PUBLISHED SUCCESS MODAL */}
      {/* ========================================================================= */}
      {publishedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
          <div className="w-full max-w-md bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-[#0B132B]">
                {t('jobPublishedSuccessTitle')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t('jobPublishedSuccessSub')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1">
              <div className="font-extrabold text-slate-900 text-sm">{publishedJob.title}</div>
              <div className="text-slate-600">📍 {publishedJob.location.locality}, {publishedJob.location.city}</div>
              <div className="text-emerald-700 font-bold pt-1">स्थिति: 🟢 ओपन (Open for Applications)</div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => navigate('/hirer/my-jobs')}
                className="w-full py-3.5 rounded-2xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{t('btnViewMyJobs')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/hire-workers')}
                className="w-full py-3 rounded-2xl bg-[#EAA228] hover:bg-[#DE9419] text-slate-950 font-black text-xs sm:text-sm transition-colors shadow-2xs"
              >
                {t('btnFindMatchingWorkers')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <HirerBottomNav />
    </div>
  );
};

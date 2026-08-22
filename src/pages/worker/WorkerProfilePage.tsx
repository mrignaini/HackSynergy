import React from 'react';
import { Link } from 'react-router-dom';
import { mockWorkerRamesh } from '../../data/mockData';
import { CheckCircle, ShieldCheck, MapPin, Phone, Star, Award, Edit, HardHat, ArrowRight, QrCode } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';
import { WorkerBottomNav } from '../../components/navigation/WorkerBottomNav';

export const WorkerProfilePage: React.FC = () => {
  const { language, t } = useLanguage();
  const { auth } = useAuth();
  const { jobs, ratings } = useJobs();

  const worker = auth.workerProfile;
  const completedJobs = jobs.filter((j) => j.status === 'completed');
  const completedCount = 12 + completedJobs.length;

  const workerReviews = ratings.filter((r) => r.toUserId === (auth.userId || 'w-101'));
  const totalRatingsCount = 11 + workerReviews.length;
  const totalRatingSum = (11 * 4.8) + workerReviews.reduce((sum, r) => sum + r.score, 0);
  const avgRating = parseFloat((totalRatingSum / totalRatingsCount).toFixed(1));

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ========================================================================= */}
        {/* DIGITAL WORK IDENTITY HERO BANNER (PHASE 8 EXTENSION) */}
        {/* ========================================================================= */}
        <div className="rounded-[28px] bg-gradient-to-r from-[#0B132B] to-[#111C3D] text-white p-6 sm:p-7 shadow-xl border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0">
              <HardHat className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
                {t('digitalWorkIdentity')}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {language === 'hi' ? 'मेरी डिजिटल कार्य पहचान' : 'My Digital Work Identity'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {language === 'hi'
                  ? 'सत्यापित कार्य अनुभव, रेटिंग्स, कौशल और क्यूआर कोड देखें'
                  : 'Verified work records, ratings, skills & shareable QR code'}
              </p>
            </div>
          </div>

          <Link
            to="/worker/digital-identity"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#EAA228] hover:bg-[#DE9419] text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <span>{t('viewMyWorkIdentity')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Existing Profile Container */}
        <div className="rounded-[28px] bg-white border border-slate-200/90 shadow-card p-6 sm:p-8 space-y-6">
          {/* Profile Top */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100 text-center sm:text-left">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-md">
                {worker?.avatar || '👷🏽‍♂️'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
                <CheckCircle className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-[#0B132B]">
                  {worker?.fullName || mockWorkerRamesh.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  सत्यापित कामगार (Grade A)
                </span>
              </div>
              <p className="text-sm font-semibold text-amber-800">
                {worker?.skills?.[0] || mockWorkerRamesh.primarySkill}
              </p>
              <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{worker?.locality || mockWorkerRamesh.locality}, {worker?.city || mockWorkerRamesh.city}</span>
              </p>
            </div>
          </div>

          {/* Verification Check Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-xs font-bold text-emerald-900 block">पहचान प्रोफ़ाइल</span>
              <span className="text-[10px] text-emerald-700">सत्यापित</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-xs font-bold text-emerald-900 block">e-Shram कार्ड</span>
              <span className="text-[10px] text-emerald-700">लिंक किया गया</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-xs font-bold text-emerald-900 block">BOCW बोर्ड</span>
              <span className="text-[10px] text-emerald-700">सत्यापित</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-xs font-bold text-emerald-900 block">बैंक खाता</span>
              <span className="text-[10px] text-emerald-700">सक्रिय</span>
            </div>
          </div>

          {/* Dynamic Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-[#FAF9F6] border border-slate-200 text-center">
            <div>
              <span className="text-2xl font-black text-slate-900 font-sans">{completedCount}</span>
              <span className="text-xs text-slate-500 block">काम पूरे किए</span>
            </div>
            <div className="border-x border-slate-200">
              <span className="text-2xl font-black text-slate-900 font-sans">286</span>
              <span className="text-xs text-slate-500 block">कार्य दिवस</span>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 font-sans">{avgRating} ★</span>
              <span className="text-xs text-slate-500 block">औसत रेटिंग</span>
            </div>
          </div>
        </div>

      </div>

      <WorkerBottomNav />
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Users,
  Search,
  Briefcase,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  IndianRupee,
  Phone,
  ArrowRight,
  CheckCircle2,
  FileText,
  UserCheck,
  Building,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { HirerBottomNav } from '../../components/navigation/HirerBottomNav';

export const HirerDashboardPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { auth } = useAuth();

  const hirer = auth.hirerProfile;
  const rawName = hirer?.fullName || 'अमित शर्मा (Amit Sharma)';
  const firstName = rawName.split(' ')[0];
  const hirerType = hirer?.hirerType || 'सिविल ठेकेदार (Civil Contractor)';
  const locationDisplay = hirer?.city
    ? `${hirer.locality}, ${hirer.city}`
    : 'राज नगर, गाजियाबाद (Ghaziabad)';

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* ========================================================================= */}
        {/* 1. HIRER HEADER & PROFILE SUMMARY */}
        {/* ========================================================================= */}
        <div className="rounded-[28px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-[#0B132B] text-amber-400 border-2 border-slate-700 flex items-center justify-center text-2xl shadow-sm font-black">
                  {firstName.slice(0, 2)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-[#0B132B] font-sans tracking-tight">
                    {language === 'hi' ? `स्वागत है, ${firstName}! 👋` : `Welcome, ${firstName}! 👋`}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    सत्यापित नियोक्ता
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-amber-800 mt-0.5">
                  {hirerType}
                </p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{locationDisplay}</span>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 flex flex-col sm:items-end gap-1">
              <span className="text-xs text-slate-400 block">{t('hirerWelcomeSub')}</span>
              <Link
                to="/hirer/profile"
                className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl transition-colors mt-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t('hirerReputationTitle')} →</span>
              </Link>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. DUAL HIRER ACTIONS: POST JOB (PRIMARY) & FIND WORKERS (SECONDARY) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Primary CTA: POST A JOB */}
          <Link
            to="/hirer/post-job"
            className="group p-6 rounded-[28px] bg-[#EAA228] hover:bg-[#DE9419] text-slate-950 shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 border border-amber-400 flex flex-col justify-between h-44"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-950/15 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <PlusCircle className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h2 className="text-xl font-black tracking-tight font-sans">
                {t('primaryPostJobTitle')}
              </h2>
              <p className="text-xs text-slate-900 mt-0.5 font-medium">
                {t('primaryPostJobSub')}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between font-extrabold text-xs">
              <span>काम पोस्ट करें</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Secondary CTA: FIND WORKERS */}
          <Link
            to="/hire-workers"
            className="group p-6 rounded-[28px] bg-white border-2 border-slate-200 hover:border-slate-800 text-slate-900 shadow-sm hover:shadow-card transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between h-44"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h2 className="text-xl font-black tracking-tight text-[#0B132B] font-sans">
                {t('secondaryFindWorkersTitle')}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 font-normal">
                {t('secondaryFindWorkersSub')}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between font-extrabold text-xs text-slate-800">
              <span>कामगार डायरेक्ट्री देखें</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

        {/* ========================================================================= */}
        {/* 3. HIRER QUICK ACTIONS GRID (2x2) */}
        {/* ========================================================================= */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
            त्वरित विकल्प • Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* 1. Post Job */}
            <Link
              to="/hirer/post-job"
              className="p-4 rounded-[22px] bg-white border border-slate-200/90 shadow-2xs hover:shadow-card hover:border-amber-400 transition-all flex flex-col justify-between h-32 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#0B132B]">{t('quickPostJobTitle')}</div>
                <div className="text-[11px] text-slate-500">{t('quickPostJobSub')}</div>
              </div>
            </Link>

            {/* 2. Find Workers */}
            <Link
              to="/hire-workers"
              className="p-4 rounded-[22px] bg-white border border-slate-200/90 shadow-2xs hover:shadow-card hover:border-slate-400 transition-all flex flex-col justify-between h-32 group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#0B132B]">{t('quickFindWorkerTitle')}</div>
                <div className="text-[11px] text-slate-500">{t('quickFindWorkerSub')}</div>
              </div>
            </Link>

            {/* 3. My Hires */}
            <Link
              to="/hirer/my-jobs"
              className="p-4 rounded-[22px] bg-white border border-slate-200/90 shadow-2xs hover:shadow-card hover:border-orange-400 transition-all flex flex-col justify-between h-32 group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#0B132B]">{t('quickMyHiresTitle')}</div>
                <div className="text-[11px] text-slate-500">{t('quickMyHiresSub')}</div>
              </div>
            </Link>

            {/* 4. Work Records */}
            <Link
              to="/admin"
              className="p-4 rounded-[22px] bg-white border border-slate-200/90 shadow-2xs hover:shadow-card hover:border-emerald-400 transition-all flex flex-col justify-between h-32 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#0B132B]">{t('quickWorkRecordsTitle')}</div>
                <div className="text-[11px] text-slate-500">{t('quickWorkRecordsSub')}</div>
              </div>
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. HIRER ACTIVE JOBS SECTION */}
        {/* ========================================================================= */}
        <div className="rounded-[28px] bg-white border border-slate-200/90 shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-[#0B132B]">
              {t('hirerMyJobsHeading')}
            </h3>
            <Link to="/hirer/post-job" className="text-xs font-bold text-amber-700 hover:underline">
              + नया काम पोस्ट करें
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
                    राजमिस्त्री (Need a Mason)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    ✓ ओपन (Open)
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">विला निर्माण हेतु 2 कुशल राजमिस्त्री</h4>
                <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>गाजियाबाद (Ghaziabad)</span>
                  <span>• 2 कामगारों की जरूरत (2 needed)</span>
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                <div className="text-right">
                  <div className="text-lg font-black text-slate-900 font-sans">₹1,000 / दिन</div>
                  <div className="text-[10px] text-slate-500">दैनिक भुगतान</div>
                </div>
                <Link
                  to="/hire-workers"
                  className="px-4 py-2 rounded-xl bg-[#0B132B] text-white text-xs font-bold hover:bg-slate-800"
                >
                  कामगार चुनें
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. RECENT HIRES SECTION */}
        {/* ========================================================================= */}
        <div className="rounded-[28px] bg-white border border-slate-200/90 shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-[#0B132B]">
              {t('recentHiresHeading')}
            </h3>
            <span className="text-xs text-slate-400">सक्रिय कामगार</span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/50 to-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-200 flex items-center justify-center text-2xl shrink-0">
                👷🏽‍♂️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-900">रमेश कुमार (Ramesh Kumar)</span>
                  <span className="flex items-center gap-0.5 text-xs font-bold text-slate-800">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    4.8
                  </span>
                </div>
                <p className="text-xs text-slate-600">🧱 राजमिस्त्री (Mason) • 7 वर्ष का अनुभव</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  {t('statusCurrentlyWorking')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 sm:pt-0">
              <a
                href="tel:9876543210"
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50"
              >
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>कॉल करें</span>
              </a>
              <Link
                to="/worker/digital-identity"
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#0B132B] text-white text-xs font-bold hover:bg-slate-800"
              >
                आईडी कार्ड
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. HIRER TRUST & CONFIDENCE SECTION */}
        {/* ========================================================================= */}
        <div className="rounded-[28px] bg-[#0B132B] text-white p-6 sm:p-8 shadow-xl">
          <h3 className="text-lg font-extrabold text-white mb-2">
            {t('hirerTrustHeading')}
          </h3>
          <p className="text-xs text-slate-300 mb-5">
            SHRAMIKK आपको सीधे सत्यापित कामगारों से जोड़ता है ताकि आपका निर्माण कार्य बिना रुकावट व पारदर्शी तरीके से पूरा हो सके।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('trustPoint1')}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('trustPoint2')}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
              <Star className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t('trustPoint3')}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
              <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('trustPoint4')}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <HirerBottomNav />
    </div>
  );
};

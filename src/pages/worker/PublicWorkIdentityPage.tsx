import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  HardHat,
  ShieldCheck,
  CheckCircle2,
  Star,
  MapPin,
  Briefcase,
  Award,
  Calendar,
  Lock,
  Globe,
  Share2,
  Check,
  Copy,
  ArrowLeft,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { mockWorkersList } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { QRCodeView } from '../../components/common/QRCodeView';

export const PublicWorkIdentityPage: React.FC = () => {
  const { workerId = 'w-101' } = useParams<{ workerId?: string }>();
  const { language, t } = useLanguage();
  const { auth } = useAuth();
  const { workers, jobs, ratings } = useJobs();

  const [copied, setCopied] = useState(false);

  // Check if profile is public
  const isPublic = localStorage.getItem(`shramikk_identity_public_${workerId}`) !== 'false';

  // Find worker details
  const targetWorker = workers.find((w) => w.id === workerId) || mockWorkersList[0];

  // Dynamic calculations from JobContext
  const completedJobs = jobs.filter((j) => j.status === 'completed');
  const completedCount = 12 + completedJobs.length;

  const workerReviews = ratings.filter((r) => r.toUserId === workerId || r.toUserId === 'w-101');
  const totalRatingsCount = 11 + workerReviews.length;

  const totalRatingSum = (11 * 4.8) + workerReviews.reduce((sum, r) => sum + r.score, 0);
  const avgRating = parseFloat((totalRatingSum / (11 + workerReviews.length)).toFixed(1));

  // Dynamic rating breakdown
  const count5Star = 9 + workerReviews.filter((r) => r.score === 5).length;
  const count4Star = 2 + workerReviews.filter((r) => r.score === 4).length;
  const count3Star = 0 + workerReviews.filter((r) => r.score === 3).length;
  const count2Star = 0 + workerReviews.filter((r) => r.score === 2).length;
  const count1Star = 0 + workerReviews.filter((r) => r.score === 1).length;

  const skillsList = [
    targetWorker.primarySkill,
    ...(targetWorker.secondarySkills || []),
    'Plastering / प्लास्टर',
    'Brick Work / ईंट चिनाई',
    'Civil Construction',
  ].filter(Boolean);

  const shareUrl = window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // If worker set identity to private
  if (!isPublic) {
    return (
      <div className="min-h-screen pb-20 bg-[#FAF9F6] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-[32px] bg-white border border-slate-200 p-8 text-center space-y-4 shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[#0B132B]">
            {t('identityPrivateNotice')}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'इस कामगार ने अपनी कार्य पहचान को केवल निजी रखा है।'
              : 'This worker has chosen to keep their work identity private.'}
          </p>
          <div className="pt-2">
            <Link
              to="/hire-workers"
              className="inline-block px-6 py-2.5 rounded-xl bg-[#0B132B] text-amber-400 text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              अन्य कारीगर खोजें (Browse Directory)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-[#FAF9F6]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/hire-workers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'कारीगर डायरेक्टरी' : 'Workers Directory'}</span>
          </Link>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'लिंक कॉपी हुआ ✓' : 'शेयर लिंक (Copy)'}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* PUBLIC DIGITAL WORK IDENTITY CARD */}
        {/* ========================================================================= */}
        <div className="rounded-[32px] bg-gradient-to-br from-[#0B132B] via-[#111C3D] to-[#080E1F] text-white p-6 sm:p-8 border-2 border-amber-400/40 shadow-2xl relative overflow-hidden">
          
          {/* Top Brand Banner */}
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <HardHat className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="text-lg font-black tracking-wider text-white">SHRAMIKK</div>
                <div className="text-[10px] text-amber-400 font-semibold tracking-tight">
                  {language === 'hi' ? 'डिजिटल कार्य पहचान (Digital Work Identity)' : 'Verified Digital Work Identity'}
                </div>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-700 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Work Record Active ✓</span>
            </span>
          </div>

          {/* Card Body */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Avatar */}
            <div className="sm:col-span-4 flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-amber-200 border-4 border-amber-400/80 flex items-center justify-center text-5xl shadow-xl">
                  {targetWorker.avatar || '👷🏽‍♂️'}
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 border-2 border-[#0B132B] flex items-center justify-center text-white">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
              <div className="mt-3 text-xs font-black text-amber-300 tracking-wider font-mono">
                {targetWorker.digitalIdCardNumber || 'SHR-2026-DL-8892'}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{targetWorker.locality}, {targetWorker.city}</span>
              </div>
            </div>

            {/* Core Info */}
            <div className="sm:col-span-8 space-y-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{targetWorker.name}</h1>
                <div className="text-sm font-bold text-amber-400">
                  🧱 {targetWorker.primarySkill}
                </div>
              </div>

              {/* 4 Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="text-slate-400 block text-[10px]">औसत रेटिंग</span>
                  <span className="font-black text-white flex items-center justify-center gap-0.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {avgRating}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="text-slate-400 block text-[10px]">पूर्ण काम</span>
                  <span className="font-black text-white">{completedCount} Shifts</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="text-slate-400 block text-[10px]">कौशल</span>
                  <span className="font-black text-white">{skillsList.length} Skills</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="text-slate-400 block text-[10px]">अनुभव</span>
                  <span className="font-black text-white">{targetWorker.experienceYears} वर्ष</span>
                </div>
              </div>

              {/* Hire Action CTA */}
              <div className="pt-2">
                <Link
                  to="/hire-workers"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#EAA228] hover:bg-[#DE9419] text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>हायर करने हेतु संपर्क करें (Hire On SHRAMIKK)</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* EVIDENCE-BASED TRUST BADGES */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-[#0B132B]">
              सत्यापित बैज व स्थिति (Verified Trust Badges)
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-center font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span>✓ Completed Work</span>
              <span className="text-[10px] text-emerald-700 block font-normal mt-0.5">{completedCount} Jobs</span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 text-center font-bold">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400 mx-auto mb-1" />
              <span>⭐ Highly Rated</span>
              <span className="text-[10px] text-amber-700 block font-normal mt-0.5">{avgRating} ★ ({totalRatingsCount})</span>
            </div>

            <div className="p-3 rounded-2xl bg-violet-50 text-violet-900 border border-violet-200 text-center font-bold">
              <Award className="w-4 h-4 text-violet-600 mx-auto mb-1" />
              <span>🛠 Skilled Worker</span>
              <span className="text-[10px] text-violet-700 block font-normal mt-0.5">{skillsList.length} Trades</span>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200 text-center font-bold">
              <Calendar className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <span>📅 Experienced</span>
              <span className="text-[10px] text-blue-700 block font-normal mt-0.5">{targetWorker.experienceYears}+ Years</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SKILLS */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-3">
          <h3 className="text-sm font-extrabold text-[#0B132B]">
            कौशल व विशेषज्ञता (Skills)
          </h3>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((s, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span>{s}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SIMPLIFIED WORK HISTORY (PUBLIC SAFE - NO SENSITIVE FINANCIAL DATA) */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#0B132B]">
              हालिया कार्य इतिहास (Verified Work History)
            </h3>
            <span className="text-xs font-bold text-emerald-700">✓ SHRAMIKK Verified</span>
          </div>

          <div className="space-y-2">
            {[
              { title: 'Villa Construction & Finishing', category: 'Mason', city: 'Ghaziabad', rating: 5.0, date: '18–20 Aug 2026' },
              { title: 'Boundary Wall & Exterior Brickwork', category: 'Mason', city: 'Delhi', rating: 5.0, date: '15–16 Aug 2026' },
              { title: 'House Plastering & Repair', category: 'Mason', city: 'Noida', rating: 4.8, date: '10–12 Aug 2026' },
            ].map((work, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900 text-xs">{work.title}</div>
                  <div className="text-[11px] text-slate-500">{work.category} • 📍 {work.city} • {work.date}</div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    ✓ Completed ({work.rating} ★)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RATING BREAKDOWN & REVIEWS */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#0B132B]">
              प्रतिष्ठा व समीक्षाएं (Reputation & Reviews)
            </h3>
            <span className="text-xs font-bold text-slate-500">{totalRatingsCount} कुल समीक्षाएं</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pb-2 border-b border-slate-100">
            <div className="sm:col-span-4 text-center p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="text-3xl font-black text-amber-900 font-sans flex items-center justify-center gap-1">
                <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
                {avgRating}
              </div>
              <div className="text-[11px] text-slate-600 font-bold mt-0.5">सत्यापित रेटिंग</div>
            </div>

            <div className="sm:col-span-8 space-y-1 text-xs">
              {[
                { star: 5, count: count5Star },
                { star: 4, count: count4Star },
                { star: 3, count: count3Star },
                { star: 2, count: count2Star },
                { star: 1, count: count1Star },
              ].map((row) => (
                <div key={row.star} className="flex items-center gap-2">
                  <span className="w-7 font-bold text-slate-700">{row.star} ★</span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${totalRatingsCount > 0 ? (row.count / totalRatingsCount) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-5 text-right font-mono text-slate-600 font-bold">{row.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews list */}
          <div className="space-y-2">
            {[
              { name: 'अमित शर्मा (Civil Contractor)', score: 5, comment: 'उत्कृष्ट राजमिस्त्री कार्य, समय पर पूर्ण किया। / Great work and completed on time.' },
              { name: 'सुरेश गुप्ता (Homeowner)', score: 5, comment: 'सटीक प्लास्टर, बहुत अनुभवी कारीगर। / Very skilled mason.' },
              { name: 'प्रिया सिंह (Site Supervisor)', score: 4, comment: 'अच्छा काम। समय पर काम पूरा किया। / Good and reliable.' },
            ].map((rev, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">{rev.name}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, si) => (
                      <Star
                        key={si}
                        className={`w-3 h-3 ${si < rev.score ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PUBLIC FOOTER */}
        {/* ========================================================================= */}
        <div className="text-center py-6 space-y-1.5 border-t border-slate-200">
          <div className="text-xs font-black text-slate-900 tracking-wider">
            {t('poweredByShramikk')}
          </div>
          <p className="text-[11px] text-slate-500">
            {t('shramikkEvidenceDisclaimer')}
          </p>
        </div>

      </div>
    </div>
  );
};

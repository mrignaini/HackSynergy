import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HardHat,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Share2,
  Star,
  MapPin,
  Briefcase,
  Award,
  Calendar,
  IndianRupee,
  Lock,
  Globe,
  Info,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Check,
  ArrowLeft,
  X,
  Copy,
} from 'lucide-react';
import { mockDigitalIdentity, mockWorkerRamesh } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';
import { WorkerBottomNav } from '../../components/navigation/WorkerBottomNav';
import { QRCodeView } from '../../components/common/QRCodeView';

export const DigitalIdentityPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { auth } = useAuth();
  const { jobs, ratings, paymentRecords, totalIncomeRecorded } = useJobs();

  // Modals state
  const [showQRModal, setShowQRModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Worker identifier
  const workerId = auth.userId || 'w-101';
  const workerProfile = auth.workerProfile;

  // Public/Private identity setting persisted
  const [isPublic, setIsPublic] = useState<boolean>(() => {
    const saved = localStorage.getItem(`shramikk_identity_public_${workerId}`);
    return saved !== null ? saved === 'true' : true;
  });

  const togglePublicStatus = () => {
    const nextVal = !isPublic;
    setIsPublic(nextVal);
    localStorage.setItem(`shramikk_identity_public_${workerId}`, String(nextVal));
  };

  // Dynamic calculations from JobContext
  const completedJobs = jobs.filter((j) => j.status === 'completed');
  const totalCompletedCount = 12 + completedJobs.length;

  // Ratings & reviews for this worker
  const workerReviews = ratings.filter((r) => r.toUserId === workerId || r.toUserId === 'w-101');
  const totalRatingsCount = 11 + workerReviews.length;
  
  // Calculate average rating dynamically
  const totalRatingSum = (11 * 4.8) + workerReviews.reduce((sum, r) => sum + r.score, 0);
  const avgRating = parseFloat((totalRatingSum / (11 + workerReviews.length)).toFixed(1));

  // Dynamic rating breakdown
  const count5Star = 9 + workerReviews.filter((r) => r.score === 5).length;
  const count4Star = 2 + workerReviews.filter((r) => r.score === 4).length;
  const count3Star = 0 + workerReviews.filter((r) => r.score === 3).length;
  const count2Star = 0 + workerReviews.filter((r) => r.score === 2).length;
  const count1Star = 0 + workerReviews.filter((r) => r.score === 1).length;

  // Skills list from auth or fallback
  const skillsList = workerProfile?.skills && workerProfile.skills.length > 0
    ? workerProfile.skills
    : ['Mason / राजमिस्त्री', 'Tile Worker / टाइल मिस्त्री', 'Plastering / प्लास्टर', 'Brick Work / ईंट चिनाई', 'Civil Construction'];

  const experienceDisplay = workerProfile?.experience || '7+ वर्ष (Years)';
  const locationDisplay = `${workerProfile?.locality || 'Raj Nagar'}, ${workerProfile?.city || 'Ghaziabad'}`;
  const workerName = workerProfile?.fullName || 'रमेश कुमार (Ramesh Kumar)';

  // Total recorded income (Private)
  const allRecordedIncome = 242000 + totalIncomeRecorded;
  const latestPayment = paymentRecords.length > 0 ? paymentRecords[0].amount : 3000;

  // Profile strength calculation
  const strengthFactors = [
    { name: language === 'hi' ? 'नाम व प्रोफ़ाइल' : 'Name & Profile', done: true },
    { name: language === 'hi' ? 'कौशल सूचीबद्ध' : 'Skills Listed', done: skillsList.length >= 3 },
    { name: language === 'hi' ? 'अनुभव दर्ज' : 'Experience Added', done: Boolean(experienceDisplay) },
    { name: language === 'hi' ? 'स्थान विवरण' : 'Location Set', done: Boolean(locationDisplay) },
    { name: language === 'hi' ? 'कार्य इतिहास सक्रिय' : 'Work History Active', done: totalCompletedCount > 0 },
    { name: language === 'hi' ? 'रेटिंग्स प्राप्त' : 'Ratings Received', done: totalRatingsCount > 0 },
  ];
  const completedFactorsCount = strengthFactors.filter((f) => f.done).length;
  const profileStrengthPercent = Math.round((completedFactorsCount / strengthFactors.length) * 100);

  // Evidence-based badges
  const badges = [
    {
      id: 'completed_work',
      label: language === 'hi' ? 'पूर्ण कार्य (Completed Work)' : 'Completed Work',
      active: totalCompletedCount >= 1,
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    },
    {
      id: 'highly_rated',
      label: language === 'hi' ? 'शीर्ष रेटेड (Highly Rated)' : 'Highly Rated',
      active: avgRating >= 4.5 && totalRatingsCount >= 5,
      icon: <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />,
      color: 'bg-amber-50 text-amber-900 border-amber-200',
    },
    {
      id: 'skilled_worker',
      label: language === 'hi' ? 'कुशल कारीगर (Skilled Worker)' : 'Skilled Worker',
      active: skillsList.length >= 3,
      icon: <Award className="w-3.5 h-3.5 text-violet-600" />,
      color: 'bg-violet-50 text-violet-900 border-violet-200',
    },
    {
      id: 'experienced',
      label: language === 'hi' ? 'अनुभवी (Experienced 5+ Yrs)' : 'Experienced (5+ Yrs)',
      active: true,
      icon: <Calendar className="w-3.5 h-3.5 text-blue-600" />,
      color: 'bg-blue-50 text-blue-900 border-blue-200',
    },
  ];

  // Public URL
  const publicIdentityUrl = `${window.location.origin}/worker/${workerId}/identity`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicIdentityUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="min-h-screen pb-28 md:pb-12 bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Top Breadcrumb & Share Actions */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Link
            to="/worker/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHowItWorksModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('howProfileIsBuilt')}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQRModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0B132B] hover:bg-slate-800 text-xs font-bold text-amber-400 transition-all shadow-md"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR कोड</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. HERO DIGITAL WORK IDENTITY CARD (Physical-style Digital ID) */}
        {/* ========================================================================= */}
        <div className="rounded-[32px] bg-gradient-to-br from-[#0B132B] via-[#111C3D] to-[#080E1F] text-white p-6 sm:p-8 border-2 border-amber-400/40 shadow-2xl relative overflow-hidden">
          
          {/* Card Top Brand Row */}
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

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-700 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Work Record Active ✓</span>
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Avatar / Photo */}
            <div className="sm:col-span-4 flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-amber-200 border-4 border-amber-400/80 flex items-center justify-center text-5xl shadow-xl">
                  {workerProfile?.avatar || '👷🏽‍♂️'}
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 border-2 border-[#0B132B] flex items-center justify-center text-white">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                </div>
              </div>
              <div className="mt-3 text-xs font-black text-amber-300 tracking-wider font-mono">
                {mockDigitalIdentity.uniqueCardId}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{locationDisplay}</span>
              </div>
            </div>

            {/* Worker Primary Info */}
            <div className="sm:col-span-5 space-y-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{workerName}</h1>
                <div className="text-sm font-bold text-amber-400">
                  🧱 {skillsList[0] || 'Mason / राजमिस्त्री'}
                </div>
              </div>

              {/* Trust Header: 4 quick metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block text-[10px]">औसत रेटिंग</span>
                  <span className="font-black text-white flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {avgRating} ★ ({totalRatingsCount})
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block text-[10px]">पूर्ण काम (Completed)</span>
                  <span className="font-black text-white">{totalCompletedCount} Shifts ✓</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block text-[10px]">कौशल (Skills)</span>
                  <span className="font-black text-white">{skillsList.length} Skills</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400 block text-[10px]">अनुभव (Experience)</span>
                  <span className="font-black text-white">{experienceDisplay}</span>
                </div>
              </div>
            </div>

            {/* QR Code Quick Box */}
            <div className="sm:col-span-3 flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white text-slate-900 shadow-md text-center">
              <button
                type="button"
                onClick={() => setShowQRModal(true)}
                className="group flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-slate-900 rounded-xl p-2 flex items-center justify-center text-white mb-1.5 group-hover:scale-105 transition-transform">
                  <QrCode className="w-16 h-16 text-amber-400" />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-800 tracking-tight flex items-center gap-1">
                  <span>स्कैन कर सत्यापित करें</span>
                </span>
                <span className="text-[9px] text-amber-800 font-bold">QR खोलें →</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. PUBLIC / PRIVATE PRIVACY CONTROLS & SHARE BAR */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                {isPublic ? (
                  <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    <Globe className="w-3.5 h-3.5" />
                    सार्वजनिक (Public Active)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    <Lock className="w-3.5 h-3.5" />
                    निजी (Private Only)
                  </span>
                )}
                <h3 className="text-sm font-extrabold text-[#0B132B]">
                  {t('publicIdentityLabel')}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isPublic
                  ? 'नियोक्ता आपकी सार्वजनिक कार्य पहचान, रेटिंग्स व कौशल देख सकते हैं। (संवेदनशील डेटा छिपा रहता है)'
                  : 'आपकी कार्य पहचान निजी है। बाहरी लिंक पर प्रोफाइल प्रदर्शित नहीं होगी।'}
              </p>
            </div>

            {/* Toggle switch */}
            <div className="flex items-center gap-3 shrink-0">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={togglePublicStatus}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
              <span className="text-xs font-black text-slate-900">
                {isPublic ? 'चालू (ON)' : 'बंद (OFF)'}
              </span>
            </div>
          </div>

          {/* Share Action Row */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100 flex-wrap">
            <Link
              to={`/worker/${workerId}/identity`}
              target="_blank"
              className="px-4 py-2.5 rounded-xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>सार्वजनिक दृश्य देखें (View Public Profile)</span>
            </Link>

            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">लिंक कॉपी हुआ ✓</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>लिंक कॉपी करें (Copy Link)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowQRModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR कोड दिखाएं</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. PROFILE STRENGTH PROGRESS */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-extrabold text-[#0B132B]">
                {t('profileStrengthLabel')}
              </h3>
            </div>
            <span className="text-sm font-black text-amber-800 font-sans">
              {profileStrengthPercent}% पूर्ण
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${profileStrengthPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-[11px]">
            {strengthFactors.map((f, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl flex items-center gap-1.5 border ${
                  f.done
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200 font-bold'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                {f.done ? (
                  <Check className="w-3 h-3 text-emerald-600 stroke-[3] shrink-0" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                )}
                <span className="truncate">{f.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. TRUST PROFILE & EVIDENCE-BASED BADGES */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-extrabold text-[#0B132B]">
                {t('trustProfileTitle')}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('trustProfileSub')}
            </p>
          </div>

          {/* 6 Transparent Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">पूर्ण कार्य (Shifts)</span>
              <span className="text-2xl font-black text-slate-900 font-sans">{totalCompletedCount}</span>
              <span className="text-[10px] text-emerald-700 block font-bold mt-0.5">✓ 100% दर्ज</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">औसत रेटिंग</span>
              <span className="text-2xl font-black text-amber-900 font-sans flex items-center justify-center gap-0.5">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                {avgRating}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{totalRatingsCount} समीक्षाओं से</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">प्राप्त समीक्षाएं</span>
              <span className="text-2xl font-black text-slate-900 font-sans">{workerReviews.length + 3}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">नियोक्ताओं से</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">सत्यापित कौशल</span>
              <span className="text-2xl font-black text-slate-900 font-sans">{skillsList.length}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">ट्रेड विशेषज्ञता</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">कार्य इतिहास</span>
              <span className="text-base font-black text-emerald-700 block mt-1">उपलब्ध ✓</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">पारदर्शी रिकॉर्ड</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">भुगतान पर्चियां</span>
              <span className="text-base font-black text-emerald-700 block mt-1">उपलब्ध ✓</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">बैंक/कैश दर्ज</span>
            </div>
          </div>

          {/* Evidence Badges */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              अर्जित बैज (Evidence Badges)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 ${b.color}`}
                >
                  <div className="p-1.5 rounded-xl bg-white/80 shrink-0">
                    {b.icon}
                  </div>
                  <span className="text-xs font-extrabold">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. VERIFICATION STATUS STATES */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#0B132B]">
              सत्यापन स्थिति (Verification Breakdown)
            </h3>
            <span className="text-[10px] font-bold text-slate-500">साक्ष्य-आधारित स्थिति</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <span className="font-bold text-slate-800">पहचान (Identity)</span>
              <span className="font-black text-emerald-800 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Profile Verified
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <span className="font-bold text-slate-800">कौशल (Skills)</span>
              <span className="font-black text-emerald-800 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Profiled & Listed
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <span className="font-bold text-slate-800">कार्य इतिहास (Work History)</span>
              <span className="font-black text-emerald-800 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Shifts Recorded
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <span className="font-bold text-slate-800">रेटिंग्स (Ratings)</span>
              <span className="font-black text-emerald-800 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Verified by Hirers
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. SKILLS & EXPERIENCE SECTION */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#0B132B]">
              कौशल व अनुभव (Skills & Experience)
            </h3>
            <span className="text-xs font-bold text-amber-800">{skillsList.length} कुल कौशल</span>
          </div>

          {/* Skills Chips */}
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span>{skill}</span>
              </span>
            ))}
          </div>

          {/* Experience Card */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">मुख्य ट्रेड अनुभव (Primary Trade Experience)</div>
              <div className="text-sm font-extrabold text-amber-900 mt-0.5">{experienceDisplay}</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white text-amber-900 text-[11px] font-bold border border-amber-300">
              Grade A कारीगर
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 7. REPUTATION & RATING DISTRIBUTION */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#0B132B]">
              प्रतिष्ठा व रेटिंग विवरण (Reputation Breakdown)
            </h3>
            <span className="text-xs font-bold text-slate-500">{totalRatingsCount} कुल रेटिंग्स</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-4 text-center p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="text-4xl font-black text-amber-900 font-sans flex items-center justify-center gap-1">
                <Star className="w-8 h-8 text-amber-500 fill-amber-400" />
                {avgRating}
              </div>
              <div className="text-xs font-extrabold text-slate-700 mt-1">
                {avgRating >= 4.5 ? 'उत्कृष्ट (Outstanding)' : 'अच्छा (Good)'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {totalRatingsCount} सत्यापित समीक्षाओं से
              </div>
            </div>

            {/* Distribution Bars */}
            <div className="sm:col-span-8 space-y-1.5 text-xs">
              {[
                { star: 5, count: count5Star },
                { star: 4, count: count4Star },
                { star: 3, count: count3Star },
                { star: 2, count: count2Star },
                { star: 1, count: count1Star },
              ].map((row) => {
                const pct = totalRatingsCount > 0 ? (row.count / totalRatingsCount) * 100 : 0;
                return (
                  <div key={row.star} className="flex items-center gap-3">
                    <span className="w-8 font-bold text-slate-700">{row.star} ★</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right font-mono text-slate-600 font-bold">{row.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 8. REVIEWS FROM HIRERS */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#0B132B]">
              नियोक्ता समीक्षाएं (Hirer Reviews)
            </h3>
            <span className="text-xs font-bold text-amber-800">{workerReviews.length + 3} समीक्षाएं</span>
          </div>

          <div className="space-y-2.5">
            {/* Dynamic reviews from JobContext ratings + seeded reviews */}
            {[
              {
                name: 'अमित शर्मा (Amit Sharma)',
                score: 5,
                comment: 'उत्कृष्ट राजमिस्त्री कार्य, समय पर पूर्ण किया। / Great work and completed on time.',
                date: '16 Aug 2026',
              },
              {
                name: 'सुरेश गुप्ता (Suresh Gupta)',
                score: 5,
                comment: 'सटीक प्लास्टर, बहुत अनुभवी व शांत कारीगर। / Very skilled mason, precise plastering.',
                date: '10 Aug 2026',
              },
              {
                name: 'प्रिया सिंह (Priya Singh)',
                score: 4,
                comment: 'अच्छा काम। समय पर काम पूरा किया और साइट साफ रखी। / Good work, hard-working professional.',
                date: '2 Aug 2026',
              },
              ...workerReviews.map((r) => ({
                name: 'सत्यापित नियोक्ता (Verified Hirer)',
                score: r.score,
                comment: r.comment || 'संतुष्टिपूर्वक कार्य पूर्ण हुआ। / Job completed satisfactorily.',
                date: r.createdAt || 'Recent',
              })),
            ].slice(0, 4).map((rev, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-slate-900 text-xs">{rev.name}</div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, si) => (
                      <Star
                        key={si}
                        className={`w-3 h-3 ${si < rev.score ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
                <div className="text-[10px] text-slate-400">{rev.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 9. WORK & INCOME RECORD (PRIVATE TO WORKER) */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] bg-gradient-to-br from-amber-50/80 to-emerald-50/50 border border-amber-200 p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-800" />
              <h3 className="text-sm font-extrabold text-[#0B132B]">
                कार्य एवं आय रिकॉर्ड (Work & Income — Private)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
              केवल आपके लिए (Private)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-white border border-amber-200/90 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 block">कुल दर्ज आय</span>
              <span className="text-xl font-black text-slate-900 font-sans">₹{allRecordedIncome.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">✓ बैंक व कैश प्रमाणित</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-amber-200/90 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 block">पूर्ण कार्य दिवस</span>
              <span className="text-xl font-black text-slate-900 font-sans">{totalCompletedCount} काम</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">प्रमाणित रिकॉर्ड</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-amber-200/90 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 block">हालिया भुगतान</span>
              <span className="text-xl font-black text-slate-900 font-sans">₹{latestPayment.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">✓ दर्ज पर्ची</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            यह रिकॉर्ड केवल कार्य इतिहास का दस्तावेज़ है, वित्तीय शोधन क्षमता (credit solvency) का प्रमाण नहीं।
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* QR CODE MODAL */}
      {/* ========================================================================= */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white rounded-[32px] border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-[#0B132B]">
                  {t('scanToViewIdentity')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowQRModal(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <QRCodeView
              value={publicIdentityUrl}
              size={180}
              label={workerName}
              sublabel={`🧱 ${skillsList[0] || 'Mason'} • ${avgRating} ★ • ${locationDisplay}`}
              showActions={true}
            />

            <div className="text-center pt-1">
              <p className="text-[10px] text-slate-400">
                {t('shramikkEvidenceDisclaimer')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HOW IT IS BUILT MODAL */}
      {/* ========================================================================= */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-[32px] border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-[#0B132B]">
                  {t('howProfileIsBuilt')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHowItWorksModal(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {t('howProfileIsBuiltDesc')}
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">1. पूर्ण किए गए कार्य</strong>
                  <span className="text-slate-600">प्लेटफॉर्म पर प्रत्येक पूर्ण कार्य +1 सत्यापन जोड़ता है।</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">2. दो-तरफ़ा रेटिंग्स</strong>
                  <span className="text-slate-600">काम पूरा होने पर नियोक्ताओं द्वारा दी गई समीक्षाएं प्रतिष्ठा बनाती हैं।</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">3. साक्ष्य-आधारित बैज</strong>
                  <span className="text-slate-600">बिना झूठे दावों के वास्तविक आंकड़ों के आधार पर बैज अनलॉक होते हैं।</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHowItWorksModal(false)}
              className="w-full py-2.5 rounded-2xl bg-[#0B132B] text-white text-xs font-bold hover:bg-slate-800"
            >
              समझ आ गया (Understood)
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <WorkerBottomNav />
    </div>
  );
};

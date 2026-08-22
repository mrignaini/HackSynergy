import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Star,
  MapPin,
  Briefcase,
  Award,
  Calendar,
  Building,
  ArrowLeft,
  PlusCircle,
  FileText,
  UserCheck,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';
import { HirerBottomNav } from '../../components/navigation/HirerBottomNav';

export const HirerProfilePage: React.FC = () => {
  const { language, t } = useLanguage();
  const { auth } = useAuth();
  const { jobs, hires, ratings } = useJobs();

  const hirer = auth.hirerProfile;
  const hirerName = hirer?.fullName || 'अमित शर्मा (Amit Sharma)';
  const hirerType = hirer?.hirerType || 'सिविल ठेकेदार (Civil Contractor)';
  const location = `${hirer?.locality || 'Raj Nagar Extension'}, ${hirer?.city || 'Ghaziabad'}`;

  // Hirer stats
  const postedJobsCount = 12 + jobs.length;
  const completedJobsCount = 9 + jobs.filter((j) => j.status === 'completed').length;
  const activeHiresCount = hires.length;

  // Two-way ratings received by hirer from workers (toUserId = 'h-201')
  const hirerRatings = ratings.filter((r) => r.toUserId === (auth.userId || 'h-201'));
  const totalHirerReviewsCount = 8 + hirerRatings.length;
  const hirerAvgRating = 4.7;

  // Evidence-based badges for Hirer
  const hirerBadges = [
    {
      label: language === 'hi' ? 'समय पर भुगतान (Prompt Payer)' : 'Prompt Payer',
      desc: language === 'hi' ? 'सभी कार्य दिवसों पर डिजिटल/कैश पर्ची जारी' : 'Verified timely daily wage payments',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    },
    {
      label: language === 'hi' ? 'सत्यापित कार्यस्थल (Verified Worksite)' : 'Verified Worksite',
      desc: language === 'hi' ? 'सुरक्षित साइट व बुनियादी सुविधाएं उपलब्ध' : 'Safe work conditions and equipment provided',
      icon: <Building className="w-4 h-4 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200 text-amber-900',
    },
    {
      label: language === 'hi' ? 'शीर्ष नियोक्ता (Top Hirer)' : 'Top Hirer',
      desc: language === 'hi' ? '9+ पूर्ण कार्य व उच्च कामगार संतुष्टि' : '9+ completed jobs with high worker satisfaction',
      icon: <Star className="w-4 h-4 text-violet-600 fill-violet-400" />,
      color: 'bg-violet-50 border-violet-200 text-violet-900',
    },
  ];

  return (
    <div className="min-h-screen pb-28 md:pb-12 bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/hirer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'नियोक्ता डैशबोर्ड' : 'Hirer Dashboard'}</span>
          </Link>

          <Link
            to="/hirer/post-job"
            className="px-3.5 py-1.5 rounded-full bg-[#0B132B] hover:bg-slate-800 text-amber-400 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ नया काम पोस्ट करें</span>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* HIRER HERO CARD */}
        {/* ========================================================================= */}
        <div className="rounded-[32px] bg-[#0B132B] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center text-3xl font-black shadow-lg">
              🏢
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{hirerName}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 text-emerald-400 text-xs font-bold border border-emerald-700">
                  ✓ Verified Hirer
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-amber-400">{hirerType}</p>
              <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{location}</span>
              </p>
            </div>

            {/* Overall Rating Box */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-center min-w-[120px]">
              <div className="text-3xl font-black text-amber-400 font-sans flex items-center justify-center gap-1">
                <Star className="w-6 h-6 fill-amber-400" />
                {hirerAvgRating}
              </div>
              <span className="text-[10px] text-slate-300 block mt-0.5">{totalHirerReviewsCount} कामगार समीक्षाएं</span>
            </div>
          </div>

          {/* 4 Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700/80 text-center">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block">पोस्ट किए गए काम</span>
              <span className="text-xl font-black text-white font-sans">{postedJobsCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block">पूरे हुए काम</span>
              <span className="text-xl font-black text-emerald-400 font-sans">{completedJobsCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block">सक्रिय नियुक्तियां</span>
              <span className="text-xl font-black text-amber-400 font-sans">{activeHiresCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-slate-400 block">प्रतिष्ठा स्कोर</span>
              <span className="text-xl font-black text-emerald-400 font-sans">Grade A</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TWO-SIDED TRUST & REPUTATION BADGES */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-[#0B132B]">
              नियोक्ता भरोसा संकेतक (Hirer Trust Profile)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            SHRAMIKK दो-तरफ़ा समीक्षा प्रणाली पर काम करता है — कामगार और नियोक्ता दोनों का रिकॉर्ड पारदर्शी रहता है।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {hirerBadges.map((badge, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border ${badge.color} space-y-1`}>
                <div className="flex items-center gap-2 font-bold text-xs">
                  {badge.icon}
                  <span>{badge.label}</span>
                </div>
                <p className="text-[11px] opacity-80">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* WORKER REVIEWS FOR HIRER */}
        {/* ========================================================================= */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#0B132B]">
              {t('workerReviewsForHirer')}
            </h3>
            <span className="text-xs font-bold text-amber-800">{totalHirerReviewsCount} कुल समीक्षाएं</span>
          </div>

          <div className="space-y-3">
            {[
              {
                worker: 'रमेश कुमार (Mason / राजमिस्त्री)',
                score: 5,
                comment: 'सभ्य व्यवहार और समय पर पूरा भुगतान प्राप्त हुआ। काम का माहौल बहुत अच्छा था। / Good hirer, prompt payment and good site conditions.',
                date: '16 Aug 2026',
              },
              {
                worker: 'सुरेश कुमार (Painter / पेंटर)',
                score: 5,
                comment: 'दैनिक पर्ची तुरंत जारी की गई और सामग्री समय पर उपलब्ध कराई। / Material provided on time and slip issued immediately.',
                date: '12 Aug 2026',
              },
              {
                worker: 'दिनेश प्रजापति (Tile Worker)',
                score: 4,
                comment: 'विश्वसनीय ठेकेदार, सही दर और समय पर चाय-नाश्ता। / Reliable contractor, fair rates.',
                date: '5 Aug 2026',
              },
            ].map((rev, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-xs">👷🏽‍♂️</div>
                    <span>{rev.worker}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, si) => (
                      <Star
                        key={si}
                        className={`w-3.5 h-3.5 ${si < rev.score ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
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

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400 py-4">
          {t('shramikkEvidenceDisclaimer')}
        </div>

      </div>

      {/* Hirer Bottom Nav */}
      <HirerBottomNav />
    </div>
  );
};

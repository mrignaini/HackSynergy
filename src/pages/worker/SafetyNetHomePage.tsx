import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Landmark, Shield, TrendingDown, Bookmark, ShieldCheck, ArrowRight, Bell, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSafetyNet } from '../../context/SafetyNetContext';
import { useJobs } from '../../context/JobContext';
import { WorkerBottomNav } from '../../components/navigation/WorkerBottomNav';

export const SafetyNetHomePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { state, toggleSafetyNet, dismissNotification, markNotificationRead, getUnreadCount } = useSafetyNet();
  const unreadNotifs = state.notifications.filter((n) => !n.isRead);
  const { jobs, paymentRecords, totalIncomeRecorded } = useJobs();

  const completedJobs = jobs.filter((j) => j.status === 'completed');

  const cards = [
    {
      icon: <Bot className="w-7 h-7" />,
      color: 'bg-violet-100 text-violet-800 border-violet-200',
      title: language === 'hi' ? '🤖 AI साथी' : '🤖 AI Saathi',
      desc: language === 'hi'
        ? 'सरकारी योजनाएं, बीमा और सहायता खोजने में मदद पाएं'
        : 'Get help finding relevant schemes and support',
      to: '/worker/ai-saathi',
    },
    {
      icon: <Landmark className="w-7 h-7" />,
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      title: language === 'hi' ? '🏛 सरकारी योजनाएं' : '🏛 Government Schemes',
      desc: language === 'hi'
        ? 'आपके लिए उपलब्ध कल्याणकारी योजनाएं खोजें'
        : 'Find welfare schemes you may be eligible for',
      to: '/worker/schemes',
    },
    {
      icon: <Shield className="w-7 h-7" />,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      title: language === 'hi' ? '🛡 बीमा एवं सुरक्षा' : '🛡 Insurance',
      desc: language === 'hi'
        ? 'आपके काम के लिए प्रासंगिक सुरक्षा विकल्प खोजें'
        : 'Discover relevant insurance options',
      to: '/worker/insurance',
    },
    {
      icon: <TrendingDown className="w-7 h-7" />,
      color: 'bg-red-100 text-red-800 border-red-200',
      title: language === 'hi' ? '📉 आय सुरक्षा' : '📉 Income Protection',
      desc: language === 'hi'
        ? 'अपने काम और दर्ज आय में बदलाव समझें'
        : 'Understand changes in your work and income',
      to: '/worker/income-protection',
    },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Header */}
        <div className="rounded-[28px] bg-[#0B132B] text-white p-6 sm:p-8 shadow-xl space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold inline-block">
            STAY PROTECTED • सुरक्षित रहें
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-sans">
            {language === 'hi' ? 'वित्तीय सुरक्षा जाल (Financial Safety Net)' : 'Financial Safety Net'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {language === 'hi'
              ? 'सरकारी योजनाएं, बीमा एवं आय सुरक्षा खोजें।'
              : 'Discover support, welfare schemes and financial protection.'}
          </p>
        </div>

        {/* Safety Net Opt-in Toggle */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900">
                {language === 'hi' ? 'सुरक्षा जाल सक्षम करें (Enable Safety Net)' : 'Enable Safety Net'}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === 'hi'
                  ? 'आपकी कार्य गतिविधि का उपयोग केवल प्रासंगिक सहायता विकल्प दिखाने के लिए किया जाएगा।'
                  : 'Your information is used only to help identify relevant support options.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleSafetyNet}
            className={`relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 transition-colors duration-200 focus:outline-none ${
              state.safetyNetEnabled
                ? 'bg-emerald-500 border-emerald-500'
                : 'bg-slate-200 border-slate-300'
            }`}
          >
            <span
              className={`inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow-md transition-transform duration-200 mt-[1px] ${
                state.safetyNetEnabled ? 'translate-x-5.5 ml-[1px]' : 'translate-x-0.5'
              }`}
              style={{ width: '22px', height: '22px', transform: state.safetyNetEnabled ? 'translateX(20px)' : 'translateX(2px)' }}
            />
          </button>
        </div>

        {/* In-app Support Alerts */}
        {unreadNotifs.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Bell className="w-3.5 h-3.5 text-amber-700" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {language === 'hi' ? 'सूचनाएं' : 'Alerts'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">{unreadNotifs.length}</span>
            </div>
            {unreadNotifs.slice(0, 3).map((n) => (
              <Link
                key={n.id}
                to={n.actionUrl || '/worker/safety-net'}
                onClick={() => markNotificationRead(n.id)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 border border-amber-200 hover:border-amber-400 transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    n.type === 'scheme_match' ? 'bg-amber-200 text-amber-900'
                    : n.type === 'protection' ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-slate-200 text-slate-700'
                  }`}>
                    {n.type === 'scheme_match' ? <Landmark className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-slate-900 truncate">{language === 'hi' ? n.titleHi : n.title}</div>
                    <p className="text-[10px] text-slate-600 truncate">{language === 'hi' ? n.messageHi : n.message}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); dismissNotification(n.id); }}
                  className="p-1 rounded-lg bg-white border border-amber-200 text-amber-700 hover:bg-amber-100 shrink-0 ml-2"
                >
                  <X className="w-3 h-3" />
                </button>
              </Link>
            ))}
          </div>
        )}

        {/* 4 Main Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group p-5 sm:p-6 rounded-[24px] bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all space-y-3"
            >
              <div className={`w-12 h-12 rounded-2xl ${card.color} border flex items-center justify-center`}>
                {card.icon}
              </div>
              <h3 className="text-base font-extrabold text-[#0B132B]">{card.title}</h3>
              <p className="text-xs text-slate-600">{card.desc}</p>
              <span className="text-xs font-bold text-amber-800 group-hover:underline flex items-center gap-1">
                {language === 'hi' ? 'खोलें' : 'Explore'} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>

        {/* My Support Link */}
        <Link
          to="/worker/my-support"
          className="flex items-center justify-between p-5 rounded-[24px] bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#0B132B]">
                {language === 'hi' ? 'मेरी सहायता (My Support)' : 'My Support'}
              </div>
              <p className="text-[11px] text-slate-500">
                {language === 'hi'
                  ? 'सहेजी गई योजनाएं, बीमा विकल्प और AI साथी इतिहास'
                  : 'Saved schemes, insurance options and AI Saathi history'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-400 text-center px-4">
          {language === 'hi'
            ? 'सूचना केवल खोज हेतु है। पात्रता और अंतिम शर्तें संबंधित सरकारी प्राधिकरण या विनियमित प्रदाता द्वारा निर्धारित होती हैं।'
            : 'Information is for discovery only. Eligibility and final terms are determined by the relevant government authority or regulated provider.'}
        </p>
      </div>

      <WorkerBottomNav />
    </div>
  );
};

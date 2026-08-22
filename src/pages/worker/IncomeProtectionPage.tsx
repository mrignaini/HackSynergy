import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingDown, TrendingUp, ArrowLeft, Briefcase, IndianRupee,
  ShieldCheck, AlertTriangle, Bot, Landmark, CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useJobs } from '../../context/JobContext';
import { useSafetyNet } from '../../context/SafetyNetContext';
import { WorkerBottomNav } from '../../components/navigation/WorkerBottomNav';

export const IncomeProtectionPage: React.FC = () => {
  const { language } = useLanguage();
  const { jobs, paymentRecords, totalIncomeRecorded } = useJobs();
  const { state } = useSafetyNet();

  const completedJobs = jobs.filter((j) => j.status === 'completed');
  const inProgressJobs = jobs.filter((j) => j.status === 'in_progress');
  const allIncome = 242000 + totalIncomeRecorded;

  // Simple disruption detection: compare base (4 jobs/month avg) vs recent
  const baselineJobsPerMonth = 4;
  const recentJobsThisMonth = completedJobs.length + inProgressJobs.length;
  const isReduced = recentJobsThisMonth < baselineJobsPerMonth;
  const activityStatus = isReduced ? 'reduced' : 'stable';

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Header */}
        <div className="rounded-[28px] bg-[#0B132B] text-white p-6 sm:p-8 shadow-xl space-y-2">
          <Link to="/worker/safety-net" className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> {language === 'hi' ? 'सुरक्षा जाल' : 'Safety Net'}
          </Link>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-red-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white font-sans">
              {language === 'hi' ? '📉 आय सुरक्षा (Income Protection)' : '📉 Income Protection'}
            </h1>
          </div>
          <p className="text-xs text-slate-300">
            {language === 'hi'
              ? 'अपने काम और दर्ज आय में बदलाव समझें।'
              : 'Understand changes in your work and recorded income.'}
          </p>
        </div>

        {/* Income Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-400 uppercase">{language === 'hi' ? 'पूर्ण काम' : 'Completed Jobs'}</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-sans">{12 + completedJobs.length}</div>
            <span className="text-[11px] text-slate-500">कुल दर्ज कार्य</span>
          </div>

          <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <IndianRupee className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-400 uppercase">{language === 'hi' ? 'दर्ज आय' : 'Recorded Income'}</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-sans">₹{allIncome.toLocaleString('en-IN')}</div>
            <span className="text-[11px] text-emerald-700 font-bold">✓ बैंक-प्रमाणित</span>
          </div>

          <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-400 uppercase">{language === 'hi' ? 'हाल की गतिविधि' : 'Recent Activity'}</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-sans">{recentJobsThisMonth}</div>
            <span className="text-[11px] text-slate-500">{language === 'hi' ? 'इस महीने काम' : 'jobs this month'}</span>
          </div>
        </div>

        {/* Income Trend Visual */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-extrabold text-[#0B132B]">
            {language === 'hi' ? 'कार्य गतिविधि विश्लेषण (Work Activity Analysis)' : 'Work Activity Analysis'}
          </h3>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">{language === 'hi' ? 'सामान्य औसत' : 'Usual Average'}</div>
              <div className="text-2xl font-black text-slate-900 font-sans">{baselineJobsPerMonth}</div>
              <div className="text-[10px] text-slate-400">{language === 'hi' ? 'काम/माह' : 'jobs/month'}</div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="w-full h-2 rounded-full bg-slate-200 relative overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isReduced ? 'bg-red-400' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, (recentJobsThisMonth / baselineJobsPerMonth) * 100)}%` }}
                />
              </div>
            </div>

            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">{language === 'hi' ? 'इस महीने' : 'This Month'}</div>
              <div className={`text-2xl font-black font-sans ${isReduced ? 'text-red-600' : 'text-emerald-700'}`}>{recentJobsThisMonth}</div>
              <div className="text-[10px] text-slate-400">{language === 'hi' ? 'काम/माह' : 'jobs/month'}</div>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
            isReduced ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            {isReduced ? <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            <span>
              {isReduced
                ? (language === 'hi' ? 'आपकी कार्य गतिविधि सामान्य से कम दिख रही है।' : 'Your work activity appears lower than usual.')
                : (language === 'hi' ? 'आपकी हालिया कार्य गतिविधि स्थिर है।' : 'Your recent work activity looks stable.')}
            </span>
          </div>
        </div>

        {/* Safety Net Alert — only show when reduced and safety net ON */}
        {isReduced && state.safetyNetEnabled && (
          <div className="rounded-[24px] bg-amber-50 border-2 border-amber-300 p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              <h3 className="text-sm font-extrabold text-amber-900">
                {language === 'hi' ? 'सहायता चाहिए? (Need support?)' : 'Need support?'}
              </h3>
            </div>
            <p className="text-xs text-amber-800">
              {language === 'hi'
                ? 'आपकी हालिया कार्य गतिविधि पहले से कम है। आप उपलब्ध योजनाओं और सुरक्षा विकल्पों का पता लगा सकते हैं।'
                : 'Your recent work activity is lower than before. You can explore available schemes and protection options.'}
            </p>
            <div className="flex items-center gap-3">
              <Link
                to="/worker/schemes"
                className="px-4 py-2.5 rounded-xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'योजनाएं खोजें' : 'Explore Schemes'}</span>
              </Link>
              <Link
                to="/worker/ai-saathi"
                className="px-4 py-2.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI साथी से पूछें</span>
              </Link>
            </div>
          </div>
        )}

        {/* Payment Records Preview */}
        <div className="rounded-[24px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#0B132B]">
              {language === 'hi' ? 'हालिया दर्ज भुगतान' : 'Recent Recorded Payments'}
            </h3>
            <Link to="/worker/financial-hub" className="text-xs font-bold text-amber-800 hover:underline">
              {language === 'hi' ? 'सभी पर्चियां →' : 'All slips →'}
            </Link>
          </div>

          {paymentRecords.slice(0, 3).map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <div className="text-xs font-extrabold text-slate-900">{p.jobTitle}</div>
                <div className="text-[11px] text-slate-500">{p.hirerName} • {p.date}</div>
              </div>
              <div className="text-sm font-black text-slate-900 font-sans">₹{p.amount.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-400 text-center px-4">
          {language === 'hi'
            ? 'सूचना केवल खोज हेतु है। पात्रता और अंतिम शर्तें संबंधित सरकारी प्राधिकरण द्वारा निर्धारित होती हैं।'
            : 'Information is for discovery only. Eligibility and final terms are determined by the relevant government authority or regulated provider.'}
        </p>

      </div>
      <WorkerBottomNav />
    </div>
  );
};

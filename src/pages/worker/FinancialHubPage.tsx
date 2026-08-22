import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  IndianRupee,
  Download,
  FileText,
  TrendingUp,
  ShieldCheck,
  Building,
  CheckCircle2,
  Share2,
  Landmark,
  Shield,
  ArrowRight,
  Sparkles,
  Clock,
  AlertTriangle,
  Check,
  Copy,
  Info,
  QrCode,
  Layers,
  ChevronRight,
  X,
  ExternalLink,
  Phone,
  HardHat,
  Truck,
  Wrench,
  Scissors,
  Home,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useJobs, PaymentRecordItem } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { PaymentRecordModal } from '../../components/lifecycle/PaymentRecordModal';
import { WorkerBottomNav } from '../../components/navigation/WorkerBottomNav';
import { QRCodeView } from '../../components/common/QRCodeView';
import {
  ecosystemIntegrationsList,
  FinancialPartnerService,
  UpiPaymentService,
} from '../../services/ecosystemServices';

export const FinancialHubPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { auth } = useAuth();
  const {
    paymentRecords,
    totalIncomeRecorded,
    confirmPaymentByWorker,
    reportPaymentIssue,
    jobs,
  } = useJobs();

  // State
  const [selectedRecord, setSelectedRecord] = useState<PaymentRecordItem | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'verified' | 'pending' | 'under_review'>('all');
  const [showPortableModal, setShowPortableModal] = useState(false);
  const [showEcosystemModal, setShowEcosystemModal] = useState(false);
  const [showBeyondConstructionModal, setShowBeyondConstructionModal] = useState(false);
  const [showFutureServiceModal, setShowFutureServiceModal] = useState<{ title: string; desc: string; type: string } | null>(null);
  const [copiedPortable, setCopiedPortable] = useState(false);

  const workerId = auth.userId || 'w-101';
  const workerProfile = auth.workerProfile;
  const workerName = workerProfile?.fullName || 'रमेश कुमार (Ramesh Kumar)';
  const primarySkill = workerProfile?.skills?.[0] || 'Mason / राजमिस्त्री';

  // Dynamic calculations from records
  const dynamicTotal = 242000 + totalIncomeRecorded;
  const currentMonthCalculated = 18500 + totalIncomeRecorded;
  const completedJobsCount = 12 + jobs.filter((j) => j.status === 'completed').length;
  
  const verifiedPaymentsCount = paymentRecords.filter((p) => p.status === 'verified').length;
  const pendingPaymentsCount = paymentRecords.filter((p) => p.status === 'pending').length;

  // Filtered payment records
  const filteredPayments = paymentRecords.filter((p) => {
    if (paymentFilter === 'verified') return p.status === 'verified';
    if (paymentFilter === 'pending') return p.status === 'pending';
    if (paymentFilter === 'under_review') return p.status === 'under_review';
    return true;
  });

  const publicIdentityUrl = `${window.location.origin}/worker/${workerId}/identity`;

  const handleCopyPortableLink = async () => {
    try {
      await navigator.clipboard.writeText(publicIdentityUrl);
      setCopiedPortable(true);
      setTimeout(() => setCopiedPortable(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="min-h-screen pb-28 md:pb-12 bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ========================================================================= */}
        {/* 1. FINANCIAL HUB HEADER WITH DISCLAIMER */}
        {/* ========================================================================= */}
        <div className="rounded-[32px] bg-[#0B132B] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <Wallet className="w-3.5 h-3.5" />
                Work-Linked Financial Visibility
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                Phase 9 Ecosystem
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
              {language === 'hi' ? 'वित्तीय केंद्र (Financial Hub)' : 'Financial Hub'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {language === 'hi'
                ? 'आपके कार्य अभिलेख, दो-तरफ़ा सत्यापित भुगतान इतिहास व कनेक्टेड वित्तीय सेवाएं।'
                : 'Your work records, payment history and connected financial services.'}
            </p>

            {/* Not a bank notice */}
            <div className="pt-2">
              <p className="text-[11px] text-amber-300/90 font-medium flex items-center gap-1.5 bg-amber-400/10 p-2.5 rounded-xl border border-amber-400/20">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {language === 'hi'
                    ? 'यह कार्य-लिंक्ड वित्तीय रिकॉर्ड है, बैंक खाता नहीं। SHRAMIKK बैंक, ऋणदाता या बीमाकर्ता नहीं है।'
                    : 'This is a work-linked financial record, not a bank account. SHRAMIKK is not a bank, lender, or insurer.'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. FOUR MAIN ENTRY CARDS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: Payment Records */}
          <div className="p-5 sm:p-6 rounded-[28px] bg-white border border-slate-200/90 shadow-card hover:border-amber-400 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <IndianRupee className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
                {verifiedPaymentsCount} Verified
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-[#0B132B]">
                {language === 'hi' ? '💳 भुगतान रिकॉर्ड (Payment Records)' : '💳 Payment Records'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'hi' ? 'कार्य के दो-तरफ़ा सत्यापित भुगतान देखें व पुष्टि करें।' : 'View recorded work payments and dual confirmations.'}
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-900 border-t border-slate-100">
              <span>कुल दर्ज: ₹{dynamicTotal.toLocaleString('en-IN')}</span>
              <span className="text-amber-800 font-extrabold">{paymentRecords.length} पर्चियां →</span>
            </div>
          </div>

          {/* Card 2: Financial Identity */}
          <div className="p-5 sm:p-6 rounded-[28px] bg-white border border-slate-200/90 shadow-card hover:border-amber-400 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                <Building className="w-6 h-6" />
              </div>
              <button
                type="button"
                onClick={() => setShowPortableModal(true)}
                className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors"
              >
                पोर्टेबल आईडी →
              </button>
            </div>
            <div>
              <h3 className="text-lg font-black text-[#0B132B]">
                {language === 'hi' ? '🏦 वित्तीय पहचान (Financial Identity)' : '🏦 Financial Identity'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'hi' ? 'कार्य व नियमित आय का पोर्टेबल प्रमाण पत्र एक्सपोर्ट करें।' : 'View your work-linked portable financial profile.'}
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-900 border-t border-slate-100">
              <span className="text-emerald-700">✓ Work Record Active</span>
              <button
                onClick={() => setShowPortableModal(true)}
                className="text-amber-800 font-extrabold hover:underline"
              >
                कार्ड देखें →
              </button>
            </div>
          </div>

          {/* Card 3: Government Services */}
          <Link
            to="/worker/schemes"
            className="p-5 sm:p-6 rounded-[28px] bg-white border border-slate-200/90 shadow-card hover:border-amber-400 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-900 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Landmark className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-900 text-xs font-bold border border-violet-200">
                10 योजनाएं
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-[#0B132B]">
                {language === 'hi' ? '🏛 सरकारी सेवाएं (Government Services)' : '🏛 Government Services'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'hi' ? 'e-Shram, BOCW, APY सहित केंद्रीय व राज्य कल्याणकारी योजनाएं खोजें।' : 'Connect with verified welfare and government services.'}
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-bold text-amber-800 border-t border-slate-100">
              <span>योजना खोज पृष्ठ खोलें</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Protection Partners */}
          <Link
            to="/worker/insurance"
            className="p-5 sm:p-6 rounded-[28px] bg-white border border-slate-200/90 shadow-card hover:border-amber-400 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200">
                4 साझेदार
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-[#0B132B]">
                {language === 'hi' ? '🛡 सुरक्षा साझेदार (Protection Partners)' : '🛡 Protection Partners'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'hi' ? 'PMSBY, PMJJBY और आयुष्मान भारत स्वास्थ्य व दुर्घटना बीमा खोजें।' : 'Explore insurance and protection from regulated providers.'}
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-bold text-amber-800 border-t border-slate-100">
              <span>बीमा विकल्प देखें</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>

        {/* ========================================================================= */}
        {/* 3. FINANCIAL VISIBILITY METRICS BAR */}
        {/* ========================================================================= */}
        <div className="rounded-[28px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-extrabold text-[#0B132B] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{language === 'hi' ? 'मेरी वित्तीय दृश्यता (Financial Visibility Profile)' : 'My Financial Visibility'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'hi' ? 'कार्य अभिलेखों पर आधारित पारदर्शी आंकड़े' : 'Aggregated from verified work and payment slips'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowEcosystemModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span>{language === 'hi' ? 'इकोसिस्टम मैप' : 'Ecosystem Map'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">पूर्ण कार्य (Shifts)</span>
              <span className="text-2xl font-black text-slate-900 font-sans">{completedJobsCount}</span>
              <span className="text-[10px] text-emerald-700 block font-bold mt-0.5">✓ 100% दर्ज</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">सत्यापित भुगतान</span>
              <span className="text-2xl font-black text-emerald-700 font-sans">{verifiedPaymentsCount}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">दो-तरफ़ा पुष्टि</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">कुल दर्ज आय</span>
              <span className="text-2xl font-black text-slate-900 font-sans">₹{dynamicTotal.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-emerald-700 block font-bold mt-0.5">प्रमाणित पर्चियां</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block">औसत कार्य आवृत्ति</span>
              <span className="text-2xl font-black text-amber-900 font-sans">4.2</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">कार्य/माह (Jobs/mo)</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. TWO-SIDED PAYMENT VERIFICATION & WAGE SLIPS LIST */}
        {/* ========================================================================= */}
        <div className="rounded-[28px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-[#0B132B]">
                {language === 'hi' ? 'दैनिक भुगतान व सत्यापन (Payment Verification)' : 'Payment Records & Dual Verification'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'कामगार व नियोक्ता दोनों की पुष्टि के बाद भुगतान "सत्यापित (Verified)" होता है।'
                  : 'Payments become Verified after both worker and hirer confirmation.'}
              </p>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'सभी (All)' },
                { id: 'verified', label: 'सत्यापित (Verified)' },
                { id: 'pending', label: 'लंबित (Pending)' },
                { id: 'under_review', label: 'समीक्षाधीन (Issue)' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setPaymentFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    paymentFilter === f.id
                      ? 'bg-[#0B132B] text-amber-400'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Payments */}
          <div className="space-y-3">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 hover:border-amber-400 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl shrink-0">
                        ₹
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-extrabold text-slate-900">{item.jobTitle}</h4>
                          {item.status === 'verified' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              ✓ Payment Verified
                            </span>
                          ) : item.status === 'under_review' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-900 text-[10px] font-bold">
                              ⚠️ Under Review
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                              ⏳ Awaiting Confirmation
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 mt-0.5">
                          {item.hirerName} • 📍 {item.location} • {item.date}
                        </div>
                        <div className="text-[11px] text-amber-800 font-mono font-semibold mt-0.5">
                          {item.slipNumber} • दर: ₹{item.wagePerDay}/दिन ({item.durationDays} दिन)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                      <div className="text-right">
                        <div className="text-xl font-black text-slate-900 font-sans">
                          ₹{item.amount.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {item.status === 'verified' ? 'दोनों पक्षों द्वारा पुष्ट' : 'पुष्टि अपेक्षित'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedRecord(item)}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all shadow-2xs"
                      >
                        पर्ची देखें
                      </button>
                    </div>
                  </div>

                  {/* Two-Sided Confirmation Action Panel for Worker */}
                  {item.status !== 'verified' && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
                        <span className="font-extrabold text-amber-950">
                          {language === 'hi' ? 'क्या आपको यह भुगतान प्राप्त हुआ?' : 'Did you receive this payment?'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => confirmPaymentByWorker(item.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>हाँ, भुगतान मिला (Confirm)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => reportPaymentIssue(item.id, 'भुगतान अभी नहीं मिला')}
                          className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold text-xs transition-colors"
                        >
                          नहीं मिला (Report)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                {t('noPaymentRecords') || 'इस श्रेणी में कोई भुगतान रिकॉर्ड नहीं मिला।'}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. WORK & PAYMENT TIMELINE */}
        {/* ========================================================================= */}
        <div className="rounded-[28px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#0B132B] flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{language === 'hi' ? 'कार्य व भुगतान टाइमलाइन (Work & Payment Timeline)' : 'Work & Payment Timeline'}</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">हालिया रिकॉर्ड्स</span>
          </div>

          <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {[
              { date: '20 Aug 2026', title: 'Villa Plastering Shift Completed', type: 'work', amount: '₹3,000', verified: true },
              { date: '18 Aug 2026', title: 'Wage Payment Confirmed by Hirer & Worker', type: 'payment', amount: '₹2,500', verified: true },
              { date: '15 Aug 2026', title: 'Boundary Wall Construction Completed', type: 'work', amount: '₹1,900', verified: true },
              { date: '10 Aug 2026', title: 'Two-Sided Payment Verification Recorded', type: 'payment', amount: '₹3,000', verified: true },
            ].map((ev, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-extrabold text-slate-900">{ev.title}</div>
                    <div className="text-[10px] text-slate-500">{ev.date} • {ev.type === 'work' ? 'कार्य पूर्ण' : 'भुगतान सत्यापित'}</div>
                  </div>
                  <span className="font-black text-slate-900 font-sans">{ev.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. FINANCIAL SERVICES DISCOVERY (FUTURE INTEGRATIONS) */}
        {/* ========================================================================= */}
        <div className="rounded-[28px] bg-white border border-slate-200/90 shadow-card p-5 sm:p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-base font-extrabold text-[#0B132B]">
                {language === 'hi' ? 'कनेक्टेड वित्तीय सेवाएं (Financial Services Discovery)' : 'Financial Services Discovery'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'hi'
                ? 'SHRAMIKK इकोसिस्टम से जुड़ने वाली भविष्य की सेवाएं (विनियमित साझेदारों के माध्यम से उपलब्ध होंगी)'
                : 'Future services powered by regulated partners and ecosystem integrations'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* 1. UPI Payment Verification */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-950">UPI भुगतान सत्यापन</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black">
                    Future Integration
                  </span>
                </div>
                <p className="text-slate-600 mt-1 text-[11px]">
                  NPCI / बैंक UPI रेल के माध्यम से सीधे डिजिटल भुगतान सत्यापन।
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFutureServiceModal({
                  title: 'UPI Payment Verification',
                  desc: UpiPaymentService.getVerificationStatus().message,
                  type: 'UPI Integration',
                })}
                className="text-amber-800 font-extrabold hover:underline text-left text-xs"
              >
                विवरण देखें →
              </button>
            </div>

            {/* 2. Formal Banking */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">बैंकिंग साझेदार (Banking)</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                    Coming Soon
                  </span>
                </div>
                <p className="text-slate-600 mt-1 text-[11px]">
                  दैनिक वेतनभोगियों के लिए शून्य-शेष बचत खाते व प्रत्यक्ष लाभ अंतरण।
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFutureServiceModal({
                  title: 'Banking Partner Integration',
                  desc: FinancialPartnerService.getBankingStatus().message,
                  type: 'Scheduled Commercial Banks',
                })}
                className="text-slate-700 font-bold hover:underline text-left text-xs"
              >
                विवरण देखें →
              </button>
            </div>

            {/* 3. Credit Access */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">क्रेडिट व ऋण पहुंच (Credit Access)</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                    Coming Soon
                  </span>
                </div>
                <p className="text-slate-600 mt-1 text-[11px]">
                  सत्यापित कार्य अभिलेखों के आधार पर विनियमित NBFC साझेदारों द्वारा आपातकालीन ऋण।
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFutureServiceModal({
                  title: 'Regulated Credit & Micro-Finance',
                  desc: FinancialPartnerService.getCreditAccessStatus().message,
                  type: 'RBI Regulated Partners',
                })}
                className="text-slate-700 font-bold hover:underline text-left text-xs"
              >
                विवरण देखें →
              </button>
            </div>

            {/* 4. Beyond Construction Preview */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-950">अन्य असंगठित क्षेत्र (Beyond Construction)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                    Roadmap
                  </span>
                </div>
                <p className="text-slate-600 mt-1 text-[11px]">
                  घरेलू काम, डिलीवरी, रिपेयर व मेंटेनेंस कारीगरों हेतु विस्तार।
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBeyondConstructionModal(true)}
                className="text-emerald-800 font-extrabold hover:underline text-left text-xs"
              >
                श्रेणियां देखें →
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* PORTABLE FINANCIAL IDENTITY MODAL */}
      {/* ========================================================================= */}
      {showPortableModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-[32px] border border-slate-200 p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-[#0B132B]">
                  पोर्टेबल कार्य व वित्तीय पहचान (Portable Identity)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPortableModal(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 flex-1">
              {/* Portable Identity Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0B132B] to-[#111C3D] text-white space-y-3 border border-amber-400/40 shadow-md text-xs">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                      <HardHat className="w-4 h-4" />
                    </div>
                    <span className="font-black tracking-wider text-amber-300">SHRAMIKK WORK IDENTITY</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">✓ Verified Record</span>
                </div>

                <div>
                  <div className="text-lg font-black text-white">{workerName}</div>
                  <div className="text-xs text-amber-400 font-bold">🧱 {primarySkill} • ⭐ 4.8 Rating</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px]">पूर्ण कार्य</span>
                    <span className="font-black text-white">{completedJobsCount} Shifts</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px]">सत्यापित भुगतान</span>
                    <span className="font-black text-emerald-400">{verifiedPaymentsCount} Slips</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px]">दर्ज आय सारांश</span>
                    <span className="font-black text-white">₹{(dynamicTotal/1000).toFixed(0)}K</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px]">सत्यापित कौशल</span>
                    <span className="font-black text-white">5 Trades</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-center pt-1">
                  SHRAMIKK दो-तरफ़ा सत्यापन पर आधारित वैध रिकॉर्ड
                </div>
              </div>

              {/* QR Code Section */}
              <QRCodeView
                value={publicIdentityUrl}
                size={140}
                label="Scan to View Full Work Identity"
                sublabel="Public safe link without sensitive financial info"
                showActions={false}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCopyPortableLink}
                className="flex-1 py-2.5 rounded-xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
              >
                {copiedPortable ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPortable ? 'लिंक कॉपी हुआ ✓' : 'शेयर लिंक कॉपी करें'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ECOSYSTEM ARCHITECTURE & SCALABILITY MODAL */}
      {/* ========================================================================= */}
      {showEcosystemModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-[32px] border border-slate-200 p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-[#0B132B]">
                  SHRAMIKK Connected Ecosystem
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEcosystemModal(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 flex-1 text-xs">
              <p className="text-slate-600">
                SHRAMIKK असंगठित कामगारों के दैनिक कार्य व भुगतानों को डिजिटल अभिलेख में बदलकर विनियमित वित्तीय व सरकारी तंत्र से जोड़ता है।
              </p>

              {/* Status Matrix */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900">इंटीग्रेशन स्थिति (Integration Matrix)</h4>
                {ecosystemIntegrationsList.map((item) => (
                  <div key={item.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2">
                    <div>
                      <div className="font-extrabold text-slate-900">{item.nameHi} ({item.name})</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.descriptionHi}</div>
                      <div className="text-[10px] text-amber-800 font-semibold mt-0.5">साझेदार: {item.partnerType}</div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                      item.status === 'available'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {item.status === 'available' ? '✓ Available' : '◷ Future'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowEcosystemModal(false)}
              className="w-full py-2.5 rounded-2xl bg-[#0B132B] text-white text-xs font-bold hover:bg-slate-800"
            >
              बंद करें (Close)
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BEYOND CONSTRUCTION EXPANSION PREVIEW MODAL */}
      {/* ========================================================================= */}
      {showBeyondConstructionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-[32px] border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-[#0B132B]">
                  SHRAMIKK Beyond Construction
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBeyondConstructionModal(false)}
                className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              भविष्य के चरणों में SHRAMIKK निर्माण क्षेत्र से आगे बढ़कर अन्य सभी असंगठित ट्रेडों में डिजिटल पहचान व सुरक्षा का विस्तार करेगा:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 font-bold text-emerald-950 flex items-center gap-2">
                <HardHat className="w-4 h-4 text-emerald-700" />
                <span>निर्माण कार्य (Active ✓)</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-2">
                <Home className="w-4 h-4 text-slate-400" />
                <span>घरेलू सेवाएं (Coming Soon)</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-2">
                <Truck className="w-4 h-4 text-slate-400" />
                <span>डिलीवरी व लॉजिस्टिक्स</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-slate-400" />
                <span>रिपेयर व मेंटेनेंस</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBeyondConstructionModal(false)}
              className="w-full py-2.5 rounded-2xl bg-[#0B132B] text-white text-xs font-bold hover:bg-slate-800"
            >
              समझ आ गया (Understood)
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FUTURE SERVICE NOTICE MODAL */}
      {/* ========================================================================= */}
      {showFutureServiceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white rounded-[32px] border border-slate-200 p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#0B132B]">
              {showFutureServiceModal.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {showFutureServiceModal.desc}
            </p>
            <div className="text-[11px] text-amber-800 font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              साझेदार प्रकार: {showFutureServiceModal.type}
            </div>
            <button
              type="button"
              onClick={() => setShowFutureServiceModal(null)}
              className="w-full py-2.5 rounded-2xl bg-[#0B132B] text-white text-xs font-bold hover:bg-slate-800"
            >
              बंद करें (Close)
            </button>
          </div>
        </div>
      )}

      {/* Slip Modal */}
      {selectedRecord && (
        <PaymentRecordModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <WorkerBottomNav />
    </div>
  );
};

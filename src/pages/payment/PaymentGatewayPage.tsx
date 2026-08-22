import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Lock,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Loader2,
  ChevronRight,
  Shield,
  ShieldCheck,
  Building,
  User,
  ArrowRight,
  Sparkles,
  Info,
  QrCode,
  Smartphone,
  Check,
  X,
  FileText,
  Copy,
  ExternalLink,
  ChevronDown,
  Download,
  Printer,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  fetchMyPayments,
  createPayment,
  processDemoPayment,
  confirmCompletion,
  releasePayment,
  simulateFailure,
  type Payment,
  type PaymentMethod,
  type PaymentStatus,
} from '../../services/paymentService';

// ─── TYPES & DATA ─────────────────────────────────────────────────────────────

interface Scenario {
  id: string;
  jobTitle: string;
  jobDescription: string;
  workerName: string;
  workerSkill: string;
  workerRating: number;
  hirerName: string;
  amount: number;
  location: string;
  initialStatus: PaymentStatus;
  workStatus: 'STARTED' | 'COMPLETED';
}

const DEMO_SCENARIOS: Scenario[] = [
  {
    id: 'sc-1',
    jobTitle: 'Boundary Wall Construction & Masonry',
    jobDescription: 'Building a 6ft boundary wall with mortar finish and neat brickwork.',
    workerName: 'रमेश कुमार (Ramesh Kumar)',
    workerSkill: 'राजमिस्त्री (Master Mason)',
    workerRating: 4.9,
    hirerName: 'अमित शर्मा (Sharma Constructions)',
    amount: 2850,
    location: 'Indirapuram, Ghaziabad',
    initialStatus: 'CREATED',
    workStatus: 'STARTED',
  },
  {
    id: 'sc-2',
    jobTitle: 'Interior Royale Texture Painting',
    jobDescription: 'Wall putty, 2 coats primer, and Royale Shine texture paint in 3 bedrooms.',
    workerName: 'सुरेश कुमार (Suresh Kumar)',
    workerSkill: 'पेंटर (Texture Painter)',
    workerRating: 4.8,
    hirerName: 'अमित शर्मा (Sharma Constructions)',
    amount: 3600,
    location: 'Raj Nagar Extension, Ghaziabad',
    initialStatus: 'FUNDS_LOCKED',
    workStatus: 'STARTED',
  },
  {
    id: 'sc-3',
    jobTitle: 'Residential Villa Tile & Marble Fitting',
    jobDescription: 'Italian marble laying and bathroom tile fitting with precision leveling.',
    workerName: 'राजेश सिंह (Rajesh Singh)',
    workerSkill: 'टाइल मिस्त्री (Tile Specialist)',
    workerRating: 5.0,
    hirerName: 'अमित शर्मा (Sharma Constructions)',
    amount: 4500,
    location: 'Sector 62, Noida',
    initialStatus: 'WORK_COMPLETED',
    workStatus: 'COMPLETED',
  },
];

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  icon: string;
  description: string;
  sub: string;
}[] = [
  { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)', icon: '📱', description: 'Instant Escrow Lock via VPA/QR', sub: 'shramikk@upi' },
  { id: 'CARD', label: 'Debit / Credit Card', icon: '💳', description: 'Simulated Visa, Mastercard, RuPay', sub: '•••• 4242' },
  { id: 'NET_BANKING', label: 'Net Banking', icon: '🏦', description: 'SBI, HDFC, ICICI, Axis Bank', sub: 'Instant confirmation' },
  { id: 'WALLET', label: 'Digital Wallet', icon: '👝', description: 'SHRAMIKK Wallet / Amazon Pay', sub: 'Zero fee demo' },
];

const TIMELINE_STEPS = [
  { status: 'CREATED', title: 'Payment Initiated', desc: 'Hirer selects work record' },
  { status: 'PAID', title: 'Payment Verified', desc: 'Simulated gateway authorization' },
  { status: 'FUNDS_LOCKED', title: '🔒 Funds Locked', desc: 'Protected in SHRAMIKK Escrow' },
  { status: 'WORK_COMPLETED', title: 'Work Completed', desc: 'Worker completes assigned shift' },
  { status: 'RELEASE_PENDING', title: 'Hirer Confirmed', desc: 'Hirer reviews & confirms work' },
  { status: 'RELEASED', title: '✓ Payment Released', desc: 'Funds credited to worker' },
];

const STATUS_PROGRESS: Record<PaymentStatus, number> = {
  CREATED: 0,
  PAYMENT_PENDING: 1,
  PAID: 2,
  FUNDS_LOCKED: 2,
  WORK_COMPLETED: 3,
  RELEASE_PENDING: 4,
  RELEASED: 5,
  FAILED: -1,
  REFUNDED: -1,
};

export const PaymentGatewayPage: React.FC = () => {
  const { auth } = useAuth();
  const { t, language } = useLanguage();

  // Active view perspective (hirer, worker, or interactive live simulator)
  const [perspective, setPerspective] = useState<'hirer' | 'worker' | 'simulator'>('simulator');
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(DEMO_SCENARIOS[0]);

  // Interactive state machine for simulator
  const [simStatus, setSimStatus] = useState<PaymentStatus>(DEMO_SCENARIOS[0].initialStatus);
  const [simWorkDone, setSimWorkDone] = useState(DEMO_SCENARIOS[0].workStatus === 'COMPLETED');
  const [demoPayId, setDemoPayId] = useState<string>('SHR-PAY-8F4A92K1');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
  const [simulateFail, setSimulateFail] = useState<boolean>(false);
  const [upiIdInput, setUpiIdInput] = useState<string>('user@okhdfcbank');

  // Checkout modal & release modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStage, setCheckoutStage] = useState<'select' | 'processing' | 'success' | 'failed'>('select');
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Generate a random demo payment ID
  const generateNewDemoId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return `SHR-PAY-${code}`;
  };

  // Change Scenario
  const handleSelectScenario = (sc: Scenario) => {
    setSelectedScenario(sc);
    setSimStatus(sc.initialStatus);
    setSimWorkDone(sc.workStatus === 'COMPLETED');
    setDemoPayId(generateNewDemoId());
  };

  // 1. Hirer Initiates Payment -> Opens Checkout
  const handleOpenCheckout = () => {
    setCheckoutStage('select');
    setIsCheckoutOpen(true);
  };

  // 2. Process Demo Checkout
  const handleProcessCheckout = async () => {
    setCheckoutStage('processing');
    await new Promise((r) => setTimeout(r, 1400));

    if (simulateFail) {
      setCheckoutStage('failed');
      setSimStatus('FAILED');
      return;
    }

    const newId = generateNewDemoId();
    setDemoPayId(newId);
    setSimStatus('FUNDS_LOCKED');
    setCheckoutStage('success');

    // Auto advance after 2 seconds
    setTimeout(() => {
      setIsCheckoutOpen(false);
    }, 2000);
  };

  // 3. Worker Marks Work Completed
  const handleWorkerCompleteWork = () => {
    if (simStatus !== 'FUNDS_LOCKED') return;
    setSimWorkDone(true);
    setSimStatus('WORK_COMPLETED');
  };

  // 4. Hirer Confirms Work Completion
  const handleHirerConfirmWork = () => {
    if (simStatus !== 'WORK_COMPLETED') return;
    setSimStatus('RELEASE_PENDING');
  };

  // 5. Open Release Confirmation Modal
  const handleOpenReleaseModal = () => {
    setIsReleaseModalOpen(true);
  };

  // 6. Hirer Releases Payment
  const handleConfirmRelease = async () => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSimStatus('RELEASED');
    setActionLoading(false);
    setIsReleaseModalOpen(false);
  };

  // Reset simulator
  const handleResetSimulation = () => {
    setSimStatus('CREATED');
    setSimWorkDone(false);
    setDemoPayId(generateNewDemoId());
    setSimulateFail(false);
  };

  const copyDemoId = () => {
    navigator.clipboard?.writeText(demoPayId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const currentStepIndex = STATUS_PROGRESS[simStatus] ?? 0;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 text-slate-900 font-sans">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-br from-[#0B132B] via-[#15234A] to-[#0B132B] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black tracking-wide uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>SHRAMIKK Secure Payment · Escrow Demo</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-sans">
                Secure Work Escrow & Milestone Release
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Experience SHRAMIKK’s core trust protocol: Hirer locks payment in escrow upfront, the worker executes the job with confidence, and funds are released immediately upon work confirmation.
              </p>
            </div>

            {/* Quick Demo Mode Badge */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col gap-2 shrink-0 max-w-xs">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold">Demo Gateway Engine</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Simulated zero-risk sandbox. No real money or bank accounts are debited.
              </p>
              <div className="flex items-center gap-2 pt-1 border-t border-white/10 text-[11px] text-amber-300 font-mono font-medium">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Neon PostgreSQL Synced</span>
              </div>
            </div>
          </div>

          {/* Perspective Selector Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-700/80 shadow-inner">
              <button
                type="button"
                onClick={() => setPerspective('simulator')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                  perspective === 'simulator'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Full Escrow Simulator</span>
              </button>
              <button
                type="button"
                onClick={() => setPerspective('hirer')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                  perspective === 'hirer'
                    ? 'bg-white text-[#0B132B] shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Building className="w-3.5 h-3.5 text-amber-600" />
                <span>Hirer Perspective</span>
              </button>
              <button
                type="button"
                onClick={() => setPerspective('worker')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                  perspective === 'worker'
                    ? 'bg-white text-[#0B132B] shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Worker Perspective</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetSimulation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition-colors border border-white/10"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        
        {/* Scenario Selection Pills */}
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/80 mb-6 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 shrink-0">
            Work Scenarios:
          </span>
          {DEMO_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 shrink-0 border ${
                selectedScenario.id === sc.id
                  ? 'bg-[#0B132B] text-amber-300 border-[#0B132B] shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span>{sc.jobTitle}</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-400 font-extrabold text-[10px]">
                ₹{sc.amount}
              </span>
            </button>
          ))}
        </div>

        {/* ─── 8-STEP ESCROW TIMELINE STEPPER ─── */}
        <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-card border border-slate-200/90 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider">
                State Machine Lifecycle
              </span>
              <h2 className="text-xl font-extrabold text-[#0B132B]">
                Escrow Status & Progression
              </h2>
            </div>

            {/* Current State Pill */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Current Status:</span>
              <span className={`px-3.5 py-1.5 rounded-full text-xs font-black border flex items-center gap-1.5 shadow-2xs ${
                simStatus === 'RELEASED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : simStatus === 'FUNDS_LOCKED'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300 animate-pulse'
                  : simStatus === 'WORK_COMPLETED'
                  ? 'bg-teal-50 text-teal-700 border-teal-300'
                  : simStatus === 'RELEASE_PENDING'
                  ? 'bg-purple-50 text-purple-700 border-purple-300'
                  : simStatus === 'FAILED'
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}>
                {simStatus === 'FUNDS_LOCKED' && <Lock className="w-3.5 h-3.5" />}
                {simStatus === 'RELEASED' && <CheckCircle className="w-3.5 h-3.5" />}
                {simStatus === 'FAILED' && <AlertCircle className="w-3.5 h-3.5" />}
                <span>
                  {simStatus === 'CREATED' && '1. CREATED (Pending Hirer Payment)'}
                  {simStatus === 'PAYMENT_PENDING' && '2. PAYMENT_PENDING (Processing)'}
                  {simStatus === 'PAID' && '3. PAID (Authorized)'}
                  {simStatus === 'FUNDS_LOCKED' && '4. FUNDS_LOCKED (🔒 Escrow Secured)'}
                  {simStatus === 'WORK_COMPLETED' && '5. WORK_COMPLETED (Shift Done)'}
                  {simStatus === 'RELEASE_PENDING' && '6. RELEASE_PENDING (Awaiting Release)'}
                  {simStatus === 'RELEASED' && '7. RELEASED (✓ Worker Paid)'}
                  {simStatus === 'FAILED' && '✕ FAILED (No funds locked)'}
                </span>
              </span>
            </div>
          </div>

          {/* Stepper Steps Desktop/Tablet Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {TIMELINE_STEPS.map((step, idx) => {
              const stepProgressIdx = STATUS_PROGRESS[step.status as PaymentStatus];
              const isCompleted = currentStepIndex >= stepProgressIdx && simStatus !== 'FAILED';
              const isCurrent = currentStepIndex === stepProgressIdx && simStatus !== 'FAILED';

              return (
                <div
                  key={step.status}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/30 shadow-sm'
                      : isCompleted
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-slate-50/70 border-slate-200/80 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isCompleted ? '✓' : idx + 1}
                      </span>
                      {isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      )}
                    </div>
                    <h4 className="text-xs font-black text-slate-900 leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 text-[9px] font-mono font-bold text-slate-400 uppercase">
                    STEP {idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── INTERACTIVE WORK RECORD & ESCROW CONTROLS ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Left 2 Cols: Scenario Work Card & Live Flow */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Work Record Card */}
            <div className="bg-white rounded-[28px] p-6 sm:p-7 shadow-card border border-slate-200/90 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-black text-xl flex items-center justify-center shadow-2xs">
                    👷🏽‍♂️
                  </div>
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                      Hired WorkRecord #WR-2026-08
                    </span>
                    <h3 className="text-lg font-black text-[#0B132B] mt-0.5">
                      {selectedScenario.jobTitle}
                    </h3>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Total Agreed Wage</span>
                  <span className="text-2xl font-black text-[#0B132B] font-sans">
                    ₹{selectedScenario.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Work Details & Stakeholders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-medium">Worker Information</span>
                  <p className="font-extrabold text-slate-900 text-sm">{selectedScenario.workerName}</p>
                  <p className="text-slate-600">{selectedScenario.workerSkill} · ★ {selectedScenario.workerRating}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-medium">Hirer / Contractor</span>
                  <p className="font-extrabold text-slate-900 text-sm">{selectedScenario.hirerName}</p>
                  <p className="text-slate-600">📍 {selectedScenario.location}</p>
                </div>
              </div>

              {/* Security Shield Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200/80 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-[#0B132B]">SHRAMIKK Escrow Guarantee: </strong>
                  The hirer’s payment is held securely in the digital escrow vault. Funds are only transferred to the worker once both parties agree the task is completed satisfactorily.
                </div>
              </div>

              {/* Interactive Action Control Section based on perspective & status */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Interactive Action Trigger:</span>
                  <span className="text-amber-800 font-bold">
                    Mode: {perspective.toUpperCase()}
                  </span>
                </div>

                {/* STAGE 1: CREATED -> Hirer Pays */}
                {simStatus === 'CREATED' && (
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={handleOpenCheckout}
                      className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#0B132B] to-[#1C3A6E] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Initiate & Secure Payment ₹{selectedScenario.amount}</span>
                    </button>
                  </div>
                )}

                {/* STAGE 2: FUNDS_LOCKED -> Worker Completes Work */}
                {simStatus === 'FUNDS_LOCKED' && (
                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm">
                        <Lock className="w-4 h-4 text-indigo-600" />
                        <span>Payment Secured in Escrow (₹{selectedScenario.amount})</span>
                      </div>
                      <span className="text-[10px] font-mono bg-indigo-200/80 text-indigo-950 px-2 py-0.5 rounded font-bold">
                        {demoPayId}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-700">
                      Funds are locked. The worker can now begin/complete the assigned work.
                    </p>
                    <button
                      type="button"
                      onClick={handleWorkerCompleteWork}
                      className="w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Worker: Mark Work as Completed</span>
                    </button>
                  </div>
                )}

                {/* STAGE 3: WORK_COMPLETED -> Hirer Confirms Work */}
                {simStatus === 'WORK_COMPLETED' && (
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-teal-900 font-extrabold text-sm">
                        <CheckCircle className="w-4 h-4 text-teal-600" />
                        <span>Work Completed by Worker!</span>
                      </div>
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-200/70 px-2 py-0.5 rounded">
                        Inspection Phase
                      </span>
                    </div>
                    <p className="text-xs text-teal-700">
                      The worker has reported work completion. Hirer must verify the quality before releasing the locked payment.
                    </p>
                    <button
                      type="button"
                      onClick={handleHirerConfirmWork}
                      className="w-full py-3 px-5 rounded-xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Hirer: Confirm Work Quality & Prepare Release</span>
                    </button>
                  </div>
                )}

                {/* STAGE 4: RELEASE_PENDING -> Hirer Releases Escrow Funds */}
                {simStatus === 'RELEASE_PENDING' && (
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-purple-900 font-extrabold text-sm">
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>Work Confirmed · Ready to Release</span>
                      </div>
                    </div>
                    <p className="text-xs text-purple-700">
                      Both parties verified the work. Click below to transfer locked funds directly to the worker’s balance.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenReleaseModal}
                      className="w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm & Release Escrow Payment (₹{selectedScenario.amount})</span>
                    </button>
                  </div>
                )}

                {/* STAGE 5: RELEASED -> Success & Receipt */}
                {simStatus === 'RELEASED' && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span>Payment Released Successfully!</span>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded font-bold">
                        {demoPayId}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700">
                      ₹{selectedScenario.amount.toLocaleString('en-IN')} has been safely released to {selectedScenario.workerName}. Worker ledger updated.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsReceiptModalOpen(true)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Official Payment Slip</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleResetSimulation}
                        className="py-2.5 px-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs"
                      >
                        New Demo Cycle
                      </button>
                    </div>
                  </div>
                )}

                {/* FAILED STATE */}
                {simStatus === 'FAILED' && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
                    <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Payment Simulation Failed (Demo Branch)</span>
                    </div>
                    <p className="text-xs text-red-600">
                      Simulated gateway rejection. No funds were locked. Rule 5 protects work from false releases.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetSimulation}
                      className="py-2 px-4 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                    >
                      Try Again
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Trust & Architecture Explainer */}
            <div className="bg-[#0B132B] text-white rounded-[28px] p-6 shadow-xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Shield className="w-4 h-4" />
                <span>Future-Ready Payment Architecture</span>
              </div>
              <h3 className="text-lg font-black">
                How SHRAMIKK Bridges Informal Labour with Instant Trust
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-amber-400 font-bold block">1. Zero Wage Default</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Workers are guaranteed payment before setting foot on site because money is locked in escrow.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-emerald-400 font-bold block">2. Quality Assurance</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Hirers hold release authority until satisfactory completion of masonry, painting, or plumbing tasks.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-amber-300 font-bold block">3. Razorpay Ready</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Standardized <code className="text-amber-200">IPaymentProvider</code> interface ready for drop-in production gateway keys.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Col: Live Transaction Summary Card & Perspectives */}
          <div className="space-y-6">
            
            {/* Live Escrow Status Card */}
            <div className="bg-white rounded-[28px] p-6 shadow-card border border-slate-200/90 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-sm font-extrabold text-[#0B132B]">
                  Escrow Vault Summary
                </h4>
                <span className="text-[10px] font-bold text-slate-400">
                  LIVE STATUS
                </span>
              </div>

              {/* Status Header */}
              <div className="text-center py-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <p className="text-[11px] text-slate-500 font-medium">Secured Amount</p>
                <p className="text-3xl font-extrabold text-[#0B132B]">
                  ₹{selectedScenario.amount.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-slate-400">
                  Currency: INR (₹) · 100% Protected
                </p>
              </div>

              {/* Transaction Meta Details */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Transaction ID</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-slate-800">{demoPayId}</span>
                    <button onClick={copyDemoId} title="Copy ID" className="text-slate-400 hover:text-slate-600">
                      {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Payment Channel</span>
                  <span className="font-semibold text-slate-800">{selectedMethod} (Demo)</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Hirer Confirmed</span>
                  <span className={`font-bold ${simStatus === 'RELEASE_PENDING' || simStatus === 'RELEASED' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {simStatus === 'RELEASE_PENDING' || simStatus === 'RELEASED' ? '✓ Yes' : 'Pending'}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Worker Confirmed</span>
                  <span className={`font-bold ${simStatus === 'RELEASED' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {simStatus === 'RELEASED' ? '✓ Credited' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Quick View Receipt Button */}
              {simStatus === 'RELEASED' && (
                <button
                  type="button"
                  onClick={() => setIsReceiptModalOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-700" />
                  <span>Download / Print Slip</span>
                </button>
              )}
            </div>

            {/* Perspective Quick Cards */}
            <div className="bg-gradient-to-br from-slate-900 to-[#101C3D] text-white rounded-[28px] p-6 shadow-card space-y-4">
              <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                Two-Sided Perspective Demo
              </h4>

              <div className="space-y-3">
                {/* Hirer Card */}
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                    <span>Hirer Experience</span>
                    <Building className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Hirer pays with 1-click upfront. If work is unsatisfactory, dispute resolution is triggered before any funds leave the vault.
                  </p>
                </div>

                {/* Worker Card */}
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                    <span>Worker Experience</span>
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Worker gets immediate notification: "🔒 ₹{selectedScenario.amount} Secured". They perform the work knowing wage default is impossible.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ─── MODAL 1: CHECKOUT MODAL ─── */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs px-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0B132B] to-[#1C2B50] px-6 py-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">SHRAMIKK Secure Payment</h3>
                  <p className="text-[10px] text-amber-300">Escrow Checkout · Demo Mode</p>
                </div>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {checkoutStage === 'select' && (
                <div className="space-y-5">
                  {/* Amount Summary */}
                  <div className="text-center py-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs text-slate-400 font-medium">Payment to Lock in Escrow</span>
                    <p className="text-3xl font-black text-[#0B132B] mt-0.5">
                      ₹{selectedScenario.amount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 font-semibold">
                      {selectedScenario.jobTitle}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Beneficiary Worker: {selectedScenario.workerName}
                    </p>
                  </div>

                  {/* Escrow Lock Notice */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-indigo-800 leading-snug">
                      <strong>100% Protection:</strong> Your payment will be locked securely until the worker completes the job and you confirm satisfaction.
                    </p>
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">
                      Choose Demo Payment Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PAYMENT_METHODS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSelectedMethod(m.id)}
                          className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                            selectedMethod === m.id
                              ? 'border-[#0B132B] bg-[#0B132B] text-white shadow-sm'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                          }`}
                        >
                          <span className="text-xl">{m.icon}</span>
                          <div>
                            <p className="text-xs font-bold leading-tight">{m.label.split(' ')[0]}</p>
                            <p className={`text-[10px] ${selectedMethod === m.id ? 'text-slate-300' : 'text-slate-500'}`}>
                              {m.sub}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* UPI Input / Card Demo Helper */}
                  {selectedMethod === 'UPI' && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-600 block">
                        Virtual Payment Address (VPA) / UPI ID
                      </label>
                      <input
                        type="text"
                        value={upiIdInput}
                        onChange={(e) => setUpiIdInput(e.target.value)}
                        placeholder="e.g. yourname@upi"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  )}

                  {/* Optional Fail Toggle */}
                  <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simulateFail}
                      onChange={(e) => setSimulateFail(e.target.checked)}
                      className="w-4 h-4 accent-red-600 rounded"
                    />
                    <span className="text-xs text-slate-600 font-medium">
                      Simulate Gateway Failure scenario (Demo test)
                    </span>
                  </label>

                  {/* Pay Button */}
                  <button
                    type="button"
                    onClick={handleProcessCheckout}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0B132B] to-[#1C3A6E] text-white font-extrabold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Pay Securely ₹{selectedScenario.amount.toLocaleString('en-IN')}</span>
                  </button>
                </div>
              )}

              {/* PROCESSING STATE */}
              {checkoutStage === 'processing' && (
                <div className="text-center py-10 space-y-4">
                  <Loader2 className="w-12 h-12 text-[#0B132B] animate-spin mx-auto" />
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">
                      Processing Secure Payment…
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Authorizing with demo payment provider & creating escrow vault
                    </p>
                  </div>
                </div>
              )}

              {/* SUCCESS STATE */}
              {checkoutStage === 'success' && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-emerald-700">
                      Payment Successful!
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      ₹{selectedScenario.amount.toLocaleString('en-IN')} locked safely in escrow
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-left space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> FUNDS LOCKED
                      </span>
                      <span className="font-mono text-[10px] bg-indigo-200 px-2 py-0.5 rounded">
                        {demoPayId}
                      </span>
                    </div>
                    <p className="text-[11px] text-indigo-800 leading-snug">
                      Your payment is securely held. It will only be released when the worker completes the job and you confirm.
                    </p>
                  </div>
                </div>
              )}

              {/* FAILED STATE */}
              {checkoutStage === 'failed' && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-red-600">
                      Payment Simulation Failed
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      No money has been debited or locked in escrow.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutStage('select')}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: RELEASE CONFIRMATION MODAL ─── */}
      {isReleaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs px-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-6 border border-slate-200 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-[#0B132B]">
                Release Payment to Worker?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Once confirmed, the locked escrow payment of <strong>₹{selectedScenario.amount.toLocaleString('en-IN')}</strong> will be instantly transferred to <strong>{selectedScenario.workerName}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Worker</span>
                <span className="font-bold text-slate-800">{selectedScenario.workerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Work Title</span>
                <span className="font-bold text-slate-800">{selectedScenario.jobTitle}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5">
                <span className="text-slate-500 font-bold">Release Amount</span>
                <span className="font-black text-emerald-700 text-sm">
                  ₹{selectedScenario.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsReleaseModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleConfirmRelease}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm Release</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: OFFICIAL PAYMENT RECEIPT SLIP ─── */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs px-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            {/* Printable Slip Header */}
            <div className="bg-[#0B132B] text-white p-6 text-center relative">
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SHRAMIKK Escrow Payment Voucher</span>
              </div>
              <h3 className="text-xl font-black">Official Wage Settlement Slip</h3>
              <p className="text-slate-400 text-xs mt-0.5">Reference: {demoPayId}</p>
            </div>

            {/* Slip Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-800 font-bold block">Status</span>
                  <span className="text-base font-black text-emerald-700">✓ RELEASED & SETTLED</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-emerald-800 font-bold block">Paid Amount</span>
                  <span className="text-xl font-black text-[#0B132B]">
                    ₹{selectedScenario.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="space-y-2 py-2 border-y border-slate-100">
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Job Title:</span>
                  <span className="font-bold text-slate-900">{selectedScenario.jobTitle}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Worker (Beneficiary):</span>
                  <span className="font-bold text-slate-900">{selectedScenario.workerName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Hirer (Contractor):</span>
                  <span className="font-bold text-slate-900">{selectedScenario.hirerName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Settlement Method:</span>
                  <span className="font-mono text-slate-800">{selectedMethod} Instant Escrow Release</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Settlement Timestamp:</span>
                  <span className="text-slate-700">{new Date().toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[10px] text-slate-500 text-center">
                This digital settlement voucher confirms full mutual sign-off and is stored permanently in the SHRAMIKK Neon PostgreSQL audit trail.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-[#0B132B] text-white hover:bg-slate-800 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

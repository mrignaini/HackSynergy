/**
 * HirerPaymentsPage — /hirer/payments
 *
 * Shows the hirer's payment history and allows them to:
 *   - Initiate a payment for a hired WorkRecord
 *   - Process the demo checkout
 *   - Confirm work completion
 *   - Release payment to the worker
 */
import React, { useEffect, useState, useCallback } from 'react';
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
  X,
  Sparkles,
} from 'lucide-react';
import { HirerBottomNav } from '../../components/navigation/HirerBottomNav';
import {
  fetchMyPayments,
  processDemoPayment,
  confirmCompletion,
  releasePayment,
  type Payment,
  type PaymentMethod,
  type PaymentStatus,
} from '../../services/paymentService';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<PaymentStatus, string> = {
  CREATED: 'Payment Pending',
  PAYMENT_PENDING: 'Processing…',
  PAID: 'Paid',
  FUNDS_LOCKED: '🔒 Payment Secured',
  WORK_COMPLETED: 'Work Completed',
  RELEASE_PENDING: 'Awaiting Release',
  RELEASED: '✓ Payment Released',
  FAILED: '✕ Payment Failed',
  REFUNDED: 'Refunded',
};

const STATUS_COLORS: Record<PaymentStatus, string> = {
  CREATED: 'bg-amber-50 text-amber-700 border-amber-200',
  PAYMENT_PENDING: 'bg-blue-50 text-blue-700 border-blue-200',
  PAID: 'bg-green-50 text-green-700 border-green-200',
  FUNDS_LOCKED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  WORK_COMPLETED: 'bg-teal-50 text-teal-700 border-teal-200',
  RELEASE_PENDING: 'bg-purple-50 text-purple-700 border-purple-200',
  RELEASED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  FAILED: 'bg-red-50 text-red-700 border-red-200',
  REFUNDED: 'bg-slate-50 text-slate-600 border-slate-200',
};

const TIMELINE_STEPS: { status: PaymentStatus; label: string }[] = [
  { status: 'CREATED', label: 'Payment Created' },
  { status: 'FUNDS_LOCKED', label: 'Funds Locked' },
  { status: 'WORK_COMPLETED', label: 'Work Completed' },
  { status: 'RELEASE_PENDING', label: 'Hirer Confirmed' },
  { status: 'RELEASED', label: 'Payment Released' },
];

const STATUS_ORDER: PaymentStatus[] = [
  'CREATED', 'PAYMENT_PENDING', 'PAID', 'FUNDS_LOCKED',
  'WORK_COMPLETED', 'RELEASE_PENDING', 'RELEASED',
];

function getStatusIndex(s: PaymentStatus) {
  return STATUS_ORDER.indexOf(s);
}

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: 'UPI', label: 'UPI', icon: '📱' },
  { id: 'CARD', label: 'Card', icon: '💳' },
  { id: 'NET_BANKING', label: 'Net Banking', icon: '🏦' },
  { id: 'WALLET', label: 'Wallet', icon: '👝' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TimelineProps { status: PaymentStatus; }
const PaymentTimeline: React.FC<TimelineProps> = ({ status }) => {
  const currentIdx = getStatusIndex(status);
  if (status === 'FAILED' || status === 'REFUNDED') {
    return (
      <div className="flex items-center gap-2 mt-3">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <span className="text-xs text-red-600 font-medium">Payment did not complete</span>
      </div>
    );
  }
  return (
    <ol className="flex items-center gap-1 mt-3 flex-wrap">
      {TIMELINE_STEPS.map((step, i) => {
        const stepIdx = getStatusIndex(step.status);
        const done = stepIdx <= currentIdx;
        const active = stepIdx === currentIdx;
        return (
          <li key={step.status} className="flex items-center gap-1">
            <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold border
              ${done ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 text-slate-400'}
              ${active ? 'ring-2 ring-emerald-300' : ''}
            `}>
              {done ? '✓' : i + 1}
            </span>
            <span className={`text-[10px] ${done ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
              {step.label}
            </span>
            {i < TIMELINE_STEPS.length - 1 && (
              <ChevronRight className={`w-3 h-3 ${done ? 'text-emerald-500' : 'text-slate-300'}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
};

// ─── Checkout Modal ───────────────────────────────────────────────────────────

interface CheckoutModalProps {
  payment: Payment;
  onClose: () => void;
  onSuccess: () => void;
}
const CheckoutModal: React.FC<CheckoutModalProps> = ({ payment, onClose, onSuccess }) => {
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [stage, setStage] = useState<'select' | 'processing' | 'success' | 'failed'>('select');
  const [demoId, setDemoId] = useState('');
  const [simulateFail, setSimulateFail] = useState(false);

  const handlePay = async () => {
    setStage('processing');
    try {
      const result = await processDemoPayment(payment.id, method, simulateFail);
      setDemoId(result.demoPaymentId);
      setStage('success');
      setTimeout(onSuccess, 2500);
    } catch {
      setStage('failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B132B] to-[#1C2B50] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-white font-semibold text-sm">SHRAMIKK Secure Payment</p>
              <p className="text-amber-300 text-[10px]">Demo Mode — No real money transferred</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {stage === 'select' && (
            <>
              {/* Amount */}
              <div className="text-center mb-4">
                <p className="text-3xl font-extrabold text-[#0B132B]">
                  ₹{payment.amount.toLocaleString('en-IN')}
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  {payment.workRecord?.job.title ?? 'Work Payment'}
                </p>
                <p className="text-slate-400 text-xs">Worker: {payment.worker?.name ?? '—'}</p>
              </div>

              {/* Payment protection notice */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 flex gap-2 mb-4">
                <Lock className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <p className="text-indigo-700 text-xs leading-tight">
                  Your payment will be securely locked until the work is completed and confirmed.
                </p>
              </div>

              {/* Method selection */}
              <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                Select Payment Method
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all
                      ${method === m.id
                        ? 'border-[#0B132B] bg-[#0B132B] text-white shadow'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                      }`}
                  >
                    <span>{m.icon}</span> {m.label}
                  </button>
                ))}
              </div>

              {/* Demo fail toggle */}
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={simulateFail}
                  onChange={(e) => setSimulateFail(e.target.checked)}
                  className="w-4 h-4 accent-red-500"
                />
                <span className="text-xs text-slate-500">Simulate Payment Failure (demo only)</span>
              </label>

              <button
                onClick={handlePay}
                className="w-full bg-gradient-to-r from-[#0B132B] to-[#1C3A6E] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Pay Securely ₹{payment.amount.toLocaleString('en-IN')}
              </button>
            </>
          )}

          {stage === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="w-10 h-10 text-[#0B132B] animate-spin mx-auto mb-3" />
              <p className="text-slate-700 font-semibold">Processing payment…</p>
              <p className="text-slate-400 text-sm mt-1">Please wait</p>
            </div>
          )}

          {stage === 'success' && (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-emerald-700 font-bold text-lg">Payment Successful!</p>
              <p className="text-slate-500 text-sm mt-1">₹{payment.amount.toLocaleString('en-IN')} paid</p>
              <div className="mt-3 bg-indigo-50 rounded-xl px-4 py-3">
                <p className="text-indigo-700 text-xs font-semibold flex items-center justify-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> FUNDS LOCKED
                </p>
                <p className="text-slate-600 text-xs mt-1">
                  Payment is securely locked until work completion.
                </p>
                <p className="text-slate-400 text-[10px] mt-1 font-mono">{demoId}</p>
              </div>
            </div>
          )}

          {stage === 'failed' && (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-600 font-bold text-lg">Payment Failed</p>
              <p className="text-slate-500 text-sm mt-1">No money has been locked.</p>
              <button
                onClick={onClose}
                className="mt-4 w-full border border-slate-300 text-slate-700 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Release Confirmation Modal ───────────────────────────────────────────────

interface ReleaseModalProps {
  payment: Payment;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}
const ReleaseModal: React.FC<ReleaseModalProps> = ({ payment, onClose, onConfirm, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6 text-amber-600" />
        </div>
        <h3 className="font-bold text-lg text-[#0B132B]">Release Payment?</h3>
        <p className="text-slate-500 text-sm mt-1">
          Once confirmed, the locked payment will be released to the worker.
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl px-4 py-3 mb-4 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Worker</span>
          <span className="font-medium">{payment.worker?.name ?? '—'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Amount</span>
          <span className="font-bold text-emerald-700">₹{payment.amount.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Job</span>
          <span className="font-medium text-right">{payment.workRecord?.job.title ?? '—'}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-xl text-sm font-medium">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 flex items-center justify-center gap-1 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Release'}
        </button>
      </div>
    </div>
  </div>
);

// ─── Payment Card ─────────────────────────────────────────────────────────────

interface PaymentCardProps {
  payment: Payment;
  onAction: (p: Payment, action: 'checkout' | 'confirm' | 'release') => void;
  actionLoading: string | null;
}
const PaymentCard: React.FC<PaymentCardProps> = ({ payment, onAction, actionLoading }) => {
  const s = payment.status;
  const isLoading = actionLoading === payment.id;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Status bar */}
      <div className={`px-4 py-2 border-b flex items-center justify-between ${STATUS_COLORS[s]}`}>
        <span className="text-xs font-semibold">{STATUS_LABELS[s]}</span>
        {s === 'FUNDS_LOCKED' && <Lock className="w-3.5 h-3.5" />}
        {s === 'RELEASED' && <CheckCircle className="w-3.5 h-3.5" />}
      </div>

      <div className="p-4">
        {/* Amount + job */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-2xl font-extrabold text-[#0B132B]">
              ₹{payment.amount.toLocaleString('en-IN')}
            </p>
            <p className="text-slate-600 text-sm font-medium mt-0.5">
              {payment.workRecord?.job.title ?? 'Work Payment'}
            </p>
            <p className="text-slate-400 text-xs">Worker: {payment.worker?.name ?? '—'}</p>
          </div>
          {payment.demoPaymentId && (
            <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">
              {payment.demoPaymentId}
            </span>
          )}
        </div>

        {/* Timeline */}
        <PaymentTimeline status={s} />

        {/* Security message */}
        {s === 'FUNDS_LOCKED' && (
          <div className="mt-3 flex items-start gap-2 bg-indigo-50 rounded-xl px-3 py-2">
            <Lock className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
            <p className="text-indigo-700 text-xs">
              Payment is locked until work completion.
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-4 flex gap-2">
          {s === 'CREATED' && (
            <button
              onClick={() => onAction(payment, 'checkout')}
              className="flex-1 bg-[#0B132B] text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 flex items-center justify-center gap-1.5"
            >
              <Lock className="w-4 h-4" /> Secure Payment
            </button>
          )}
          {s === 'WORK_COMPLETED' && (
            <button
              onClick={() => onAction(payment, 'confirm')}
              disabled={isLoading}
              className="flex-1 bg-amber-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-amber-600 flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Confirm Work</>}
            </button>
          )}
          {s === 'RELEASE_PENDING' && (
            <button
              onClick={() => onAction(payment, 'release')}
              disabled={isLoading}
              className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Confirm & Release</>}
            </button>
          )}
          {s === 'RELEASED' && (
            <div className="flex-1 bg-emerald-50 text-emerald-700 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Payment Released
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export const HirerPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutPayment, setCheckoutPayment] = useState<Payment | null>(null);
  const [releasePaymentData, setReleasePaymentData] = useState<Payment | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyPayments();
      setPayments(data);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (payment: Payment, action: 'checkout' | 'confirm' | 'release') => {
    if (action === 'checkout') {
      setCheckoutPayment(payment);
      return;
    }
    if (action === 'release') {
      setReleasePaymentData(payment);
      return;
    }
    // confirm
    setActionLoading(payment.id);
    try {
      await confirmCompletion(payment.id);
      await load();
    } catch (e: any) {
      alert(e.message ?? 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRelease = async () => {
    if (!releasePaymentData) return;
    setActionLoading(releasePaymentData.id);
    try {
      await releasePayment(releasePaymentData.id);
      setReleasePaymentData(null);
      await load();
    } catch (e: any) {
      alert(e.message ?? 'Release failed');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0B132B] to-[#1C3A6E] px-5 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-amber-400/20 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-amber-300" />
          </div>
          <h1 className="text-white text-xl font-extrabold tracking-tight">Payments</h1>
        </div>
        <p className="text-slate-400 text-sm ml-12">Manage your secure worker payments</p>
        <div className="ml-12 mt-2 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-300 text-[11px] font-medium">SHRAMIKK Secure Payment · Demo Mode</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-5 space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && payments.length === 0 && (
          <div className="text-center py-12 px-4 rounded-[28px] bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 text-amber-700">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">No active backend payments yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You can experience the complete 8-step interactive Escrow & Secure Payment simulation right now in the Showcase Gateway.
            </p>
            <a
              href="/payments"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B132B] hover:bg-slate-800 text-amber-400 text-xs font-black shadow-md mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Interactive Escrow Showcase →</span>
            </a>
          </div>
        )}

        {!loading && payments.map((p) => (
          <PaymentCard
            key={p.id}
            payment={p}
            onAction={handleAction}
            actionLoading={actionLoading}
          />
        ))}

        {/* Refresh */}
        {!loading && payments.length > 0 && (
          <button
            onClick={load}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-slate-400 text-sm hover:text-slate-600"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        )}
      </div>

      {/* Modals */}
      {checkoutPayment && (
        <CheckoutModal
          payment={checkoutPayment}
          onClose={() => setCheckoutPayment(null)}
          onSuccess={() => { setCheckoutPayment(null); load(); }}
        />
      )}

      {releasePaymentData && (
        <ReleaseModal
          payment={releasePaymentData}
          onClose={() => setReleasePaymentData(null)}
          onConfirm={handleRelease}
          loading={actionLoading === releasePaymentData.id}
        />
      )}

      <HirerBottomNav />
    </div>
  );
};

/**
 * WorkerPaymentsPage — /worker/payments
 *
 * Shows the worker's payment history (read-only).
 * Workers can view status, transaction IDs, and the payment timeline.
 * They CANNOT release payments — that is the hirer's responsibility.
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  Wallet,
  Lock,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Loader2,
  ChevronRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { WorkerBottomNav } from '../../components/navigation/WorkerBottomNav';
import { fetchMyPayments, type Payment, type PaymentStatus } from '../../services/paymentService';

// ─── Shared helpers (duplicated for isolation) ────────────────────────────────

const STATUS_LABELS: Record<PaymentStatus, string> = {
  CREATED: 'Payment Pending',
  PAYMENT_PENDING: 'Processing…',
  PAID: 'Paid',
  FUNDS_LOCKED: '🔒 Payment Secured',
  WORK_COMPLETED: 'Work Completed',
  RELEASE_PENDING: 'Awaiting Confirmation',
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
  { status: 'FUNDS_LOCKED', label: 'Payment Secured' },
  { status: 'WORK_COMPLETED', label: 'Work Completed' },
  { status: 'RELEASE_PENDING', label: 'Hirer Confirmed' },
  { status: 'RELEASED', label: 'Released to You' },
];

const STATUS_ORDER: PaymentStatus[] = [
  'CREATED', 'PAYMENT_PENDING', 'PAID', 'FUNDS_LOCKED',
  'WORK_COMPLETED', 'RELEASE_PENDING', 'RELEASED',
];

function getStatusIndex(s: PaymentStatus) { return STATUS_ORDER.indexOf(s); }

// ─── Timeline ─────────────────────────────────────────────────────────────────

const PaymentTimeline: React.FC<{ status: PaymentStatus }> = ({ status }) => {
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

// ─── Payment Card ─────────────────────────────────────────────────────────────

const WorkerPaymentCard: React.FC<{ payment: Payment }> = ({ payment }) => {
  const s = payment.status;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Status bar */}
      <div className={`px-4 py-2 border-b flex items-center justify-between ${STATUS_COLORS[s]}`}>
        <span className="text-xs font-semibold">{STATUS_LABELS[s]}</span>
        {s === 'FUNDS_LOCKED' && <Lock className="w-3.5 h-3.5" />}
        {s === 'RELEASED' && <CheckCircle className="w-3.5 h-3.5" />}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-2xl font-extrabold text-[#0B132B]">
              ₹{payment.amount.toLocaleString('en-IN')}
            </p>
            <p className="text-slate-600 text-sm font-medium mt-0.5">
              {payment.workRecord?.job.title ?? 'Work Payment'}
            </p>
            <p className="text-slate-400 text-xs">From: {payment.hirer?.name ?? '—'}</p>
          </div>
          {payment.demoPaymentId && (
            <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">
              {payment.demoPaymentId}
            </span>
          )}
        </div>

        <PaymentTimeline status={s} />

        {/* Context messages */}
        {s === 'FUNDS_LOCKED' && (
          <div className="mt-3 bg-indigo-50 rounded-xl px-3 py-2 flex gap-2">
            <Lock className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
            <p className="text-indigo-700 text-xs">
              Payment is secured. Complete the work to unlock funds.
            </p>
          </div>
        )}
        {s === 'WORK_COMPLETED' && (
          <div className="mt-3 bg-teal-50 rounded-xl px-3 py-2 flex gap-2">
            <Clock className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
            <p className="text-teal-700 text-xs">
              Work marked complete. Waiting for hirer confirmation.
            </p>
          </div>
        )}
        {s === 'RELEASED' && (
          <div className="mt-3 bg-emerald-50 rounded-xl px-3 py-2 flex gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <p className="text-emerald-700 text-xs font-medium">
              ₹{payment.amount.toLocaleString('en-IN')} released to you.
            </p>
          </div>
        )}

        {/* Timestamps */}
        <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] text-slate-400">
          {payment.paidAt && (
            <span>Paid: {new Date(payment.paidAt).toLocaleDateString('en-IN')}</span>
          )}
          {payment.releasedAt && (
            <span>Released: {new Date(payment.releasedAt).toLocaleDateString('en-IN')}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export const WorkerPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Stats
  const totalEarned = payments
    .filter((p) => p.status === 'RELEASED')
    .reduce((s, p) => s + p.amount, 0);

  const secured = payments.filter((p) => p.status === 'FUNDS_LOCKED').length;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0B132B] to-[#1C3A6E] px-5 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-amber-400/20 rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5 text-amber-300" />
          </div>
          <h1 className="text-white text-xl font-extrabold tracking-tight">My Payments</h1>
        </div>
        <p className="text-slate-400 text-sm ml-12">Your secure payment history</p>

        {/* Quick stats */}
        {!loading && payments.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl px-4 py-3">
              <p className="text-amber-300 text-xs font-medium">Total Earned</p>
              <p className="text-white text-xl font-extrabold">₹{totalEarned.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-3">
              <p className="text-amber-300 text-xs font-medium">Secured Payments</p>
              <p className="text-white text-xl font-extrabold">{secured}</p>
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center gap-1.5">
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
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
              <Wallet className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">No active backend payments yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Payments will appear here once a hirer secures payment for your work. You can explore the full Escrow Showcase now.
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
          <WorkerPaymentCard key={p.id} payment={p} />
        ))}

        {!loading && payments.length > 0 && (
          <button
            onClick={load}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-slate-400 text-sm hover:text-slate-600"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        )}
      </div>

      <WorkerBottomNav />
    </div>
  );
};

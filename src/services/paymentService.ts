/**
 * SHRAMIKK Payment API Service
 *
 * Thin fetch-wrapper over the backend /api/payments routes.
 * All functions return the `data` field from the standard
 * { success: true, data: ... } response wrapper.
 */

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

function getToken(): string | null {
  // Try common storage keys used by the project's auth flow
  return (
    localStorage.getItem('shramik_token') ??
    localStorage.getItem('token') ??
    sessionStorage.getItem('token') ??
    null
  );
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message ?? 'Request failed');
  }
  return json.data as T;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentStatus =
  | 'CREATED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'FUNDS_LOCKED'
  | 'WORK_COMPLETED'
  | 'RELEASE_PENDING'
  | 'RELEASED'
  | 'FAILED'
  | 'REFUNDED';

export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET';

export interface Payment {
  id: string;
  workRecordId: string;
  hirerId: string;
  workerId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string;
  demoPaymentId?: string;
  workerConfirmed: boolean;
  hirerConfirmed: boolean;
  createdAt: string;
  paidAt?: string;
  releaseRequestedAt?: string;
  releasedAt?: string;
  updatedAt: string;
  workRecord?: {
    job: {
      title: string;
      description?: string;
      location: string;
      wage: number;
    };
  };
  hirer?: { name: string };
  worker?: { name: string };
}

export interface ProcessDemoResult {
  paymentId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  demoPaymentId: string;
  paidAt: string;
}

// ─── API Calls ────────────────────────────────────────────────────────────────

/** Create a payment for a WorkRecord (hirer only) */
export function createPayment(workRecordId: string): Promise<Payment> {
  return apiFetch('/api/payments/create', {
    method: 'POST',
    body: JSON.stringify({ workRecordId }),
  });
}

/** Process the demo checkout (hirer only) */
export function processDemoPayment(
  paymentId: string,
  paymentMethod: PaymentMethod,
  simulateFail = false,
): Promise<ProcessDemoResult> {
  return apiFetch('/api/payments/process-demo', {
    method: 'POST',
    body: JSON.stringify({ paymentId, paymentMethod, simulateFail }),
  });
}

/** Fetch a single payment by ID (hirer or worker) */
export function fetchPaymentById(paymentId: string): Promise<Payment> {
  return apiFetch(`/api/payments/${paymentId}`);
}

/** Fetch all payments for the logged-in user */
export function fetchMyPayments(): Promise<Payment[]> {
  return apiFetch('/api/payments/my');
}

/** Hirer confirms that work is complete → moves to RELEASE_PENDING */
export function confirmCompletion(paymentId: string): Promise<Payment> {
  return apiFetch(`/api/payments/${paymentId}/confirm-completion`, { method: 'POST' });
}

/** Hirer releases payment → RELEASED */
export function releasePayment(paymentId: string): Promise<{ paymentId: string; status: string; releasedAt: string }> {
  return apiFetch(`/api/payments/${paymentId}/release`, { method: 'POST' });
}

/** (Demo only) Force payment to FAILED state */
export function simulateFailure(paymentId: string): Promise<{ paymentId: string; status: string }> {
  return apiFetch(`/api/payments/${paymentId}/simulate-failure`, { method: 'POST' });
}

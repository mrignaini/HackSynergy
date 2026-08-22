/**
 * Payment Service — Escrow-style Demo
 *
 * State Machine:
 *   CREATED → PAYMENT_PENDING → PAID → FUNDS_LOCKED
 *          → WORK_COMPLETED → RELEASE_PENDING → RELEASED
 *   Any state → FAILED (on gateway failure)
 *   Any state → REFUNDED (admin action, future)
 *
 * All amount / worker / hirer values come from the DATABASE, never from the frontend.
 */

import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/response';
import { PaymentStatus } from '@prisma/client';
import { paymentProvider } from './paymentProvider';

const VALID_METHODS = ['UPI', 'CARD', 'NET_BANKING', 'WALLET'] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function assertStatus(current: PaymentStatus, expected: PaymentStatus, message: string) {
  if (current !== expected) {
    throw new ApiError(400, message);
  }
}

function assertNotStatus(current: PaymentStatus, forbidden: PaymentStatus, message: string) {
  if (current === forbidden) {
    throw new ApiError(400, message);
  }
}

// ─── 1. Create Payment ────────────────────────────────────────────────────────

/**
 * Creates a payment record for a WorkRecord.
 * Only the hirer (via userId) may create a payment.
 * Amount is taken from job.wage — never from the frontend.
 */
export async function createPayment(workRecordId: string, userId: string) {
  // Resolve authenticated user → hirer profile
  const hirerProfile = await prisma.hirerProfile.findUnique({ where: { userId } });
  if (!hirerProfile) {
    throw new ApiError(403, 'Only hirers can initiate a payment');
  }

  // Fetch work record with related job and worker
  const workRecord = await prisma.workRecord.findUnique({
    where: { id: workRecordId },
    include: {
      job: true,
      worker: true,
    },
  });

  if (!workRecord) {
    throw new ApiError(404, 'Work record not found');
  }

  // Ensure the calling hirer owns this work record
  if (workRecord.hirerId !== hirerProfile.id) {
    throw new ApiError(403, 'You are not the hirer for this work record');
  }

  // Check work record is in a state that allows payment
  if (!['STARTED', 'COMPLETED'].includes(workRecord.status)) {
    throw new ApiError(400, 'Work record is not in a payable state');
  }

  // Prevent duplicate payments
  const existing = await prisma.payment.findUnique({
    where: { workRecordId },
  });
  if (existing) {
    // Return idempotently instead of erroring – useful for UI retries
    return existing;
  }

  const payment = await prisma.payment.create({
    data: {
      workRecordId,
      hirerId: hirerProfile.id,
      workerId: workRecord.workerId,
      amount: workRecord.job.wage,
      currency: 'INR',
      status: PaymentStatus.CREATED,
    },
  });

  return payment;
}

// ─── 2. Process Demo Payment ─────────────────────────────────────────────────

/**
 * Simulates a full checkout:
 *   CREATED → PAYMENT_PENDING → (gateway) → PAID → FUNDS_LOCKED
 * On gateway failure: FAILED
 */
export async function processDemoPayment(
  paymentId: string,
  paymentMethod: string,
  userId: string,
  simulateFail = false,
) {
  const hirerProfile = await prisma.hirerProfile.findUnique({ where: { userId } });
  if (!hirerProfile) {
    throw new ApiError(403, 'Only hirers can process a payment');
  }

  if (!VALID_METHODS.includes(paymentMethod as (typeof VALID_METHODS)[number])) {
    throw new ApiError(400, `Invalid payment method. Allowed: ${VALID_METHODS.join(', ')}`);
  }

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) {
    throw new ApiError(404, 'Payment not found');
  }

  if (payment.hirerId !== hirerProfile.id) {
    throw new ApiError(403, 'You are not authorised to process this payment');
  }

  if (!([PaymentStatus.CREATED, PaymentStatus.PAYMENT_PENDING] as PaymentStatus[]).includes(payment.status)) {
    throw new ApiError(400, `Payment cannot be processed from status: ${payment.status}`);
  }

  // Transition to PAYMENT_PENDING
  await prisma.payment.update({
    where: { id: paymentId },
    data: { status: PaymentStatus.PAYMENT_PENDING, paymentMethod },
  });

  // Call the payment provider (demo by default)
  const result = await paymentProvider.process(
    payment.amount,
    payment.currency,
    paymentMethod,
    payment.hirerId,
    payment.workerId,
    simulateFail,
  );

  if (!result.success) {
    // Mark as FAILED and surface the reason
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.FAILED },
    });
    throw new ApiError(502, result.failureReason ?? 'Payment gateway returned a failure');
  }

  // PAID → FUNDS_LOCKED (atomic update)
  const updated = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: PaymentStatus.FUNDS_LOCKED,
      demoPaymentId: result.gatewayReference,
      paidAt: new Date(),
    },
  });

  return updated;
}

// ─── 3. Get Payment (by ID) ───────────────────────────────────────────────────

export async function getPaymentById(paymentId: string, userId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      workRecord: {
        include: { job: true },
      },
      hirer: { include: { user: { select: { email: true, phone: true } } } },
      worker: { include: { user: { select: { email: true, phone: true } } } },
    },
  });

  if (!payment) {
    throw new ApiError(404, 'Payment not found');
  }

  // Either the hirer or the worker may view this payment
  const hirerProfile = await prisma.hirerProfile.findUnique({ where: { userId } });
  const workerProfile = await prisma.workerProfile.findUnique({ where: { userId } });

  const isHirer = hirerProfile && payment.hirerId === hirerProfile.id;
  const isWorker = workerProfile && payment.workerId === workerProfile.id;

  if (!isHirer && !isWorker) {
    throw new ApiError(403, 'You are not authorised to view this payment');
  }

  return payment;
}

// ─── 4. My Payments (authenticated user) ─────────────────────────────────────

export async function getMyPayments(userId: string) {
  const hirerProfile = await prisma.hirerProfile.findUnique({ where: { userId } });
  const workerProfile = await prisma.workerProfile.findUnique({ where: { userId } });

  if (hirerProfile) {
    return prisma.payment.findMany({
      where: { hirerId: hirerProfile.id },
      include: {
        workRecord: { include: { job: true } },
        worker: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  if (workerProfile) {
    return prisma.payment.findMany({
      where: { workerId: workerProfile.id },
      include: {
        workRecord: { include: { job: true } },
        hirer: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  return [];
}

// ─── 5. Mark Work Completed (called from WorkRecord service) ──────────────────

/**
 * Advances payment from FUNDS_LOCKED → WORK_COMPLETED.
 * Called automatically when a WorkRecord is marked COMPLETED.
 */
export async function markPaymentWorkCompleted(workRecordId: string) {
  const payment = await prisma.payment.findUnique({ where: { workRecordId } });
  if (!payment) return; // no payment attached — ignore silently

  if (payment.status !== PaymentStatus.FUNDS_LOCKED) return; // not in the right state

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: PaymentStatus.WORK_COMPLETED },
  });
}

// ─── 6. Hirer Confirms Completion ────────────────────────────────────────────

export async function confirmCompletion(paymentId: string, userId: string) {
  const hirerProfile = await prisma.hirerProfile.findUnique({ where: { userId } });
  if (!hirerProfile) {
    throw new ApiError(403, 'Only hirers can confirm completion');
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { workRecord: true },
  });

  if (!payment) throw new ApiError(404, 'Payment not found');
  if (payment.hirerId !== hirerProfile.id) {
    throw new ApiError(403, 'You are not the hirer for this payment');
  }

  assertStatus(
    payment.status,
    PaymentStatus.WORK_COMPLETED,
    'Payment cannot be confirmed until the work is marked completed',
  );

  if (payment.workRecord.status !== 'COMPLETED') {
    throw new ApiError(400, 'The associated work record is not yet completed');
  }

  return prisma.payment.update({
    where: { id: paymentId },
    data: {
      hirerConfirmed: true,
      status: PaymentStatus.RELEASE_PENDING,
      releaseRequestedAt: new Date(),
    },
  });
}

// ─── 7. Release Payment ───────────────────────────────────────────────────────

export async function releasePayment(paymentId: string, userId: string) {
  const hirerProfile = await prisma.hirerProfile.findUnique({ where: { userId } });
  if (!hirerProfile) {
    throw new ApiError(403, 'Only hirers can release a payment');
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { workRecord: true },
  });

  if (!payment) throw new ApiError(404, 'Payment not found');

  // RULE 3 & 1 — only the correct hirer
  if (payment.hirerId !== hirerProfile.id) {
    throw new ApiError(403, 'You are not authorised to release this payment');
  }

  // RULE 4 — no double release
  assertNotStatus(payment.status, PaymentStatus.RELEASED, 'Payment has already been released');

  // RULE 5 — failed payments cannot be released
  assertNotStatus(payment.status, PaymentStatus.FAILED, 'A failed payment cannot be released');

  // RULE 6 — refunded payments cannot be released
  assertNotStatus(
    payment.status,
    PaymentStatus.REFUNDED,
    'A refunded payment cannot be released',
  );

  // RULE 2 — must be RELEASE_PENDING (= hirer confirmed work)
  assertStatus(
    payment.status,
    PaymentStatus.RELEASE_PENDING,
    'Payment cannot be released until the hirer has confirmed work completion',
  );

  if (payment.workRecord.status !== 'COMPLETED') {
    throw new ApiError(400, 'Work must be marked completed before releasing payment');
  }

  if (!payment.hirerConfirmed) {
    throw new ApiError(400, 'Hirer must confirm completion before releasing payment');
  }

  return prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: PaymentStatus.RELEASED,
      workerConfirmed: true,
      releasedAt: new Date(),
    },
  });
}

// ─── 8. (Dev/Demo) Simulate Failure ──────────────────────────────────────────

export async function simulateFailure(paymentId: string, userId: string) {
  const hirerProfile = await prisma.hirerProfile.findUnique({ where: { userId } });
  if (!hirerProfile) throw new ApiError(403, 'Only hirers can trigger this action');

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) throw new ApiError(404, 'Payment not found');
  if (payment.hirerId !== hirerProfile.id)
    throw new ApiError(403, 'Not authorised');

  if (payment.status === PaymentStatus.RELEASED || payment.status === PaymentStatus.FAILED) {
    throw new ApiError(400, `Payment is already in terminal state: ${payment.status}`);
  }

  return prisma.payment.update({
    where: { id: paymentId },
    data: { status: PaymentStatus.FAILED },
  });
}

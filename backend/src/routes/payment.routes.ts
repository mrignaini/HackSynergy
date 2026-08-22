import { Router } from 'express';
import {
  createPayment,
  processDemo,
  getMyPayments,
  getPaymentById,
  confirmCompletion,
  releasePayment,
  simulateFailure,
} from '../controllers/payment.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// All payment routes require authentication
router.use(authenticate);

// POST /api/payments/create — Hirer only
router.post('/create', requireRole(Role.HIRER), createPayment);

// POST /api/payments/process-demo — Hirer only
router.post('/process-demo', requireRole(Role.HIRER), processDemo);

// GET /api/payments/my — Hirer or Worker
router.get('/my', getMyPayments);

// GET /api/payments/:paymentId — Hirer or Worker (ownership checked in service)
router.get('/:paymentId', getPaymentById);

// POST /api/payments/:paymentId/confirm-completion — Hirer only
router.post('/:paymentId/confirm-completion', requireRole(Role.HIRER), confirmCompletion);

// POST /api/payments/:paymentId/release — Hirer only
router.post('/:paymentId/release', requireRole(Role.HIRER), releasePayment);

// POST /api/payments/:paymentId/simulate-failure — Hirer only (demo mode)
router.post('/:paymentId/simulate-failure', requireRole(Role.HIRER), simulateFailure);

export default router;

import { NextFunction, Request, Response } from 'express';
import * as paymentService from '../services/payment.service';
import { sendSuccess, sendCreated } from '../utils/response';
import { validateRequiredId, validateRequiredString } from '../utils/validation';

// POST /api/payments/create
export async function createPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const workRecordId = validateRequiredString(req.body.workRecordId, 'workRecordId');
    const payment = await paymentService.createPayment(workRecordId, userId);
    return sendCreated(res, payment);
  } catch (error) {
    next(error);
  }
}

// POST /api/payments/process-demo
export async function processDemo(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const paymentId = validateRequiredString(req.body.paymentId, 'paymentId');
    const paymentMethod = validateRequiredString(req.body.paymentMethod, 'paymentMethod');
    const simulateFail = req.body.simulateFail === true;

    const payment = await paymentService.processDemoPayment(
      paymentId,
      paymentMethod,
      userId,
      simulateFail,
    );
    return sendSuccess(res, {
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      demoPaymentId: payment.demoPaymentId,
      paidAt: payment.paidAt,
    }, 200);
  } catch (error) {
    next(error);
  }
}

// GET /api/payments/my
export async function getMyPayments(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const payments = await paymentService.getMyPayments(userId);
    return sendSuccess(res, payments);
  } catch (error) {
    next(error);
  }
}

// GET /api/payments/:paymentId
export async function getPaymentById(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const paymentId = validateRequiredId(req.params.paymentId, 'paymentId');
    const payment = await paymentService.getPaymentById(paymentId, userId);
    return sendSuccess(res, payment);
  } catch (error) {
    next(error);
  }
}

// POST /api/payments/:paymentId/confirm-completion
export async function confirmCompletion(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const paymentId = validateRequiredId(req.params.paymentId, 'paymentId');
    const payment = await paymentService.confirmCompletion(paymentId, userId);
    return sendSuccess(res, payment);
  } catch (error) {
    next(error);
  }
}

// POST /api/payments/:paymentId/release
export async function releasePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const paymentId = validateRequiredId(req.params.paymentId, 'paymentId');
    const payment = await paymentService.releasePayment(paymentId, userId);
    return sendSuccess(res, {
      paymentId: payment.id,
      status: payment.status,
      releasedAt: payment.releasedAt,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/payments/:paymentId/simulate-failure  (demo only)
export async function simulateFailure(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.id;
    const paymentId = validateRequiredId(req.params.paymentId, 'paymentId');
    const payment = await paymentService.simulateFailure(paymentId, userId);
    return sendSuccess(res, { paymentId: payment.id, status: payment.status });
  } catch (error) {
    next(error);
  }
}

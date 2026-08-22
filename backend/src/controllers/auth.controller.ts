import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess, ApiError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body);
    return sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    return sendSuccess(res, result, 200);
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const user = await authService.getCurrentUser(req.user.userId);
    return sendSuccess(res, user, 200);
  } catch (error) {
    next(error);
  }
}

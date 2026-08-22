import { NextFunction, Request, Response } from 'express';
import * as notificationService from '../services/notification.service';
import { sendPaginated, sendSuccess } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { validateRequiredId } from '../utils/validation';

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = getPaginationParams(req);
    const filters = {
      userId: req.query.userId as string | undefined,
      read: req.query.read !== undefined ? req.query.read === 'true' : undefined,
    };
    const { notifications, meta } = await notificationService.getAllNotifications(pagination, filters);
    return sendPaginated(res, notifications, meta);
  } catch (error) {
    next(error);
  }
}

export async function getNotificationById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = validateRequiredId(req.params.id, 'notificationId');
    const notification = await notificationService.getNotificationById(id);
    return sendSuccess(res, notification);
  } catch (error) {
    next(error);
  }
}

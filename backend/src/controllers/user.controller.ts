import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/user.service';
import { sendPaginated, sendSuccess } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { validateRequiredId } from '../utils/validation';

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = getPaginationParams(req);
    const { users, meta } = await userService.getAllUsers(pagination);
    return sendPaginated(res, users, meta);
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = validateRequiredId(req.params.id, 'userId');
    const user = await userService.getUserById(id);
    return sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
}

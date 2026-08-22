import { NextFunction, Request, Response } from 'express';
import * as insuranceService from '../services/insurance.service';
import { sendPaginated, sendSuccess } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { validateRequiredId } from '../utils/validation';

export async function getInsurance(req: Request, res: Response, next: NextFunction) {
  try {
    const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;
    const filters = {
      activeOnly: req.query.active !== undefined ? req.query.active === 'true' : undefined,
      provider: req.query.provider as string | undefined,
    };

    if (hasPagination) {
      const pagination = getPaginationParams(req);
      const { insurance, meta } = await insuranceService.getAllInsurance(pagination, filters);
      return sendPaginated(res, insurance, meta);
    }

    const { insurance, meta } = await insuranceService.getAllInsurance(undefined, filters);
    return sendPaginated(res, insurance, meta);
  } catch (error) {
    next(error);
  }
}

export async function getInsuranceById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = validateRequiredId(req.params.id, 'insuranceId');
    const option = await insuranceService.getInsuranceById(id);
    return sendSuccess(res, option);
  } catch (error) {
    next(error);
  }
}

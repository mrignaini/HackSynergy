import { NextFunction, Request, Response } from 'express';
import * as schemeService from '../services/scheme.service';
import { sendPaginated, sendSuccess } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { validateRequiredId } from '../utils/validation';

export async function getSchemes(req: Request, res: Response, next: NextFunction) {
  try {
    const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;
    const filters = {
      activeOnly: req.query.active !== undefined ? req.query.active === 'true' : undefined,
    };

    if (hasPagination) {
      const pagination = getPaginationParams(req);
      const { schemes, meta } = await schemeService.getAllSchemes(pagination, filters);
      return sendPaginated(res, schemes, meta);
    }

    const { schemes, meta } = await schemeService.getAllSchemes(undefined, filters);
    return sendPaginated(res, schemes, meta);
  } catch (error) {
    next(error);
  }
}

export async function getSchemeById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = validateRequiredId(req.params.id, 'schemeId');
    const scheme = await schemeService.getSchemeById(id);
    return sendSuccess(res, scheme);
  } catch (error) {
    next(error);
  }
}

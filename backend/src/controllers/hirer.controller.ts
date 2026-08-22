import { NextFunction, Request, Response } from 'express';
import * as hirerService from '../services/hirer.service';
import { sendPaginated, sendSuccess, ApiError } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { validateRequiredId } from '../utils/validation';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// 1. Get Authenticated Hirer's Profile
export async function getMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const profile = await hirerService.getHirerProfileByUserId(req.user.userId);
    return sendSuccess(res, profile, 200);
  } catch (error) {
    next(error);
  }
}

// 2. Update Authenticated Hirer's Profile
export async function updateMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const updatedProfile = await hirerService.updateHirerProfileByUserId(req.user.userId, req.body);
    return sendSuccess(res, updatedProfile, 200);
  } catch (error) {
    next(error);
  }
}

// 3. Get Authenticated Hirer's Jobs
export async function getMyJobs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const pagination = getPaginationParams(req);
    const filters = {
      status: req.query.status as string | undefined,
    };
    const { jobs, meta } = await hirerService.getHirerJobs(req.user.userId, pagination, filters);
    return sendPaginated(res, jobs, meta, 200);
  } catch (error) {
    next(error);
  }
}

// 4. Get Single Job Belonging to Authenticated Hirer
export async function getMyJobById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const jobId = validateRequiredId(req.params.id, 'jobId');
    const job = await hirerService.getHirerJobById(req.user.userId, jobId);
    return sendSuccess(res, job, 200);
  } catch (error) {
    next(error);
  }
}

// 5. Update Job Belonging to Authenticated Hirer
export async function updateMyJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const jobId = validateRequiredId(req.params.id, 'jobId');
    const updatedJob = await hirerService.updateHirerJob(req.user.userId, jobId, req.body);
    return sendSuccess(res, updatedJob, 200);
  } catch (error) {
    next(error);
  }
}

// 6. Update Job Status Belonging to Authenticated Hirer
export async function updateMyJobStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const jobId = validateRequiredId(req.params.id, 'jobId');
    const status = req.body?.status;
    const updatedJob = await hirerService.updateHirerJobStatus(req.user.userId, jobId, status);
    return sendSuccess(res, updatedJob, 200);
  } catch (error) {
    next(error);
  }
}

// 7. Cancel / Close Job Belonging to Authenticated Hirer
export async function cancelMyJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const jobId = validateRequiredId(req.params.id, 'jobId');
    const result = await hirerService.cancelOrDeleteHirerJob(req.user.userId, jobId);
    return sendSuccess(res, result, 200);
  } catch (error) {
    next(error);
  }
}

// 8. Get Hirer Dashboard Statistics
export async function getMyStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const stats = await hirerService.getHirerStats(req.user.userId);
    return sendSuccess(res, stats, 200);
  } catch (error) {
    next(error);
  }
}

// 9. Get All Hirers (B2)
export async function getHirers(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = getPaginationParams(req);
    const { hirers, meta } = await hirerService.getAllHirers(pagination);
    return sendPaginated(res, hirers, meta, 200);
  } catch (error) {
    next(error);
  }
}

// 10. Get Hirer By ID (B2)
export async function getHirerById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = validateRequiredId(req.params.id, 'hirerId');
    const hirer = await hirerService.getHirerById(id);
    return sendSuccess(res, hirer, 200);
  } catch (error) {
    next(error);
  }
}

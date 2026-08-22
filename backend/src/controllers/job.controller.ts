import { NextFunction, Request, Response } from 'express';
import * as jobService from '../services/job.service';
import { sendPaginated, sendSuccess, ApiError } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { validateRequiredId } from '../utils/validation';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// 1. Create Job (Authenticated Hirer)
export async function createJob(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const job = await jobService.createJob(req.user.userId, req.body);
    return sendSuccess(res, job, 201);
  } catch (error) {
    next(error);
  }
}

// 2. Get All Jobs (Public Find Work)
export async function getJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = getPaginationParams(req);
    const filters: jobService.JobFilters = {
      search: req.query.search as string | undefined,
      location: req.query.location as string | undefined,
      skill: req.query.skill as string | undefined,
      minWage: req.query.minWage ? parseFloat(req.query.minWage as string) : undefined,
      maxWage: req.query.maxWage ? parseFloat(req.query.maxWage as string) : undefined,
      status: req.query.status as string | undefined,
      sort: req.query.sort as string | undefined,
    };

    const { jobs, meta } = await jobService.getAllJobs(pagination, filters);
    return sendPaginated(res, jobs, meta, 200);
  } catch (error) {
    next(error);
  }
}

// 3. Get Job By ID
export async function getJobById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = validateRequiredId(req.params.id, 'jobId');
    const job = await jobService.getJobById(id);
    return sendSuccess(res, job, 200);
  } catch (error) {
    next(error);
  }
}

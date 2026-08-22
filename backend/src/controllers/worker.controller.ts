import { NextFunction, Request, Response } from 'express';
import * as workerService from '../services/worker.service';
import { sendPaginated, sendSuccess, ApiError } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { validateRequiredId } from '../utils/validation';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// 1. Get Authenticated Worker's Own Profile
export async function getMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const profile = await workerService.getWorkerProfileByUserId(req.user.userId);
    return sendSuccess(res, profile, 200);
  } catch (error) {
    next(error);
  }
}

// 2. Update Authenticated Worker's Own Profile
export async function updateMyProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const updatedProfile = await workerService.updateWorkerProfileByUserId(req.user.userId, req.body);
    return sendSuccess(res, updatedProfile, 200);
  } catch (error) {
    next(error);
  }
}

// 3. Get Authenticated Worker's Skills
export async function getMySkills(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const skills = await workerService.getWorkerSkills(req.user.userId);
    return sendSuccess(res, skills, 200);
  } catch (error) {
    next(error);
  }
}

// 4. Add Skill to Authenticated Worker's Profile
export async function addMySkill(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const result = await workerService.addWorkerSkill(req.user.userId, req.body);
    return sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}

// 5. Remove Skill from Authenticated Worker's Profile
export async function removeMySkill(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const skillId = validateRequiredId(req.params.skillId, 'skillId');
    const result = await workerService.removeWorkerSkill(req.user.userId, skillId);
    return sendSuccess(res, result, 200);
  } catch (error) {
    next(error);
  }
}

// 6. Get Matched Jobs for Authenticated Worker
export async function getMyMatchedJobs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const pagination = getPaginationParams(req);
    const { jobs, meta } = await workerService.getMatchedJobsForWorker(req.user.userId, pagination);
    return sendPaginated(res, jobs, meta, 200);
  } catch (error) {
    next(error);
  }
}

// 7. Get All Workers (B2)
export async function getWorkers(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = getPaginationParams(req);
    const filters = {
      location: req.query.location as string | undefined,
      skillId: req.query.skillId as string | undefined,
    };
    const { workers, meta } = await workerService.getAllWorkers(pagination, filters);
    return sendPaginated(res, workers, meta, 200);
  } catch (error) {
    next(error);
  }
}

// 8. Get Worker By ID (B2)
export async function getWorkerById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = validateRequiredId(req.params.id, 'workerId');
    const worker = await workerService.getWorkerById(id);
    return sendSuccess(res, worker, 200);
  } catch (error) {
    next(error);
  }
}

import { NextFunction, Request, Response } from 'express';
import * as applicationService from '../services/application.service';
import { sendPaginated, sendSuccess, sendCreated } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { validateRequiredId } from '../utils/validation';

export async function getApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = getPaginationParams(req);
    const filters = {
      jobId: req.query.jobId as string | undefined,
      workerId: req.query.workerId as string | undefined,
      status: req.query.status as string | undefined,
    };
    const { applications, meta } = await applicationService.getAllApplications(pagination, filters);
    return sendPaginated(res, applications, meta);
  } catch (error) {
    next(error);
  }
}

export async function getApplicationById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = validateRequiredId(req.params.id, 'applicationId');
    const application = await applicationService.getApplicationById(id);
    return sendSuccess(res, application);
  } catch (error) {
    next(error);
  }
}
// ---------- Worker endpoints ----------

export async function applyToJob(req: Request, res: Response, next: NextFunction) {
  try {
    const jobId = validateRequiredId(req.params.jobId, 'jobId');
    // @ts-ignore – authenticated request has user populated by middleware
    const userId = (req as any).user.id;
    const application = await applicationService.applyToJob(userId, jobId);
    return sendCreated(res, application);
  } catch (error) {
    next(error);
  }
}

export async function getMyApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const pagination = getPaginationParams(req);
    // @ts-ignore
    const userId = (req as any).user.id;
    const { applications, meta } = await applicationService.getWorkerApplications(userId, pagination);
    return sendPaginated(res, applications, meta);
  } catch (error) {
    next(error);
  }
}

export async function getMyApplicationById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = validateRequiredId(req.params.id, 'applicationId');
    // @ts-ignore
    const userId = (req as any).user.id;
    const application = await applicationService.getWorkerApplicationById(userId, id);
    return sendSuccess(res, application);
  } catch (error) {
    next(error);
  }
}

export async function withdrawApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const id = validateRequiredId(req.params.id, 'applicationId');
    // @ts-ignore
    const userId = (req as any).user.id;
    const application = await applicationService.withdrawApplication(userId, id);
    return sendSuccess(res, application);
  } catch (error) {
    next(error);
  }
}

// ---------- Hirer endpoints ----------

export async function listJobApplicants(req: Request, res: Response, next: NextFunction) {
  try {
    const jobId = validateRequiredId(req.params.jobId, 'jobId');
    const pagination = getPaginationParams(req);
    // @ts-ignore
    const userId = (req as any).user.id;
    const { applications, meta } = await applicationService.listJobApplications(userId, jobId, pagination);
    return sendPaginated(res, applications, meta);
  } catch (error) {
    next(error);
  }
}

export async function getApplicationForHirer(req: Request, res: Response, next: NextFunction) {
  try {
    const id = validateRequiredId(req.params.id, 'applicationId');
    // @ts-ignore
    const userId = (req as any).user.id;
    const application = await applicationService.getApplicationByIdForHirer(userId, id);
    return sendSuccess(res, application);
  } catch (error) {
    next(error);
  }
}

export async function acceptApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const id = validateRequiredId(req.params.id, 'applicationId');
    // @ts-ignore
    const userId = (req as any).user.id;
    const application = await applicationService.acceptApplication(userId, id);
    return sendSuccess(res, application);
  } catch (error) {
    next(error);
  }
}

export async function rejectApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const id = validateRequiredId(req.params.id, 'applicationId');
    // @ts-ignore
    const userId = (req as any).user.id;
    const application = await applicationService.rejectApplication(userId, id);
    return sendSuccess(res, application);
  } catch (error) {
    next(error);
  }
}


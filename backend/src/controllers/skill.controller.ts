import { NextFunction, Request, Response } from 'express';
import * as skillService from '../services/skill.service';
import { sendPaginated, sendSuccess } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { validateRequiredId, validateRequiredString } from '../utils/validation';

export async function getSkills(req: Request, res: Response, next: NextFunction) {
  try {
    const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;
    if (hasPagination) {
      const pagination = getPaginationParams(req);
      const { skills, meta } = await skillService.getAllSkills(pagination);
      return sendPaginated(res, skills, meta);
    }

    const { skills, meta } = await skillService.getAllSkills();
    return sendPaginated(res, skills, meta);
  } catch (error) {
    next(error);
  }
}

export async function getSkillById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = validateRequiredId(req.params.id, 'skillId');
    const skill = await skillService.getSkillById(id);
    return sendSuccess(res, skill);
  } catch (error) {
    next(error);
  }
}

export async function createSkill(req: Request, res: Response, next: NextFunction) {
  try {
    const name = validateRequiredString(req.body?.name, 'name');
    const skill = await skillService.createSkill(name);
    return sendSuccess(res, skill, 201);
  } catch (error) {
    next(error);
  }
}

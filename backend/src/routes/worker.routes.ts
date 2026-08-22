import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  getMyProfile,
  updateMyProfile,
  getMySkills,
  addMySkill,
  removeMySkill,
  getMyMatchedJobs,
  getWorkers,
  getWorkerById,
} from '../controllers/worker.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Authenticated worker self-service routes
router.get('/me', authenticate, requireRole(Role.WORKER), getMyProfile);
router.put('/me', authenticate, requireRole(Role.WORKER), updateMyProfile);
router.get('/me/skills', authenticate, requireRole(Role.WORKER), getMySkills);
router.post('/me/skills', authenticate, requireRole(Role.WORKER), addMySkill);
router.delete('/me/skills/:skillId', authenticate, requireRole(Role.WORKER), removeMySkill);
router.get('/me/jobs', authenticate, requireRole(Role.WORKER), getMyMatchedJobs);

// General worker directory routes
router.get('/', getWorkers);
router.get('/:id', getWorkerById);

export default router;

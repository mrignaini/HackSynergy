import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  getMyProfile,
  updateMyProfile,
  getMyJobs,
  getMyJobById,
  updateMyJob,
  updateMyJobStatus,
  cancelMyJob,
  getMyStats,
  getHirers,
  getHirerById,
} from '../controllers/hirer.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Hirer authenticated self-service and management routes
router.get('/me', authenticate, requireRole(Role.HIRER), getMyProfile);
router.put('/me', authenticate, requireRole(Role.HIRER), updateMyProfile);
router.get('/me/jobs', authenticate, requireRole(Role.HIRER), getMyJobs);
router.get('/me/jobs/:id', authenticate, requireRole(Role.HIRER), getMyJobById);
router.put('/me/jobs/:id', authenticate, requireRole(Role.HIRER), updateMyJob);
router.patch('/me/jobs/:id/status', authenticate, requireRole(Role.HIRER), updateMyJobStatus);
router.delete('/me/jobs/:id', authenticate, requireRole(Role.HIRER), cancelMyJob);
router.get('/me/stats', authenticate, requireRole(Role.HIRER), getMyStats);

// Public / Directory routes
router.get('/', getHirers);
router.get('/:id', getHirerById);

export default router;

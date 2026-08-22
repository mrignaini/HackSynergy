import { Router } from 'express';
import { Role } from '@prisma/client';
import { getJobs, getJobById, createJob } from '../controllers/job.controller';
import { applyToJob } from '../controllers/application.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Post a new job (Authenticated HIRER)
router.post('/', authenticate, requireRole(Role.HIRER), createJob);
router.post('/:jobId/applications', authenticate, requireRole(Role.WORKER), applyToJob);
// Public Find Work / Browse Jobs
router.get('/', getJobs);
router.get('/:id', getJobById);

export default router;

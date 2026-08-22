import { Router } from 'express';
import {
  getApplications,
  getApplicationById,
  applyToJob,
  getMyApplications,
  getMyApplicationById,
  withdrawApplication,
  listJobApplicants,
  getApplicationForHirer,
  acceptApplication,
  rejectApplication,
} from '../controllers/application.controller';

const router = Router();

// Public routes
router.get('/', getApplications);
router.get('/:id', getApplicationById);

// Worker routes
router.post('/jobs/:jobId/apply', applyToJob);
router.get('/me', getMyApplications);
router.get('/me/:id', getMyApplicationById);
router.patch('/me/:id/withdraw', withdrawApplication);

// Hirer routes
router.get('/jobs/:jobId/applicants', listJobApplicants);
router.get('/hirer/:id', getApplicationForHirer);
router.post('/hirer/:id/accept', acceptApplication);
router.post('/hirer/:id/reject', rejectApplication);

export default router;

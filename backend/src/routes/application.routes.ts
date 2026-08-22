import { Router } from 'express';
import { getApplications, getApplicationById } from '../controllers/application.controller';

const router = Router();

router.get('/', getApplications);
router.get('/:id', getApplicationById);

export default router;

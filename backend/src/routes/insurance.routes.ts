import { Router } from 'express';
import { getInsurance, getInsuranceById } from '../controllers/insurance.controller';

const router = Router();

router.get('/', getInsurance);
router.get('/:id', getInsuranceById);

export default router;

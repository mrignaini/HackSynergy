import { Router } from 'express';
import { getSchemes, getSchemeById } from '../controllers/scheme.controller';

const router = Router();

router.get('/', getSchemes);
router.get('/:id', getSchemeById);

export default router;

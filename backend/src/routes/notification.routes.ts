import { Router } from 'express';
import { getNotifications, getNotificationById } from '../controllers/notification.controller';

const router = Router();

router.get('/', getNotifications);
router.get('/:id', getNotificationById);

export default router;

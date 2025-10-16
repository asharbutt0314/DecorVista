import express from 'express';
import { getUserNotifications, markAsRead } from '../Controllers/notificationController.mjs';
import { authenticateToken } from '../middleware/auth.mjs';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getUserNotifications);
router.put('/:id/read', markAsRead);

export default router;
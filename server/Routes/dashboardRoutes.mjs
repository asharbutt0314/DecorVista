import express from 'express';
import { getUserDashboard, getDesignerDashboard } from '../Controllers/dashboardController.mjs';
import { authenticateToken } from '../middleware/auth.mjs';

const router = express.Router();

router.use(authenticateToken);

router.get('/user', getUserDashboard);
router.get('/designer', getDesignerDashboard);

export default router;
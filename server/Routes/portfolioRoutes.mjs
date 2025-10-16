import express from 'express';
import { authenticateToken } from '../middleware/auth.mjs';
import { createPortfolio, getPortfolioByDesigner, deletePortfolio } from '../Controllers/portfolioController.mjs';

const router = express.Router();

router.post('/', authenticateToken, createPortfolio);
router.get('/:designerId', getPortfolioByDesigner);
router.delete('/:id', authenticateToken, deletePortfolio);

export default router;
import express from 'express';
import { authenticateToken } from '../middleware/auth.mjs';
import {
  createReview,
  getProductReviews,
  getDesignerReviews,
  updateReview,
  deleteReview,
  respondToReview,
  getUserReviews,
  getMyDesignerReviews
} from '../Controllers/reviewController.mjs';

const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
  try {
    res.json({ success: true, reviews: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.get('/product/:productId', getProductReviews);
router.get('/designer/:designerId', getDesignerReviews);

// Authenticated routes
router.post('/', authenticateToken, createReview);
router.get('/user', authenticateToken, getUserReviews);
router.get('/my-designer-reviews', authenticateToken, getMyDesignerReviews);
router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);
router.post('/:id/respond', authenticateToken, respondToReview);

export default router;
import express from 'express';
import { authenticateToken } from '../middleware/auth.mjs';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategories
} from '../Controllers/categoryController.mjs';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);
router.get('/:parentId/subcategories', getSubcategories);

// Admin only routes
router.post('/', authenticateToken, createCategory);
router.put('/:id', authenticateToken, updateCategory);
router.delete('/:id', authenticateToken, deleteCategory);

export default router;
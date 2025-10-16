import express from 'express';
import { 
  getBlogs, 
  getBlog, 
  createBlog, 
  updateBlog, 
  deleteBlog,
  getBlogsByCategory,
  getFeaturedBlogs
} from '../Controllers/blogController.mjs';
import { authenticateAdmin } from '../middleware/auth.mjs';

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/category/:category', getBlogsByCategory);
router.get('/:slug', getBlog);

// Admin routes
router.post('/', authenticateAdmin, createBlog);
router.put('/:id', authenticateAdmin, updateBlog);
router.delete('/:id', authenticateAdmin, deleteBlog);

export default router;
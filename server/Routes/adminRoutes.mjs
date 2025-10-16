import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.mjs';
import { 
  register, login, forgotPassword, verifyResetOTP, resetPassword, verifyOTP, resendOTP,
  getUsers, deleteUser, getDesigners, deleteDesigner,
  createProduct, updateProduct, deleteProduct, createCategory,
  createBlog, updateBlog, deleteBlog, getReports, getOrders, updateOrder, getAnalytics
} from '../Controllers/adminController.mjs';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

// Management routes
router.get('/users', authenticateToken, requireAdmin, getUsers);
router.delete('/users/:id', authenticateToken, requireAdmin, deleteUser);
router.get('/designers', authenticateToken, requireAdmin, getDesigners);
router.delete('/designers/:id', authenticateToken, requireAdmin, deleteDesigner);
router.post('/products', authenticateToken, requireAdmin, createProduct);
router.put('/products/:id', authenticateToken, requireAdmin, updateProduct);
router.delete('/products/:id', authenticateToken, requireAdmin, deleteProduct);
router.post('/categories', authenticateToken, requireAdmin, createCategory);
router.post('/blogs', authenticateToken, requireAdmin, createBlog);
router.put('/blogs/:id', authenticateToken, requireAdmin, updateBlog);
router.delete('/blogs/:id', authenticateToken, requireAdmin, deleteBlog);
router.get('/reports', authenticateToken, requireAdmin, getReports);
router.get('/orders', authenticateToken, requireAdmin, getOrders);
router.put('/orders/:id', authenticateToken, requireAdmin, updateOrder);
router.get('/analytics', getAnalytics);

export default router;
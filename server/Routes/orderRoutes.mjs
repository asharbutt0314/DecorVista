import express from 'express';
import { getAllOrders, updateOrderStatus, getUserOrders, createOrder } from '../Controllers/orderController.mjs';
import { authenticateAdmin, authenticateToken } from '../middleware/auth.mjs';

const router = express.Router();

// Public route for admin dashboard
router.get('/', async (req, res) => {
  try {
    const Order = (await import('../Models/Order.mjs')).default;
    const orders = await Order.find()
      .populate('user')
      .sort({ createdAt: -1 });
    // Transform to match frontend expectations
    const transformedOrders = orders.map(order => ({
      ...order.toObject(),
      user_id: order.user
    }));
    res.json({ success: true, orders: transformedOrders });
  } catch (error) {
    console.log('Order fetch error:', error.message);
    res.json({ success: true, orders: [] });
  }
});

// User routes
router.get('/user', authenticateToken, getUserOrders);
router.post('/', authenticateToken, createOrder);

// Admin routes for order management
router.put('/:id/status', authenticateAdmin, updateOrderStatus);

export default router;
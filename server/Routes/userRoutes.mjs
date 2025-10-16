import express from 'express';
import { getAllUsers, updateUser, deleteUser } from '../Controllers/userController.mjs';
import { authenticateToken, requireAdmin } from '../middleware/auth.mjs';

const router = express.Router();

// Public route for admin dashboard
router.get('/', async (req, res) => {
  try {
    const User = (await import('../Models/User.mjs')).default;
    const UserDetails = (await import('../Models/UserDetails.mjs')).default;
    const users = await User.find().select('-password');
    const usersWithDetails = await Promise.all(users.map(async (user) => {
      const details = await UserDetails.findOne({ user_id: user._id });
      return { ...user.toObject(), userDetails: details };
    }));
    res.json({ success: true, users: usersWithDetails });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin routes for user management
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const User = (await import('../Models/User.mjs')).default;
    const UserDetails = (await import('../Models/UserDetails.mjs')).default;
    
    // Update user basic info
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    
    // Update user details if provided
    if (req.body.userDetails) {
      await UserDetails.findOneAndUpdate(
        { user_id: id },
        req.body.userDetails,
        { new: true, upsert: true }
      );
    }
    
    res.json({ success: true, message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const User = (await import('../Models/User.mjs')).default;
    const UserDetails = (await import('../Models/UserDetails.mjs')).default;
    await User.findByIdAndDelete(id);
    await UserDetails.findOneAndDelete({ user_id: id });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
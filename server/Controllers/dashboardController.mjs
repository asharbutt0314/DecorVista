import Consultation from '../Models/Consultation.mjs';
import Review from '../Models/Review.mjs';
import Order from '../Models/Order.mjs';
import Notification from '../Models/Notification.mjs';

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user consultations
    const consultations = await Consultation.find({ user_id: userId })
      .populate('designer_id', 'username')
      .sort({ scheduled_datetime: -1 })
      .limit(5);

    // Get user reviews
    const reviews = await Review.find({ user_id: userId })
      .populate('designer_id', 'username')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get user orders
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get unread notifications
    const notifications = await Notification.find({ userId, isRead: false })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get stats
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const stats = {
      totalConsultations: await Consultation.countDocuments({ user_id: userId }),
      totalReviews: await Review.countDocuments({ user_id: userId, createdAt: { $gte: thirtyDaysAgo } }),
      totalOrders: await Order.countDocuments({ user: userId }),
      pendingOrders: await Order.countDocuments({ user: userId, status: 'pending' }),
      unreadNotifications: await Notification.countDocuments({ userId, isRead: false })
    };

    res.json({
      success: true,
      data: {
        consultations,
        reviews,
        orders,
        notifications,
        stats
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDesignerDashboard = async (req, res) => {
  try {
    const designerId = req.user.id;

    // Get designer consultations
    const consultations = await Consultation.find({ designer_id: designerId })
      .populate('user_id', 'username')
      .sort({ scheduled_datetime: -1 })
      .limit(5);

    // Get designer reviews
    const reviews = await Review.find({ designer_id: designerId })
      .populate('user_id', 'username')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get unread notifications
    const notifications = await Notification.find({ userId: designerId, isRead: false })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get stats
    const stats = {
      totalConsultations: await Consultation.countDocuments({ designer_id: designerId }),
      totalReviews: await Review.countDocuments({ designer_id: designerId }),
      pendingConsultations: await Consultation.countDocuments({ designer_id: designerId, status: 'pending' }),
      unreadNotifications: await Notification.countDocuments({ userId: designerId, isRead: false })
    };

    res.json({
      success: true,
      data: {
        consultations,
        reviews,
        notifications,
        stats
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
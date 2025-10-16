import User from '../Models/User.mjs';
import Order from '../Models/Order.mjs';
import Product from '../Models/Product.mjs';
import Review from '../Models/Review.mjs';

// Get analytics data (Admin only)
export const getAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - parseInt(days));

    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    // Get total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Get monthly revenue (last 6 months)
    const monthlyRevenue = await Order.aggregate([
      { 
        $match: { 
          status: 'delivered',
          createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get order status distribution
    const orderStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get user growth (last 6 months)
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          users: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format data for frontend
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const formattedMonthlyRevenue = monthlyRevenue.map(item => ({
      month: months[item._id.month - 1],
      revenue: item.revenue
    }));

    const formattedUserGrowth = userGrowth.map(item => ({
      month: months[item._id.month - 1],
      users: item.users
    }));

    const formattedOrderStatus = {};
    orderStatus.forEach(item => {
      formattedOrderStatus[item._id] = item.count;
    });

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalOrders,
        totalRevenue,
        totalProducts,
        monthlyRevenue: formattedMonthlyRevenue,
        userGrowth: formattedUserGrowth,
        orderStatus: formattedOrderStatus,
        topProducts: [], // Can be implemented later
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics'
    });
  }
};
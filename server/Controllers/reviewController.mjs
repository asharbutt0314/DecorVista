import Review from '../Models/Review.mjs';
import Product from '../Models/Product.mjs';
import User from '../Models/User.mjs';
import { createNotification } from './notificationController.mjs';

// Create review
export const createReview = async (req, res) => {
  try {
    const { designerId, rating, comment } = req.body;
    const userId = req.user.id;

    console.log('Creating review:', { userId, designerId, rating, comment });

    const review = new Review({
      user_id: userId,
      designer_id: designerId,
      rating,
      comment
    });

    const savedReview = await review.save();
    
    // Create notification for designer
    await createNotification(
      designerId,
      'New Review Received',
      `You received a ${rating}-star review from a client`,
      'review'
    );

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review: savedReview
    });
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get product reviews
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ productId })
      .populate('userId', 'username profile')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ productId });

    res.json({
      success: true,
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get designer reviews
export const getDesignerReviews = async (req, res) => {
  try {
    const { designerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ designer_id: designerId })
      .populate('user_id', 'username profile')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ designer_id: designerId });

    res.json({
      success: true,
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, images } = req.body;
    const userId = req.user.id;

    const review = await Review.findOne({ _id: id, userId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found or not authorized' });
    }

    review.rating = rating;
    review.comment = comment;
    if (images) review.images = images;
    
    await review.save();

    // Update product/designer rating
    if (review.productId) {
      await updateProductRating(review.productId);
    } else if (review.designerId) {
      await updateDesignerRating(review.designerId);
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findOneAndDelete({ _id: id, userId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found or not authorized' });
    }

    // Update product/designer rating
    if (review.productId) {
      await updateProductRating(review.productId);
    } else if (review.designerId) {
      await updateDesignerRating(review.designerId);
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Respond to review (Designer only)
export const respondToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the designer being reviewed
    if (review.designerId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to respond to this review' });
    }

    review.response = {
      comment,
      respondedAt: new Date(),
      respondedBy: userId
    };

    await review.save();

    res.json({
      success: true,
      message: 'Response added successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to update product rating
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ productId });
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(averageRating * 10) / 10,
    totalReviews
  });
};

// Get user reviews
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user_id: req.user.id })
      .populate('designer_id', 'username')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get designer's own reviews
export const getMyDesignerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ designer_id: req.user.id })
      .populate('user_id', 'username')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to update designer rating
const updateDesignerRating = async (designerId) => {
  const reviews = await Review.find({ designerId });
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  await User.findByIdAndUpdate(designerId, {
    'designerProfile.rating': Math.round(averageRating * 10) / 10,
    'designerProfile.totalReviews': totalReviews
  });
};
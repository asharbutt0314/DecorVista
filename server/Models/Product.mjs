import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  room: {
    type: String,
    enum: ['living_room', 'bedroom', 'kitchen', 'bathroom', 'dining_room', 'office', 'outdoor'],
    required: true
  },
  style: {
    type: String,
    enum: ['modern', 'traditional', 'contemporary', 'minimalist', 'rustic', 'industrial', 'scandinavian']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, default: 'cm' }
  },
  material: String,
  color: String,
  availability: {
    type: String,
    enum: ['in_stock', 'out_of_stock', 'pre_order'],
    default: 'in_stock'
  },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);
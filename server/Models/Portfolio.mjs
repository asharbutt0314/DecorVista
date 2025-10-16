import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  designer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InteriorDesigner',
    required: true
  },
  project_title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['living_room', 'bedroom', 'kitchen', 'bathroom', 'office'],
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Portfolio', portfolioSchema);
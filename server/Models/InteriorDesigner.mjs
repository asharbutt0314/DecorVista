import mongoose from 'mongoose';

const interiorDesignerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: true,
    enum: ['residential', 'commercial', 'hospitality', 'retail', 'office']
  },
  yearsofexperience: {
    type: Number,
    required: true,
    min: 0
  },
  portfolio: {
    type: String,
    default: ''
  },
  hourlyRate: {
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

export default mongoose.model('InteriorDesigner', interiorDesignerSchema);
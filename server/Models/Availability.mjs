import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  designer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InteriorDesigner',
    required: true
  },
  available_date: {
    type: Date,
    required: true
  },
  start_time: {
    type: String,
    required: true
  },
  end_time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'booked', 'cancelled'],
    default: 'open'
  }
}, {
  timestamps: true
});

export default mongoose.model('Availability', availabilitySchema);
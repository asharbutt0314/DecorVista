import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  designer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Designer',
    required: true
  },
  scheduled_datetime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  consultation_type: {
    type: String,
    enum: ['online', 'in_person'],
    default: 'online'
  }
}, {
  timestamps: true
});

export default mongoose.model('Consultation', consultationSchema);
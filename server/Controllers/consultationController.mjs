import Consultation from '../Models/Consultation.mjs';
import User from '../Models/User.mjs';
import { createNotification } from './notificationController.mjs';

// Book consultation
export const bookConsultation = async (req, res) => {
  try {
    const { designerId, scheduledDateTime, consultationType, projectDetails } = req.body;
    const userId = req.user.id;

    console.log('Booking request:', { designerId, scheduledDateTime, consultationType, projectDetails, userId });

    const consultation = new Consultation({
      user_id: userId,
      designer_id: designerId,
      scheduled_datetime: new Date(scheduledDateTime),
      consultation_type: consultationType || 'online',
      notes: projectDetails || ''
    });

    const savedConsultation = await consultation.save();
    
    // Create notifications
    await createNotification(userId, 'Consultation Booked', 'Your consultation has been booked successfully', 'booking');
    await createNotification(designerId, 'New Consultation', 'You have a new consultation request', 'booking');

    res.status(201).json({
      success: true,
      message: 'Consultation booked successfully',
      consultation: savedConsultation
    });
  } catch (error) {
    console.error('Consultation booking error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get user consultations
export const getUserConsultations = async (req, res) => {
  try {
    const userId = req.user.id;
    const consultations = await Consultation.find({ user_id: userId })
      .populate('designer_id', 'username email')
      .sort({ scheduled_datetime: -1 });

    res.json({ success: true, consultations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get designer consultations
export const getDesignerConsultations = async (req, res) => {
  try {
    console.log('Designer consultations request - User:', req.user);
    const designerId = req.user.id;
    const consultations = await Consultation.find({ designer_id: designerId })
      .populate('user_id', 'username email')
      .sort({ scheduled_datetime: -1 });

    console.log('Found consultations:', consultations.length);
    res.json({ success: true, consultations });
  } catch (error) {
    console.error('Designer consultations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update consultation status
export const updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.id;

    console.log('Update status request:', { id, status, userId });

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const consultation = await Consultation.findById(id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }

    console.log('Consultation found:', consultation);

    // Allow admin to update any consultation
    if (req.user.role !== 'admin' && consultation.designer_id.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this consultation' });
    }

    consultation.status = status;
    if (notes) consultation.notes = notes;
    
    const updatedConsultation = await consultation.save();
    
    // Create notification for status update
    await createNotification(
      consultation.user_id, 
      'Consultation Status Updated', 
      `Your consultation status has been updated to ${status}`, 
      'booking'
    );

    res.json({
      success: true,
      message: 'Consultation updated successfully',
      consultation: updatedConsultation
    });
  } catch (error) {
    console.error('Update consultation error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get single consultation
export const getConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const consultation = await Consultation.findById(id)
      .populate('user_id', 'username email')
      .populate('designer_id', 'username email');

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    res.json({ success: true, consultation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available designers
export const getAvailableDesigners = async (req, res) => {
  try {
    const { specialization, date } = req.query;
    
    const filter = { 
      role: 'designer',
      'designerProfile.availability.isAvailable': true
    };
    
    if (specialization) {
      filter['designerProfile.specialization'] = specialization;
    }

    const designers = await User.find(filter)
      .select('username profile designerProfile')
      .sort({ 'designerProfile.rating': -1 });

    res.json({ success: true, designers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all consultations (Admin only)
export const getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({})
      .populate('user_id', 'username email')
      .populate('designer_id', 'username email')
      .sort({ scheduled_datetime: -1 });

    res.json({ success: true, consultations });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
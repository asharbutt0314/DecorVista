import express from 'express';
import { getDesignerAvailability, addAvailability, updateAvailability } from '../Controllers/availabilityController.mjs';
import { authenticateToken } from '../middleware/auth.mjs';
import Availability from '../Models/Availability.mjs';

const router = express.Router();

// Public route to get designer availability by ID
router.get('/designer/:designerId', async (req, res) => {
  try {
    const { designerId } = req.params;
    const availability = await Availability.find({ designer_id: designerId })
      .sort({ available_date: 1 });
    res.json({ success: true, availability });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Protected routes
router.use(authenticateToken);

router.get('/', getDesignerAvailability);
router.post('/', addAvailability);
router.put('/:id', updateAvailability);

export default router;
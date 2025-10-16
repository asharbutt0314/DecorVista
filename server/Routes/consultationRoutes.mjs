import express from 'express';
import { authenticateToken, authenticateAdmin } from '../middleware/auth.mjs';
import {
  bookConsultation,
  getUserConsultations,
  getDesignerConsultations,
  updateConsultationStatus,
  getConsultation,
  getAvailableDesigners,
  getAllConsultations
} from '../Controllers/consultationController.mjs';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Public authenticated routes
router.get('/designers', getAvailableDesigners);
router.post('/', bookConsultation);
router.get('/user', getUserConsultations);
router.get('/designer', getDesignerConsultations);
router.get('/admin/all', authenticateToken, getAllConsultations);
router.get('/:id', getConsultation);
router.put('/:id/status', updateConsultationStatus);

export default router;
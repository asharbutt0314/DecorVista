import express from 'express';
import { registerDesigner, loginDesigner, verifyDesignerOTP, resendDesignerOTP, forgotDesignerPassword, verifyDesignerResetOTP, resetDesignerPassword, getAllDesigners, getDesigner, updateDesigner, deleteDesigner } from '../Controllers/designerController.mjs';

const router = express.Router();

router.post('/register', registerDesigner);
router.post('/login', loginDesigner);
router.post('/verify-otp', verifyDesignerOTP);
router.post('/resend-otp', resendDesignerOTP);
router.post('/forgot-password', forgotDesignerPassword);
router.post('/verify-reset-otp', verifyDesignerResetOTP);
router.post('/reset-password', resetDesignerPassword);
router.get('/all', getAllDesigners);
router.get('/:id', getDesigner);
router.put('/:id', updateDesigner);
router.delete('/:id', deleteDesigner);

export default router;
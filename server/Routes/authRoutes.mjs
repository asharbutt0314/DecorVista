import express from 'express';
import { register, login, verifyOTP, resendOTP, getUser, updateUser, deleteUser, getUsers, forgotPassword, verifyResetOTP, resetPassword, changePassword } from '../Controllers/authController.mjs';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);
router.put('/change-password', changePassword);
router.get('/users', getUsers);
router.get('/user/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/user/:id', deleteUser);

export default router;
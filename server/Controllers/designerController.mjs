import jwt from 'jsonwebtoken';
import Designer from '../Models/Designer.mjs';
import { sendOTPEmail, sendPasswordResetEmail } from '../Services/emailService.mjs';
import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

const validateEmailDomain = async (email) => {
  try {
    const domain = email.split('@')[1];
    const mxRecords = await resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch (error) {
    return false;
  }
};

export const registerDesigner = async (req, res) => {
  try {
    const { username, email, password, gender } = req.body;

    // Check if email already exists
    const existingEmail = await Designer.findOne({ email });
    if (existingEmail) {
      if (!existingEmail.isVerified) {
        return res.status(400).json({ message: 'Email already registered. Please verify your account.' });
      }
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check if username already exists
    const existingUsername = await Designer.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const designer = new Designer({ 
      username,
      email, 
      password, 
      gender,
      otp, 
      otpExpires 
    });
    await designer.save();

    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.log('Email send failed, but designer created');
    }

    res.status(201).json({
      success: true,
      message: 'Designer registration successful. Please check your email for verification code.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginDesigner = async (req, res) => {
  try {
    const { email, password } = req.body;

    const designer = await Designer.findOne({ email });
    
    if (!designer) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const isMatch = await designer.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    if (!designer.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      
      designer.otp = otp;
      designer.otpExpires = otpExpires;
      await designer.save();
      
      try {
        await sendOTPEmail(designer.email, otp);
      } catch (emailError) {
        console.log('Failed to send OTP email:', emailError);
      }
      
      return res.status(400).json({ 
        message: 'Account not verified. New OTP sent to your email.',
        needsVerification: true
      });
    }

    // Find the corresponding InteriorDesigner profile
    const interiorDesigner = await import('../Models/InteriorDesigner.mjs').then(m => m.default.findOne({ user_id: designer._id }));
    let designerIdForToken = designer._id;
    if (interiorDesigner) {
      designerIdForToken = interiorDesigner._id;
    }

    const token = jwt.sign(
      { id: designerIdForToken, type: 'designer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const designerResponse = designer.toObject();
    delete designerResponse.password;
    delete designerResponse.otp;
    delete designerResponse.otpExpires;
    delete designerResponse.resetOtp;
    delete designerResponse.resetOtpExpires;

    res.json({
      success: true,
      token,
      user: designerResponse,
      designerProfileId: designerIdForToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyDesignerOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const designer = await Designer.findOne({ email, otp, isVerified: false });
    if (!designer) {
      return res.status(400).json({ message: 'Invalid OTP or designer already verified' });
    }

    if (designer.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    designer.isVerified = true;
    designer.otp = undefined;
    designer.otpExpires = undefined;
    await designer.save();
    
    const token = jwt.sign(
      { id: designer._id, type: 'designer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const designerResponse = designer.toObject();
    delete designerResponse.password;
    delete designerResponse.otp;
    delete designerResponse.otpExpires;
    delete designerResponse.resetOtp;
    delete designerResponse.resetOtpExpires;
    
    res.json({
      success: true,
      message: 'Email verified and logged in successfully',
      token,
      user: designerResponse
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const resendDesignerOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const designer = await Designer.findOne({ email, isVerified: false });
    if (!designer) {
      return res.status(400).json({ message: 'Designer not found or already verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    designer.otp = otp;
    designer.otpExpires = otpExpires;
    await designer.save();

    try {
      await sendOTPEmail(designer.email, otp);
    } catch (emailError) {
      return res.status(400).json({ message: 'Failed to send OTP' });
    }

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const forgotDesignerPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const designer = await Designer.findOne({ email });
    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    designer.resetOtp = otp;
    designer.resetOtpExpires = otpExpires;
    await designer.save();

    try {
      await sendPasswordResetEmail(email, otp);
    } catch (emailError) {
      return res.status(400).json({ message: 'Failed to send reset email' });
    }
    
    res.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyDesignerResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const designer = await Designer.findOne({ email });
    
    if (!designer || designer.resetOtp !== otp || designer.resetOtpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ success: true, message: 'OTP verified' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const resetDesignerPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const designer = await Designer.findOne({ email });
    
    if (!designer) {
      return res.status(400).json({ message: 'Designer not found' });
    }

    designer.password = newPassword;
    designer.resetOtp = undefined;
    designer.resetOtpExpires = undefined;
    await designer.save();

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllDesigners = async (req, res) => {
  try {
    const designers = await Designer.find().select('-password -otp -otpExpires -resetOtp -resetOtpExpires');
    res.json({ success: true, designers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDesigner = async (req, res) => {
  try {
    const { id } = req.params;
    const designer = await Designer.findById(id).select('-password -otp -otpExpires -resetOtp -resetOtpExpires');
    
    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }

    res.json({ success: true, designer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateDesigner = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remove sensitive fields from updates
    delete updates.password;
    delete updates.otp;
    delete updates.otpExpires;
    delete updates.resetOtp;
    delete updates.resetOtpExpires;
    
    const designer = await Designer.findByIdAndUpdate(id, updates, { new: true }).select('-password -otp -otpExpires -resetOtp -resetOtpExpires');
    
    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }

    res.json({ success: true, designer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteDesigner = async (req, res) => {
  try {
    const { id } = req.params;
    const designer = await Designer.findByIdAndDelete(id);
    
    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }

    res.json({ success: true, message: 'Designer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
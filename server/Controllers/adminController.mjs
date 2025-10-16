import jwt from 'jsonwebtoken';
import Admin from '../Models/Admin.mjs';
import User from '../Models/User.mjs';
import UserDetails from '../Models/UserDetails.mjs';
import InteriorDesigner from '../Models/InteriorDesigner.mjs';
import Product from '../Models/Product.mjs';
import Category from '../Models/Category.mjs';
import Blog from '../Models/Blog.mjs';
import Order from '../Models/Order.mjs';
import { sendAdminOTPEmail, sendAdminPasswordResetEmail } from '../Services/adminEmailService.mjs';
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

// Admin Auth Functions
export const register = async (req, res) => {
  try {
    const { username, email, password, gender } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    const isDomainValid = await validateEmailDomain(email);
    if (!isDomainValid) {
      return res.status(400).json({ message: 'Email domain does not exist. Please check and try again.' });
    }

    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const existingUsername = await Admin.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken. Please change the username.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    try {
      await sendAdminOTPEmail(email, otp);
    } catch (emailError) {
      return res.status(400).json({ message: 'Email does not exist. Please check and try again.' });
    }

    const admin = new Admin({ 
      username,
      email, 
      password, 
      gender,
      otp,
      otpExpires
    });
    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin registration successful. Please check your email for verification code.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    const isDomainValid = await validateEmailDomain(email);
    if (!isDomainValid) {
      return res.status(400).json({ message: 'Email domain does not exist. Please check and try again.' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    if (!admin.isVerified) {
      return res.status(400).json({ 
        message: 'Please verify your email first',
        needsVerification: true
      });
    }

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    if (!admin.otp || admin.otp !== otp || admin.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    admin.isVerified = true;
    admin.otp = undefined;
    admin.otpExpires = undefined;
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Email verified and logged in successfully',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    if (admin.isVerified) {
      return res.status(400).json({ message: 'Admin already verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    admin.otp = otp;
    admin.otpExpires = otpExpires;
    await admin.save();

    try {
      await sendAdminOTPEmail(admin.email, otp);
    } catch (emailError) {
      return res.status(400).json({ message: 'Email does not exist. Please check and try again.' });
    }

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    const isDomainValid = await validateEmailDomain(email);
    if (!isDomainValid) {
      return res.status(400).json({ message: 'Email domain does not exist. Please check and try again.' });
    }
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    admin.resetOtp = otp;
    admin.resetOtpExpires = otpExpires;
    await admin.save();

    try {
      await sendAdminPasswordResetEmail(email, otp);
    } catch (emailError) {
      return res.status(400).json({ message: 'Email does not exist. Please check and try again.' });
    }
    
    res.json({ success: true, message: 'OTP sent to email', adminId: admin._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (!admin || admin.resetOtp !== otp || admin.resetOtpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ success: true, message: 'OTP verified', adminId: admin._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    admin.password = newPassword;
    admin.resetOtp = undefined;
    admin.resetOtpExpires = undefined;
    await admin.save();

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Management Functions
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('userDetails');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    await UserDetails.findOneAndDelete({ user_id: id });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDesigners = async (req, res) => {
  try {
    const designers = await InteriorDesigner.find().populate('user_id');
    res.json({ success: true, designers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteDesigner = async (req, res) => {
  try {
    const { id } = req.params;
    await InteriorDesigner.findByIdAndDelete(id);
    res.json({ success: true, message: 'Designer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { productname, brand, price, description, image } = req.body;
    const product = new Product({ productname, brand, price, description, image });
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { categoryname } = req.body;
    const category = new Category({ categoryname });
    await category.save();
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = new Blog({ title, content, author: req.user.id });
    await blog.save();
    res.status(201).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, blog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const designerCount = await InteriorDesigner.countDocuments();
    const productCount = await Product.countDocuments();
    const blogCount = await Blog.countDocuments();
    const orderCount = await Order.countDocuments();
    
    res.json({
      success: true,
      reports: {
        totalUsers: userCount,
        totalDesigners: designerCount,
        totalProducts: productCount,
        totalBlogs: blogCount,
        totalOrders: orderCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Order Management
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user_id');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Analytics
export const getAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    res.json({
      success: true,
      analytics: {
        totalUsers: await User.countDocuments(),
        totalDesigners: await InteriorDesigner.countDocuments(),
        totalProducts: await Product.countDocuments(),
        totalBlogs: await Blog.countDocuments(),
        recentUsers: await User.countDocuments({ createdAt: { $gte: dateFrom } }),
        recentDesigners: await InteriorDesigner.countDocuments({ createdAt: { $gte: dateFrom } }),
        userGrowth: [
          { date: '2024-01-01', users: 10 },
          { date: '2024-01-02', users: 15 },
          { date: '2024-01-03', users: 20 }
        ],
        topCategories: [
          { name: 'Living Room', count: 25 },
          { name: 'Bedroom', count: 20 },
          { name: 'Kitchen', count: 15 }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
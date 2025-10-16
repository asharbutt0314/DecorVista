import jwt from 'jsonwebtoken';
import User from '../Models/User.mjs';
import UserDetails from '../Models/UserDetails.mjs';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // If it's an admin token, don't require user lookup
    if (decoded.role === 'admin') {
      req.user = { id: decoded.id, role: 'admin' };
      return next();
    }
    
    // Check if it's a designer token
    if (decoded.type === 'designer') {
      const Designer = (await import('../Models/Designer.mjs')).default;
      const designer = await Designer.findById(decoded.id);
      
      if (!designer) {
        return res.status(401).json({ message: 'Invalid designer token' });
      }
      
      req.user = { id: designer._id, email: designer.email, type: 'designer' };
      return next();
    }
    
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = { id: user._id, email: user.email, role: user.role };
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const userDetails = await UserDetails.findOne({ user_id: req.user.id });
    
    if (!userDetails || userDetails.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Access denied' });
  }
};

export const requireDesigner = async (req, res, next) => {
  try {
    const userDetails = await UserDetails.findOne({ user_id: req.user.id });
    
    if (!userDetails || userDetails.role !== 'designer') {
      return res.status(403).json({ message: 'Designer access required' });
    }
    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Access denied' });
  }
};

export const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's admin token
    if (decoded.role === 'admin') {
      req.user = { id: decoded.id, role: 'admin' };
      return next();
    }
    
    return res.status(403).json({ message: 'Admin access required' });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
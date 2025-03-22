
// Simplified auth middleware with no JWT tokens
const User = require('../models/userModel');

// Simple auth check
exports.protect = async (req, res, next) => {
  try {
    // Get user ID from request query or body for simple authentication
    const userId = req.query.userId || req.body.userId;
    
    if (!userId) {
      return res.status(401).json({
        status: 401,
        message: 'Authentication required. Please provide userId in query or body.'
      });
    }
    
    // Get user from database
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: 'User not found'
      });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Server error'
    });
  }
};

// Admin middleware
exports.admin = (req, res, next) => {
  // Check if user is an admin
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      status: 403,
      message: 'Not authorized as an admin'
    });
  }
};

// Provider middleware (for content creators)
exports.provider = (req, res, next) => {
  // Check if user is a provider or admin
  if (req.user && (req.user.role === 'provider' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      status: 403,
      message: 'Not authorized as a provider'
    });
  }
};

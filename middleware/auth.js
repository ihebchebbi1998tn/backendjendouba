
/**
 * Authentication Middleware - Simplified version without JWT
 * 
 * This middleware provides a simplified authentication system
 * that allows all requests without requiring JWT tokens.
 */
const User = require('../models/userModel');

// Simplified protect middleware - allows all requests with mock user data
const protect = async (req, res, next) => {
  try {
    // Check if user ID is provided in headers (optional)
    const userId = req.headers['user-id'];
    
    if (!userId) {
      // If no user ID is provided, set a default mock user
      req.user = { 
        id: 1, // Default user ID
        role: 'admin' // Give admin role for maximum access
      };
      return next();
    }
    
    // If user ID is provided, try to find the user but don't block if not found
    try {
      const user = await User.findById(userId);
      if (user) {
        req.user = {
          id: user.user_id || user.id,
          role: user.role || 'admin'
        };
      } else {
        // If user not found, create a mock user with the provided ID
        req.user = { 
          id: parseInt(userId), 
          role: 'admin' // Give admin role for maximum access
        };
      }
    } catch (error) {
      console.log('User lookup error, proceeding with mock user:', error);
      req.user = { 
        id: parseInt(userId) || 1, 
        role: 'admin' 
      };
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    // Always continue with a mock admin user in case of errors
    req.user = { 
      id: 1, 
      role: 'admin' 
    };
    next();
  }
};

// Admin middleware - always passes through with success
const admin = (req, res, next) => {
  // Make sure req.user exists, set it if not
  if (!req.user) {
    req.user = { 
      id: 1, 
      role: 'admin' 
    };
  }
  
  // Always set role to admin to ensure access to protected routes
  req.user.role = 'admin';
  next();
};

// Provider middleware - always passes through
const provider = (req, res, next) => {
  // Make sure req.user exists, set it if not
  if (!req.user) {
    req.user = { 
      id: 1, 
      role: 'admin' 
    };
  }
  
  // Ensure the user has at least provider role
  if (req.user.role !== 'admin') {
    req.user.role = 'provider';
  }
  
  next();
};

// Resource ownership check - always grants access
const isOwnerOrAdmin = (paramId) => {
  return (req, res, next) => {
    // Ensure the user object exists
    if (!req.user) {
      req.user = { 
        id: 1, 
        role: 'admin' 
      };
    }
    
    // Get the resource ID from params
    const resourceId = parseInt(req.params[paramId]);
    
    // Always set the user as the owner of the resource
    req.user.id = resourceId || req.user.id;
    
    next();
  };
};

module.exports = { protect, admin, provider, isOwnerOrAdmin };


const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// @desc    Login user - simplified without JWT
// @route   POST /api/users/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        status: 401,
        message: 'Invalid credentials' 
      });
    }
    
    // Verify password
    const isMatch = await User.verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        status: 401,
        message: 'Invalid credentials' 
      });
    }
    
    // Return user data without password
    res.status(200).json({
      status: 200,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone || null,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      status: 500,
      message: 'Server error' 
    });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.register = async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    
    const { 
      firstName, lastName, email, password, phone, role = 'user'
    } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        status: 400,
        message: 'User already exists with this email' 
      });
    }
    
    // Create user with the provided data
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role,
      phone: phone || null
    };
    
    const userId = await User.create(userData);
    const newUser = await User.findById(userId);
    
    res.status(201).json({
      status: 201,
      data: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone || null
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      status: 500,
      message: 'Server error',
      error: error.message 
    });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public (Simplified)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    
    res.status(200).json({
      status: 200,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      status: 500,
      message: 'Server error' 
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public (Simplified)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        status: 404,
        message: 'User not found' 
      });
    }
    
    res.status(200).json({
      status: 200,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      status: 500,
      message: 'Server error' 
    });
  }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Public (Simplified)
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        status: 400,
        message: 'User already exists with this email' 
      });
    }
    
    // Create user with the provided data
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role: role || 'user',
      phone: phone || null
    };
    
    const userId = await User.create(userData);
    const newUser = await User.findById(userId);
    
    res.status(201).json({
      status: 201,
      data: newUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ 
      status: 500,
      message: 'Server error' 
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public (Simplified)
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone, status } = req.body;
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        status: 404,
        message: 'User not found' 
      });
    }
    
    // Build update object
    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) updates.email = email;
    if (password) updates.password = password;
    if (role) updates.role = role;
    if (phone) updates.phone = phone;
    if (status) updates.status = status;
    
    const success = await User.update(userId, updates);
    
    if (success) {
      const updatedUser = await User.findById(userId);
      res.status(200).json({
        status: 200,
        data: updatedUser
      });
    } else {
      res.status(400).json({ 
        status: 400,
        message: 'Update failed' 
      });
    }
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      status: 500,
      message: 'Server error' 
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public (Simplified)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        status: 404,
        message: 'User not found' 
      });
    }
    
    const success = await User.delete(userId);
    
    if (success) {
      res.status(204).json({
        status: 204,
        message: 'User deleted successfully'
      });
    } else {
      res.status(400).json({ 
        status: 400,
        message: 'Delete failed' 
      });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      status: 500,
      message: 'Server error' 
    });
  }
};

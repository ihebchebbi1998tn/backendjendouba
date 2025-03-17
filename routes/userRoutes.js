
/**
 * User Routes - Handles all user-related API endpoints
 * 
 * These routes handle user registration, authentication, profile management,
 * and administrative functions for user accounts.
 */
const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

console.log('📌 Configuration des routes utilisateur');

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user & get token
 * @access  Public
 * @body    {email, password}
 * @returns User data
 */
router.post('/login', login);
console.log('🔹 Route POST /login configurée');

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 * @body    {name, email, password}
 * @returns User data without sensitive information
 */
router.post('/register', register);
console.log('🔹 Route POST /register configurée');

/**
 * @route   GET /api/users
 * @desc    Get all users with basic information
 * @access  Private - Requires authentication
 * @returns Array of users
 */
router.get('/', protect, getAllUsers);
console.log('🔹 Route GET / configurée (protégée)');

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private - Requires authentication
 * @returns User data
 */
router.get('/:id', protect, getUserById);
console.log('🔹 Route GET /:id configurée (protégée)');

/**
 * @route   POST /api/users
 * @desc    Create a new user (admin only)
 * @access  Private - Requires admin role
 * @body    {name, email, password, role}
 * @returns Created user data
 */
router.post('/', protect, admin, createUser);
console.log('🔹 Route POST / configurée (protégée/admin)');

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private - Requires authentication and ownership or admin role
 * @param   id - User ID
 * @body    {name, email, password, role}
 * @returns Updated user data
 */
router.put('/:id', protect, updateUser);
console.log('🔹 Route PUT /:id configurée (protégée)');

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private - Requires admin role
 * @param   id - User ID
 * @returns Success message
 */
router.delete('/:id', protect, admin, deleteUser);
console.log('🔹 Route DELETE /:id configurée (protégée/admin)');

console.log('✅ Configuration des routes utilisateur terminée');

module.exports = router;

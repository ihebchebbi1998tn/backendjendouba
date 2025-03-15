
/**
 * User Routes - Handles all user-related API endpoints
 * 
 * These routes handle user registration, authentication, profile management,
 * and administrative functions for user accounts.
 */
const express = require('express');
const router = express.Router();
const { register, login, getMe, getAllUsers, updateUser, deleteUser, updateUserStatus } = require('../controllers/userController');
const { protect, admin, isOwnerOrAdmin } = require('../middleware/auth');

console.log('📌 Configuration des routes utilisateur');

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 * @body    {nom, prenom, email, password, phone}
 * @returns User data without sensitive information
 */
router.post('/register', register);
console.log('🔹 Route POST /register configurée');

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
 * @route   GET /api/users/me
 * @desc    Get current user's profile
 * @access  Private - Requires authentication
 * @returns Current user's profile data
 */
router.get('/me', protect, getMe);
console.log('🔹 Route GET /me configurée (protégée)');

/**
 * @route   GET /api/users
 * @desc    Get all users - can be filtered by role, status, and search term
 * @access  Private - Requires authentication
 * @query   {role, status, search}
 * @returns Array of users
 */
router.get('/', protect, getAllUsers);
console.log('🔹 Route GET / configurée (protégée)');

/**
 * @route   PUT /api/users/:id
 * @desc    Update user profile
 * @access  Private - Requires authentication and ownership or admin role
 * @param   id - User ID
 * @body    {nom, prenom, email, phone, profile_image}
 * @returns Updated user data
 */
router.put('/:id', protect, updateUser);
console.log('🔹 Route PUT /:id configurée (protégée)');

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private - Requires authentication and ownership or admin role
 * @param   id - User ID
 * @returns Success message
 */
router.delete('/:id', protect, deleteUser);
console.log('🔹 Route DELETE /:id configurée (protégée)');

/**
 * @route   PATCH /api/users/:id/status
 * @desc    Update user status (active/inactive)
 * @access  Private - Requires admin role
 * @param   id - User ID
 * @body    {status}
 * @returns Updated user data
 */
router.patch('/:id/status', protect, updateUserStatus);
console.log('🔹 Route PATCH /:id/status configurée (protégée)');

console.log('✅ Configuration des routes utilisateur terminée');

module.exports = router;

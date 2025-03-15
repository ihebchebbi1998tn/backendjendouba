
/**
 * Review Routes - Handles all review-related API endpoints
 * 
 * These routes handle the creation, retrieval, updating, and deletion
 * of reviews, as well as moderation by admins.
 */
const express = require("express");
const router = express.Router();
const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  updateReviewStatus
} = require("../controllers/reviewController");
const { protect, admin } = require("../middleware/auth");
const { reviewValidation, idValidation } = require("../middleware/validate");

// Public Routes

/**
 * @route   GET /api/reviews
 * @desc    Get all reviews with optional filtering
 * @access  Public
 * @query   Various filter parameters
 * @returns Array of reviews
 */
router.get("/", getAllReviews);

/**
 * @route   GET /api/reviews/:id
 * @desc    Get review by ID
 * @access  Public
 * @param   id - Review ID
 * @returns Review data
 */
router.get("/:id", idValidation, getReviewById);

// Protected Routes

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Private - Requires authentication
 * @body    Review data
 * @returns Created review data
 */
router.post("/", protect, reviewValidation, createReview);

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update a review
 * @access  Private - Requires authentication and ownership
 * @param   id - Review ID
 * @body    Updated review data
 * @returns Updated review data
 */
router.put("/:id", protect, idValidation, reviewValidation, updateReview);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review
 * @access  Private - Requires authentication and ownership
 * @param   id - Review ID
 * @returns Success message
 */
router.delete("/:id", protect, idValidation, deleteReview);

// Admin Only Routes

/**
 * @route   PATCH /api/reviews/:id/status
 * @desc    Update review status (pending, approved, rejected)
 * @access  Private - Requires admin role
 * @param   id - Review ID
 * @body    {status}
 * @returns Success message
 */
router.patch("/:id/status", protect, admin, idValidation, updateReviewStatus);

module.exports = router;


/**
 * Review Routes - Handles all review-related API endpoints
 * 
 * These routes handle the creation, retrieval, updating, and deletion
 * of reviews for tourist places.
 */
const express = require("express");
const router = express.Router();
const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
} = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");
const { reviewValidation, idValidation } = require("../middleware/validate");

// Public Routes

/**
 * @route   GET /api/reviews
 * @desc    Get all reviews with optional filtering
 * @access  Public
 * @query   placeId, userId - filter parameters
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
 * @body    Review data (placeId, rating, comment)
 * @returns Created review data
 */
router.post("/", protect, reviewValidation, createReview);

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update a review
 * @access  Private - Requires authentication and ownership
 * @param   id - Review ID
 * @body    Updated review data (rating, comment)
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

module.exports = router;

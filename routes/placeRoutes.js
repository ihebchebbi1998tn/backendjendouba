
/**
 * Place Routes - Handles all place-related API endpoints
 * 
 * These routes handle the creation, retrieval, updating, and deletion
 * of places.
 */
const express = require("express");
const router = express.Router();
const {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace
} = require("../controllers/placeController");
const { protect, admin } = require("../middleware/auth");
const { placeValidation, idValidation } = require("../middleware/validate");

/**
 * @route   GET /api/places
 * @desc    Get all places
 * @access  Public
 * @returns Array of all places
 */
router.get("/", getAllPlaces);

/**
 * @route   GET /api/places/:id
 * @desc    Get place by ID
 * @access  Public
 * @param   id - Place ID
 * @returns Place data with detailed information
 */
router.get("/:id", idValidation, getPlaceById);

/**
 * @route   POST /api/places
 * @desc    Create a new place
 * @access  Private - Requires authentication (admin)
 * @body    Place data
 * @returns Created place data
 */
router.post("/", protect, admin, placeValidation, createPlace);

/**
 * @route   PUT /api/places/:id
 * @desc    Update a place
 * @access  Private - Requires authentication (admin)
 * @param   id - Place ID
 * @body    Updated place data
 * @returns Updated place data
 */
router.put("/:id", protect, admin, idValidation, placeValidation, updatePlace);

/**
 * @route   DELETE /api/places/:id
 * @desc    Delete a place
 * @access  Private - Requires authentication (admin)
 * @param   id - Place ID
 * @returns Success message
 */
router.delete("/:id", protect, admin, idValidation, deletePlace);

module.exports = router;

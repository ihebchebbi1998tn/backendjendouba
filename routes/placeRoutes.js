
/**
 * Place Routes - Handles all place/location-related API endpoints
 * 
 * These routes handle the creation, retrieval, updating, and deletion
 * of places, as well as searching and filtering options.
 */
const express = require("express");
const router = express.Router();
const {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  searchPlaces,
  getPlacesByProvider,
  getPlacesByRegion,
  getPopularPlaces
} = require("../controllers/placeController");
const { protect, admin, provider } = require("../middleware/auth");
const { placeValidation, idValidation, searchValidation } = require("../middleware/validate");

// Public routes - No authentication required

/**
 * @route   GET /api/places
 * @desc    Get all places
 * @access  Public
 * @returns Array of all places
 */
router.get("/", getAllPlaces);

/**
 * @route   GET /api/places/search
 * @desc    Search places with various filters (name, region, type, amenities, etc.)
 * @access  Public
 * @query   Various search parameters
 * @returns Array of filtered places
 */
router.get("/search", searchValidation, searchPlaces);

/**
 * @route   GET /api/places/popular
 * @desc    Get most popular places based on ratings and visits
 * @access  Public
 * @query   {limit} - Number of places to return
 * @returns Array of popular places
 */
router.get("/popular", getPopularPlaces);

/**
 * @route   GET /api/places/region/:region
 * @desc    Get places by region
 * @access  Public
 * @param   region - Region name
 * @returns Array of places in the specified region
 */
router.get("/region/:region", getPlacesByRegion);

/**
 * @route   GET /api/places/:id
 * @desc    Get place by ID
 * @access  Public
 * @param   id - Place ID
 * @returns Place data
 */
router.get("/:id", idValidation, getPlaceById);

// Protected routes - Authentication required

/**
 * @route   GET /api/places/provider/:providerId
 * @desc    Get places by provider ID
 * @access  Private - Requires authentication
 * @param   providerId - Provider user ID
 * @returns Array of places owned by the provider
 */
router.get("/provider/:providerId", protect, getPlacesByProvider);

/**
 * @route   POST /api/places
 * @desc    Create a new place
 * @access  Private - Requires authentication (admin or provider)
 * @body    Place data
 * @returns Created place data
 */
router.post("/", protect, placeValidation, createPlace);

/**
 * @route   PUT /api/places/:id
 * @desc    Update a place
 * @access  Private - Requires authentication (admin or owner provider)
 * @param   id - Place ID
 * @body    Updated place data
 * @returns Updated place data
 */
router.put("/:id", protect, idValidation, placeValidation, updatePlace);

/**
 * @route   DELETE /api/places/:id
 * @desc    Delete a place
 * @access  Private - Requires authentication (admin or owner provider)
 * @param   id - Place ID
 * @returns Success message
 */
router.delete("/:id", protect, idValidation, deletePlace);

module.exports = router;


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
  deletePlace,
  searchPlaces,
  getPlacesByRegion,
  getPopularPlaces,
  getPlacesByProvider
} = require("../controllers/placeController");
const { placeValidation, idValidation } = require("../middleware/validate");

/**
 * @route   GET /api/places
 * @desc    Get all places
 * @access  Public
 * @returns Array of all places
 */
router.get("/", getAllPlaces);

/**
 * @route   GET /api/places/search
 * @desc    Search places with various filters
 * @access  Public
 * @query   Various search parameters
 * @returns Array of matching places
 */
router.get("/search", searchPlaces);

/**
 * @route   GET /api/places/region/:region
 * @desc    Get places by region
 * @access  Public
 * @param   region - Region name
 * @returns Array of places in the specified region
 */
router.get("/region/:region", getPlacesByRegion);

/**
 * @route   GET /api/places/popular
 * @desc    Get popular places
 * @access  Public
 * @query   {limit} - Number of places to return
 * @returns Array of popular places
 */
router.get("/popular", getPopularPlaces);

/**
 * @route   GET /api/places/provider/:providerId
 * @desc    Get places by provider
 * @access  Public (was previously protected)
 * @param   providerId - Provider user ID
 * @returns Array of places owned by the provider
 */
router.get("/provider/:providerId", getPlacesByProvider);

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
 * @access  Public (was previously protected for admin or provider)
 * @body    Place data
 * @returns Created place data
 */
router.post("/", placeValidation, createPlace);

/**
 * @route   PUT /api/places/:id
 * @desc    Update a place
 * @access  Public (was previously protected for admin or provider who owns the place)
 * @param   id - Place ID
 * @body    Updated place data
 * @returns Updated place data
 */
router.put("/:id", idValidation, placeValidation, updatePlace);

/**
 * @route   DELETE /api/places/:id
 * @desc    Delete a place
 * @access  Public (was previously protected for admin or provider who owns the place)
 * @param   id - Place ID
 * @returns Success message
 */
router.delete("/:id", idValidation, deletePlace);

module.exports = router;

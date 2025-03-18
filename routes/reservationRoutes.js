
/**
 * Reservation Routes - Handles all reservation-related API endpoints
 * 
 * These routes handle the creation, retrieval, updating, and deletion
 * of reservations, as well as availability checking.
 */
const express = require("express");
const router = express.Router();
const {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
  checkAvailability
} = require("../controllers/reservationController");
const { protect, admin } = require("../middleware/auth");
const { reservationValidation, idValidation } = require("../middleware/validate");

/**
 * @route   GET /api/reservations
 * @desc    Get all reservations (filtered by user role)
 * @access  Private - Requires authentication
 * @query   Various filter parameters
 * @returns Array of reservations according to user permissions
 */
router.get("/", protect, getAllReservations);

/**
 * @route   GET /api/reservations/:id
 * @desc    Get reservation by ID
 * @access  Private - Requires authentication and access rights
 * @param   id - Reservation ID
 * @returns Reservation data
 */
router.get("/:id", protect, idValidation, getReservationById);

/**
 * @route   POST /api/reservations
 * @desc    Create a new reservation
 * @access  Private - Requires authentication
 * @body    Reservation data
 * @returns Created reservation data
 */
router.post("/", protect, reservationValidation, createReservation);

/**
 * @route   PUT /api/reservations/:id
 * @desc    Update a reservation
 * @access  Private - Requires authentication and ownership
 * @param   id - Reservation ID
 * @body    Updated reservation data
 * @returns Updated reservation data
 */
router.put("/:id", protect, idValidation, updateReservation);

/**
 * @route   DELETE /api/reservations/:id
 * @desc    Delete a reservation
 * @access  Private - Requires authentication and ownership
 * @param   id - Reservation ID
 * @returns Success message
 */
router.delete("/:id", protect, idValidation, deleteReservation);

/**
 * @route   GET /api/reservations/availability
 * @desc    Check availability for an event or place
 * @access  Public
 * @query   {entityType, entityId, date, numberOfTickets}
 * @returns Availability status
 */
router.get("/availability", checkAvailability);

module.exports = router;

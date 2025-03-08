
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
const { protect, admin, provider } = require("../middleware/auth");
const { reservationValidation, idValidation } = require("../middleware/validate");

// Routes protégées (Protected routes)
router.get("/", protect, getAllReservations);        // Récupérer toutes les réservations
router.get("/availability", checkAvailability);      // Vérifier la disponibilité
router.get("/:id", protect, idValidation, getReservationById);  // Récupérer une réservation par son ID
router.post("/", protect, reservationValidation, createReservation);  // Créer une nouvelle réservation
router.put("/:id", protect, idValidation, updateReservation);  // Mettre à jour une réservation
router.delete("/:id", protect, idValidation, deleteReservation);  // Supprimer une réservation

module.exports = router;

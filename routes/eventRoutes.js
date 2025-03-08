
const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents
} = require("../controllers/eventController");
const { protect, admin, provider } = require("../middleware/auth");
const { eventValidation, idValidation } = require("../middleware/validate");

// Routes publiques (Public routes)
router.get("/", getAllEvents);                       // Récupérer tous les événements
router.get("/upcoming", getUpcomingEvents);          // Récupérer les événements à venir
router.get("/:id", idValidation, getEventById);      // Récupérer un événement par son ID

// Routes pour Admin/Fournisseur (Admin/Provider routes)
router.post("/", protect, eventValidation, createEvent);          // Créer un nouvel événement
router.put("/:id", protect, idValidation, eventValidation, updateEvent);   // Mettre à jour un événement
router.delete("/:id", protect, idValidation, deleteEvent);        // Supprimer un événement

module.exports = router;

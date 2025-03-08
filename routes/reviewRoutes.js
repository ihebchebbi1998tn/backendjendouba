
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

// Routes publiques (Public routes)
router.get("/", getAllReviews);                      // Récupérer tous les avis
router.get("/:id", idValidation, getReviewById);     // Récupérer un avis par son ID

// Routes protégées (Protected routes)
router.post("/", protect, reviewValidation, createReview);          // Créer un nouvel avis
router.put("/:id", protect, idValidation, reviewValidation, updateReview);   // Mettre à jour un avis
router.delete("/:id", protect, idValidation, deleteReview);        // Supprimer un avis

// Routes pour administrateurs uniquement (Admin only routes)
router.patch("/:id/status", protect, admin, idValidation, updateReviewStatus);  // Modifier le statut d'un avis

module.exports = router;

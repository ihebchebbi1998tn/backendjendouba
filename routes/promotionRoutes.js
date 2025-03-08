
const express = require("express");
const router = express.Router();
const {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getActivePromotions
} = require("../controllers/promotionController");
const { protect, admin, provider } = require("../middleware/auth");
const { promotionValidation, idValidation } = require("../middleware/validate");

// Récupérer les promotions actives pour un lieu (public)
router.get("/place/:placeId/active", getActivePromotions);

// Routes protégées (Protected routes)
router.get("/", protect, getAllPromotions);           // Récupérer toutes les promotions
router.get("/:id", protect, idValidation, getPromotionById);  // Récupérer une promotion par son ID
router.post("/", protect, promotionValidation, createPromotion);  // Créer une nouvelle promotion
router.put("/:id", protect, idValidation, promotionValidation, updatePromotion);  // Mettre à jour une promotion
router.delete("/:id", protect, idValidation, deletePromotion);  // Supprimer une promotion

module.exports = router;

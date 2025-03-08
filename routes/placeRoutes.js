
const express = require("express");
const router = express.Router();
const {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  searchPlaces,
  getPlacesByProvider
} = require("../controllers/placeController");
const { protect, admin, provider } = require("../middleware/auth");
const { placeValidation, idValidation, searchValidation } = require("../middleware/validate");

// Public routes
router.get("/", getAllPlaces);
router.get("/search", searchValidation, searchPlaces);
router.get("/:id", idValidation, getPlaceById);

// Provider routes
router.get("/provider/:providerId", protect, getPlacesByProvider);

// Protected admin/provider routes
router.post("/", protect, placeValidation, createPlace);
router.put("/:id", protect, idValidation, placeValidation, updatePlace);
router.delete("/:id", protect, idValidation, deletePlace);

module.exports = router;

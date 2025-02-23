const express = require("express");
const router = express.Router();
const {
  getAllPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/placeController");
const { protect, admin } = require("../middleware/auth");
const { placeValidation, idValidation } = require("../middleware/validate");

// Public routes
router.get("/", getAllPlaces);
router.get("/:id", idValidation, getPlaceById);

// Protected admin routes
router.post("/", protect, admin, placeValidation, createPlace);
router.put("/:id", protect, admin, idValidation, placeValidation, updatePlace);
router.delete("/:id", protect, admin, idValidation, deletePlace);

module.exports = router;

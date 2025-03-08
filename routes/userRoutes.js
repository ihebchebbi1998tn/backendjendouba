
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateUser,
  deleteUser,
  getAllUsers,
  updateUserStatus
} = require("../controllers/userController");
const { protect, admin, isOwnerOrAdmin } = require("../middleware/auth");
const {
  registerValidation,
  loginValidation,
  userUpdateValidation,
  idValidation
} = require("../middleware/validate");

// Auth routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

// User management
router.put("/:id", protect, idValidation, userUpdateValidation, isOwnerOrAdmin("id"), updateUser);
router.delete("/:id", protect, idValidation, isOwnerOrAdmin("id"), deleteUser);

// Admin only routes
router.get("/", protect, admin, getAllUsers);
router.patch("/:id/status", protect, admin, idValidation, updateUserStatus);

module.exports = router;

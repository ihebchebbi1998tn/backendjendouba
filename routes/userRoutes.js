const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const {
  registerValidation,
  loginValidation,
} = require("../middleware/validate");

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

module.exports = router;

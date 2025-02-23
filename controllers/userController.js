const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

// Register User
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = await User.create(req.body);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      // Set session data
      req.session.userId = user.user_id;
      req.session.role = user.role;

      res.json({
        user: {
          id: user.user_id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout User
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
};

// Get Current User
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    // Only allow users to update their own account unless admin
    if (
      req.session.role !== "admin" &&
      req.session.userId !== parseInt(req.params.id)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await User.update(req.params.id, req.body);
    res.json({ message: "User updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    // Only allow users to delete their own account unless admin
    if (
      req.session.role !== "admin" &&
      req.session.userId !== parseInt(req.params.id)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await User.delete(req.params.id);
    req.session.destroy();
    res.json({ message: "User removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

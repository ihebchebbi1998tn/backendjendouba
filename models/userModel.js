
const db = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
  // Créer un nouvel utilisateur
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [result] = await db.query(
      `INSERT INTO users 
      (nom, prenom, email, password_hash, role, profile_image, phone) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.nom,
        userData.prenom,
        userData.email,
        hashedPassword,
        userData.role || "user",
        userData.profile_image || null,
        userData.phone || null,
      ]
    );
    return result.insertId;
  }

  // Trouver un utilisateur par email
  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }

  // Trouver un utilisateur par ID
  static async findById(id) {
    const [rows] = await db.query(
      "SELECT user_id, nom, prenom, email, role, status, profile_image, phone, created_at FROM users WHERE user_id = ?",
      [id]
    );
    return rows[0];
  }

  // Mettre à jour un utilisateur
  static async update(id, updates) {
    if (updates.password) {
      updates.password_hash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }

    const fields = Object.keys(updates).join(" = ?, ") + " = ?";
    const values = Object.values(updates);

    await db.query(`UPDATE users SET ${fields} WHERE user_id = ?`, [
      ...values,
      id,
    ]);
  }

  // Supprimer un utilisateur
  static async delete(id) {
    await db.query("DELETE FROM users WHERE user_id = ?", [id]);
  }

  // Récupérer tous les utilisateurs avec filtres optionnels
  static async getAll(filters = {}) {
    let query = "SELECT user_id, nom, prenom, email, role, status, created_at FROM users WHERE 1=1";
    const params = [];

    // Filtre par rôle
    if (filters.role) {
      query += " AND role = ?";
      params.push(filters.role);
    }

    // Filtre par statut
    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    // Filtre par recherche (nom, prénom ou email)
    if (filters.search) {
      query += " AND (nom LIKE ? OR prenom LIKE ? OR email LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Tri par date de création (décroissant)
    query += " ORDER BY created_at DESC";

    const [rows] = await db.query(query, params);
    return rows;
  }

  // Mettre à jour le statut d'un utilisateur
  static async updateStatus(id, status) {
    await db.query("UPDATE users SET status = ? WHERE user_id = ?", [status, id]);
  }
}

module.exports = User;

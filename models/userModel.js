const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ nom, prenom, email, password, role = 'user', status = 'active', phone = null, profile_image = null, oauth_id = null, oauth_provider = null }) {
    try {
      let passwordHash = null;
      
      // Only hash password if it's provided (for non-OAuth users)
      if (password) {
        const salt = await bcrypt.genSalt(10);
        passwordHash = await bcrypt.hash(password, salt);
      }
      
      const [result] = await db.execute(
        'INSERT INTO users (nom, prenom, email, password_hash, role, status, phone, profile_image, oauth_id, oauth_provider) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nom, prenom, email, passwordHash, role, status, phone, profile_image, oauth_id, oauth_provider]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query(
      "SELECT user_id, nom, prenom, email, role, status, profile_image, phone, created_at FROM users WHERE user_id = ?",
      [id]
    );
    return rows[0];
  }

  static async update(id, updates) {
    if (updates.password) {
      updates.password_hash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    const [result] = await db.query(`UPDATE users SET ${fields} WHERE user_id = ?`, values);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query("DELETE FROM users WHERE user_id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async getAll(filters = {}) {
    let query = "SELECT user_id, nom, prenom, email, role, status, created_at FROM users WHERE 1=1";
    const params = [];

    // Filter by role
    if (filters.role) {
      query += " AND role = ?";
      params.push(filters.role);
    }

    // Filter by status
    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    // Filter by search (name, first name or email)
    if (filters.search) {
      query += " AND (nom LIKE ? OR prenom LIKE ? OR email LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Sort by creation date (descending)
    query += " ORDER BY created_at DESC";

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async updateStatus(id, status) {
    const [result] = await db.query("UPDATE users SET status = ? WHERE user_id = ?", [status, id]);
    return result.affectedRows > 0;
  }

  static async findByOAuthId(oauth_id, provider) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE oauth_id = ? AND oauth_provider = ?',
        [oauth_id, provider]
      );
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error finding user by OAuth ID:', error);
      throw error;
    }
  }
}

module.exports = User;

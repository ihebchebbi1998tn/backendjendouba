
const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ firstName, lastName, email, password, role = 'user', phone = null }) {
    try {
      // Simplified password handling - basic hash
      const passwordHash = password ? await bcrypt.hash(password, 10) : null;
      
      const [result] = await db.execute(
        'INSERT INTO users (firstName, lastName, email, password, role, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, passwordHash, role, phone, 'active']
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
      "SELECT id, firstName, lastName, email, role, phone, status, createdAt FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  static async update(id, updates) {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    const [result] = await db.query(`UPDATE users SET ${fields} WHERE id = ?`, values);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async getAll() {
    const [rows] = await db.query("SELECT id, firstName, lastName, email, role, phone, status FROM users ORDER BY createdAt DESC");
    return rows;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;

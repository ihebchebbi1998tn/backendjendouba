const db = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [result] = await db.query(
      `INSERT INTO users 
      (nom, prenom, email, password_hash, role) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        userData.nom,
        userData.prenom,
        userData.email,
        hashedPassword,
        userData.role || "user",
      ]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query(
      "SELECT user_id, nom, prenom, email, role FROM users WHERE user_id = ?",
      [id]
    );
    return rows[0];
  }

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

  static async delete(id) {
    await db.query("DELETE FROM users WHERE user_id = ?", [id]);
  }
}

module.exports = User;

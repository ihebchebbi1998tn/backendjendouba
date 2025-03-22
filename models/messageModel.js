
const db = require("../config/db");

class Message {
  // Create a new message
  static async create(messageData) {
    const [result] = await db.query(
      `INSERT INTO messages 
      (sessionId, senderId, content) 
      VALUES (?, ?, ?)`,
      [
        messageData.sessionId,
        messageData.senderId,
        messageData.content
      ]
    );
    return result.insertId;
  }

  // Get all messages
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM messages ORDER BY createdAt DESC");
    return rows;
  }

  // Get message by ID
  static async getById(id) {
    const [rows] = await db.query(
      "SELECT * FROM messages WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  // Get messages by session ID
  static async getBySessionId(sessionId) {
    const [rows] = await db.query(
      "SELECT * FROM messages WHERE sessionId = ? ORDER BY createdAt ASC",
      [sessionId]
    );
    return rows;
  }

  // Update a message
  static async update(id, messageData) {
    const fields = [];
    const values = [];

    // Build dynamic query based on provided fields
    Object.keys(messageData).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(messageData[key]);
    });

    values.push(id);

    const [result] = await db.query(
      `UPDATE messages SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  // Mark message as read
  static async markAsRead(id) {
    const [result] = await db.query(
      "UPDATE messages SET is_read = TRUE WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  // Mark all messages in a session as read for a user
  static async markSessionMessagesAsRead(sessionId, userId) {
    const [result] = await db.query(
      "UPDATE messages SET is_read = TRUE WHERE sessionId = ? AND senderId != ? AND is_read = FALSE",
      [sessionId, userId]
    );
    return result.affectedRows;
  }

  // Delete a message
  static async delete(id) {
    const [result] = await db.query(
      "DELETE FROM messages WHERE id = ?", 
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Message;

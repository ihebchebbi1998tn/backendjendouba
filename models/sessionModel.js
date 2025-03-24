
const db = require("../config/db");
const User = require("./userModel");
const Message = require("./messageModel");

class Session {
  // Create a new session
  static async create(sessionData) {
    const [result] = await db.query(
      `INSERT INTO sessions 
      (userId1, userId2, isActive) 
      VALUES (?, ?, ?)`,
      [
        sessionData.userId1,
        sessionData.userId2,
        sessionData.isActive !== undefined ? sessionData.isActive : true
      ]
    );
    return result.insertId;
  }

  // Get all sessions for a user
  static async getAllForUser(userId) {
    const [rows] = await db.query(
      `SELECT s.*, 
        (SELECT m.content FROM messages m WHERE m.sessionId = s.id ORDER BY m.createdAt DESC LIMIT 1) as lastMessageContent,
        (SELECT m.senderId FROM messages m WHERE m.sessionId = s.id ORDER BY m.createdAt DESC LIMIT 1) as lastMessageSenderId,
        (SELECT m.createdAt FROM messages m WHERE m.sessionId = s.id ORDER BY m.createdAt DESC LIMIT 1) as lastMessageCreatedAt
       FROM sessions s
       WHERE s.userId1 = ? OR s.userId2 = ?
       ORDER BY s.lastMessageAt DESC, s.createdAt DESC`,
      [userId, userId]
    );

    // Enhance sessions with user information
    const enhancedSessions = await Promise.all(rows.map(async (session) => {
      const otherUserId = session.userId1 === parseInt(userId) ? session.userId2 : session.userId1;
      const user = await User.findById(otherUserId);
      
      return {
        ...session,
        user: user ? {
          id: user.id,
          name: user.name,
          email: user.email
        } : null,
        lastMessage: session.lastMessageContent ? {
          content: session.lastMessageContent,
          senderId: session.lastMessageSenderId,
          createdAt: session.lastMessageCreatedAt
        } : null
      };
    }));

    return enhancedSessions;
  }

  // Get session by ID with messages
  static async getById(id, includeMessages = true) {
    const [rows] = await db.query(
      "SELECT * FROM sessions WHERE id = ?",
      [id]
    );
    
    if (rows.length === 0) {
      return null;
    }

    const session = rows[0];
    
    // Get user details
    const user1 = await User.findById(session.userId1);
    const user2 = await User.findById(session.userId2);
    
    if (!user1 || !user2) {
      return null;
    }
    
    const result = {
      ...session,
      user1: {
        id: user1.id,
        name: user1.name,
        email: user1.email
      },
      user2: {
        id: user2.id,
        name: user2.name,
        email: user2.email
      }
    };

    // Include messages if requested
    if (includeMessages) {
      const messages = await Message.getBySessionId(id);
      result.messages = messages;
    }

    return result;
  }

  // Check if a session exists between two users
  static async findBetweenUsers(userId1, userId2) {
    const [rows] = await db.query(
      `SELECT * FROM sessions 
       WHERE (userId1 = ? AND userId2 = ?) OR (userId1 = ? AND userId2 = ?)
       LIMIT 1`,
      [userId1, userId2, userId2, userId1]
    );
    return rows[0];
  }

  // Update a session
  static async update(id, sessionData) {
    const fields = [];
    const values = [];

    // Build dynamic query based on provided fields
    Object.keys(sessionData).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(sessionData[key]);
    });

    values.push(id);

    const [result] = await db.query(
      `UPDATE sessions SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  // Delete a session
  static async delete(id) {
    const [result] = await db.query(
      "DELETE FROM sessions WHERE id = ?", 
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Session;

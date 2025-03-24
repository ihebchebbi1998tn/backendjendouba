
const db = require("../config/db");

class Event {
  // Get all events with optional filters
  static async getAll(filters = {}) {
    let query = "SELECT * FROM events WHERE 1=1";
    const params = [];

    // Filter by location
    if (filters.location) {
      query += " AND location LIKE ?";
      params.push(`%${filters.location}%`);
    }

    // Filter by organizer
    if (filters.organizer) {
      query += " AND organizer = ?";
      params.push(filters.organizer);
    }

    // Filter by date range
    if (filters.startDate) {
      query += " AND startDate >= ?";
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += " AND endDate <= ?";
      params.push(filters.endDate);
    }

    // Sort by start date
    query += " ORDER BY startDate ASC";

    const [rows] = await db.query(query, params);
    return rows;
  }

  // Get an event by its ID
  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
    return rows[0];
  }

  // Create a new event
  static async create(eventData) {
    const [result] = await db.query(
      `INSERT INTO events 
      (title, description, startDate, endDate, location, organizer, ticketPrice, capacity, images)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        eventData.title,
        eventData.description,
        eventData.startDate,
        eventData.endDate,
        eventData.location,
        eventData.organizer || null,
        eventData.ticketPrice || null,
        eventData.capacity || null,
        JSON.stringify(eventData.images || []),
      ]
    );
    return result.insertId;
  }

  // Update an existing event
  static async update(id, updates) {
    // If images is provided, ensure it's stored as JSON
    if (updates.images) {
      updates.images = JSON.stringify(updates.images);
    }

    const fields = Object.keys(updates).join(" = ?, ") + " = ?";
    const values = Object.values(updates);

    await db.query(`UPDATE events SET ${fields} WHERE id = ?`, [
      ...values,
      id,
    ]);
  }

  // Delete an event
  static async delete(id) {
    await db.query("DELETE FROM events WHERE id = ?", [id]);
  }

  // Get upcoming events
  static async getUpcomingEvents(limit = 10) {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [rows] = await db.query(
      `SELECT * FROM events 
      WHERE startDate > ? 
      ORDER BY startDate ASC LIMIT ?`,
      [now, limit]
    );
    return rows;
  }
}

module.exports = Event;

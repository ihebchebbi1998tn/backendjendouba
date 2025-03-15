
const db = require("../config/db");

class Event {
  // Récupérer tous les événements avec filtres optionnels
  static async getAll(filters = {}) {
    let query = "SELECT * FROM events WHERE 1=1";
    const params = [];

    // Filtre par lieu
    if (filters.place_id) {
      query += " AND place_id = ?";
      params.push(filters.place_id);
    }

    // Filtre par statut
    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    // Filtre par créateur
    if (filters.created_by) {
      query += " AND created_by = ?";
      params.push(filters.created_by);
    }

    // Filtre par plage de dates
    if (filters.start_date) {
      query += " AND start_date >= ?";
      params.push(filters.start_date);
    }

    if (filters.end_date) {
      query += " AND end_date <= ?";
      params.push(filters.end_date);
    }

    // Tri par date de début
    query += " ORDER BY start_date ASC";

    const [rows] = await db.query(query, params);
    return rows;
  }

  // Récupérer un événement par son ID
  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM events WHERE event_id = ?", [id]);
    return rows[0];
  }

  // Créer un nouvel événement
  static async create(eventData) {
    const [result] = await db.query(
      `INSERT INTO events 
      (title, description, place_id, start_date, end_date, image_url, price, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        eventData.title,
        eventData.description,
        eventData.place_id,
        eventData.start_date,
        eventData.end_date,
        eventData.image_url,
        eventData.price,
        eventData.status || 'upcoming',
        eventData.created_by,
      ]
    );
    return result.insertId;
  }

  // Mettre à jour un événement existant
  static async update(id, updates) {
    const fields = Object.keys(updates).join(" = ?, ") + " = ?";
    const values = Object.values(updates);

    await db.query(`UPDATE events SET ${fields} WHERE event_id = ?`, [
      ...values,
      id,
    ]);
  }

  // Supprimer un événement
  static async delete(id) {
    await db.query("DELETE FROM events WHERE event_id = ?", [id]);
  }

  // Récupérer les événements à venir
  static async getUpcomingEvents(limit = 10) {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [rows] = await db.query(
      `SELECT * FROM events 
      WHERE start_date > ? AND status = 'upcoming' 
      ORDER BY start_date ASC LIMIT ?`,
      [now, limit]
    );
    return rows;
  }
}

module.exports = Event;

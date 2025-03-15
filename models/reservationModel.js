
const db = require("../config/db");

class Reservation {
  // Récupérer toutes les réservations avec filtres optionnels
  static async getAll(filters = {}) {
    let query = "SELECT * FROM reservations WHERE 1=1";
    const params = [];

    // Filtre par utilisateur
    if (filters.user_id) {
      query += " AND user_id = ?";
      params.push(filters.user_id);
    }

    // Filtre par lieu
    if (filters.place_id) {
      query += " AND place_id = ?";
      params.push(filters.place_id);
    }

    // Filtre par événement
    if (filters.event_id) {
      query += " AND event_id = ?";
      params.push(filters.event_id);
    }

    // Filtre par statut
    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    // Filtre par plage de dates
    if (filters.from_date) {
      query += " AND reservation_date >= ?";
      params.push(filters.from_date);
    }

    if (filters.to_date) {
      query += " AND reservation_date <= ?";
      params.push(filters.to_date);
    }

    // Tri par date et heure de réservation
    query += " ORDER BY reservation_date ASC, start_time ASC";

    const [rows] = await db.query(query, params);
    return rows;
  }

  // Récupérer une réservation par son ID
  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM reservations WHERE reservation_id = ?", [id]);
    return rows[0];
  }

  // Créer une nouvelle réservation
  static async create(reservationData) {
    const [result] = await db.query(
      `INSERT INTO reservations 
      (user_id, place_id, event_id, reservation_date, start_time, end_time, num_guests, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reservationData.user_id,
        reservationData.place_id,
        reservationData.event_id || null,
        reservationData.reservation_date,
        reservationData.start_time,
        reservationData.end_time || null,
        reservationData.num_guests || 1,
        reservationData.status || 'pending',
        reservationData.notes || null,
      ]
    );
    return result.insertId;
  }

  // Mettre à jour une réservation existante
  static async update(id, updates) {
    const fields = Object.keys(updates).join(" = ?, ") + " = ?";
    const values = Object.values(updates);

    await db.query(`UPDATE reservations SET ${fields} WHERE reservation_id = ?`, [
      ...values,
      id,
    ]);
  }

  // Supprimer une réservation
  static async delete(id) {
    await db.query("DELETE FROM reservations WHERE reservation_id = ?", [id]);
  }

  // Vérifier la disponibilité d'un créneau horaire
  static async checkAvailability(placeId, date, startTime, endTime = null) {
    let query = `
      SELECT COUNT(*) as count FROM reservations 
      WHERE place_id = ? AND reservation_date = ? 
      AND status IN ('pending', 'confirmed')
    `;
    const params = [placeId, date];

    if (endTime) {
      query += ` AND ((start_time <= ? AND end_time >= ?) OR (start_time >= ? AND start_time <= ?))`;
      params.push(endTime, startTime, startTime, endTime);
    } else {
      query += ` AND start_time = ?`;
      params.push(startTime);
    }

    const [rows] = await db.query(query, params);
    return rows[0].count === 0; // True si disponible
  }
}

module.exports = Reservation;

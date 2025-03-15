
const db = require("../config/db");

class Review {
  // Récupérer tous les avis avec filtres optionnels
  static async getAll(filters = {}) {
    let query = "SELECT * FROM reviews WHERE 1=1";
    const params = [];

    // Filtre par lieu
    if (filters.place_id) {
      query += " AND place_id = ?";
      params.push(filters.place_id);
    }

    // Filtre par utilisateur
    if (filters.user_id) {
      query += " AND user_id = ?";
      params.push(filters.user_id);
    }

    // Filtre par statut
    if (filters.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }

    // Tri par date de création (décroissant)
    query += " ORDER BY created_at DESC";

    const [rows] = await db.query(query, params);
    return rows;
  }

  // Récupérer un avis par son ID
  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM reviews WHERE review_id = ?", [id]);
    return rows[0];
  }

  // Créer un nouvel avis
  static async create(reviewData) {
    const [result] = await db.query(
      `INSERT INTO reviews 
      (place_id, user_id, rating, comment, status)
      VALUES (?, ?, ?, ?, ?)`,
      [
        reviewData.place_id,
        reviewData.user_id,
        reviewData.rating,
        reviewData.comment,
        reviewData.status || 'pending',
      ]
    );
    return result.insertId;
  }

  // Mettre à jour un avis existant
  static async update(id, updates) {
    const fields = Object.keys(updates).join(" = ?, ") + " = ?";
    const values = Object.values(updates);

    await db.query(`UPDATE reviews SET ${fields} WHERE review_id = ?`, [
      ...values,
      id,
    ]);
  }

  // Supprimer un avis
  static async delete(id) {
    await db.query("DELETE FROM reviews WHERE review_id = ?", [id]);
  }

  // Calculer la note moyenne pour un lieu
  static async getAverageRatingForPlace(placeId) {
    const [rows] = await db.query(
      "SELECT AVG(rating) as average_rating FROM reviews WHERE place_id = ? AND status = 'approved'",
      [placeId]
    );
    return rows[0]?.average_rating || 0;
  }
}

module.exports = Review;

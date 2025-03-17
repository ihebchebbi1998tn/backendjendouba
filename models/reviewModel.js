
const db = require("../config/db");

class Review {
  // Get all reviews with optional filters
  static async getAll(filters = {}) {
    let query = "SELECT * FROM reviews WHERE 1=1";
    const params = [];

    // Filter by place
    if (filters.placeId) {
      query += " AND placeId = ?";
      params.push(filters.placeId);
    }

    // Filter by user
    if (filters.userId) {
      query += " AND userId = ?";
      params.push(filters.userId);
    }

    // Order by creation date (descending)
    query += " ORDER BY createdAt DESC";

    const [rows] = await db.query(query, params);
    return rows;
  }

  // Get a review by its ID
  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM reviews WHERE id = ?", [id]);
    return rows[0];
  }

  // Create a new review
  static async create(reviewData) {
    const [result] = await db.query(
      `INSERT INTO reviews 
      (userId, placeId, rating, comment, createdAt)
      VALUES (?, ?, ?, ?, NOW())`,
      [
        reviewData.userId,
        reviewData.placeId,
        reviewData.rating,
        reviewData.comment
      ]
    );
    return result.insertId;
  }

  // Update an existing review
  static async update(id, updates) {
    updates.updatedAt = new Date(); // Add the updatedAt timestamp
    
    const fields = Object.keys(updates).join(" = ?, ") + " = ?";
    const values = Object.values(updates);

    await db.query(`UPDATE reviews SET ${fields} WHERE id = ?`, [
      ...values,
      id,
    ]);
  }

  // Delete a review
  static async delete(id) {
    await db.query("DELETE FROM reviews WHERE id = ?", [id]);
  }

  // Calculate average rating for a place
  static async getAverageRatingForPlace(placeId) {
    const [rows] = await db.query(
      "SELECT AVG(rating) as average_rating FROM reviews WHERE placeId = ?",
      [placeId]
    );
    return rows[0]?.average_rating || 0;
  }
}

module.exports = Review;

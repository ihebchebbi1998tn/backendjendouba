
const db = require("../config/db");

class Place {
  // Get all places
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM places ORDER BY createdAt DESC");
    return rows;
  }

  // Get a place by its ID
  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM places WHERE id = ?", [id]);
    return rows[0];
  }

  // Create a new place
  static async create(placeData) {
    // Convert objects and arrays to JSON strings for storage
    const location = JSON.stringify(placeData.location || {});
    const images = JSON.stringify(placeData.images || []);
    const openingHours = JSON.stringify(placeData.openingHours || {});
    const entranceFee = JSON.stringify(placeData.entranceFee || {});

    const [result] = await db.query(
      `INSERT INTO places 
      (name, type, description, location, images, openingHours, entranceFee)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        placeData.name,
        placeData.type,
        placeData.description,
        location,
        images,
        openingHours,
        entranceFee
      ]
    );
    
    return result.insertId;
  }

  // Update an existing place
  static async update(id, updates) {
    // Prepare the updates, converting objects and arrays to JSON as needed
    const updateData = { ...updates };
    
    if (updates.location) {
      updateData.location = JSON.stringify(updates.location);
    }
    
    if (updates.images) {
      updateData.images = JSON.stringify(updates.images);
    }
    
    if (updates.openingHours) {
      updateData.openingHours = JSON.stringify(updates.openingHours);
    }
    
    if (updates.entranceFee) {
      updateData.entranceFee = JSON.stringify(updates.entranceFee);
    }

    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateData), id];

    const [result] = await db.query(`UPDATE places SET ${fields} WHERE id = ?`, values);
    return result.affectedRows > 0;
  }

  // Delete a place
  static async delete(id) {
    const [result] = await db.query("DELETE FROM places WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Place;

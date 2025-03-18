
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

  // Search places with filters
  static async search(filters) {
    let query = "SELECT * FROM places WHERE 1=1";
    const params = [];

    if (filters.type) {
      query += " AND type = ?";
      params.push(filters.type);
    }

    if (filters.name) {
      query += " AND name LIKE ?";
      params.push(`%${filters.name}%`);
    }

    if (filters.region) {
      query += " AND JSON_EXTRACT(location, '$.region') = ?";
      params.push(filters.region);
    }

    if (filters.near) {
      // Add haversine formula to calculate distance
      const [lat, lng] = filters.near.split(',').map(Number);
      const radius = filters.radius || 10; // Default 10km radius
      
      query = `
        SELECT *, 
        (6371 * acos(cos(radians(?)) * cos(radians(JSON_EXTRACT(location, '$.latitude'))) * 
        cos(radians(JSON_EXTRACT(location, '$.longitude')) - radians(?)) + 
        sin(radians(?)) * sin(radians(JSON_EXTRACT(location, '$.latitude'))))) AS distance 
        FROM places 
        HAVING distance < ? 
        ORDER BY distance
      `;
      
      params.push(lat, lng, lat, radius);
    } else {
      // Default sorting
      query += " ORDER BY createdAt DESC";
    }

    // Add limit if specified
    if (filters.limit) {
      query += " LIMIT ?";
      params.push(parseInt(filters.limit));
    }

    const [rows] = await db.query(query, params);
    return rows;
  }

  // Get places by region
  static async getByRegion(region) {
    const [rows] = await db.query(
      "SELECT * FROM places WHERE JSON_EXTRACT(location, '$.region') = ? ORDER BY createdAt DESC", 
      [region]
    );
    return rows;
  }

  // Get popular places (by rating or visit count)
  static async getPopular(limit = 10) {
    const [rows] = await db.query(
      "SELECT * FROM places ORDER BY average_rating DESC LIMIT ?", 
      [limit]
    );
    return rows;
  }

  // Get places by provider
  static async getByProviderId(providerId) {
    const [rows] = await db.query(
      "SELECT * FROM places WHERE provider_id = ? ORDER BY createdAt DESC", 
      [providerId]
    );
    return rows;
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
      (name, type, description, location, images, openingHours, entranceFee, provider_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        placeData.name,
        placeData.type,
        placeData.description,
        location,
        images,
        openingHours,
        entranceFee,
        placeData.provider_id || null
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

  // Get all places owned by a provider
  static async getAllByProvider(providerId) {
    const [rows] = await db.query(
      "SELECT * FROM places WHERE provider_id = ?", 
      [providerId]
    );
    return rows;
  }
}

module.exports = Place;

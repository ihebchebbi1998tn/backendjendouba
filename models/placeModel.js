const db = require("../config/db");

class Place {
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM places");
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM places WHERE place_id = ?", [
      id,
    ]);
    return rows[0];
  }

  static async create(placeData) {
    const [result] = await db.query(
      `INSERT INTO places 
      (nom_place, description, location, longitude, latitude, url_img, url_web)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        placeData.nom_place,
        placeData.description,
        placeData.location,
        placeData.longitude,
        placeData.latitude,
        placeData.url_img,
        placeData.url_web,
      ]
    );
    return result.insertId;
  }

  static async update(id, updates) {
    const fields = Object.keys(updates).join(" = ?, ") + " = ?";
    const values = Object.values(updates);

    await db.query(`UPDATE places SET ${fields} WHERE place_id = ?`, [
      ...values,
      id,
    ]);
  }

  static async delete(id) {
    await db.query("DELETE FROM places WHERE place_id = ?", [id]);
  }
}

module.exports = Place;

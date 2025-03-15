
const db = require("../config/db");

class Place {
  // Récupérer tous les lieux
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM places ORDER BY created_at DESC");
    return rows;
  }

  // Récupérer un lieu par son ID
  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM places WHERE place_id = ?", [
      id,
    ]);
    return rows[0];
  }

  // Rechercher des lieux avec différents critères
  static async search(searchParams) {
    let query = "SELECT * FROM places WHERE 1=1";
    const params = [];

    // Filtre par catégorie
    if (searchParams.category) {
      query += " AND category = ?";
      params.push(searchParams.category);
    }

    // Recherche par mot-clé (nom ou description)
    if (searchParams.keyword) {
      query += " AND (nom_place LIKE ? OR description LIKE ? OR location LIKE ?)";
      const searchTerm = `%${searchParams.keyword}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Filtre par région ou ville
    if (searchParams.location) {
      query += " AND location LIKE ?";
      params.push(`%${searchParams.location}%`);
    }

    // Recherche par proximité (rayon en kilomètres)
    if (searchParams.near) {
      // Formule haversine pour calculer la distance en kilomètres
      const [lat, lng, distance] = searchParams.near.split(',').map(Number);
      query = `
        SELECT *, 
        (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance 
        FROM places 
        HAVING distance < ? 
        ORDER BY distance
      `;
      params.push(lat, lng, lat, distance || 10); // Rayon par défaut de 10km
    }

    // Filtre par fournisseur
    if (searchParams.provider_id) {
      query += " AND provider_id = ?";
      params.push(searchParams.provider_id);
    }

    // Filtre par notes minimales
    if (searchParams.rating) {
      query += " AND average_rating >= ?";
      params.push(parseFloat(searchParams.rating));
    }

    // Options de tri
    if (searchParams.sort) {
      switch (searchParams.sort) {
        case 'rating':
          query += " ORDER BY average_rating DESC";
          break;
        case 'name':
          query += " ORDER BY nom_place ASC";
          break;
        case 'newest':
          query += " ORDER BY created_at DESC";
          break;
        case 'popular':
          // Assuming we could add a 'visit_count' column in the future
          query += " ORDER BY average_rating DESC, created_at DESC";
          break;
        default:
          // Tri par défaut par distance si recherche par proximité
          if (!searchParams.near) {
            query += " ORDER BY nom_place ASC";
          }
      }
    } else if (!searchParams.near) {
      // Tri par défaut si pas de recherche par proximité
      query += " ORDER BY created_at DESC";
    }

    // Pagination
    if (searchParams.limit) {
      const limit = parseInt(searchParams.limit) || 20;
      const page = parseInt(searchParams.page) || 1;
      const offset = (page - 1) * limit;
      
      query += " LIMIT ? OFFSET ?";
      params.push(limit, offset);
    }

    const [rows] = await db.query(query, params);
    return rows;
  }

  // Récupérer les lieux par région
  static async getByRegion(region) {
    const [rows] = await db.query("SELECT * FROM places WHERE location LIKE ?", [`%${region}%`]);
    return rows;
  }

  // Récupérer les lieux populaires (par notes)
  static async getPopular(limit = 10) {
    const [rows] = await db.query("SELECT * FROM places ORDER BY average_rating DESC LIMIT ?", [limit]);
    return rows;
  }

  // Créer un nouveau lieu
  static async create(placeData) {
    const [result] = await db.query(
      `INSERT INTO places 
      (nom_place, description, location, longitude, latitude, url_img, url_web, category, provider_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        placeData.nom_place,
        placeData.description,
        placeData.location,
        placeData.longitude,
        placeData.latitude,
        placeData.url_img,
        placeData.url_web,
        placeData.category || 'museums',
        placeData.provider_id || null,
      ]
    );
    return result.insertId;
  }

  // Mettre à jour un lieu existant
  static async update(id, updates) {
    const fields = Object.keys(updates).join(" = ?, ") + " = ?";
    const values = Object.values(updates);

    await db.query(`UPDATE places SET ${fields} WHERE place_id = ?`, [
      ...values,
      id,
    ]);
  }

  // Supprimer un lieu
  static async delete(id) {
    await db.query("DELETE FROM places WHERE place_id = ?", [id]);
  }

  // Récupérer les lieux d'un fournisseur
  static async getByProviderId(providerId) {
    const [rows] = await db.query("SELECT * FROM places WHERE provider_id = ?", [providerId]);
    return rows;
  }
}

module.exports = Place;

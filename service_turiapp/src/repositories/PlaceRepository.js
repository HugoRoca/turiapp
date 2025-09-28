const BaseRepository = require('./BaseRepository');

class PlaceRepository extends BaseRepository {
  constructor() {
    super('places');
  }

  async findNearbyPlaces(latitude, longitude, radiusKm, limit = 20) {
    const sql = `
      CALL FindNearbyPlaces(?, ?, ?, ?)
    `;
    return this.query(sql, [latitude, longitude, radiusKm, limit]);
  }

  async getPopularPlaces(limit = 10, categoryId = null) {
    const sql = `
      CALL GetPopularPlaces(?, ?)
    `;
    return this.query(sql, [limit, categoryId]);
  }

  async getPlaceStats(placeId) {
    const sql = `
      CALL GetPlaceStats(?)
    `;
    const results = await this.query(sql, [placeId]);
    return results.length > 0 ? results[0] : null;
  }

  async findPlacesByCategory(categoryId, limit = 20, offset = 0) {
    const sql = `
      SELECT DISTINCT p.*, 
             ST_X(p.coordinates) as latitude,
             ST_Y(p.coordinates) as longitude,
             GROUP_CONCAT(c.name SEPARATOR ', ') as categories
      FROM places p
      JOIN place_categories pc ON p.id = pc.place_id
      JOIN categories c ON pc.category_id = c.id
      WHERE pc.category_id = ? AND p.is_active = TRUE
      GROUP BY p.id
      ORDER BY p.is_featured DESC, p.average_rating DESC, p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [categoryId, limit, offset]);
  }

  async searchPlaces(searchTerm, limit = 20, offset = 0) {
    const sql = `
      SELECT p.*, 
             ST_X(p.coordinates) as latitude,
             ST_Y(p.coordinates) as longitude,
             GROUP_CONCAT(c.name SEPARATOR ', ') as categories
      FROM places p
      LEFT JOIN place_categories pc ON p.id = pc.place_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.is_active = TRUE 
      AND (p.name LIKE ? OR p.description LIKE ? OR p.short_description LIKE ?)
      GROUP BY p.id
      ORDER BY p.is_featured DESC, p.average_rating DESC
      LIMIT ? OFFSET ?
    `;
    const searchPattern = `%${searchTerm}%`;
    return this.query(sql, [searchPattern, searchPattern, searchPattern, limit, offset]);
  }

  async findFeaturedPlaces(limit = 10) {
    const sql = `
      SELECT p.*, 
             ST_X(p.coordinates) as latitude,
             ST_Y(p.coordinates) as longitude,
             GROUP_CONCAT(c.name SEPARATOR ', ') as categories
      FROM places p
      LEFT JOIN place_categories pc ON p.id = pc.place_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.is_active = TRUE AND p.is_featured = TRUE
      GROUP BY p.id
      ORDER BY p.average_rating DESC, p.total_reviews DESC
      LIMIT ?
    `;
    return this.query(sql, [limit]);
  }

  async findVerifiedPlaces(limit = 20, offset = 0) {
    const sql = `
      SELECT p.*, 
             ST_X(p.coordinates) as latitude,
             ST_Y(p.coordinates) as longitude,
             GROUP_CONCAT(c.name SEPARATOR ', ') as categories
      FROM places p
      LEFT JOIN place_categories pc ON p.id = pc.place_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.is_active = TRUE AND p.is_verified = TRUE
      GROUP BY p.id
      ORDER BY p.average_rating DESC, p.total_reviews DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [limit, offset]);
  }

  async getPlacesByPriceRange(priceRange, limit = 20, offset = 0) {
    const sql = `
      SELECT p.*, 
             ST_X(p.coordinates) as latitude,
             ST_Y(p.coordinates) as longitude,
             GROUP_CONCAT(c.name SEPARATOR ', ') as categories
      FROM places p
      LEFT JOIN place_categories pc ON p.id = pc.place_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.is_active = TRUE AND p.price_range = ?
      GROUP BY p.id
      ORDER BY p.average_rating DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [priceRange, limit, offset]);
  }

  async addCategoryToPlace(placeId, categoryId) {
    const sql = `
      INSERT IGNORE INTO place_categories (place_id, category_id) 
      VALUES (?, ?)
    `;
    const result = await this.query(sql, [placeId, categoryId]);
    return result.affectedRows > 0;
  }

  async removeCategoryFromPlace(placeId, categoryId) {
    const sql = `
      DELETE FROM place_categories 
      WHERE place_id = ? AND category_id = ?
    `;
    const result = await this.query(sql, [placeId, categoryId]);
    return result.affectedRows > 0;
  }

  async getPlaceCategories(placeId) {
    const sql = `
      SELECT c.* 
      FROM categories c
      JOIN place_categories pc ON c.id = pc.category_id
      WHERE pc.place_id = ? AND c.is_active = TRUE
      ORDER BY c.sort_order, c.name
    `;
    return this.query(sql, [placeId]);
  }

  async incrementVisitCount(placeId) {
    const sql = `
      UPDATE places 
      SET total_visits = total_visits + 1 
      WHERE id = ?
    `;
    const result = await this.query(sql, [placeId]);
    return result.affectedRows > 0;
  }

  async createPlaceWithCategories(placeData, categoryIds = []) {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insertar el lugar
      const placeColumns = Object.keys(placeData).join(', ');
      const placePlaceholders = Object.keys(placeData).map(() => '?').join(', ');
      const placeValues = Object.values(placeData);

      const placeSql = `INSERT INTO places (${placeColumns}) VALUES (${placePlaceholders})`;
      const [placeResult] = await connection.execute(placeSql, placeValues);
      const placeId = placeResult.insertId;

      // Insertar las categorías si se proporcionan
      if (categoryIds.length > 0) {
        const categorySql = `
          INSERT INTO place_categories (place_id, category_id) 
          VALUES ${categoryIds.map(() => '(?, ?)').join(', ')}
        `;
        const categoryValues = categoryIds.flatMap((categoryId) => [placeId, categoryId]);
        await connection.execute(categorySql, categoryValues);
      }

      await connection.commit();
      return placeId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updatePlaceWithCategories(placeId, placeData, categoryIds = null) {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      // Actualizar el lugar
      if (Object.keys(placeData).length > 0) {
        const placeColumns = Object.keys(placeData).map((key) => `${key} = ?`).join(', ');
        const placeValues = [...Object.values(placeData), placeId];

        const placeSql = `UPDATE places SET ${placeColumns} WHERE id = ?`;
        await connection.execute(placeSql, placeValues);
      }

      // Actualizar las categorías si se proporcionan
      if (categoryIds !== null) {
        // Eliminar categorías existentes
        await connection.execute('DELETE FROM place_categories WHERE place_id = ?', [placeId]);

        // Insertar nuevas categorías
        if (categoryIds.length > 0) {
          const categorySql = `
            INSERT INTO place_categories (place_id, category_id) 
            VALUES ${categoryIds.map(() => '(?, ?)').join(', ')}
          `;
          const categoryValues = categoryIds.flatMap((categoryId) => [placeId, categoryId]);
          await connection.execute(categorySql, categoryValues);
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = PlaceRepository;

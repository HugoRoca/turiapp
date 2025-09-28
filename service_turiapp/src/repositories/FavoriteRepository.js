const BaseRepository = require('./BaseRepository');

class FavoriteRepository extends BaseRepository {
  constructor() {
    super('favorites');
  }

  async addFavorite(userId, placeId) {
    const sql = `
      INSERT IGNORE INTO favorites (user_id, place_id)
      VALUES (?, ?)
    `;
    const result = await this.query(sql, [userId, placeId]);
    return result.affectedRows > 0;
  }

  async removeFavorite(userId, placeId) {
    const sql = `
      DELETE FROM favorites 
      WHERE user_id = ? AND place_id = ?
    `;
    const result = await this.query(sql, [userId, placeId]);
    return result.affectedRows > 0;
  }

  async isFavorite(userId, placeId) {
    const sql = `
      SELECT COUNT(*) as count
      FROM favorites
      WHERE user_id = ? AND place_id = ?
    `;
    const results = await this.query(sql, [userId, placeId]);
    return results[0].count > 0;
  }

  async getUserFavorites(userId, limit = 20, offset = 0) {
    const sql = `
      SELECT 
        f.*,
        p.name as place_name,
        p.short_description,
        p.address,
        ST_X(p.coordinates) as latitude,
        ST_Y(p.coordinates) as longitude,
        p.phone,
        p.email,
        p.website,
        p.price_range,
        p.average_rating,
        p.total_reviews,
        p.is_verified,
        p.is_featured,
        p.images,
        GROUP_CONCAT(c.name SEPARATOR ', ') as categories
      FROM favorites f
      JOIN places p ON f.place_id = p.id
      LEFT JOIN place_categories pc ON p.id = pc.place_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE f.user_id = ? AND p.is_active = TRUE
      GROUP BY f.id
      ORDER BY f.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [userId, limit, offset]);
  }

  async getPlaceFavorites(placeId, limit = 20, offset = 0) {
    const sql = `
      SELECT 
        f.*,
        u.username,
        u.first_name,
        u.last_name,
        u.avatar_url,
        u.is_verified
      FROM favorites f
      JOIN users u ON f.user_id = u.id
      WHERE f.place_id = ? AND u.is_active = TRUE
      ORDER BY f.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [placeId, limit, offset]);
  }

  async getUserFavoriteCount(userId) {
    const sql = `
      SELECT COUNT(*) as favorite_count
      FROM favorites f
      JOIN places p ON f.place_id = p.id
      WHERE f.user_id = ? AND p.is_active = TRUE
    `;
    const results = await this.query(sql, [userId]);
    return results[0].favorite_count;
  }

  async getPlaceFavoriteCount(placeId) {
    const sql = `
      SELECT COUNT(*) as favorite_count
      FROM favorites
      WHERE place_id = ?
    `;
    const results = await this.query(sql, [placeId]);
    return results[0].favorite_count;
  }

  async getUserFavoritesByCategory(userId, categoryId, limit = 20, offset = 0) {
    const sql = `
      SELECT 
        f.*,
        p.name as place_name,
        p.short_description,
        p.address,
        ST_X(p.coordinates) as latitude,
        ST_Y(p.coordinates) as longitude,
        p.phone,
        p.email,
        p.website,
        p.price_range,
        p.average_rating,
        p.total_reviews,
        p.is_verified,
        p.is_featured,
        p.images,
        GROUP_CONCAT(c.name SEPARATOR ', ') as categories
      FROM favorites f
      JOIN places p ON f.place_id = p.id
      JOIN place_categories pc ON p.id = pc.place_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE f.user_id = ? AND pc.category_id = ? AND p.is_active = TRUE
      GROUP BY f.id
      ORDER BY f.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [userId, categoryId, limit, offset]);
  }

  async getUserFavoritesByPriceRange(userId, priceRange, limit = 20, offset = 0) {
    const sql = `
      SELECT 
        f.*,
        p.name as place_name,
        p.short_description,
        p.address,
        ST_X(p.coordinates) as latitude,
        ST_Y(p.coordinates) as longitude,
        p.phone,
        p.email,
        p.website,
        p.price_range,
        p.average_rating,
        p.total_reviews,
        p.is_verified,
        p.is_featured,
        p.images,
        GROUP_CONCAT(c.name SEPARATOR ', ') as categories
      FROM favorites f
      JOIN places p ON f.place_id = p.id
      LEFT JOIN place_categories pc ON p.id = pc.place_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE f.user_id = ? AND p.price_range = ? AND p.is_active = TRUE
      GROUP BY f.id
      ORDER BY f.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [userId, priceRange, limit, offset]);
  }

  async searchUserFavorites(userId, searchTerm, limit = 20, offset = 0) {
    const sql = `
      SELECT 
        f.*,
        p.name as place_name,
        p.short_description,
        p.address,
        ST_X(p.coordinates) as latitude,
        ST_Y(p.coordinates) as longitude,
        p.phone,
        p.email,
        p.website,
        p.price_range,
        p.average_rating,
        p.total_reviews,
        p.is_verified,
        p.is_featured,
        p.images,
        GROUP_CONCAT(c.name SEPARATOR ', ') as categories
      FROM favorites f
      JOIN places p ON f.place_id = p.id
      LEFT JOIN place_categories pc ON p.id = pc.place_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE f.user_id = ? AND p.is_active = TRUE
      AND (p.name LIKE ? OR p.short_description LIKE ? OR p.address LIKE ?)
      GROUP BY f.id
      ORDER BY f.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const searchPattern = `%${searchTerm}%`;
    return this.query(sql, [userId, searchPattern, searchPattern, searchPattern, limit, offset]);
  }

  async getMostFavoritedPlaces(limit = 20, offset = 0) {
    const sql = `
      SELECT 
        p.id,
        p.name,
        p.short_description,
        p.address,
        ST_X(p.coordinates) as latitude,
        ST_Y(p.coordinates) as longitude,
        p.average_rating,
        p.total_reviews,
        p.is_verified,
        p.is_featured,
        COUNT(f.id) as favorite_count,
        GROUP_CONCAT(c.name SEPARATOR ', ') as categories
      FROM places p
      JOIN favorites f ON p.id = f.place_id
      LEFT JOIN place_categories pc ON p.id = pc.place_id
      LEFT JOIN categories c ON pc.category_id = c.id
      WHERE p.is_active = TRUE
      GROUP BY p.id
      ORDER BY favorite_count DESC, p.average_rating DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [limit, offset]);
  }

  async getUserFavoriteStats(userId) {
    const sql = `
      SELECT 
        COUNT(DISTINCT f.id) as total_favorites,
        COUNT(DISTINCT pc.category_id) as favorite_categories,
        AVG(p.average_rating) as avg_rating_of_favorites,
        COUNT(DISTINCT CASE WHEN p.price_range = 'free' THEN p.id END) as free_favorites,
        COUNT(DISTINCT CASE WHEN p.price_range = 'low' THEN p.id END) as low_price_favorites,
        COUNT(DISTINCT CASE WHEN p.price_range = 'medium' THEN p.id END) as medium_price_favorites,
        COUNT(DISTINCT CASE WHEN p.price_range = 'high' THEN p.id END) as high_price_favorites,
        COUNT(DISTINCT CASE WHEN p.price_range = 'luxury' THEN p.id END) as luxury_favorites
      FROM favorites f
      JOIN places p ON f.place_id = p.id
      LEFT JOIN place_categories pc ON p.id = pc.place_id
      WHERE f.user_id = ? AND p.is_active = TRUE
    `;
    const results = await this.query(sql, [userId]);
    return results[0];
  }

  async getFavoriteTrends(days = 30) {
    const sql = `
      SELECT 
        DATE(f.created_at) as date,
        COUNT(*) as favorites_added
      FROM favorites f
      WHERE f.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(f.created_at)
      ORDER BY date DESC
    `;
    return this.query(sql, [days]);
  }

  async getCategoryFavoriteStats() {
    const sql = `
      SELECT 
        c.id,
        c.name,
        COUNT(DISTINCT f.id) as total_favorites,
        COUNT(DISTINCT f.user_id) as unique_users
      FROM categories c
      JOIN place_categories pc ON c.id = pc.category_id
      JOIN places p ON pc.place_id = p.id
      JOIN favorites f ON p.id = f.place_id
      WHERE c.is_active = TRUE AND p.is_active = TRUE
      GROUP BY c.id
      ORDER BY total_favorites DESC
    `;
    return this.query(sql);
  }
}

module.exports = FavoriteRepository;

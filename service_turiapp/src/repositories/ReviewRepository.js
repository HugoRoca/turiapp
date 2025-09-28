const BaseRepository = require('./BaseRepository');

class ReviewRepository extends BaseRepository {
  constructor() {
    super('reviews');
  }

  async createReview(placeId, userId, rating, title, content, images = null) {
    const sql = `
      CALL CreateReview(?, ?, ?, ?, ?, ?)
    `;
    const result = await this.query(sql, [placeId, userId, rating, title, content, images]);
    return result.insertId;
  }

  async updateReview(reviewId, userId, rating, title, content, images = null) {
    const sql = `
      CALL UpdateReview(?, ?, ?, ?, ?, ?)
    `;
    const result = await this.query(sql, [reviewId, userId, rating, title, content, images]);
    return result.affectedRows > 0;
  }

  async deleteReview(reviewId, userId) {
    const sql = `
      CALL DeleteReview(?, ?)
    `;
    const result = await this.query(sql, [reviewId, userId]);
    return result.affectedRows > 0;
  }

  async getPlaceReviews(placeId, offset = 0, limit = 10, ratingFilter = null) {
    const sql = `
      CALL GetPlaceReviews(?, ?, ?, ?)
    `;
    return this.query(sql, [placeId, offset, limit, ratingFilter]);
  }

  async getUserReviews(userId, limit = 20, offset = 0) {
    const sql = `
      SELECT r.*, 
             p.name as place_name,
             p.address as place_address,
             ST_X(p.coordinates) as place_latitude,
             ST_Y(p.coordinates) as place_longitude,
             COUNT(DISTINCT c.id) as comments_count
      FROM reviews r
      JOIN places p ON r.place_id = p.id
      LEFT JOIN comments c ON r.id = c.review_id AND c.is_public = TRUE
      WHERE r.user_id = ? AND r.is_public = TRUE
      GROUP BY r.id
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [userId, limit, offset]);
  }

  async getRecentReviews(limit = 20, offset = 0) {
    const sql = `
      SELECT r.*, 
             u.username,
             u.first_name,
             u.last_name,
             u.avatar_url,
             p.name as place_name,
             p.address as place_address,
             COUNT(DISTINCT c.id) as comments_count
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN places p ON r.place_id = p.id
      LEFT JOIN comments c ON r.id = c.review_id AND c.is_public = TRUE
      WHERE r.is_public = TRUE
      GROUP BY r.id
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [limit, offset]);
  }

  async getTopRatedReviews(limit = 20, offset = 0) {
    const sql = `
      SELECT r.*, 
             u.username,
             u.first_name,
             u.last_name,
             u.avatar_url,
             p.name as place_name,
             p.address as place_address,
             COUNT(DISTINCT c.id) as comments_count
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN places p ON r.place_id = p.id
      LEFT JOIN comments c ON r.id = c.review_id AND c.is_public = TRUE
      WHERE r.is_public = TRUE AND r.rating >= 4
      GROUP BY r.id
      ORDER BY r.rating DESC, r.helpful_count DESC, r.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [limit, offset]);
  }

  async getReviewsByRating(rating, limit = 20, offset = 0) {
    const sql = `
      SELECT r.*, 
             u.username,
             u.first_name,
             u.last_name,
             u.avatar_url,
             p.name as place_name,
             p.address as place_address,
             COUNT(DISTINCT c.id) as comments_count
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN places p ON r.place_id = p.id
      LEFT JOIN comments c ON r.id = c.review_id AND c.is_public = TRUE
      WHERE r.is_public = TRUE AND r.rating = ?
      GROUP BY r.id
      ORDER BY r.helpful_count DESC, r.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [rating, limit, offset]);
  }

  async markReviewHelpful(reviewId, userId) {
    const sql = `
      CALL MarkReviewHelpful(?, ?)
    `;
    const result = await this.query(sql, [reviewId, userId]);
    return result.affectedRows > 0;
  }

  async getReviewHelpfulCount(reviewId) {
    const sql = `
      SELECT COUNT(*) as helpful_count
      FROM review_helpful
      WHERE review_id = ?
    `;
    const results = await this.query(sql, [reviewId]);
    return results[0].helpful_count;
  }

  async hasUserMarkedHelpful(reviewId, userId) {
    const sql = `
      SELECT COUNT(*) as count
      FROM review_helpful
      WHERE review_id = ? AND user_id = ?
    `;
    const results = await this.query(sql, [reviewId, userId]);
    return results[0].count > 0;
  }

  async getReviewStats(placeId) {
    const sql = `
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM reviews
      WHERE place_id = ? AND is_public = TRUE
    `;
    const results = await this.query(sql, [placeId]);
    return results[0];
  }

  async getUserReviewStats(userId) {
    const sql = `
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating_given,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_given,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star_given,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star_given,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star_given,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star_given,
        SUM(helpful_count) as total_helpful_received
      FROM reviews
      WHERE user_id = ? AND is_public = TRUE
    `;
    const results = await this.query(sql, [userId]);
    return results[0];
  }

  async searchReviews(searchTerm, limit = 20, offset = 0) {
    const sql = `
      SELECT r.*, 
             u.username,
             u.first_name,
             u.last_name,
             u.avatar_url,
             p.name as place_name,
             p.address as place_address,
             COUNT(DISTINCT c.id) as comments_count
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN places p ON r.place_id = p.id
      LEFT JOIN comments c ON r.id = c.review_id AND c.is_public = TRUE
      WHERE r.is_public = TRUE 
      AND (r.title LIKE ? OR r.content LIKE ? OR p.name LIKE ?)
      GROUP BY r.id
      ORDER BY r.helpful_count DESC, r.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const searchPattern = `%${searchTerm}%`;
    return this.query(sql, [searchPattern, searchPattern, searchPattern, limit, offset]);
  }

  async getReviewById(reviewId) {
    const sql = `
      SELECT r.*, 
             u.username,
             u.first_name,
             u.last_name,
             u.avatar_url,
             p.name as place_name,
             p.address as place_address,
             ST_X(p.coordinates) as place_latitude,
             ST_Y(p.coordinates) as place_longitude,
             COUNT(DISTINCT c.id) as comments_count
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN places p ON r.place_id = p.id
      LEFT JOIN comments c ON r.id = c.review_id AND c.is_public = TRUE
      WHERE r.id = ?
      GROUP BY r.id
    `;
    const results = await this.query(sql, [reviewId]);
    return results.length > 0 ? results[0] : null;
  }

  async canUserReviewPlace(placeId, userId) {
    const sql = `
      SELECT COUNT(*) as count
      FROM reviews
      WHERE place_id = ? AND user_id = ?
    `;
    const results = await this.query(sql, [placeId, userId]);
    return results[0].count === 0;
  }
}

module.exports = ReviewRepository;

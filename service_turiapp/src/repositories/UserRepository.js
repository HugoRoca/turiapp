/* eslint-disable max-len */
const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const results = await this.query(sql, [email]);
    return results.length > 0 ? results[0] : null;
  }

  async findByUsername(username) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const results = await this.query(sql, [username]);
    return results.length > 0 ? results[0] : null;
  }

  async findByEmailOrUsername(identifier) {
    const sql = 'SELECT * FROM users WHERE email = ? OR username = ?';
    const results = await this.query(sql, [identifier, identifier]);
    return results.length > 0 ? results[0] : null;
  }

  async updatePassword(id, passwordHash) {
    const sql = 'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?';
    const result = await this.query(sql, [passwordHash, id]);
    return result.affectedRows > 0;
  }

  async findByName(name) {
    const sql = `
      SELECT * FROM users 
      WHERE (first_name LIKE ? OR last_name LIKE ? OR username LIKE ?) 
      AND is_active = TRUE
    `;
    const searchPattern = `%${name}%`;
    return this.query(sql, [searchPattern, searchPattern, searchPattern]);
  }

  async findActiveUsers() {
    const sql = 'SELECT * FROM users WHERE is_active = TRUE';
    return this.query(sql);
  }

  async findVerifiedUsers() {
    const sql = 'SELECT * FROM users WHERE is_verified = TRUE AND is_active = TRUE';
    return this.query(sql);
  }

  async findUsersByRole(role) {
    const sql = 'SELECT * FROM users WHERE role = ? AND is_active = TRUE';
    return this.query(sql, [role]);
  }

  async updateLastLogin(id) {
    const sql = 'UPDATE users SET last_login = NOW() WHERE id = ?';
    const result = await this.query(sql, [id]);
    return result.affectedRows > 0;
  }

  async verifyUser(id) {
    const sql = 'UPDATE users SET is_verified = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await this.query(sql, [id]);
    return result.affectedRows > 0;
  }

  async deactivateUser(id) {
    const sql = 'UPDATE users SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await this.query(sql, [id]);
    return result.affectedRows > 0;
  }

  async activateUser(id) {
    const sql = 'UPDATE users SET is_active = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await this.query(sql, [id]);
    return result.affectedRows > 0;
  }

  async updateUserRole(id, role) {
    const sql = 'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await this.query(sql, [role, id]);
    return result.affectedRows > 0;
  }

  async getUserStats(userId) {
    const sql = `
      SELECT 
        u.id,
        u.username,
        u.first_name,
        u.last_name,
        u.email,
        u.avatar_url,
        u.is_verified,
        u.role,
        u.created_at,
        u.last_login,
        COUNT(DISTINCT r.id) as total_reviews,
        COUNT(DISTINCT f.id) as total_favorites,
        COUNT(DISTINCT v.id) as total_visits,
        COUNT(DISTINCT c.id) as total_comments,
        AVG(r.rating) as average_rating_given
      FROM users u
      LEFT JOIN reviews r ON u.id = r.user_id AND r.is_public = TRUE
      LEFT JOIN favorites f ON u.id = f.user_id
      LEFT JOIN visits v ON u.id = v.user_id
      LEFT JOIN comments c ON u.id = c.user_id AND c.is_public = TRUE
      WHERE u.id = ?
      GROUP BY u.id
    `;
    const results = await this.query(sql, [userId]);
    return results.length > 0 ? results[0] : null;
  }

  async searchUsers(searchTerm, limit = 20, offset = 0) {
    const sql = `
      SELECT u.*, 
             p.bio,
             p.location_country,
             p.location_city
      FROM users u
      LEFT JOIN persons p ON u.id = p.user_id
      WHERE u.is_active = TRUE 
      AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.username LIKE ? OR u.email LIKE ?)
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const searchPattern = `%${searchTerm}%`;
    return this.query(sql, [searchPattern, searchPattern, searchPattern, searchPattern, limit, offset]);
  }

  async getRecentUsers(days = 30, limit = 20) {
    const sql = `
      SELECT u.*, 
             p.bio,
             p.location_country,
             p.location_city
      FROM users u
      LEFT JOIN persons p ON u.id = p.user_id
      WHERE u.is_active = TRUE 
      AND u.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      ORDER BY u.created_at DESC
      LIMIT ?
    `;
    return this.query(sql, [days, limit]);
  }

  async getUserDashboard(userId) {
    const sql = `
      CALL GetUserDashboard(?)
    `;
    const results = await this.query(sql, [userId]);
    return results.length > 0 ? results[0] : null;
  }
}

module.exports = UserRepository;

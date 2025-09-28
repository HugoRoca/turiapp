const BaseRepository = require('./BaseRepository');

class CommentRepository extends BaseRepository {
  constructor() {
    super('comments');
  }

  async getCommentsByReview(reviewId, limit = 20, offset = 0) {
    const sql = `
      SELECT c.*, 
             u.username,
             u.first_name,
             u.last_name,
             u.avatar_url,
             pr.bio
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN persons pr ON u.id = pr.user_id
      WHERE c.review_id = ? AND c.is_public = TRUE
      ORDER BY c.created_at ASC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [reviewId, limit, offset]);
  }

  async getCommentReplies(commentId, limit = 20, offset = 0) {
    const sql = `
      SELECT c.*, 
             u.username,
             u.first_name,
             u.last_name,
             u.avatar_url,
             pr.bio
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN persons pr ON u.id = pr.user_id
      WHERE c.parent_id = ? AND c.is_public = TRUE
      ORDER BY c.created_at ASC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [commentId, limit, offset]);
  }

  async getUserComments(userId, limit = 20, offset = 0) {
    const sql = `
      SELECT c.*, 
             r.id as review_id,
             r.rating as review_rating,
             r.title as review_title,
             p.name as place_name,
             p.address as place_address
      FROM comments c
      JOIN reviews r ON c.review_id = r.id
      JOIN places p ON r.place_id = p.id
      WHERE c.user_id = ? AND c.is_public = TRUE
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [userId, limit, offset]);
  }

  async getRecentComments(limit = 20, offset = 0) {
    const sql = `
      SELECT c.*, 
             u.username,
             u.first_name,
             u.last_name,
             u.avatar_url,
             r.id as review_id,
             r.rating as review_rating,
             r.title as review_title,
             p.name as place_name,
             p.address as place_address
      FROM comments c
      JOIN users u ON c.user_id = u.id
      JOIN reviews r ON c.review_id = r.id
      JOIN places p ON r.place_id = p.id
      WHERE c.is_public = TRUE
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [limit, offset]);
  }

  async createComment(reviewId, userId, content, parentId = null) {
    const sql = `
      INSERT INTO comments (review_id, user_id, content, parent_id)
      VALUES (?, ?, ?, ?)
    `;
    const result = await this.query(sql, [reviewId, userId, content, parentId]);
    return result.insertId;
  }

  async updateComment(commentId, userId, content) {
    const sql = `
      UPDATE comments 
      SET content = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `;
    const result = await this.query(sql, [content, commentId, userId]);
    return result.affectedRows > 0;
  }

  async deleteComment(commentId, userId) {
    const sql = `
      DELETE FROM comments 
      WHERE id = ? AND user_id = ?
    `;
    const result = await this.query(sql, [commentId, userId]);
    return result.affectedRows > 0;
  }

  async getCommentById(commentId) {
    const sql = `
      SELECT c.*, 
             u.username,
             u.first_name,
             u.last_name,
             u.avatar_url,
             pr.bio,
             r.id as review_id,
             r.rating as review_rating,
             r.title as review_title,
             p.name as place_name,
             p.address as place_address
      FROM comments c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN persons pr ON u.id = pr.user_id
      JOIN reviews r ON c.review_id = r.id
      JOIN places p ON r.place_id = p.id
      WHERE c.id = ?
    `;
    const results = await this.query(sql, [commentId]);
    return results.length > 0 ? results[0] : null;
  }

  async getCommentCountByReview(reviewId) {
    const sql = `
      SELECT COUNT(*) as comment_count
      FROM comments
      WHERE review_id = ? AND is_public = TRUE
    `;
    const results = await this.query(sql, [reviewId]);
    return results[0].comment_count;
  }

  async getUserCommentStats(userId) {
    const sql = `
      SELECT 
        COUNT(*) as total_comments,
        COUNT(CASE WHEN parent_id IS NULL THEN 1 END) as top_level_comments,
        COUNT(CASE WHEN parent_id IS NOT NULL THEN 1 END) as reply_comments
      FROM comments
      WHERE user_id = ? AND is_public = TRUE
    `;
    const results = await this.query(sql, [userId]);
    return results[0];
  }

  async searchComments(searchTerm, limit = 20, offset = 0) {
    const sql = `
      SELECT c.*, 
             u.username,
             u.first_name,
             u.last_name,
             u.avatar_url,
             r.id as review_id,
             r.rating as review_rating,
             r.title as review_title,
             p.name as place_name,
             p.address as place_address
      FROM comments c
      JOIN users u ON c.user_id = u.id
      JOIN reviews r ON c.review_id = r.id
      JOIN places p ON r.place_id = p.id
      WHERE c.is_public = TRUE AND c.content LIKE ?
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const searchPattern = `%${searchTerm}%`;
    return this.query(sql, [searchPattern, limit, offset]);
  }

  async getCommentThread(commentId) {
    // Obtener el comentario principal y todos sus replies
    const sql = `
      WITH RECURSIVE comment_thread AS (
        -- Comentario principal
        SELECT c.*, 
               u.username,
               u.first_name,
               u.last_name,
               u.avatar_url,
               pr.bio,
               0 as level
        FROM comments c
        JOIN users u ON c.user_id = u.id
        LEFT JOIN persons pr ON u.id = pr.user_id
        WHERE c.id = ? AND c.is_public = TRUE
        
        UNION ALL
        
        -- Replies recursivos
        SELECT c.*, 
               u.username,
               u.first_name,
               u.last_name,
               u.avatar_url,
               pr.bio,
               ct.level + 1
        FROM comments c
        JOIN users u ON c.user_id = u.id
        LEFT JOIN persons pr ON u.id = pr.user_id
        JOIN comment_thread ct ON c.parent_id = ct.id
        WHERE c.is_public = TRUE
      )
      SELECT * FROM comment_thread
      ORDER BY level, created_at ASC
    `;
    return this.query(sql, [commentId]);
  }

  async canUserCommentOnReview(reviewId, userId) {
    // Verificar si el usuario puede comentar en esta reseña
    // (por ejemplo, si no es el autor de la reseña o si ya comentó)
    const sql = `
      SELECT 
        CASE 
          WHEN r.user_id = ? THEN FALSE
          WHEN EXISTS (
            SELECT 1 FROM comments 
            WHERE review_id = ? AND user_id = ? AND parent_id IS NULL
          ) THEN FALSE
          ELSE TRUE
        END as can_comment
      FROM reviews r
      WHERE r.id = ? AND r.is_public = TRUE
    `;
    const results = await this.query(sql, [userId, reviewId, userId, reviewId]);
    return results.length > 0 ? results[0].can_comment : false;
  }
}

module.exports = CommentRepository;

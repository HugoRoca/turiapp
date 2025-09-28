/* eslint-disable max-len */
const CommentRepository = require('../repositories/CommentRepository');
const logger = require('../utils/logger');

class CommentService {
  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async createComment(reviewId, userId, content, parentId = null) {
    try {
      logger.info('Creating new comment', { reviewId, userId, parentId });

      // Validar datos
      if (!reviewId || !userId || !content) {
        throw new Error('Review ID, user ID, and content are required');
      }

      if (content.trim().length === 0) {
        throw new Error('Comment content cannot be empty');
      }

      // Verificar si el usuario puede comentar en esta reseña
      const canComment = await this.commentRepository.canUserCommentOnReview(reviewId, userId);
      if (!canComment) {
        throw new Error('User cannot comment on this review');
      }

      const commentId = await this.commentRepository.createComment(reviewId, userId, content, parentId);

      logger.info('Comment created successfully', { commentId, reviewId, userId });
      return commentId;
    } catch (error) {
      logger.error('Error creating comment:', { error: error.message, reviewId, userId });
      throw error;
    }
  }

  async updateComment(commentId, userId, content) {
    try {
      logger.info('Updating comment', { commentId, userId });

      if (!content || content.trim().length === 0) {
        throw new Error('Comment content cannot be empty');
      }

      const updated = await this.commentRepository.updateComment(commentId, userId, content);

      if (updated) {
        logger.info('Comment updated successfully', { commentId });
      } else {
        logger.warn('Comment not found or unauthorized', { commentId, userId });
        throw new Error('Comment not found or unauthorized to update');
      }

      return updated;
    } catch (error) {
      logger.error('Error updating comment:', { error: error.message, commentId, userId });
      throw error;
    }
  }

  async deleteComment(commentId, userId) {
    try {
      logger.info('Deleting comment', { commentId, userId });

      const deleted = await this.commentRepository.deleteComment(commentId, userId);

      if (deleted) {
        logger.info('Comment deleted successfully', { commentId });
      } else {
        logger.warn('Comment not found or unauthorized', { commentId, userId });
        throw new Error('Comment not found or unauthorized to delete');
      }

      return deleted;
    } catch (error) {
      logger.error('Error deleting comment:', { error: error.message, commentId, userId });
      throw error;
    }
  }

  async getCommentById(commentId) {
    try {
      logger.info('Getting comment by ID', { commentId });
      const comment = await this.commentRepository.getCommentById(commentId);
      if (!comment) {
        logger.warn('Comment not found', { commentId });
        return null;
      }
      logger.info('Comment found', { commentId });
      return comment;
    } catch (error) {
      logger.error('Error getting comment by ID:', { error: error.message, commentId });
      throw error;
    }
  }

  async getCommentsByReview(reviewId, limit = 20, offset = 0) {
    try {
      logger.info('Getting comments by review', { reviewId, limit, offset });
      const comments = await this.commentRepository.getCommentsByReview(reviewId, limit, offset);
      logger.info(`Retrieved ${comments.length} comments for review ${reviewId}`);
      return comments;
    } catch (error) {
      logger.error('Error getting comments by review:', { error: error.message, reviewId });
      throw error;
    }
  }

  async getCommentReplies(commentId, limit = 20, offset = 0) {
    try {
      logger.info('Getting comment replies', { commentId, limit, offset });
      const replies = await this.commentRepository.getCommentReplies(commentId, limit, offset);
      logger.info(`Retrieved ${replies.length} replies for comment ${commentId}`);
      return replies;
    } catch (error) {
      logger.error('Error getting comment replies:', { error: error.message, commentId });
      throw error;
    }
  }

  async getCommentThread(commentId) {
    try {
      logger.info('Getting comment thread', { commentId });
      const thread = await this.commentRepository.getCommentThread(commentId);
      logger.info(`Retrieved comment thread with ${thread.length} comments`);
      return thread;
    } catch (error) {
      logger.error('Error getting comment thread:', { error: error.message, commentId });
      throw error;
    }
  }

  async getUserComments(userId, limit = 20, offset = 0) {
    try {
      logger.info('Getting user comments', { userId, limit, offset });
      const comments = await this.commentRepository.getUserComments(userId, limit, offset);
      logger.info(`Retrieved ${comments.length} comments for user ${userId}`);
      return comments;
    } catch (error) {
      logger.error('Error getting user comments:', { error: error.message, userId });
      throw error;
    }
  }

  async getRecentComments(limit = 20, offset = 0) {
    try {
      logger.info('Getting recent comments', { limit, offset });
      const comments = await this.commentRepository.getRecentComments(limit, offset);
      logger.info(`Retrieved ${comments.length} recent comments`);
      return comments;
    } catch (error) {
      logger.error('Error getting recent comments:', { error: error.message });
      throw error;
    }
  }

  async getCommentCountByReview(reviewId) {
    try {
      logger.info('Getting comment count by review', { reviewId });
      const count = await this.commentRepository.getCommentCountByReview(reviewId);
      logger.info(`Review ${reviewId} has ${count} comments`);
      return count;
    } catch (error) {
      logger.error('Error getting comment count by review:', { error: error.message, reviewId });
      throw error;
    }
  }

  async getUserCommentStats(userId) {
    try {
      logger.info('Getting user comment stats', { userId });
      const stats = await this.commentRepository.getUserCommentStats(userId);
      logger.info('User comment stats retrieved', { userId });
      return stats;
    } catch (error) {
      logger.error('Error getting user comment stats:', { error: error.message, userId });
      throw error;
    }
  }

  async searchComments(searchTerm, limit = 20, offset = 0) {
    try {
      logger.info('Searching comments', { searchTerm, limit, offset });
      const comments = await this.commentRepository.searchComments(searchTerm, limit, offset);
      logger.info(`Found ${comments.length} comments matching "${searchTerm}"`);
      return comments;
    } catch (error) {
      logger.error('Error searching comments:', { error: error.message, searchTerm });
      throw error;
    }
  }

  async canUserCommentOnReview(reviewId, userId) {
    try {
      const canComment = await this.commentRepository.canUserCommentOnReview(reviewId, userId);
      return canComment;
    } catch (error) {
      logger.error('Error checking if user can comment on review:', { error: error.message, reviewId, userId });
      throw error;
    }
  }

  async getCommentsWithReplies(reviewId, limit = 20, offset = 0) {
    try {
      logger.info('Getting comments with replies', { reviewId, limit, offset });

      // Obtener comentarios principales
      const mainComments = await this.commentRepository.getCommentsByReview(reviewId, limit, offset);

      // Para cada comentario principal, obtener sus respuestas
      const commentsWithReplies = await Promise.all(
        mainComments.map(async (comment) => {
          const replies = await this.commentRepository.getCommentReplies(comment.id, 10, 0);
          return {
            ...comment,
            replies,
          };
        }),
      );

      logger.info(`Retrieved ${commentsWithReplies.length} comments with replies for review ${reviewId}`);
      return commentsWithReplies;
    } catch (error) {
      logger.error('Error getting comments with replies:', { error: error.message, reviewId });
      throw error;
    }
  }

  async getCommentWithDetails(commentId) {
    try {
      logger.info('Getting comment with details', { commentId });
      const comment = await this.commentRepository.getCommentById(commentId);

      if (!comment) {
        return null;
      }

      // Si es un comentario principal, obtener sus respuestas
      if (!comment.parent_id) {
        const replies = await this.commentRepository.getCommentReplies(commentId, 10, 0);
        comment.replies = replies;
      }

      logger.info('Comment with details retrieved', { commentId });
      return comment;
    } catch (error) {
      logger.error('Error getting comment with details:', { error: error.message, commentId });
      throw error;
    }
  }

  async moderateComment(commentId, action, moderatorId) {
    try {
      logger.info('Moderating comment', { commentId, action, moderatorId });

      let updated = false;

      switch (action) {
        case 'hide':
          updated = await this.commentRepository.update(commentId, { is_public: false });
          break;
        case 'show':
          updated = await this.commentRepository.update(commentId, { is_public: true });
          break;
        case 'delete':
          updated = await this.commentRepository.delete(commentId);
          break;
        default:
          throw new Error('Invalid moderation action');
      }

      if (updated) {
        logger.info('Comment moderated successfully', { commentId, action, moderatorId });
      }

      return updated;
    } catch (error) {
      logger.error('Error moderating comment:', { error: error.message, commentId, action });
      throw error;
    }
  }
}

module.exports = CommentService;

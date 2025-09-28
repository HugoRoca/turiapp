/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
/* eslint-disable import/order */
const BaseController = require('./BaseController');
const CommentService = require('../services/CommentService');
const Joi = require('joi');
const logger = require('../utils/logger');

class CommentController extends BaseController {
  constructor() {
    super();
    this.commentService = new CommentService();
  }

  // Validation schemas
  static get createCommentSchema() {
    return Joi.object({
      review_id: Joi.number().integer().positive().required(),
      content: Joi.string().min(1).max(1000).required(),
      parent_id: Joi.number().integer().positive().optional(),
    });
  }

  static get updateCommentSchema() {
    return Joi.object({
      content: Joi.string().min(1).max(1000).required(),
    });
  }

  // Create comment
  async createComment(ctx) {
    logger.info('CommentController: Creating new comment');
    
    const validatedData = BaseController.validateRequest(ctx, CommentController.createCommentSchema);
    if (!validatedData) return;

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.commentService.createComment.bind(this.commentService),
      validatedData.review_id,
      userId,
      validatedData.content,
      validatedData.parent_id,
    );
  }

  // Update comment
  async updateComment(ctx) {
    const { id } = ctx.params;
    logger.info('CommentController: Updating comment', { id });
    
    if (!id || isNaN(parseInt(id, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid comment ID',
        message: 'Comment ID must be a valid number',
      };
      return;
    }

    const validatedData = BaseController.validateRequest(ctx, CommentController.updateCommentSchema);
    if (!validatedData) return;

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.commentService.updateComment.bind(this.commentService),
      parseInt(id, 10),
      userId,
      validatedData.content,
    );
  }

  // Delete comment
  async deleteComment(ctx) {
    const { id } = ctx.params;
    logger.info('CommentController: Deleting comment', { id });
    
    if (!id || isNaN(parseInt(id, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid comment ID',
        message: 'Comment ID must be a valid number',
      };
      return;
    }

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.commentService.deleteComment.bind(this.commentService),
      parseInt(id, 10),
      userId,
    );
  }

  // Get comment by ID
  async getCommentById(ctx) {
    const { id } = ctx.params;
    logger.info('CommentController: Getting comment by ID', { id });
    
    if (!id || isNaN(parseInt(id, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid comment ID',
        message: 'Comment ID must be a valid number',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.commentService.getCommentById.bind(this.commentService),
      parseInt(id, 10),
    );
  }

  // Get comments by review
  async getCommentsByReview(ctx) {
    const { reviewId } = ctx.params;
    const { limit, offset } = ctx.query;
    logger.info('CommentController: Getting comments by review', { reviewId, limit, offset });
    
    if (!reviewId || isNaN(parseInt(reviewId, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid review ID',
        message: 'Review ID must be a valid number',
      };
      return;
    }

    const limitNum = limit ? parseInt(limit, 10) : 20;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    if (isNaN(limitNum) || isNaN(offsetNum)) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid parameters',
        message: 'Limit and offset must be valid numbers',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.commentService.getCommentsByReview.bind(this.commentService),
      parseInt(reviewId, 10),
      limitNum,
      offsetNum,
    );
  }

  // Get comments with replies
  async getCommentsWithReplies(ctx) {
    const { reviewId } = ctx.params;
    const { limit, offset } = ctx.query;
    logger.info('CommentController: Getting comments with replies', { reviewId, limit, offset });
    
    if (!reviewId || isNaN(parseInt(reviewId, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid review ID',
        message: 'Review ID must be a valid number',
      };
      return;
    }

    const limitNum = limit ? parseInt(limit, 10) : 20;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    if (isNaN(limitNum) || isNaN(offsetNum)) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid parameters',
        message: 'Limit and offset must be valid numbers',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.commentService.getCommentsWithReplies.bind(this.commentService),
      parseInt(reviewId, 10),
      limitNum,
      offsetNum,
    );
  }

  // Get comment replies
  async getCommentReplies(ctx) {
    const { id } = ctx.params;
    const { limit, offset } = ctx.query;
    logger.info('CommentController: Getting comment replies', { id, limit, offset });
    
    if (!id || isNaN(parseInt(id, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid comment ID',
        message: 'Comment ID must be a valid number',
      };
      return;
    }

    const limitNum = limit ? parseInt(limit, 10) : 20;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    if (isNaN(limitNum) || isNaN(offsetNum)) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid parameters',
        message: 'Limit and offset must be valid numbers',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.commentService.getCommentReplies.bind(this.commentService),
      parseInt(id, 10),
      limitNum,
      offsetNum,
    );
  }

  // Get comment thread
  async getCommentThread(ctx) {
    const { id } = ctx.params;
    logger.info('CommentController: Getting comment thread', { id });
    
    if (!id || isNaN(parseInt(id, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid comment ID',
        message: 'Comment ID must be a valid number',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.commentService.getCommentThread.bind(this.commentService),
      parseInt(id, 10),
    );
  }

  // Get user comments
  async getUserComments(ctx) {
    const { userId } = ctx.params;
    const { limit, offset } = ctx.query;
    logger.info('CommentController: Getting user comments', { userId, limit, offset });
    
    if (!userId || isNaN(parseInt(userId, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a valid number',
      };
      return;
    }

    const limitNum = limit ? parseInt(limit, 10) : 20;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    if (isNaN(limitNum) || isNaN(offsetNum)) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid parameters',
        message: 'Limit and offset must be valid numbers',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.commentService.getUserComments.bind(this.commentService),
      parseInt(userId, 10),
      limitNum,
      offsetNum,
    );
  }

  // Get my comments (current user)
  async getMyComments(ctx) {
    const { limit, offset } = ctx.query;
    logger.info('CommentController: Getting my comments', { limit, offset });
    
    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    const limitNum = limit ? parseInt(limit, 10) : 20;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    if (isNaN(limitNum) || isNaN(offsetNum)) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid parameters',
        message: 'Limit and offset must be valid numbers',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.commentService.getUserComments.bind(this.commentService),
      userId,
      limitNum,
      offsetNum,
    );
  }

  // Get recent comments
  async getRecentComments(ctx) {
    const { limit, offset } = ctx.query;
    logger.info('CommentController: Getting recent comments', { limit, offset });
    
    const limitNum = limit ? parseInt(limit, 10) : 20;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    if (isNaN(limitNum) || isNaN(offsetNum)) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid parameters',
        message: 'Limit and offset must be valid numbers',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.commentService.getRecentComments.bind(this.commentService),
      limitNum,
      offsetNum,
    );
  }

  // Get comment count by review
  async getCommentCountByReview(ctx) {
    const { reviewId } = ctx.params;
    logger.info('CommentController: Getting comment count by review', { reviewId });
    
    if (!reviewId || isNaN(parseInt(reviewId, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid review ID',
        message: 'Review ID must be a valid number',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.commentService.getCommentCountByReview.bind(this.commentService),
      parseInt(reviewId, 10),
    );
  }

  // Get user comment stats
  async getUserCommentStats(ctx) {
    const { userId } = ctx.params;
    logger.info('CommentController: Getting user comment stats', { userId });
    
    if (!userId || isNaN(parseInt(userId, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a valid number',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.commentService.getUserCommentStats.bind(this.commentService),
      parseInt(userId, 10),
    );
  }

  // Get my comment stats (current user)
  async getMyCommentStats(ctx) {
    logger.info('CommentController: Getting my comment stats');
    
    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.commentService.getUserCommentStats.bind(this.commentService),
      userId,
    );
  }

  // Search comments
  async searchComments(ctx) {
    const { q, limit, offset } = ctx.query;
    logger.info('CommentController: Searching comments', { q, limit, offset });
    
    if (!q || q.trim().length === 0) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Search term required',
        message: 'Query parameter "q" is required',
      };
      return;
    }

    const limitNum = limit ? parseInt(limit, 10) : 20;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    if (isNaN(limitNum) || isNaN(offsetNum)) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid parameters',
        message: 'Limit and offset must be valid numbers',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.commentService.searchComments.bind(this.commentService),
      q.trim(),
      limitNum,
      offsetNum,
    );
  }

  // Check if user can comment on review
  async canUserCommentOnReview(ctx) {
    const { reviewId } = ctx.params;
    logger.info('CommentController: Checking if user can comment on review', { reviewId });
    
    if (!reviewId || isNaN(parseInt(reviewId, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid review ID',
        message: 'Review ID must be a valid number',
      };
      return;
    }

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.commentService.canUserCommentOnReview.bind(this.commentService),
      parseInt(reviewId, 10),
      userId,
    );
  }

  // Moderate comment (admin only)
  async moderateComment(ctx) {
    const { id } = ctx.params;
    const { action } = ctx.request.body;
    logger.info('CommentController: Moderating comment', { id, action });
    
    if (!id || isNaN(parseInt(id, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid comment ID',
        message: 'Comment ID must be a valid number',
      };
      return;
    }

    const validActions = ['hide', 'show', 'delete'];
    if (!action || !validActions.includes(action)) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid action',
        message: 'Action must be one of: hide, show, delete',
      };
      return;
    }

    // Get moderator ID from context (assuming it's set by auth middleware)
    const moderatorId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.commentService.moderateComment.bind(this.commentService),
      parseInt(id, 10),
      action,
      moderatorId,
    );
  }
}

module.exports = CommentController;

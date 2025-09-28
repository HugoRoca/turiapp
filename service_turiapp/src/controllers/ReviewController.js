/* eslint-disable max-len */
/* eslint-disable no-restricted-globals */
const Joi = require('joi');
const BaseController = require('./BaseController');
const ReviewService = require('../services/ReviewService');
const logger = require('../utils/logger');

class ReviewController extends BaseController {
  constructor() {
    super();
    this.reviewService = new ReviewService();
  }

  // Validation schemas
  static get createReviewSchema() {
    return Joi.object({
      place_id: Joi.number().integer().positive().required(),
      rating: Joi.number().integer().min(1).max(5)
        .required(),
      title: Joi.string().min(5).max(200).optional(),
      content: Joi.string().min(10).max(2000).required(),
      images: Joi.array().items(Joi.string().uri()).optional(),
    });
  }

  static get updateReviewSchema() {
    return Joi.object({
      rating: Joi.number().integer().min(1).max(5)
        .optional(),
      title: Joi.string().min(5).max(200).optional(),
      content: Joi.string().min(10).max(2000).optional(),
      images: Joi.array().items(Joi.string().uri()).optional(),
    });
  }

  // Create review
  async createReview(ctx) {
    logger.info('ReviewController: Creating new review');

    const validatedData = BaseController.validateRequest(ctx, ReviewController.createReviewSchema);
    if (!validatedData) return;

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.reviewService.createReview.bind(this.reviewService),
      validatedData.place_id,
      userId,
      validatedData.rating,
      validatedData.title,
      validatedData.content,
      validatedData.images,
    );
  }

  // Update review
  async updateReview(ctx) {
    const { id } = ctx.params;
    logger.info('ReviewController: Updating review', { id });

    if (!id || isNaN(parseInt(id, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid review ID',
        message: 'Review ID must be a valid number',
      };
      return;
    }

    const validatedData = BaseController.validateRequest(ctx, ReviewController.updateReviewSchema);
    if (!validatedData) return;

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.reviewService.updateReview.bind(this.reviewService),
      parseInt(id, 10),
      userId,
      validatedData.rating,
      validatedData.title,
      validatedData.content,
      validatedData.images,
    );
  }

  // Delete review
  async deleteReview(ctx) {
    const { id } = ctx.params;
    logger.info('ReviewController: Deleting review', { id });

    if (!id || isNaN(parseInt(id, 10))) {
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
      this.reviewService.deleteReview.bind(this.reviewService),
      parseInt(id, 10),
      userId,
    );
  }

  // Get review by ID
  async getReviewById(ctx) {
    const { id } = ctx.params;
    logger.info('ReviewController: Getting review by ID', { id });

    if (!id || isNaN(parseInt(id, 10))) {
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
      this.reviewService.getReviewById.bind(this.reviewService),
      parseInt(id, 10),
    );
  }

  // Get place reviews
  async getPlaceReviews(ctx) {
    const { placeId } = ctx.params;
    const { offset, limit, rating } = ctx.query;
    logger.info('ReviewController: Getting place reviews', {
      placeId, offset, limit, rating,
    });

    if (!placeId || isNaN(parseInt(placeId, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid place ID',
        message: 'Place ID must be a valid number',
      };
      return;
    }

    const offsetNum = offset ? parseInt(offset, 10) : 0;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const ratingFilter = rating ? parseInt(rating, 10) : null;

    if (isNaN(offsetNum) || isNaN(limitNum) || (ratingFilter && (ratingFilter < 1 || ratingFilter > 5))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid parameters',
        message: 'Offset, limit, and rating must be valid numbers. Rating must be between 1 and 5.',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.reviewService.getPlaceReviews.bind(this.reviewService),
      parseInt(placeId, 10),
      offsetNum,
      limitNum,
      ratingFilter,
    );
  }

  // Get user reviews
  async getUserReviews(ctx) {
    const { userId } = ctx.params;
    const { limit, offset } = ctx.query;
    logger.info('ReviewController: Getting user reviews', { userId, limit, offset });

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
      this.reviewService.getUserReviews.bind(this.reviewService),
      parseInt(userId, 10),
      limitNum,
      offsetNum,
    );
  }

  // Get my reviews (current user)
  async getMyReviews(ctx) {
    const { limit, offset } = ctx.query;
    logger.info('ReviewController: Getting my reviews', { limit, offset });

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
      this.reviewService.getUserReviews.bind(this.reviewService),
      userId,
      limitNum,
      offsetNum,
    );
  }

  // Get recent reviews
  async getRecentReviews(ctx) {
    const { limit, offset } = ctx.query;
    logger.info('ReviewController: Getting recent reviews', { limit, offset });

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
      this.reviewService.getRecentReviews.bind(this.reviewService),
      limitNum,
      offsetNum,
    );
  }

  // Get top rated reviews
  async getTopRatedReviews(ctx) {
    const { limit, offset } = ctx.query;
    logger.info('ReviewController: Getting top rated reviews', { limit, offset });

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
      this.reviewService.getTopRatedReviews.bind(this.reviewService),
      limitNum,
      offsetNum,
    );
  }

  // Get reviews by rating
  async getReviewsByRating(ctx) {
    const { rating } = ctx.params;
    const { limit, offset } = ctx.query;
    logger.info('ReviewController: Getting reviews by rating', { rating, limit, offset });

    if (!rating || isNaN(parseInt(rating, 10)) || parseInt(rating, 10) < 1 || parseInt(rating, 10) > 5) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid rating',
        message: 'Rating must be a number between 1 and 5',
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
      this.reviewService.getReviewsByRating.bind(this.reviewService),
      parseInt(rating, 10),
      limitNum,
      offsetNum,
    );
  }

  // Mark review as helpful
  async markReviewHelpful(ctx) {
    const { id } = ctx.params;
    logger.info('ReviewController: Marking review as helpful', { id });

    if (!id || isNaN(parseInt(id, 10))) {
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
      this.reviewService.markReviewHelpful.bind(this.reviewService),
      parseInt(id, 10),
      userId,
    );
  }

  // Get review helpful count
  async getReviewHelpfulCount(ctx) {
    const { id } = ctx.params;
    logger.info('ReviewController: Getting review helpful count', { id });

    if (!id || isNaN(parseInt(id, 10))) {
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
      this.reviewService.getReviewHelpfulCount.bind(this.reviewService),
      parseInt(id, 10),
    );
  }

  // Check if user marked review as helpful
  async hasUserMarkedHelpful(ctx) {
    const { id } = ctx.params;
    logger.info('ReviewController: Checking if user marked helpful', { id });

    if (!id || isNaN(parseInt(id, 10))) {
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
      this.reviewService.hasUserMarkedHelpful.bind(this.reviewService),
      parseInt(id, 10),
      userId,
    );
  }

  // Get review stats
  async getReviewStats(ctx) {
    const { placeId } = ctx.params;
    logger.info('ReviewController: Getting review stats', { placeId });

    if (!placeId || isNaN(parseInt(placeId, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid place ID',
        message: 'Place ID must be a valid number',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.reviewService.getReviewStats.bind(this.reviewService),
      parseInt(placeId, 10),
    );
  }

  // Get user review stats
  async getUserReviewStats(ctx) {
    const { userId } = ctx.params;
    logger.info('ReviewController: Getting user review stats', { userId });

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
      this.reviewService.getUserReviewStats.bind(this.reviewService),
      parseInt(userId, 10),
    );
  }

  // Get my review stats (current user)
  async getMyReviewStats(ctx) {
    logger.info('ReviewController: Getting my review stats');

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.reviewService.getUserReviewStats.bind(this.reviewService),
      userId,
    );
  }

  // Search reviews
  async searchReviews(ctx) {
    const { q, limit, offset } = ctx.query;
    logger.info('ReviewController: Searching reviews', { q, limit, offset });

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
      this.reviewService.searchReviews.bind(this.reviewService),
      q.trim(),
      limitNum,
      offsetNum,
    );
  }

  // Check if user can review place
  async canUserReviewPlace(ctx) {
    const { placeId } = ctx.params;
    logger.info('ReviewController: Checking if user can review place', { placeId });

    if (!placeId || isNaN(parseInt(placeId, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid place ID',
        message: 'Place ID must be a valid number',
      };
      return;
    }

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.reviewService.canUserReviewPlace.bind(this.reviewService),
      parseInt(placeId, 10),
      userId,
    );
  }
}

module.exports = ReviewController;

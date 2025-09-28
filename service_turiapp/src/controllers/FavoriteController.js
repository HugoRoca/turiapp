/* eslint-disable max-len */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-trailing-spaces */
/* eslint-disable newline-per-chained-call */
/* eslint-disable import/order */
const BaseController = require('./BaseController');
const FavoriteService = require('../services/FavoriteService');
const Joi = require('joi');
const logger = require('../utils/logger');

class FavoriteController extends BaseController {
  constructor() {
    super();
    this.favoriteService = new FavoriteService();
  }

  // Validation schemas
  static get addFavoriteSchema() {
    return Joi.object({
      place_id: Joi.number().integer().positive().required(),
    });
  }

  static get bulkFavoritesSchema() {
    return Joi.array().items(
      Joi.number().integer().positive(),
    ).min(1).max(50).required();
  }

  // Add favorite
  async addFavorite(ctx) {
    logger.info('FavoriteController: Adding favorite');
    
    const validatedData = BaseController.validateRequest(ctx, FavoriteController.addFavoriteSchema);
    if (!validatedData) return;

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.favoriteService.addFavorite.bind(this.favoriteService),
      userId,
      validatedData.place_id,
    );
  }

  // Remove favorite
  async removeFavorite(ctx) {
    const { placeId } = ctx.params;
    logger.info('FavoriteController: Removing favorite', { placeId });
    
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
      this.favoriteService.removeFavorite.bind(this.favoriteService),
      userId,
      parseInt(placeId, 10),
    );
  }

  // Toggle favorite
  async toggleFavorite(ctx) {
    const { placeId } = ctx.params;
    logger.info('FavoriteController: Toggling favorite', { placeId });
    
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
      this.favoriteService.toggleFavorite.bind(this.favoriteService),
      userId,
      parseInt(placeId, 10),
    );
  }

  // Check if favorite
  async isFavorite(ctx) {
    const { placeId } = ctx.params;
    logger.info('FavoriteController: Checking if favorite', { placeId });
    
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
      this.favoriteService.isFavorite.bind(this.favoriteService),
      userId,
      parseInt(placeId, 10),
    );
  }

  // Get user favorites
  async getUserFavorites(ctx) {
    const { userId } = ctx.params;
    const { limit, offset } = ctx.query;
    logger.info('FavoriteController: Getting user favorites', { userId, limit, offset });
    
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
      this.favoriteService.getUserFavorites.bind(this.favoriteService),
      parseInt(userId, 10),
      limitNum,
      offsetNum,
    );
  }

  // Get my favorites (current user)
  async getMyFavorites(ctx) {
    const { limit, offset } = ctx.query;
    logger.info('FavoriteController: Getting my favorites', { limit, offset });
    
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
      this.favoriteService.getUserFavorites.bind(this.favoriteService),
      userId,
      limitNum,
      offsetNum,
    );
  }

  // Get place favorites
  async getPlaceFavorites(ctx) {
    const { placeId } = ctx.params;
    const { limit, offset } = ctx.query;
    logger.info('FavoriteController: Getting place favorites', { placeId, limit, offset });
    
    if (!placeId || isNaN(parseInt(placeId, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid place ID',
        message: 'Place ID must be a valid number',
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
      this.favoriteService.getPlaceFavorites.bind(this.favoriteService),
      parseInt(placeId, 10),
      limitNum,
      offsetNum,
    );
  }

  // Get user favorite count
  async getUserFavoriteCount(ctx) {
    const { userId } = ctx.params;
    logger.info('FavoriteController: Getting user favorite count', { userId });
    
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
      this.favoriteService.getUserFavoriteCount.bind(this.favoriteService),
      parseInt(userId, 10),
    );
  }

  // Get my favorite count (current user)
  async getMyFavoriteCount(ctx) {
    logger.info('FavoriteController: Getting my favorite count');
    
    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.favoriteService.getUserFavoriteCount.bind(this.favoriteService),
      userId,
    );
  }

  // Get place favorite count
  async getPlaceFavoriteCount(ctx) {
    const { placeId } = ctx.params;
    logger.info('FavoriteController: Getting place favorite count', { placeId });
    
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
      this.favoriteService.getPlaceFavoriteCount.bind(this.favoriteService),
      parseInt(placeId, 10),
    );
  }

  // Get user favorites by category
  async getUserFavoritesByCategory(ctx) {
    const { userId, categoryId } = ctx.params;
    const { limit, offset } = ctx.query;
    logger.info('FavoriteController: Getting user favorites by category', {
      userId, categoryId, limit, offset, 
    });
    
    if (!userId || isNaN(parseInt(userId, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a valid number',
      };
      return;
    }

    if (!categoryId || isNaN(parseInt(categoryId, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid category ID',
        message: 'Category ID must be a valid number',
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
      this.favoriteService.getUserFavoritesByCategory.bind(this.favoriteService),
      parseInt(userId, 10),
      parseInt(categoryId, 10),
      limitNum,
      offsetNum,
    );
  }

  // Get my favorites by category (current user)
  async getMyFavoritesByCategory(ctx) {
    const { categoryId } = ctx.params;
    const { limit, offset } = ctx.query;
    logger.info('FavoriteController: Getting my favorites by category', { categoryId, limit, offset });
    
    if (!categoryId || isNaN(parseInt(categoryId, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid category ID',
        message: 'Category ID must be a valid number',
      };
      return;
    }

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
      this.favoriteService.getUserFavoritesByCategory.bind(this.favoriteService),
      userId,
      parseInt(categoryId, 10),
      limitNum,
      offsetNum,
    );
  }

  // Get user favorites by price range
  async getUserFavoritesByPriceRange(ctx) {
    const { userId, priceRange } = ctx.params;
    const { limit, offset } = ctx.query;
    logger.info('FavoriteController: Getting user favorites by price range', {
      userId, priceRange, limit, offset, 
    });
    
    if (!userId || isNaN(parseInt(userId, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a valid number',
      };
      return;
    }

    const validPriceRanges = ['free', 'low', 'medium', 'high', 'luxury'];
    if (!validPriceRanges.includes(priceRange)) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid price range',
        message: 'Price range must be one of: free, low, medium, high, luxury',
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
      this.favoriteService.getUserFavoritesByPriceRange.bind(this.favoriteService),
      parseInt(userId, 10),
      priceRange,
      limitNum,
      offsetNum,
    );
  }

  // Get my favorites by price range (current user)
  async getMyFavoritesByPriceRange(ctx) {
    const { priceRange } = ctx.params;
    const { limit, offset } = ctx.query;
    logger.info('FavoriteController: Getting my favorites by price range', { priceRange, limit, offset });
    
    const validPriceRanges = ['free', 'low', 'medium', 'high', 'luxury'];
    if (!validPriceRanges.includes(priceRange)) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid price range',
        message: 'Price range must be one of: free, low, medium, high, luxury',
      };
      return;
    }

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
      this.favoriteService.getUserFavoritesByPriceRange.bind(this.favoriteService),
      userId,
      priceRange,
      limitNum,
      offsetNum,
    );
  }

  // Search user favorites
  async searchUserFavorites(ctx) {
    const { userId } = ctx.params;
    const { q, limit, offset } = ctx.query;
    logger.info('FavoriteController: Searching user favorites', {
      userId, q, limit, offset, 
    });
    
    if (!userId || isNaN(parseInt(userId, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a valid number',
      };
      return;
    }

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
      this.favoriteService.searchUserFavorites.bind(this.favoriteService),
      parseInt(userId, 10),
      q.trim(),
      limitNum,
      offsetNum,
    );
  }

  // Search my favorites (current user)
  async searchMyFavorites(ctx) {
    const { q, limit, offset } = ctx.query;
    logger.info('FavoriteController: Searching my favorites', { q, limit, offset });
    
    if (!q || q.trim().length === 0) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Search term required',
        message: 'Query parameter "q" is required',
      };
      return;
    }

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
      this.favoriteService.searchUserFavorites.bind(this.favoriteService),
      userId,
      q.trim(),
      limitNum,
      offsetNum,
    );
  }

  // Get most favorited places
  async getMostFavoritedPlaces(ctx) {
    const { limit, offset } = ctx.query;
    logger.info('FavoriteController: Getting most favorited places', { limit, offset });
    
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
      this.favoriteService.getMostFavoritedPlaces.bind(this.favoriteService),
      limitNum,
      offsetNum,
    );
  }

  // Get user favorite stats
  async getUserFavoriteStats(ctx) {
    const { userId } = ctx.params;
    logger.info('FavoriteController: Getting user favorite stats', { userId });
    
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
      this.favoriteService.getUserFavoriteStats.bind(this.favoriteService),
      parseInt(userId, 10),
    );
  }

  // Get my favorite stats (current user)
  async getMyFavoriteStats(ctx) {
    logger.info('FavoriteController: Getting my favorite stats');
    
    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.favoriteService.getUserFavoriteStats.bind(this.favoriteService),
      userId,
    );
  }

  // Get favorite summary (current user)
  async getFavoriteSummary(ctx) {
    logger.info('FavoriteController: Getting favorite summary');
    
    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.favoriteService.getFavoriteSummary.bind(this.favoriteService),
      userId,
    );
  }

  // Bulk add favorites
  async bulkAddFavorites(ctx) {
    logger.info('FavoriteController: Bulk adding favorites');
    
    const validatedData = BaseController.validateRequest(ctx, FavoriteController.bulkFavoritesSchema);
    if (!validatedData) return;

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.favoriteService.bulkAddFavorites.bind(this.favoriteService),
      userId,
      validatedData,
    );
  }

  // Bulk remove favorites
  async bulkRemoveFavorites(ctx) {
    logger.info('FavoriteController: Bulk removing favorites');
    
    const validatedData = BaseController.validateRequest(ctx, FavoriteController.bulkFavoritesSchema);
    if (!validatedData) return;

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.favoriteService.bulkRemoveFavorites.bind(this.favoriteService),
      userId,
      validatedData,
    );
  }
}

module.exports = FavoriteController;

/* eslint-disable camelcase */
/* eslint-disable no-restricted-globals */
const Joi = require('joi');
const BaseController = require('./BaseController');
const PlaceService = require('../services/PlaceService');
const logger = require('../utils/logger');

class PlaceController extends BaseController {
  constructor() {
    super();
    this.placeService = new PlaceService();
  }

  // Validation schemas
  static get createPlaceSchema() {
    return Joi.object({
      name: Joi.string().min(2).max(200).required(),
      description: Joi.string().max(2000).optional(),
      short_description: Joi.string().max(500).optional(),
      address: Joi.string().min(5).max(500).required(),
      coordinates: Joi.object({
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required(),
      }).required(),
      phone: Joi.string().min(10).max(20).optional(),
      email: Joi.string().email().optional(),
      website: Joi.string().uri().optional(),
      price_range: Joi.string().valid('free', 'low', 'medium', 'high', 'luxury').default('free'),
      opening_hours: Joi.object().optional(),
      amenities: Joi.array().items(Joi.string()).optional(),
      images: Joi.array().items(Joi.string().uri()).optional(),
      category_ids: Joi.array().items(Joi.number().integer().positive()).optional(),
    });
  }

  static get updatePlaceSchema() {
    return Joi.object({
      name: Joi.string().min(2).max(200).optional(),
      description: Joi.string().max(2000).optional(),
      short_description: Joi.string().max(500).optional(),
      address: Joi.string().min(5).max(500).optional(),
      coordinates: Joi.object({
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required(),
      }).optional(),
      phone: Joi.string().min(10).max(20).optional(),
      email: Joi.string().email().optional(),
      website: Joi.string().uri().optional(),
      price_range: Joi.string().valid('free', 'low', 'medium', 'high', 'luxury').optional(),
      opening_hours: Joi.object().optional(),
      amenities: Joi.array().items(Joi.string()).optional(),
      images: Joi.array().items(Joi.string().uri()).optional(),
      category_ids: Joi.array().items(Joi.number().integer().positive()).optional(),
    });
  }

  // Get all places
  async getAllPlaces(ctx) {
    logger.info('PlaceController: Getting all places');
    const filters = ctx.query;
    await BaseController.handleRequest(
      ctx,
      this.placeService.getAllPlaces.bind(this.placeService),
      filters,
    );
  }

  // Get place by ID
  async getPlaceById(ctx) {
    const { id } = ctx.params;
    logger.info('PlaceController: Getting place by ID', { id });

    if (!id || isNaN(parseInt(id, 10))) {
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
      this.placeService.getPlaceById.bind(this.placeService),
      parseInt(id, 10),
    );
  }

  // Get nearby places
  async getNearbyPlaces(ctx) {
    const {
      latitude, longitude, radius, limit,
    } = ctx.query;
    logger.info('PlaceController: Getting nearby places', {
      latitude, longitude, radius, limit,
    });

    if (!latitude || !longitude) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Missing coordinates',
        message: 'Latitude and longitude are required',
      };
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusKm = radius ? parseFloat(radius) : 10;
    const limitNum = limit ? parseInt(limit, 10) : 20;

    if (isNaN(lat) || isNaN(lng) || isNaN(radiusKm) || isNaN(limitNum)) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid parameters',
        message: 'Latitude, longitude, radius, and limit must be valid numbers',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.placeService.getNearbyPlaces.bind(this.placeService),
      lat,
      lng,
      radiusKm,
      limitNum,
    );
  }

  // Get popular places
  async getPopularPlaces(ctx) {
    const { limit, category_id } = ctx.query;
    logger.info('PlaceController: Getting popular places', { limit, category_id });

    const limitNum = limit ? parseInt(limit, 10) : 10;
    const categoryId = category_id ? parseInt(category_id, 10) : null;

    if (isNaN(limitNum) || (categoryId && isNaN(categoryId))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid parameters',
        message: 'Limit and category_id must be valid numbers',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.placeService.getPopularPlaces.bind(this.placeService),
      limitNum,
      categoryId,
    );
  }

  // Get featured places
  async getFeaturedPlaces(ctx) {
    const { limit } = ctx.query;
    logger.info('PlaceController: Getting featured places', { limit });

    const limitNum = limit ? parseInt(limit, 10) : 10;

    if (isNaN(limitNum)) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid limit parameter',
        message: 'Limit must be a valid number',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.placeService.getFeaturedPlaces.bind(this.placeService),
      limitNum,
    );
  }

  // Get verified places
  async getVerifiedPlaces(ctx) {
    const { limit, offset } = ctx.query;
    logger.info('PlaceController: Getting verified places', { limit, offset });

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
      this.placeService.getVerifiedPlaces.bind(this.placeService),
      limitNum,
      offsetNum,
    );
  }

  // Get places by category
  async getPlacesByCategory(ctx) {
    const { categoryId } = ctx.params;
    const { limit, offset } = ctx.query;
    logger.info('PlaceController: Getting places by category', { categoryId, limit, offset });

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
      this.placeService.getPlacesByCategory.bind(this.placeService),
      parseInt(categoryId, 10),
      limitNum,
      offsetNum,
    );
  }

  // Get places by price range
  async getPlacesByPriceRange(ctx) {
    const { priceRange } = ctx.params;
    const { limit, offset } = ctx.query;
    logger.info('PlaceController: Getting places by price range', { priceRange, limit, offset });

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
      this.placeService.getPlacesByPriceRange.bind(this.placeService),
      priceRange,
      limitNum,
      offsetNum,
    );
  }

  // Search places
  async searchPlaces(ctx) {
    const { q, limit, offset } = ctx.query;
    logger.info('PlaceController: Searching places', { q, limit, offset });

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
      this.placeService.searchPlaces.bind(this.placeService),
      q.trim(),
      limitNum,
      offsetNum,
    );
  }

  // Create place
  async createPlace(ctx) {
    logger.info('PlaceController: Creating new place');

    const validatedData = BaseController.validateRequest(ctx, PlaceController.createPlaceSchema);
    if (!validatedData) return;

    // Extract category_ids if provided
    const categoryIds = validatedData.category_ids || [];
    delete validatedData.category_ids;

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.placeService.createPlace.bind(this.placeService),
      validatedData,
      categoryIds,
      userId,
    );
  }

  // Update place
  async updatePlace(ctx) {
    const { id } = ctx.params;
    logger.info('PlaceController: Updating place', { id });

    if (!id || isNaN(parseInt(id, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid place ID',
        message: 'Place ID must be a valid number',
      };
      return;
    }

    const validatedData = BaseController.validateRequest(ctx, PlaceController.updatePlaceSchema);
    if (!validatedData) return;

    // Extract category_ids if provided
    const categoryIds = validatedData.category_ids || null;
    delete validatedData.category_ids;

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.placeService.updatePlace.bind(this.placeService),
      parseInt(id, 10),
      validatedData,
      categoryIds,
      userId,
    );
  }

  // Delete place
  async deletePlace(ctx) {
    const { id } = ctx.params;
    logger.info('PlaceController: Deleting place', { id });

    if (!id || isNaN(parseInt(id, 10))) {
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
      this.placeService.deletePlace.bind(this.placeService),
      parseInt(id, 10),
      userId,
    );
  }

  // Get place stats
  async getPlaceStats(ctx) {
    const { id } = ctx.params;
    logger.info('PlaceController: Getting place stats', { id });

    if (!id || isNaN(parseInt(id, 10))) {
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
      this.placeService.getPlaceStats.bind(this.placeService),
      parseInt(id, 10),
    );
  }

  // Get place categories
  async getPlaceCategories(ctx) {
    const { id } = ctx.params;
    logger.info('PlaceController: Getting place categories', { id });

    if (!id || isNaN(parseInt(id, 10))) {
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
      this.placeService.getPlaceCategories.bind(this.placeService),
      parseInt(id, 10),
    );
  }

  // Increment visit count
  async incrementVisitCount(ctx) {
    const { id } = ctx.params;
    logger.info('PlaceController: Incrementing visit count', { id });

    if (!id || isNaN(parseInt(id, 10))) {
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
      this.placeService.incrementVisitCount.bind(this.placeService),
      parseInt(id, 10),
    );
  }
}

module.exports = PlaceController;

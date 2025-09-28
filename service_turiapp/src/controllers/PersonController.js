/* eslint-disable no-restricted-globals */
/* eslint-disable import/order */
const BaseController = require('./BaseController');
const PersonService = require('../services/PersonService');
const Joi = require('joi');
const logger = require('../utils/logger');

class PersonController extends BaseController {
  constructor() {
    super();
    this.personService = new PersonService();
  }

  // Validation schemas
  static get createPersonSchema() {
    return Joi.object({
      bio: Joi.string().max(1000).optional(),
      birth_date: Joi.date().max('now').optional(),
      nationality: Joi.string().max(100).optional(),
      languages: Joi.array().items(Joi.string().max(50)).optional(),
      interests: Joi.array().items(Joi.string().max(100)).optional(),
      social_links: Joi.object().optional(),
      location_country: Joi.string().max(100).optional(),
      location_city: Joi.string().max(100).optional(),
      coordinates: Joi.object({
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required(),
      }).optional(),
      is_public: Joi.boolean().default(true),
    });
  }

  static get updatePersonSchema() {
    return Joi.object({
      bio: Joi.string().max(1000).optional(),
      birth_date: Joi.date().max('now').optional(),
      nationality: Joi.string().max(100).optional(),
      languages: Joi.array().items(Joi.string().max(50)).optional(),
      interests: Joi.array().items(Joi.string().max(100)).optional(),
      social_links: Joi.object().optional(),
      location_country: Joi.string().max(100).optional(),
      location_city: Joi.string().max(100).optional(),
      coordinates: Joi.object({
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required(),
      }).optional(),
      is_public: Joi.boolean().optional(),
    });
  }

  // Get person by user ID
  async getPersonByUserId(ctx) {
    const { userId } = ctx.params;
    logger.info('PersonController: Getting person by user ID', { userId });

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
      this.personService.getPersonByUserId.bind(this.personService),
      parseInt(userId, 10),
    );
  }

  // Get my person profile (current user)
  async getMyPersonProfile(ctx) {
    logger.info('PersonController: Getting my person profile');

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.personService.getPersonByUserId.bind(this.personService),
      userId,
    );
  }

  // Get public profiles
  async getPublicProfiles(ctx) {
    const { limit, offset } = ctx.query;
    logger.info('PersonController: Getting public profiles', { limit, offset });

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
      this.personService.getPublicProfiles.bind(this.personService),
      limitNum,
      offsetNum,
    );
  }

  // Get profiles by location
  async getProfilesByLocation(ctx) {
    const {
      country, city, limit, offset,
    } = ctx.query;
    logger.info('PersonController: Getting profiles by location', {
      country, city, limit, offset,
    });

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
      this.personService.getProfilesByLocation.bind(this.personService),
      country || null,
      city || null,
      limitNum,
      offsetNum,
    );
  }

  // Get profiles by interests
  async getProfilesByInterests(ctx) {
    const { interests, limit, offset } = ctx.query;
    logger.info('PersonController: Getting profiles by interests', { interests, limit, offset });

    if (!interests) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Interests parameter required',
        message: 'Interests parameter is required',
      };
      return;
    }

    let interestsArray;
    try {
      interestsArray = JSON.parse(interests);
      if (!Array.isArray(interestsArray)) {
        throw new Error('Interests must be an array');
      }
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid interests format',
        message: 'Interests must be a valid JSON array',
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
      this.personService.getProfilesByInterests.bind(this.personService),
      interestsArray,
      limitNum,
      offsetNum,
    );
  }

  // Get profiles by languages
  async getProfilesByLanguages(ctx) {
    const { languages, limit, offset } = ctx.query;
    logger.info('PersonController: Getting profiles by languages', { languages, limit, offset });

    if (!languages) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Languages parameter required',
        message: 'Languages parameter is required',
      };
      return;
    }

    let languagesArray;
    try {
      languagesArray = JSON.parse(languages);
      if (!Array.isArray(languagesArray)) {
        throw new Error('Languages must be an array');
      }
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid languages format',
        message: 'Languages must be a valid JSON array',
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
      this.personService.getProfilesByLanguages.bind(this.personService),
      languagesArray,
      limitNum,
      offsetNum,
    );
  }

  // Get profiles by nationality
  async getProfilesByNationality(ctx) {
    const { nationality, limit, offset } = ctx.query;
    logger.info('PersonController: Getting profiles by nationality', { nationality, limit, offset });

    if (!nationality) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Nationality parameter required',
        message: 'Nationality parameter is required',
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
      this.personService.getProfilesByNationality.bind(this.personService),
      nationality,
      limitNum,
      offsetNum,
    );
  }

  // Search profiles
  async searchProfiles(ctx) {
    const { q, limit, offset } = ctx.query;
    logger.info('PersonController: Searching profiles', { q, limit, offset });

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
      this.personService.searchProfiles.bind(this.personService),
      q.trim(),
      limitNum,
      offsetNum,
    );
  }

  // Get popular profiles
  async getPopularProfiles(ctx) {
    const { limit } = ctx.query;
    logger.info('PersonController: Getting popular profiles', { limit });

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
      this.personService.getPopularProfiles.bind(this.personService),
      limitNum,
    );
  }

  // Create person profile
  async createPersonProfile(ctx) {
    logger.info('PersonController: Creating person profile');

    const validatedData = BaseController.validateRequest(ctx, PersonController.createPersonSchema);
    if (!validatedData) return;

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.personService.createPersonProfile.bind(this.personService),
      userId,
      validatedData,
    );
  }

  // Update person profile
  async updatePersonProfile(ctx) {
    logger.info('PersonController: Updating person profile');

    const validatedData = BaseController.validateRequest(ctx, PersonController.updatePersonSchema);
    if (!validatedData) return;

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.personService.updatePersonProfile.bind(this.personService),
      userId,
      validatedData,
    );
  }

  // Get person stats
  async getPersonStats(ctx) {
    const { userId } = ctx.params;
    logger.info('PersonController: Getting person stats', { userId });

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
      this.personService.getPersonStats.bind(this.personService),
      parseInt(userId, 10),
    );
  }

  // Get my person stats (current user)
  async getMyPersonStats(ctx) {
    logger.info('PersonController: Getting my person stats');

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.personService.getPersonStats.bind(this.personService),
      userId,
    );
  }

  // Get location stats
  async getLocationStats(ctx) {
    logger.info('PersonController: Getting location stats');
    await BaseController.handleRequest(
      ctx,
      this.personService.getLocationStats.bind(this.personService),
    );
  }

  // Get nationality stats
  async getNationalityStats(ctx) {
    logger.info('PersonController: Getting nationality stats');
    await BaseController.handleRequest(
      ctx,
      this.personService.getNationalityStats.bind(this.personService),
    );
  }

  // Update profile visibility
  async updateProfileVisibility(ctx) {
    const { isPublic } = ctx.request.body;
    logger.info('PersonController: Updating profile visibility', { isPublic });

    if (typeof isPublic !== 'boolean') {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid visibility value',
        message: 'isPublic must be a boolean value',
      };
      return;
    }

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.personService.updateProfileVisibility.bind(this.personService),
      userId,
      isPublic,
    );
  }

  // Add interest
  async addInterest(ctx) {
    const { interest } = ctx.request.body;
    logger.info('PersonController: Adding interest', { interest });

    if (!interest || typeof interest !== 'string' || interest.trim().length === 0) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid interest',
        message: 'Interest must be a non-empty string',
      };
      return;
    }

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.personService.addInterest.bind(this.personService),
      userId,
      interest.trim(),
    );
  }

  // Remove interest
  async removeInterest(ctx) {
    const { interest } = ctx.request.body;
    logger.info('PersonController: Removing interest', { interest });

    if (!interest || typeof interest !== 'string' || interest.trim().length === 0) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid interest',
        message: 'Interest must be a non-empty string',
      };
      return;
    }

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.personService.removeInterest.bind(this.personService),
      userId,
      interest.trim(),
    );
  }

  // Add language
  async addLanguage(ctx) {
    const { language } = ctx.request.body;
    logger.info('PersonController: Adding language', { language });

    if (!language || typeof language !== 'string' || language.trim().length === 0) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid language',
        message: 'Language must be a non-empty string',
      };
      return;
    }

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.personService.addLanguage.bind(this.personService),
      userId,
      language.trim(),
    );
  }

  // Remove language
  async removeLanguage(ctx) {
    const { language } = ctx.request.body;
    logger.info('PersonController: Removing language', { language });

    if (!language || typeof language !== 'string' || language.trim().length === 0) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid language',
        message: 'Language must be a non-empty string',
      };
      return;
    }

    // Get user ID from context (assuming it's set by auth middleware)
    const userId = ctx.state.user?.id || 1; // Fallback for testing

    await BaseController.handleRequest(
      ctx,
      this.personService.removeLanguage.bind(this.personService),
      userId,
      language.trim(),
    );
  }
}

module.exports = PersonController;

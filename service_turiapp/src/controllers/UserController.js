const Joi = require('joi');
const BaseController = require('./BaseController');
const UserService = require('../services/UserService');
const logger = require('../utils/logger');

class UserController extends BaseController {
  constructor() {
    super();
    this.userService = new UserService();
  }

  // Validation schemas
  static get createUserSchema() {
    return Joi.object({
      name: Joi.string().min(2).max(100).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(10).max(20).optional(),
      status: Joi.string().valid('active', 'inactive').default('active'),
    });
  }

  static get updateUserSchema() {
    return Joi.object({
      name: Joi.string().min(2).max(100).optional(),
      email: Joi.string().email().optional(),
      phone: Joi.string().min(10).max(20).optional(),
      status: Joi.string().valid('active', 'inactive').optional(),
    });
  }

  // Get all users
  async getAllUsers(ctx) {
    logger.info('UserController: Getting all users');
    const filters = ctx.query;
    await BaseController.handleRequest(
      ctx,
      this.userService.getAllUsers.bind(this.userService),
      filters,
    );
  }

  // Get user by ID
  async getUserById(ctx) {
    const { id } = ctx.params;
    logger.info('UserController: Getting user by ID', { id });

    if (!id || isNaN(parseInt(id, 10))) {
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
      this.userService.getUserById.bind(this.userService),
      parseInt(id, 10),
    );
  }

  // Get user by email
  async getUserByEmail(ctx) {
    const { email } = ctx.query;
    logger.info('UserController: Getting user by email', { email });

    if (!email) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Email parameter is required',
        message: 'Please provide an email address',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.userService.getUserByEmail.bind(this.userService),
      email,
    );
  }

  // Create new user
  async createUser(ctx) {
    logger.info('UserController: Creating new user');

    const validatedData = BaseController.validateRequest(ctx, UserController.createUserSchema);
    if (!validatedData) return;

    await BaseController.handleRequest(
      ctx,
      this.userService.createUser.bind(this.userService),
      validatedData,
    );
  }

  // Update user
  async updateUser(ctx) {
    const { id } = ctx.params;
    logger.info('UserController: Updating user', { id });

    if (!id || isNaN(parseInt(id, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a valid number',
      };
      return;
    }

    const validatedData = BaseController.validateRequest(ctx, UserController.updateUserSchema);
    if (!validatedData) return;

    await BaseController.handleRequest(
      ctx,
      this.userService.updateUser.bind(this.userService),
      parseInt(id, 10),
      validatedData,
    );
  }

  // Delete user
  async deleteUser(ctx) {
    const { id } = ctx.params;
    logger.info('UserController: Deleting user', { id });

    if (!id || isNaN(parseInt(id, 10))) {
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
      this.userService.deleteUser.bind(this.userService),
      parseInt(id, 10),
    );
  }

  // Search users by name
  async searchUsers(ctx) {
    const { name } = ctx.query;
    logger.info('UserController: Searching users', { name });

    if (!name) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Name parameter is required',
        message: 'Please provide a name to search for',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.userService.searchUsers.bind(this.userService),
      name,
    );
  }

  // Get active users
  async getActiveUsers(ctx) {
    logger.info('UserController: Getting active users');
    await BaseController.handleRequest(
      ctx,
      this.userService.getActiveUsers.bind(this.userService),
    );
  }
}

module.exports = UserController;

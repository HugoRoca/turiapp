/* eslint-disable max-len */
/* eslint-disable no-restricted-globals */
/* eslint-disable import/order */
const BaseController = require('./BaseController');
const CategoryService = require('../services/CategoryService');
const Joi = require('joi');
const logger = require('../utils/logger');

class CategoryController extends BaseController {
  constructor() {
    super();
    this.categoryService = new CategoryService();
  }

  // Validation schemas
  static get createCategorySchema() {
    return Joi.object({
      name: Joi.string().min(2).max(100).required(),
      description: Joi.string().max(500).optional(),
      icon_url: Joi.string().uri().optional(),
      color_code: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
      parent_id: Joi.number().integer().positive().optional(),
      sort_order: Joi.number().integer().min(0).default(0),
    });
  }

  static get updateCategorySchema() {
    return Joi.object({
      name: Joi.string().min(2).max(100).optional(),
      description: Joi.string().max(500).optional(),
      icon_url: Joi.string().uri().optional(),
      color_code: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
      parent_id: Joi.number().integer().positive().optional(),
      sort_order: Joi.number().integer().min(0).optional(),
    });
  }

  static get reorderCategoriesSchema() {
    return Joi.array().items(
      Joi.object({
        categoryId: Joi.number().integer().positive().required(),
        sortOrder: Joi.number().integer().min(0).required(),
      }),
    ).min(1).required();
  }

  // Get all categories
  async getAllCategories(ctx) {
    logger.info('CategoryController: Getting all categories');
    await BaseController.handleRequest(
      ctx,
      this.categoryService.getAllCategories.bind(this.categoryService),
    );
  }

  // Get category by ID
  async getCategoryById(ctx) {
    const { id } = ctx.params;
    logger.info('CategoryController: Getting category by ID', { id });

    if (!id || isNaN(parseInt(id, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid category ID',
        message: 'Category ID must be a valid number',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.categoryService.getCategoryById.bind(this.categoryService),
      parseInt(id, 10),
    );
  }

  // Get category with subcategories
  async getCategoryWithSubcategories(ctx) {
    const { id } = ctx.params;
    logger.info('CategoryController: Getting category with subcategories', { id });

    if (!id || isNaN(parseInt(id, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid category ID',
        message: 'Category ID must be a valid number',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.categoryService.getCategoryWithSubcategories.bind(this.categoryService),
      parseInt(id, 10),
    );
  }

  // Get parent categories
  async getParentCategories(ctx) {
    logger.info('CategoryController: Getting parent categories');
    await BaseController.handleRequest(
      ctx,
      this.categoryService.getParentCategories.bind(this.categoryService),
    );
  }

  // Get subcategories
  async getSubcategories(ctx) {
    const { parentId } = ctx.params;
    logger.info('CategoryController: Getting subcategories', { parentId });

    if (!parentId || isNaN(parseInt(parentId, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid parent category ID',
        message: 'Parent category ID must be a valid number',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.categoryService.getSubcategories.bind(this.categoryService),
      parseInt(parentId, 10),
    );
  }

  // Get category hierarchy
  async getCategoryHierarchy(ctx) {
    logger.info('CategoryController: Getting category hierarchy');
    await BaseController.handleRequest(
      ctx,
      this.categoryService.getCategoryHierarchy.bind(this.categoryService),
    );
  }

  // Get category tree
  async getCategoryTree(ctx) {
    logger.info('CategoryController: Getting category tree');
    await BaseController.handleRequest(
      ctx,
      this.categoryService.getCategoryTree.bind(this.categoryService),
    );
  }

  // Get categories with place count
  async getCategoriesWithPlaceCount(ctx) {
    logger.info('CategoryController: Getting categories with place count');
    await BaseController.handleRequest(
      ctx,
      this.categoryService.getCategoriesWithPlaceCount.bind(this.categoryService),
    );
  }

  // Get popular categories
  async getPopularCategories(ctx) {
    const { limit } = ctx.query;
    logger.info('CategoryController: Getting popular categories', { limit });

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
      this.categoryService.getPopularCategories.bind(this.categoryService),
      limitNum,
    );
  }

  // Search categories
  async searchCategories(ctx) {
    const { q, limit } = ctx.query;
    logger.info('CategoryController: Searching categories', { q, limit });

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
      this.categoryService.searchCategories.bind(this.categoryService),
      q.trim(),
      limitNum,
    );
  }

  // Create category
  async createCategory(ctx) {
    logger.info('CategoryController: Creating new category');

    const validatedData = BaseController.validateRequest(ctx, CategoryController.createCategorySchema);
    if (!validatedData) return;

    await BaseController.handleRequest(
      ctx,
      this.categoryService.createCategory.bind(this.categoryService),
      validatedData,
    );
  }

  // Create subcategory
  async createSubcategory(ctx) {
    const { parentId } = ctx.params;
    logger.info('CategoryController: Creating subcategory', { parentId });

    if (!parentId || isNaN(parseInt(parentId, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid parent category ID',
        message: 'Parent category ID must be a valid number',
      };
      return;
    }

    const validatedData = BaseController.validateRequest(ctx, CategoryController.createCategorySchema);
    if (!validatedData) return;

    await BaseController.handleRequest(
      ctx,
      this.categoryService.createSubcategory.bind(this.categoryService),
      parseInt(parentId, 10),
      validatedData,
    );
  }

  // Update category
  async updateCategory(ctx) {
    const { id } = ctx.params;
    logger.info('CategoryController: Updating category', { id });

    if (!id || isNaN(parseInt(id, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid category ID',
        message: 'Category ID must be a valid number',
      };
      return;
    }

    const validatedData = BaseController.validateRequest(ctx, CategoryController.updateCategorySchema);
    if (!validatedData) return;

    await BaseController.handleRequest(
      ctx,
      this.categoryService.updateCategory.bind(this.categoryService),
      parseInt(id, 10),
      validatedData,
    );
  }

  // Delete category
  async deleteCategory(ctx) {
    const { id } = ctx.params;
    logger.info('CategoryController: Deleting category', { id });

    if (!id || isNaN(parseInt(id, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid category ID',
        message: 'Category ID must be a valid number',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.categoryService.deleteCategory.bind(this.categoryService),
      parseInt(id, 10),
    );
  }

  // Get category stats
  async getCategoryStats(ctx) {
    const { id } = ctx.params;
    logger.info('CategoryController: Getting category stats', { id });

    if (!id || isNaN(parseInt(id, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid category ID',
        message: 'Category ID must be a valid number',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.categoryService.getCategoryStats.bind(this.categoryService),
      parseInt(id, 10),
    );
  }

  // Update category sort order
  async updateCategorySortOrder(ctx) {
    const { id } = ctx.params;
    const { sortOrder } = ctx.request.body;
    logger.info('CategoryController: Updating category sort order', { id, sortOrder });

    if (!id || isNaN(parseInt(id, 10))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid category ID',
        message: 'Category ID must be a valid number',
      };
      return;
    }

    if (sortOrder === undefined || isNaN(parseInt(sortOrder, 10)) || parseInt(sortOrder, 10) < 0) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Invalid sort order',
        message: 'Sort order must be a non-negative number',
      };
      return;
    }

    await BaseController.handleRequest(
      ctx,
      this.categoryService.updateCategorySortOrder.bind(this.categoryService),
      parseInt(id, 10),
      parseInt(sortOrder, 10),
    );
  }

  // Reorder categories
  async reorderCategories(ctx) {
    logger.info('CategoryController: Reordering categories');

    const validatedData = BaseController.validateRequest(ctx, CategoryController.reorderCategoriesSchema);
    if (!validatedData) return;

    await BaseController.handleRequest(
      ctx,
      this.categoryService.reorderCategories.bind(this.categoryService),
      validatedData,
    );
  }
}

module.exports = CategoryController;

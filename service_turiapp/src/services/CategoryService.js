/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
const CategoryRepository = require('../repositories/CategoryRepository');
const logger = require('../utils/logger');

class CategoryService {
  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async getAllCategories() {
    try {
      logger.info('Getting all categories');
      const categories = await this.categoryRepository.findActiveCategories();
      logger.info(`Retrieved ${categories.length} categories`);
      return categories;
    } catch (error) {
      logger.error('Error getting all categories:', { error: error.message });
      throw error;
    }
  }

  async getCategoryById(id) {
    try {
      logger.info('Getting category by ID', { id });
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        logger.warn('Category not found', { id });
        return null;
      }
      logger.info('Category found', { id, name: category.name });
      return category;
    } catch (error) {
      logger.error('Error getting category by ID:', { error: error.message, id });
      throw error;
    }
  }

  async getCategoryWithSubcategories(id) {
    try {
      logger.info('Getting category with subcategories', { id });
      const category = await this.categoryRepository.findCategoryWithSubcategories(id);
      if (!category) {
        logger.warn('Category not found', { id });
        return null;
      }
      logger.info('Category with subcategories found', { id, name: category.name });
      return category;
    } catch (error) {
      logger.error('Error getting category with subcategories:', { error: error.message, id });
      throw error;
    }
  }

  async getParentCategories() {
    try {
      logger.info('Getting parent categories');
      const categories = await this.categoryRepository.findParentCategories();
      logger.info(`Retrieved ${categories.length} parent categories`);
      return categories;
    } catch (error) {
      logger.error('Error getting parent categories:', { error: error.message });
      throw error;
    }
  }

  async getSubcategories(parentId) {
    try {
      logger.info('Getting subcategories', { parentId });
      const subcategories = await this.categoryRepository.findSubcategories(parentId);
      logger.info(`Retrieved ${subcategories.length} subcategories for parent ${parentId}`);
      return subcategories;
    } catch (error) {
      logger.error('Error getting subcategories:', { error: error.message, parentId });
      throw error;
    }
  }

  async getCategoryHierarchy() {
    try {
      logger.info('Getting category hierarchy');
      const hierarchy = await this.categoryRepository.getCategoryHierarchy();
      logger.info(`Retrieved category hierarchy with ${hierarchy.length} categories`);
      return hierarchy;
    } catch (error) {
      logger.error('Error getting category hierarchy:', { error: error.message });
      throw error;
    }
  }

  async getCategoriesWithPlaceCount() {
    try {
      logger.info('Getting categories with place count');
      const categories = await this.categoryRepository.getCategoriesWithPlaceCount();
      logger.info(`Retrieved ${categories.length} categories with place counts`);
      return categories;
    } catch (error) {
      logger.error('Error getting categories with place count:', { error: error.message });
      throw error;
    }
  }

  async getPopularCategories(limit = 10) {
    try {
      logger.info('Getting popular categories', { limit });
      const categories = await this.categoryRepository.getPopularCategories(limit);
      logger.info(`Retrieved ${categories.length} popular categories`);
      return categories;
    } catch (error) {
      logger.error('Error getting popular categories:', { error: error.message });
      throw error;
    }
  }

  async searchCategories(searchTerm, limit = 20) {
    try {
      logger.info('Searching categories', { searchTerm, limit });
      const categories = await this.categoryRepository.searchCategories(searchTerm, limit);
      logger.info(`Found ${categories.length} categories matching "${searchTerm}"`);
      return categories;
    } catch (error) {
      logger.error('Error searching categories:', { error: error.message, searchTerm });
      throw error;
    }
  }

  async createCategory(categoryData) {
    try {
      logger.info('Creating new category', { name: categoryData.name });

      // Validar datos requeridos
      if (!categoryData.name) {
        throw new Error('Category name is required');
      }

      // Verificar si ya existe una categoría con el mismo nombre
      const existingCategories = await this.categoryRepository.findCategoriesByName(categoryData.name);
      if (existingCategories.length > 0) {
        throw new Error('Category with this name already exists');
      }

      const categoryId = await this.categoryRepository.createCategoryWithParent(
        categoryData.name,
        categoryData.description || null,
        categoryData.iconUrl || null,
        categoryData.colorCode || null,
        categoryData.parentId || null,
        categoryData.sortOrder || 0,
      );

      logger.info('Category created successfully', { categoryId, name: categoryData.name });
      return categoryId;
    } catch (error) {
      logger.error('Error creating category:', { error: error.message, categoryData });
      throw error;
    }
  }

  async updateCategory(id, categoryData) {
    try {
      logger.info('Updating category', { id });

      const existingCategory = await this.categoryRepository.findById(id);
      if (!existingCategory) {
        logger.warn('Category not found for update', { id });
        throw new Error('Category not found');
      }

      // Verificar si el nuevo nombre ya existe (si se está cambiando)
      if (categoryData.name && categoryData.name !== existingCategory.name) {
        const existingCategories = await this.categoryRepository.findCategoriesByName(categoryData.name);
        if (existingCategories.length > 0) {
          throw new Error('Category with this name already exists');
        }
      }

      const updated = await this.categoryRepository.update(id, {
        ...categoryData,
        updated_at: new Date(),
      });

      if (updated) {
        logger.info('Category updated successfully', { id });
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error updating category:', { error: error.message, id, categoryData });
      throw error;
    }
  }

  async deleteCategory(id) {
    try {
      logger.info('Deleting category', { id });

      const existingCategory = await this.categoryRepository.findById(id);
      if (!existingCategory) {
        logger.warn('Category not found for deletion', { id });
        throw new Error('Category not found');
      }

      // Verificar si la categoría puede ser eliminada
      const canDelete = await this.categoryRepository.canDeleteCategory(id);
      if (!canDelete) {
        throw new Error('Cannot delete category: it has associated places or subcategories');
      }

      const deleted = await this.categoryRepository.deleteCategory(id);
      if (deleted) {
        logger.info('Category deleted successfully', { id });
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Error deleting category:', { error: error.message, id });
      throw error;
    }
  }

  async getCategoryStats(categoryId) {
    try {
      logger.info('Getting category stats', { categoryId });
      const stats = await this.categoryRepository.getCategoryStats(categoryId);
      if (!stats) {
        logger.warn('Category stats not found', { categoryId });
        return null;
      }
      logger.info('Category stats retrieved', { categoryId });
      return stats;
    } catch (error) {
      logger.error('Error getting category stats:', { error: error.message, categoryId });
      throw error;
    }
  }

  async updateCategorySortOrder(categoryId, sortOrder) {
    try {
      logger.info('Updating category sort order', { categoryId, sortOrder });
      const updated = await this.categoryRepository.updateCategorySortOrder(categoryId, sortOrder);
      if (updated) {
        logger.info('Category sort order updated successfully', { categoryId, sortOrder });
      }
      return updated;
    } catch (error) {
      logger.error('Error updating category sort order:', { error: error.message, categoryId, sortOrder });
      throw error;
    }
  }

  async reorderCategories(categoryUpdates) {
    try {
      logger.info('Reordering categories', { updates: categoryUpdates.length });

      if (!Array.isArray(categoryUpdates) || categoryUpdates.length === 0) {
        throw new Error('Category updates array is required');
      }

      // Validar que cada update tenga categoryId y sortOrder
      for (const update of categoryUpdates) {
        if (!update.categoryId || update.sortOrder === undefined) {
          throw new Error('Each update must have categoryId and sortOrder');
        }
      }

      const reordered = await this.categoryRepository.reorderCategories(categoryUpdates);
      if (reordered) {
        logger.info('Categories reordered successfully', { updates: categoryUpdates.length });
      }
      return reordered;
    } catch (error) {
      logger.error('Error reordering categories:', { error: error.message, categoryUpdates });
      throw error;
    }
  }

  async createSubcategory(parentId, subcategoryData) {
    try {
      logger.info('Creating subcategory', { parentId, name: subcategoryData.name });

      // Verificar que la categoría padre existe
      const parentCategory = await this.categoryRepository.findById(parentId);
      if (!parentCategory) {
        throw new Error('Parent category not found');
      }

      // Crear la subcategoría
      const subcategoryId = await this.categoryRepository.createCategoryWithParent(
        subcategoryData.name,
        subcategoryData.description || null,
        subcategoryData.iconUrl || null,
        subcategoryData.colorCode || null,
        parentId,
        subcategoryData.sortOrder || 0,
      );

      logger.info('Subcategory created successfully', { subcategoryId, parentId, name: subcategoryData.name });
      return subcategoryId;
    } catch (error) {
      logger.error('Error creating subcategory:', { error: error.message, parentId, subcategoryData });
      throw error;
    }
  }

  async getCategoryTree() {
    try {
      logger.info('Getting category tree');

      // Obtener todas las categorías con sus conteos
      const categories = await this.categoryRepository.getCategoriesWithPlaceCount();

      // Construir el árbol jerárquico
      const categoryMap = new Map();
      const rootCategories = [];

      // Crear mapa de categorías
      categories.forEach((category) => {
        categoryMap.set(category.id, {
          ...category,
          subcategories: [],
        });
      });

      // Construir jerarquía
      categories.forEach((category) => {
        if (category.parent_id) {
          const parent = categoryMap.get(category.parent_id);
          if (parent) {
            parent.subcategories.push(categoryMap.get(category.id));
          }
        } else {
          rootCategories.push(categoryMap.get(category.id));
        }
      });

      logger.info(`Retrieved category tree with ${rootCategories.length} root categories`);
      return rootCategories;
    } catch (error) {
      logger.error('Error getting category tree:', { error: error.message });
      throw error;
    }
  }
}

module.exports = CategoryService;

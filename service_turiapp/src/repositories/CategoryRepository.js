const BaseRepository = require('./BaseRepository');

class CategoryRepository extends BaseRepository {
  constructor() {
    super('categories');
  }

  async findActiveCategories() {
    const sql = `
      SELECT * FROM categories 
      WHERE is_active = TRUE 
      ORDER BY sort_order ASC, name ASC
    `;
    return this.query(sql);
  }

  async findParentCategories() {
    const sql = `
      SELECT * FROM categories 
      WHERE parent_id IS NULL AND is_active = TRUE 
      ORDER BY sort_order ASC, name ASC
    `;
    return this.query(sql);
  }

  async findSubcategories(parentId) {
    const sql = `
      SELECT * FROM categories 
      WHERE parent_id = ? AND is_active = TRUE 
      ORDER BY sort_order ASC, name ASC
    `;
    return this.query(sql, [parentId]);
  }

  async findCategoryWithSubcategories(categoryId) {
    const sql = `
      SELECT 
        c.*,
        GROUP_CONCAT(
          JSON_OBJECT(
            'id', sc.id,
            'name', sc.name,
            'description', sc.description,
            'icon_url', sc.icon_url,
            'color_code', sc.color_code,
            'sort_order', sc.sort_order
          )
        ) as subcategories
      FROM categories c
      LEFT JOIN categories sc ON c.id = sc.parent_id AND sc.is_active = TRUE
      WHERE c.id = ? AND c.is_active = TRUE
      GROUP BY c.id
    `;
    const results = await this.query(sql, [categoryId]);
    if (results.length > 0) {
      const category = results[0];
      if (category.subcategories) {
        category.subcategories = JSON.parse(`[${category.subcategories}]`);
      } else {
        category.subcategories = [];
      }
      return category;
    }
    return null;
  }

  async getCategoryHierarchy() {
    const sql = `
      SELECT 
        c.id,
        c.name,
        c.description,
        c.icon_url,
        c.color_code,
        c.parent_id,
        c.sort_order,
        COUNT(pc.place_id) as place_count
      FROM categories c
      LEFT JOIN place_categories pc ON c.id = pc.category_id
      LEFT JOIN places p ON pc.place_id = p.id AND p.is_active = TRUE
      WHERE c.is_active = TRUE
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC
    `;
    return this.query(sql);
  }

  async getCategoriesWithPlaceCount() {
    const sql = `
      SELECT 
        c.*,
        COUNT(DISTINCT pc.place_id) as place_count
      FROM categories c
      LEFT JOIN place_categories pc ON c.id = pc.category_id
      LEFT JOIN places p ON pc.place_id = p.id AND p.is_active = TRUE
      WHERE c.is_active = TRUE
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC
    `;
    return this.query(sql);
  }

  async findCategoriesByName(name) {
    const sql = `
      SELECT * FROM categories 
      WHERE name LIKE ? AND is_active = TRUE 
      ORDER BY sort_order ASC, name ASC
    `;
    return this.query(sql, [`%${name}%`]);
  }

  async createCategoryWithParent(name, description, iconUrl, colorCode, parentId = null, sortOrder = 0) {
    const sql = `
      INSERT INTO categories (name, description, icon_url, color_code, parent_id, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await this.query(sql, [name, description, iconUrl, colorCode, parentId, sortOrder]);
    return result.insertId;
  }

  async updateCategorySortOrder(categoryId, sortOrder) {
    const sql = `
      UPDATE categories 
      SET sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const result = await this.query(sql, [sortOrder, categoryId]);
    return result.affectedRows > 0;
  }

  async reorderCategories(categoryUpdates) {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const update of categoryUpdates) {
        await connection.execute(
          'UPDATE categories SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [update.sortOrder, update.categoryId],
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getPopularCategories(limit = 10) {
    const sql = `
      SELECT 
        c.*,
        COUNT(DISTINCT pc.place_id) as place_count,
        AVG(p.average_rating) as avg_rating
      FROM categories c
      JOIN place_categories pc ON c.id = pc.category_id
      JOIN places p ON pc.place_id = p.id AND p.is_active = TRUE
      WHERE c.is_active = TRUE AND c.parent_id IS NULL
      GROUP BY c.id
      ORDER BY place_count DESC, avg_rating DESC
      LIMIT ?
    `;
    return this.query(sql, [limit]);
  }

  async getCategoryStats(categoryId) {
    const sql = `
      SELECT 
        c.name,
        c.description,
        COUNT(DISTINCT pc.place_id) as total_places,
        COUNT(DISTINCT CASE WHEN p.is_verified = TRUE THEN p.id END) as verified_places,
        COUNT(DISTINCT CASE WHEN p.is_featured = TRUE THEN p.id END) as featured_places,
        AVG(p.average_rating) as avg_rating,
        SUM(p.total_reviews) as total_reviews,
        SUM(p.total_visits) as total_visits
      FROM categories c
      LEFT JOIN place_categories pc ON c.id = pc.category_id
      LEFT JOIN places p ON pc.place_id = p.id AND p.is_active = TRUE
      WHERE c.id = ?
      GROUP BY c.id
    `;
    const results = await this.query(sql, [categoryId]);
    return results.length > 0 ? results[0] : null;
  }

  async searchCategories(searchTerm, limit = 20) {
    const sql = `
      SELECT 
        c.*,
        COUNT(DISTINCT pc.place_id) as place_count
      FROM categories c
      LEFT JOIN place_categories pc ON c.id = pc.category_id
      LEFT JOIN places p ON pc.place_id = p.id AND p.is_active = TRUE
      WHERE c.is_active = TRUE 
      AND (c.name LIKE ? OR c.description LIKE ?)
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.name ASC
      LIMIT ?
    `;
    const searchPattern = `%${searchTerm}%`;
    return this.query(sql, [searchPattern, searchPattern, limit]);
  }

  async canDeleteCategory(categoryId) {
    // Verificar si la categoría puede ser eliminada
    // (no debe tener lugares asociados ni subcategorías)
    const sql = `
      SELECT 
        CASE 
          WHEN EXISTS (SELECT 1 FROM place_categories WHERE category_id = ?) THEN FALSE
          WHEN EXISTS (SELECT 1 FROM categories WHERE parent_id = ?) THEN FALSE
          ELSE TRUE
        END as can_delete
    `;
    const results = await this.query(sql, [categoryId, categoryId]);
    return results[0].can_delete;
  }

  async deleteCategory(categoryId) {
    // Solo se puede eliminar si no tiene lugares ni subcategorías
    const canDelete = await this.canDeleteCategory(categoryId);
    if (!canDelete) {
      throw new Error('Cannot delete category: it has associated places or subcategories');
    }

    const sql = `
      UPDATE categories 
      SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const result = await this.query(sql, [categoryId]);
    return result.affectedRows > 0;
  }
}

module.exports = CategoryRepository;

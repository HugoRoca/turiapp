const { pool } = require('../config/database');
const logger = require('../utils/logger');

class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async query(sql, params = []) {
    try {
      logger.info(`Executing query: ${sql}`, { params });
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (error) {
      logger.error('Database query error:', { error: error.message, sql, params });
      throw error;
    }
  }

  async findAll(conditions = {}, limit = null, offset = 0) {
    let sql = `SELECT * FROM ${this.tableName}`;
    const params = [];

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map((key) => `${key} = ?`)
        .join(' AND ');
      sql += ` WHERE ${whereClause}`;
      params.push(...Object.values(conditions));
    }

    if (limit) {
      sql += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    return this.query(sql, params);
  }

  async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const results = await this.query(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  async create(data) {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
    const result = await this.query(sql, values);
    return result.insertId;
  }

  async update(id, data) {
    const columns = Object.keys(data).map((key) => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];

    const sql = `UPDATE ${this.tableName} SET ${columns} WHERE id = ?`;
    const result = await this.query(sql, values);
    return result.affectedRows > 0;
  }

  async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const result = await this.query(sql, [id]);
    return result.affectedRows > 0;
  }

  async count(conditions = {}) {
    let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const params = [];

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map((key) => `${key} = ?`)
        .join(' AND ');
      sql += ` WHERE ${whereClause}`;
      params.push(...Object.values(conditions));
    }

    const results = await this.query(sql, params);
    return results[0].count;
  }
}

module.exports = BaseRepository;

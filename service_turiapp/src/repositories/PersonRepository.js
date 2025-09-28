/* eslint-disable max-len */
const BaseRepository = require('./BaseRepository');

class PersonRepository extends BaseRepository {
  constructor() {
    super('persons');
  }

  async findByUserId(userId) {
    const sql = `
      SELECT p.*, 
             u.username,
             u.email,
             u.first_name,
             u.last_name,
             u.phone,
             u.avatar_url,
             u.is_verified,
             u.role,
             u.created_at as user_created_at
      FROM persons p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
    `;
    const results = await this.query(sql, [userId]);
    return results.length > 0 ? results[0] : null;
  }

  async findPublicProfiles(limit = 20, offset = 0) {
    const sql = `
      SELECT p.*, 
             u.username,
             u.first_name,
             u.last_name,
             u.avatar_url,
             u.is_verified,
             u.created_at as user_created_at
      FROM persons p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_public = TRUE AND u.is_active = TRUE
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [limit, offset]);
  }

  async findProfilesByLocation(country = null, city = null, limit = 20, offset = 0) {
    let sql = `
      SELECT p.*, 
             u.username,
             u.first_name,
             u.last_name,
             u.avatar_url,
             u.is_verified,
             u.created_at as user_created_at
      FROM persons p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_public = TRUE AND u.is_active = TRUE
    `;
    const params = [];

    if (country) {
      sql += ' AND p.location_country = ?';
      params.push(country);
    }

    if (city) {
      sql += ' AND p.location_city = ?';
      params.push(city);
    }

    sql += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return this.query(sql, params);
  }

  async findProfilesByInterests(interests, limit = 20, offset = 0) {
    const sql = `
      SELECT p.*, 
             u.username,
             u.first_name,
             u.last_name,
             u.avatar_url,
             u.is_verified,
             u.created_at as user_created_at
      FROM persons p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_public = TRUE AND u.is_active = TRUE
      AND JSON_OVERLAPS(p.interests, ?)
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [JSON.stringify(interests), limit, offset]);
  }

  async findProfilesByLanguages(languages, limit = 20, offset = 0) {
    const sql = `
      SELECT p.*, 
             u.username,
             u.first_name,
             u.last_name,
             u.avatar_url,
             u.is_verified,
             u.created_at as user_created_at
      FROM persons p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_public = TRUE AND u.is_active = TRUE
      AND JSON_OVERLAPS(p.languages, ?)
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [JSON.stringify(languages), limit, offset]);
  }

  async searchProfiles(searchTerm, limit = 20, offset = 0) {
    const sql = `
      SELECT p.*, 
             u.username,
             u.first_name,
             u.last_name,
             u.avatar_url,
             u.is_verified,
             u.created_at as user_created_at
      FROM persons p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_public = TRUE AND u.is_active = TRUE
      AND (
        u.first_name LIKE ? OR 
        u.last_name LIKE ? OR 
        u.username LIKE ? OR 
        p.bio LIKE ? OR 
        p.location_city LIKE ? OR 
        p.location_country LIKE ?
      )
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const searchPattern = `%${searchTerm}%`;
    return this.query(sql, [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, limit, offset]);
  }

  async createPersonProfile(userId, personData) {
    const sql = `
      INSERT INTO persons (
        user_id, bio, birth_date, nationality, languages, 
        interests, social_links, location_country, location_city, 
        location_coordinates, is_public
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      userId,
      personData.bio || null,
      personData.birthDate || null,
      personData.nationality || null,
      personData.languages ? JSON.stringify(personData.languages) : null,
      personData.interests ? JSON.stringify(personData.interests) : null,
      personData.socialLinks ? JSON.stringify(personData.socialLinks) : null,
      personData.locationCountry || null,
      personData.locationCity || null,
      personData.coordinates ? `POINT(${personData.coordinates.longitude}, ${personData.coordinates.latitude})` : null,
      personData.isPublic !== undefined ? personData.isPublic : true,
    ];

    const result = await this.query(sql, params);
    return result.insertId;
  }

  async updatePersonProfile(userId, personData) {
    const updateFields = [];
    const params = [];

    if (personData.bio !== undefined) {
      updateFields.push('bio = ?');
      params.push(personData.bio);
    }
    if (personData.birthDate !== undefined) {
      updateFields.push('birth_date = ?');
      params.push(personData.birthDate);
    }
    if (personData.nationality !== undefined) {
      updateFields.push('nationality = ?');
      params.push(personData.nationality);
    }
    if (personData.languages !== undefined) {
      updateFields.push('languages = ?');
      params.push(JSON.stringify(personData.languages));
    }
    if (personData.interests !== undefined) {
      updateFields.push('interests = ?');
      params.push(JSON.stringify(personData.interests));
    }
    if (personData.socialLinks !== undefined) {
      updateFields.push('social_links = ?');
      params.push(JSON.stringify(personData.socialLinks));
    }
    if (personData.locationCountry !== undefined) {
      updateFields.push('location_country = ?');
      params.push(personData.locationCountry);
    }
    if (personData.locationCity !== undefined) {
      updateFields.push('location_city = ?');
      params.push(personData.locationCity);
    }
    if (personData.coordinates !== undefined) {
      updateFields.push('location_coordinates = ?');
      params.push(`POINT(${personData.coordinates.longitude}, ${personData.coordinates.latitude})`);
    }
    if (personData.isPublic !== undefined) {
      updateFields.push('is_public = ?');
      params.push(personData.isPublic);
    }

    if (updateFields.length === 0) {
      return false;
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(userId);

    const sql = `
      UPDATE persons 
      SET ${updateFields.join(', ')}
      WHERE user_id = ?
    `;

    const result = await this.query(sql, params);
    return result.affectedRows > 0;
  }

  async getPersonStats(userId) {
    const sql = `
      SELECT 
        p.*,
        u.username,
        u.first_name,
        u.last_name,
        u.avatar_url,
        u.is_verified,
        u.created_at as user_created_at,
        COUNT(DISTINCT r.id) as total_reviews,
        COUNT(DISTINCT f.id) as total_favorites,
        COUNT(DISTINCT v.id) as total_visits,
        COUNT(DISTINCT c.id) as total_comments,
        AVG(r.rating) as average_rating_given
      FROM persons p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN reviews r ON u.id = r.user_id AND r.is_public = TRUE
      LEFT JOIN favorites f ON u.id = f.user_id
      LEFT JOIN visits v ON u.id = v.user_id
      LEFT JOIN comments c ON u.id = c.user_id AND c.is_public = TRUE
      WHERE p.user_id = ?
      GROUP BY p.id
    `;
    const results = await this.query(sql, [userId]);
    return results.length > 0 ? results[0] : null;
  }

  async getPopularProfiles(limit = 10) {
    const sql = `
      SELECT 
        p.*,
        u.username,
        u.first_name,
        u.last_name,
        u.avatar_url,
        u.is_verified,
        COUNT(DISTINCT r.id) as total_reviews,
        COUNT(DISTINCT f.id) as total_favorites,
        AVG(r.rating) as average_rating_given
      FROM persons p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN reviews r ON u.id = r.user_id AND r.is_public = TRUE
      LEFT JOIN favorites f ON u.id = f.user_id
      WHERE p.is_public = TRUE AND u.is_active = TRUE
      GROUP BY p.id
      ORDER BY total_reviews DESC, average_rating_given DESC
      LIMIT ?
    `;
    return this.query(sql, [limit]);
  }

  async getProfilesByNationality(nationality, limit = 20, offset = 0) {
    const sql = `
      SELECT p.*, 
             u.username,
             u.first_name,
             u.last_name,
             u.avatar_url,
             u.is_verified,
             u.created_at as user_created_at
      FROM persons p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_public = TRUE AND u.is_active = TRUE
      AND p.nationality = ?
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return this.query(sql, [nationality, limit, offset]);
  }

  async getLocationStats() {
    const sql = `
      SELECT 
        location_country,
        location_city,
        COUNT(*) as user_count
      FROM persons
      WHERE is_public = TRUE AND location_country IS NOT NULL
      GROUP BY location_country, location_city
      ORDER BY user_count DESC
    `;
    return this.query(sql);
  }

  async getNationalityStats() {
    const sql = `
      SELECT 
        nationality,
        COUNT(*) as user_count
      FROM persons
      WHERE is_public = TRUE AND nationality IS NOT NULL
      GROUP BY nationality
      ORDER BY user_count DESC
    `;
    return this.query(sql);
  }
}

module.exports = PersonRepository;
